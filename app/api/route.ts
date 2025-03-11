import { NextRequest, NextResponse } from 'next/server';

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

    if (action === 'saveMessage') {
      console.log("Forwarding save message request");
      
      // Forward to the upload endpoint
      const response = await fetch(new URL('/api/resume-enhance/upload', request.url), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Forward auth cookies and headers
          'Cookie': request.headers.get('cookie') || '',
          'Authorization': request.headers.get('authorization') || ''
        },
        body: JSON.stringify(body)
      });
      
      const responseData = await response.json();
      return NextResponse.json({ success: response.ok, result: responseData });
    } 
    else if (action === 'geminiOCR') {
      console.log("Forwarding Gemini OCR request");
      
      // Forward to the genai-ocr endpoint
      const response = await fetch(new URL('/api/resume-enhance/genai-ocr', request.url), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Forward auth cookies and headers
          'Cookie': request.headers.get('cookie') || '',
          'Authorization': request.headers.get('authorization') || ''
        },
        body: JSON.stringify(body)
      });
      
      const responseData = await response.json();
      return NextResponse.json({ success: response.ok, result: responseData });
    } 
    else if (action === 'analyzeResume') {
      console.log("Forwarding resume analysis request");
      
      // Forward to the analyze endpoint
      const response = await fetch(new URL('/api/resume-enhance/analyze', request.url), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Forward auth cookies and headers
          'Cookie': request.headers.get('cookie') || '',
          'Authorization': request.headers.get('authorization') || ''
        },
        body: JSON.stringify(body)
      });
      
      const responseData = await response.json();
      return NextResponse.json({ success: response.ok, result: responseData });
    }
    else {
      console.error("Invalid action:", action);
      return NextResponse.json({ error: "Invalid action specified", success: false }, { status: 400 });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("API route error:", errorMessage);
    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    );
  }
}