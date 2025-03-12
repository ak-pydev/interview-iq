// app/api/session/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Fetching session data for ID: ${params.id}`);
    
    // Get authenticated user - making this optional for development
    let userId = "demo-user";
    try {
      const user = await currentUser();
      if (user) {
        userId = user.id;
        console.log(`Authenticated user: ${userId}`);
      } else {
        console.log("No authenticated user, using demo user ID");
      }
    } catch (authError) {
      console.error("Authentication error:", authError);
      console.log("Continuing with demo user ID");
    }

    const sessionId = params.id;

    // For demo sessions, return mock data
    if (sessionId.startsWith('demo-') || !clientPromise) {
      console.log(`Returning mock session data for ${sessionId}`);
      return NextResponse.json(createDemoSession(sessionId, userId));
    }

    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db("propelcareerai-db");
    const sessionsCollection = db.collection('interview_sessions');
    
    // Find session in database
    console.log(`Querying MongoDB for session ${sessionId}`);
    const session = await sessionsCollection.findOne({ 
      sessionId: sessionId
    });

    // Check if session exists
    if (!session) {
      console.log(`Session not found: ${sessionId}`);
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    console.log(`Session found: ${sessionId}`);
    return NextResponse.json(session);
  } catch (error) {
    console.error('Error retrieving session:', error);
    // Return mock data as fallback in case of error
    return NextResponse.json(
      createDemoSession(params.id, "demo-user"),
      { status: 200 }
    );
  }
}

// Demo session creator for testing purposes
function createDemoSession(sessionId: string, userId: string) {
  const interviewType = sessionId.includes('technical') ? 'technical' : 'behavior';
  
  const demoSession = {
    sessionId: sessionId,
    userId: userId,
    jobTitle: interviewType === 'technical' ? "Frontend Developer" : "Product Manager",
    companyName: "Acme Tech",
    jobDescription: interviewType === 'technical' 
      ? "We're looking for a skilled frontend developer with experience in React, TypeScript, and modern JavaScript frameworks. The ideal candidate will have 3+ years of experience building responsive web applications and a strong understanding of UI/UX principles."
      : "We're seeking a product manager who can lead cross-functional teams, define product requirements, and drive product strategy. The ideal candidate will have experience with agile methodologies and a track record of successful product launches.",
    interviewType: interviewType,
    status: "in_progress",
    createdAt: new Date().toISOString()
  };
  
  return demoSession;
}