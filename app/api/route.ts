<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';
import { POST as processGeminiOCR } from './resume-enhance/genai-ocr/route';
import { POST as saveInterviewMessage } from './resume-enhance/upload/route';

export async function POST(request: NextRequest) {
=======
import { NextResponse } from 'next/server';
import { processBehavioralInterview } from './behavioral-interview/route';
import { processGemini } from './gemini/route';
import { processGeminiOCR } from './gemini-ocr/route';
import { processMockInterview } from './test-interview/route';
import { processResume } from './process-resume/route';
import { saveInterviewMessage } from './uploading/interviews/route';

export async function POST(request: Request) {
>>>>>>> 5c3db7c68406bbc17a2604f2dce0ec7a944cedc9
  try {
    const body = await request.json();
    console.log("Received API request:", JSON.stringify(body).substring(0, 200) + "...");
    
    const { action } = body;
    if (!action) {
      return NextResponse.json(
        { error: "Missing required field: action" },
        { status: 400 }
      );
    }

<<<<<<< HEAD
    let result: NextResponse;
    if (action === 'saveMessage') {
      console.log("Dispatching save message request");
      // Create a fake request for the saveInterviewMessage handler.
      const fakeReq = new Request("http://localhost/api/dummy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: body.message }),
      });
      result = await saveInterviewMessage(fakeReq);
    } else if (action === 'geminiOCR') {
      console.log("Dispatching Gemini OCR request");
      // Create a fake request for the processGeminiOCR handler.
      const fakeReq = new Request("http://localhost/api/dummy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      result = await processGeminiOCR(fakeReq);
    } else {
      console.error("Invalid action:", action);
      return NextResponse.json({ error: "Invalid action specified" }, { status: 400 });
    }

    // Extract and return the JSON response from the handler.
    const responseData = await result.json();
    return NextResponse.json({ success: true, result: responseData });
=======
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
>>>>>>> 5c3db7c68406bbc17a2604f2dce0ec7a944cedc9
  } catch (error: any) {
    console.error("API route error:", error.message);
    return NextResponse.json(
      { error: error.message || "An unknown error occurred", success: false },
      { status: 500 }
    );
  }
}
