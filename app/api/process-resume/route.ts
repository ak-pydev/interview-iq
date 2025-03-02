import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-pro-exp-02-05' });

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file provided or invalid file' },
        { status: 400 }
      );
    }

    // Fetch file as array buffer and convert to base64
    const fileBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(fileBuffer).toString("base64");

    // Use Gemini's OCR summarization via the GoogleGenerativeAI SDK
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      },
      'Summarize this document including critical details.',
    ]);

    // Assuming the response returns the summarized text via result.response.text()
    const summary = result.response.text();

    return NextResponse.json({
      success: true,
      summary,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });
  } catch (error: any) {
    console.error('Error processing resume:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
