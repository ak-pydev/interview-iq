import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'propelcareerdb';
const COLLECTION_NAME = 'mockinterview-behavior';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Please define the GEMINI_API_KEY environment variable');
}

// Cache the database connection to improve performance.
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

/**
 * Call Gemini 2.0 Pro Experimental 02-05 model API.
 * Replace the URL with the actual endpoint provided by your Gemini vendor.
 */
export async function callGeminiAPI(params: {
  conversation: any;
  interviewContext: string;
  tone: string;
  timeLimit: number;
}): Promise<string> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const payload = {
    model: "Gemini-2.0-Pro-Experimental-02-05",
    prompt: `Interview Context: ${params.interviewContext}\n` +
            `Conversation so far: ${JSON.stringify(params.conversation)}\n` +
            `Instructions: Based on the context and conversation history, ask a relevant behavioral interview question in a casual, friendly tone.`,
    tone: params.tone,
    timeLimit: params.timeLimit
  };

  const response = await fetch("https://api.gemini.example.com/v2/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GEMINI_API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${errorBody}`);
  }
  const data = await response.json();
  // Assuming the API returns the generated text in a property called "generatedText"
  return data.generatedText;
}

/**
 * Process the behavioral interview by calling the Gemini API.
 * Expects an object with conversation, interviewContext, tone, and timeLimit.
 */
export async function processBehavioralInterview(requestBody: any) {
  const { conversation, interviewContext, tone, timeLimit } = requestBody;
  // You might add logging or additional preprocessing here.
  const response = await callGeminiAPI({ conversation, interviewContext, tone, timeLimit });
  return { response };
}

export async function saveInterviewMessage(message: any) {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection(COLLECTION_NAME).insertOne(message);
    return result;
  } catch (error) {
    console.error('Error saving interview message:', error);
    throw error;
  }
} 

