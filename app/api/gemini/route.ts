import { NextResponse } from 'next/server';
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Configure dotenv
dotenv.config();

// Type definitions for improved type safety
interface ConversationMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface RequestBody {
  conversation: ConversationMessage[];
  interviewContext: string;
  tone?: string;
  timeLimit?: number;
}

// Fallback interview question
const FALLBACK_QUESTION = "Could you tell me about a challenging situation you've faced in your career and how you handled it?";

export async function POST(request: Request) {
  // Validate Gemini API key
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not defined in environment variables");
    return NextResponse.json(
      { error: "API key is missing" },
      { status: 500 }
    );
  }

  try {
    // Initialize Gemini SDK
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });

    // Parse the request body with type checking
    const body: RequestBody = await request.json();
    
    // Validate required fields
    if (!body.interviewContext) {
      return NextResponse.json(
        { error: "interviewContext is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.conversation)) {
      return NextResponse.json(
        { error: "Conversation must be an array" },
        { status: 400 }
      );
    }
    
    // Log processing details
    console.log("Processing Gemini request with context length:", body.interviewContext.length);
    
    // Format conversation for Gemini
    const formattedConversation = body.conversation.length > 0
      ? body.conversation.map(msg => `${msg.role}: ${msg.text}`).join('\n')
      : "No previous messages";
    
    // Construct prompt for Gemini
    const prompt = `Interview Context: ${body.interviewContext}\n\n` +
      `Conversation so far: ${formattedConversation}\n\n` +
      `Instructions: Generate a behavioral interview question based on the context and conversation. ` +
      `Tone: ${body.tone || 'casual, friendly'}, Time Limit: ${body.timeLimit || 5} minutes. ` +
      `Ensure the question is relevant, concise, and allows for a meaningful response. ` +
      `If this is the first question, make it an introductory question about the candidate's background related to the role.`;

    // Generate content using Gemini SDK
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();
    
    // Return generated question
    if (generatedText) {
      return NextResponse.json({ 
        success: true, 
        question: generatedText.trim()
      });
    } else {
      console.error("Failed to generate a question");
      
      return NextResponse.json(
        { 
          success: false,
          error: "Unable to generate a question",
          question: FALLBACK_QUESTION
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    // Comprehensive error handling
    console.error("Error generating interview question:", error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Failed to generate interview question",
        question: FALLBACK_QUESTION
      },
      { status: 500 }
    );
  }
}