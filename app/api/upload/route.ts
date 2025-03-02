import { NextResponse } from 'next/server';
import { processBehavioralInterview, saveInterviewMessage } from './behavior';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // If the request body contains a "message" property, treat this as a save message call.
    if (body.message) {
      const result = await saveInterviewMessage(body.message);
      return NextResponse.json({ success: true, result });
    } else {
      // Otherwise, treat the request as a Gemini interview processing call.
      const result = await processBehavioralInterview(body);
      return NextResponse.json(result);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
