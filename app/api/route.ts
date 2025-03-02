// File: /api/route.ts
import { NextResponse } from 'next/server';
import { processBehavioralInterview } from './behavioral-interview/route';
import { processGemini } from './gemini/route';
import { processGeminiOCR } from './gemini-ocr/route';
import { processMockInterview } from './test-interview/route';
import { processResume } from './process-resume/route';
import { saveInterviewMessage } from './uploading/interviews/route';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received API request:", JSON.stringify(body).substring(0, 200) + "...");
    const action = body.action;
    let result;

    switch (action) {
      case 'saveMessage':
        console.log("Dispatching save message request");
        result = await saveInterviewMessage(body.message);
        break;
      case 'behavioral':
        console.log("Dispatching behavioral interview request");
        result = await processBehavioralInterview(body);
        break;
      case 'gemini':
        console.log("Dispatching Gemini request");
        result = await processGemini(body);
        break;
      case 'geminiOCR':
        console.log("Dispatching Gemini OCR request");
        result = await processGeminiOCR(body);
        break;
      case 'mockInterview':
        console.log("Dispatching mock interview request");
        result = await processMockInterview(body);
        break;
      case 'processResume':
        console.log("Dispatching resume processing request");
        result = await processResume(body);
        break;
      default:
        console.error("Invalid action:", action);
        return NextResponse.json({ error: "Invalid action specified" }, { status: 400 });
    }

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("API route error:", error.message);
    return NextResponse.json(
      { error: error.message || "An unknown error occurred", success: false },
      { status: 500 }
    );
  }
}
