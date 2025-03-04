import { NextResponse } from 'next/server';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

const DB_NAME = 'propelcareerdb';

// Helper function to connect to MongoDB
async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  return { client, db };
}

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

// Fallback interview question if Gemini returns no response
const FALLBACK_QUESTION =
  "Could you tell me about a challenging situation you've faced in your career and how you handled it?";

export async function POST(request: Request) {
  try {
    // Parse the request payload, expecting a JSON with a "pdfId" property
    const { pdfId } = await request.json();
    if (!pdfId) {
      return NextResponse.json({ error: "pdfId is required" }, { status: 400 });
    }

    // Connect to MongoDB and fetch the PDF document
    const { client, db } = await connectToDatabase();
    const pdfDoc = await db.collection('pdfFiles').findOne({ _id: new ObjectId(pdfId) });
    if (!pdfDoc || !pdfDoc.fileData) {
      await client.close();
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    // Ensure fileData is a Buffer
    const pdfBuffer: Buffer = Buffer.isBuffer(pdfDoc.fileData)
      ? pdfDoc.fileData
      : pdfDoc.fileData.buffer;
    const base64Data = pdfBuffer.toString("base64");

    // Instantiate the Gemini client using GoogleGenerativeAI with your API key
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not defined in environment variables");
      await client.close();
      return NextResponse.json({ error: "API key is missing" }, { status: 500 });
    }
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-pro-exp-02-05' });

    // Generate content using the Gemini model with inline PDF data and a summarization prompt
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: "application/pdf",
        },
      },
      'Summarize this document, including critical details.',
    ]);

    // Close the database connection
    await client.close();

    // Return the summarized text
    const summary = result.response.text;
    if (summary && summary.trim().length > 0) {
      return NextResponse.json({ success: true, summary: summary.trim() });
    } else {
      console.error("Gemini model returned an empty response");
      return NextResponse.json(
        { success: false, error: "Unable to generate a summary", summary: FALLBACK_QUESTION },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in Gemini OCR endpoint:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
