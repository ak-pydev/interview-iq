import { MongoClient, ServerApiVersion } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'propelcareerdb';
const COLLECTION_NAME = 'mockinterview-behavior';

// Validate environment variables early
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Please define the GEMINI_API_KEY environment variable');
}

// Improved MongoDB client options
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000,  // 45 seconds
};

// Cache the database connection to improve performance
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  
  try {
    // Log connection attempt (with masked URI for security)
    const maskedUri = MONGODB_URI.replace(
      /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/,
      'mongodb$1://$2:****@'
    );
    console.log(`Connecting to MongoDB: ${maskedUri}`);
    
    // Create a new MongoClient with the options
    const client = new MongoClient(MONGODB_URI, options);
    
    // Connect to the MongoDB server
    await client.connect();
    
    // Ping to confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB server");
    
    const db = client.db(DB_NAME);
    cachedClient = client;
    cachedDb = db;
    return { client, db };
  } catch (error: any) {
    console.error("MongoDB connection error:", error.message);
    console.error("Stack trace:", error.stack);
    
    // Add specific error handling for common MongoDB connection issues
    if (error.name === 'MongoServerSelectionError') {
      console.error("Could not connect to any MongoDB server in the connection string");
    } else if (error.name === 'MongoNetworkError') {
      console.error("Network error while connecting to MongoDB");
    }
    
    throw error;
  }
}

interface ConversationMessage {
  role: string;
  text: string;
  timestamp?: string;
}

export async function callGeminiAPI(params: {
  conversation: ConversationMessage[] | any;
  interviewContext: string;
  tone?: string;
  timeLimit?: number;
}): Promise<string> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined');
  }
  
  // Format conversation array for Gemini with proper handling of different formats
  let formattedConversation: string;
  
  if (Array.isArray(params.conversation)) {
    if (params.conversation.length === 0) {
      formattedConversation = "No previous conversation yet. This is the first question.";
    } else {
      formattedConversation = params.conversation
        .filter(msg => msg && msg.role && msg.text) // Filter out invalid messages
        .map(msg => `${msg.role}: ${msg.text}`)
        .join('\n');
    }
  } else if (typeof params.conversation === 'object' && params.conversation !== null) {
    formattedConversation = JSON.stringify(params.conversation);
  } else {
    formattedConversation = "No conversation data provided";
  }
  
  // Set default tone and timeLimit if not provided
  const tone = params.tone || 'casual, friendly';
  const timeLimit = params.timeLimit || 5;
  
  // Construct proper prompt with formatting for Gemini
  const promptContent = [
    {
      parts: [
        {
          text: `Interview Context: ${params.interviewContext}\n\n` +
                `Conversation so far: ${formattedConversation}\n\n` +
                `Instructions: Based on the context and conversation history, ask a relevant behavioral interview question in a ${tone} tone. ` +
                `The candidate should be able to answer this question within ${timeLimit} minutes.\n` +
                `If this is the first question, make it an introductory question about their background related to the role.\n` +
                `Focus on relevant experience, challenging situations they've faced, or how they've demonstrated skills mentioned in the job description.\n` +
                `Keep your questions concise and clear.`
        }
      ]
    }
  ];

  try {
    console.log(`Calling Gemini API with conversation length: ${Array.isArray(params.conversation) ? params.conversation.length : 'N/A'}`);
    
    // Use the correct Gemini API endpoint
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: promptContent,
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Gemini API error response: ${errorBody}`);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Extract the text from the Gemini response structure
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      // Extract text from each part and combine
      const textParts = data.candidates[0].content.parts
        .filter((part: any) => part.text)
        .map((part: any) => part.text);
      
      const result = textParts.join(' ');
      console.log(`Received response from Gemini API (${result.length} chars)`);
      return result;
    } else {
      console.error("Unexpected Gemini API response format:", data);
      throw new Error('Unexpected response format from Gemini API');
    }
  } catch (error: any) {
    console.error("Gemini API error:", error.message);
    // Provide a fallback response in case of API failure
    return "I'm sorry, I couldn't generate a question at the moment. Could you tell me about a challenging situation you've faced in your previous role and how you handled it?";
  }
}

/**
 * Process the behavioral interview by calling the Gemini API.
 * Expects an object with conversation, interviewContext, tone, and timeLimit.
 */
export async function processBehavioralInterview(requestBody: any) {
  const { conversation, interviewContext, tone, timeLimit } = requestBody;
  
  // Validate required parameters
  if (!interviewContext) {
    throw new Error('Interview context is required');
  }
  
  // Add any logging or preprocessing if needed.
  try {
    console.log("Processing behavioral interview request");
    const response = await callGeminiAPI({ 
      conversation, 
      interviewContext, 
      tone, 
      timeLimit 
    });
    
    return { response };
  } catch (error: any) {
    console.error("Error processing behavioral interview:", error.message);
    throw error;
  }
}

/**
 * Save an interview message to MongoDB Atlas.
 * The message will be inserted into the collection "mockinterview-behavior" in the propelcareerdb.
 */
export async function saveInterviewMessage(message: any) {
  if (!message) {
    throw new Error('Message is required');
  }
  
  try {
    const { db } = await connectToDatabase();
    
    // Ensure there's a timestamp and sanitize the message
    const sanitizedMessage = {
      ...message,
      timestamp: message.timestamp || new Date().toISOString(),
      savedAt: new Date().toISOString()
    };
    
    // Remove any undefined or null values
    Object.keys(sanitizedMessage).forEach(key => 
      (sanitizedMessage[key] === undefined || sanitizedMessage[key] === null) && delete sanitizedMessage[key]
    );
    
    const result = await db.collection(COLLECTION_NAME).insertOne(sanitizedMessage);
    console.log(`Successfully saved message to ${COLLECTION_NAME} with ID: ${result.insertedId}`);
    return result;
  } catch (error: any) {
    console.error(`Error saving interview message: ${error.message}`);
    // Don't throw the error, just log it and return null
    // This prevents API failures from breaking the interview flow
    return null;
  }
}