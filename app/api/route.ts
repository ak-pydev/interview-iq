import { NextRequest, NextResponse } from 'next/server';
import { POST as processGeminiOCR } from './resume-enhance/genai-ocr/route';
import { POST as saveInterviewMessage } from './resume-enhance/upload/route';

export async function POST(request: NextRequest) {
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
  } catch (error: any) {
    console.error("API route error:", error.message);
    return NextResponse.json(
      { error: error.message || "An unknown error occurred", success: false },
      { status: 500 }
    );
  }
}
