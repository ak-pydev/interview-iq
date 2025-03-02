import { NextResponse } from 'next/server';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
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

// Fallback interview question in case Gemini doesn't return one
const FALLBACK_QUESTION =
  "Could you tell me about a challenging situation you've faced in your career and how you handled it?";

// Helper function to format conversation history
function formatConversation(conversation: ConversationMessage[]): string {
  if (conversation.length === 0) return "No previous messages";
  return conversation.map((msg) => `${msg.role}: ${msg.text}`).join('\n');
}

export async function POST(request: Request) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not defined in environment variables");
    return NextResponse.json({ error: "API key is missing" }, { status: 500 });
  }

  try {
    // Initialize Gemini SDK and get the generative model
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Parse and validate the request body
    const body: RequestBody = await request.json();
    if (!body.interviewContext) {
      console.error("interviewContext is missing in the request");
      return NextResponse.json({ error: "interviewContext is required" }, { status: 400 });
    }
    if (!Array.isArray(body.conversation)) {
      console.error("Invalid conversation format");
      return NextResponse.json({ error: "Conversation must be an array" }, { status: 400 });
    }

    console.log("Processing Gemini request with interviewContext length:", body.interviewContext.length);

    // Format conversation history using helper function
    const formattedConversation = formatConversation(body.conversation);

    // Construct the prompt for Gemini
    const prompt = `Interview Context: ${body.interviewContext}\n\n` +
      `Conversation so far: ${formattedConversation}\n\n` +
      `Instructions: Generate a behavioral interview question based on the context and conversation. ` +
      `Tone: ${body.tone || 'casual, friendly'}, Time Limit: ${body.timeLimit || 5} minutes. ` +
      `Ensure the question is relevant, concise, and allows for a meaningful response. ` +
      `If this is the first question, make it an introductory question about the candidate's background related to the role.`;

    console.log("Generated prompt for Gemini:", prompt);

    // Generate content using the Gemini model
    const result = await model.generateContent(prompt);
    if (!result || !result.response) {
      console.error("No response received from Gemini model");
      return NextResponse.json(
        { success: false, error: "No response received from Gemini model", question: FALLBACK_QUESTION },
        { status: 500 }
      );
    }

    const response = await result.response;
    const generatedText = await response.text();

    if (generatedText && generatedText.trim().length > 0) {
      console.log("Generated question:", generatedText.trim());
      return NextResponse.json({ success: true, question: generatedText.trim() });
    } else {
      console.error("Gemini model returned empty response");
      return NextResponse.json(
        { success: false, error: "Unable to generate a question", question: FALLBACK_QUESTION },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error generating interview question:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate interview question", question: FALLBACK_QUESTION },
      { status: 500 }
    );
  }
}
