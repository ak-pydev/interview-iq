import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectToDatabase } from '../behavioral-interview'; // Adjust path as needed

export async function POST(request: Request) {
  try {
    // Expect the client to send a JSON payload with a "pdfId" property.
    const { pdfId } = await request.json();
    if (!pdfId) {
      return NextResponse.json({ error: "pdfId is required" }, { status: 400 });
    }

    // Connect to MongoDB and fetch the PDF document
    const { db } = await connectToDatabase();
    const pdfDoc = await db.collection('pdfFiles').findOne({ _id: new ObjectId(pdfId) });
    if (!pdfDoc || !pdfDoc.fileData) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    // Ensure that fileData is a Buffer.
    const pdfBuffer: Buffer = Buffer.isBuffer(pdfDoc.fileData)
      ? pdfDoc.fileData
      : pdfDoc.fileData.buffer;
    const base64Data = pdfBuffer.toString("base64");

    // Instantiate the Gemini client using GoogleGenerativeAI with your API key.
    // The non-null assertion operator (!) is used because we expect GEMINI_API_KEY to be defined.
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-pro-exp-02-05' });

    // Call the model with inline data (base64 PDF) and a summarization prompt.
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: "application/pdf",
        },
      },
      'Summarize this document, including critical details.',
    ]);

    // Return the summarized text.
    // Adjust this if your library's API returns the text differently.
    return NextResponse.json({ summary: result.response.text });
  } catch (error: any) {
    console.error("Error in Gemini OCR endpoint:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
