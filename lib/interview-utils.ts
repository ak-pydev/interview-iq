import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Configure dotenv
dotenv.config();

// Type definitions
interface ConversationMessage {
  role: 'user' | 'assistant';
  text: string;
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
  
  // Construct prompt for Gemini
  const prompt = `Interview Context: ${params.interviewContext}\n\n` +
    `Conversation so far: ${formattedConversation}\n\n` +
    `Instructions: Based on the context and conversation history, ask a relevant behavioral interview question in a ${tone} tone. ` +
    `The candidate should be able to answer this question within ${timeLimit} minutes.\n` +
    `If this is the first question, make it an introductory question about their background related to the role.\n` +
    `Focus on relevant experience, challenging situations they've faced, or how they've demonstrated skills mentioned in the job description.\n` +
    `Keep your questions concise and clear.`;

  try {
    console.log(`Calling Gemini API with conversation length: ${Array.isArray(params.conversation) ? params.conversation.length : 'N/A'}`);
    
    // Initialize Gemini SDK
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Generate content using Gemini SDK
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();

    console.log(`Received response from Gemini API (${generatedText.length} chars)`);
    return generatedText;

  } catch (error: any) {
    console.error("Gemini API error:", error.message);
    // Provide a fallback response in case of API failure
    return "I'm sorry, I couldn't generate a question at the moment. Could you tell me about a challenging situation you've faced in your previous role and how you handled it?";
  }
}