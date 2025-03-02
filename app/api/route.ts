import { NextResponse } from 'next/server';
import { processBehavioralInterview, saveInterviewMessage } from '@/lib/interview-utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received API request:", JSON.stringify(body).substring(0, 200) + "...");

    // If the request body contains a "message" property, treat this as a save message call.
    if (body.message) {
      console.log("Processing save message request");
      const result = await saveInterviewMessage(body.message);
      return NextResponse.json({ success: true, result });
    } else {
      // Otherwise, treat the request as a Gemini interview processing call.
      console.log("Processing behavioral interview request");
      const result = await processBehavioralInterview(body);
      return NextResponse.json(result);
    }
  } catch (error: any) {
    console.error("API route error:", error.message);
    return NextResponse.json({ 
      error: error.message || "An unknown error occurred",
      success: false
    }, { status: 500 });
  }
}