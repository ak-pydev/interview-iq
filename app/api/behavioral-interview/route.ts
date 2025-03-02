import { NextResponse } from 'next/server';
import { processBehavioralInterview, saveInterviewMessage } from '@/lib/interview-utils';

export async function POST(request: Request) {
  try {
    // Parse the request payload
    const requestBody = await request.json();
    
    // Validate required fields
    const { conversation, interviewContext } = requestBody;
    if (!conversation || !interviewContext) {
      return NextResponse.json(
        { error: "Missing required fields: conversation or interviewContext" },
        { status: 400 }
      );
    }
    
    // Default values if not provided
    const tone = requestBody.tone || 'casual, friendly';
    const timeLimit = requestBody.timeLimit || 5;
    
    // Process the interview question generation
    const { response } = await processBehavioralInterview({
      conversation,
      interviewContext,
      tone,
      timeLimit
    });
    
    // Save the interaction to the database
    try {
      await saveInterviewMessage({
        type: 'question',
        content: response,
        timestamp: new Date().toISOString(),
        sessionId: requestBody.sessionId || null,
        metadata: {
          conversation: conversation,
          context: interviewContext,
          tone: tone,
          timeLimit: timeLimit
        }
      });
    } catch (dbError) {
      console.warn('Warning: Failed to save interview question to database', dbError);
      // Continue even if database save fails
    }
    
    // Return the generated question
    return NextResponse.json({
      success: true,
      question: response
    });
    
  } catch (error: any) {
    console.error('Error in behavioral interview processing:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to process interview request' },
      { status: 500 }
    );
  }
}