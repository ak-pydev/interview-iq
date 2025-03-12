// app/api/interview/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { currentUser } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

export async function POST(request: NextRequest) {
  let mongoClient;
  
  try {
    // Get authenticated user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const userId = user.id;
    
    // Parse request body
    const body = await request.json();
    const { messages, systemPrompt, sessionId } = body;

    if (!messages || !Array.isArray(messages) || !sessionId) {
      return NextResponse.json(
        { error: 'Invalid request format. Messages array and sessionId are required.' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    mongoClient = await clientPromise;
    const db = mongoClient.db("propelcareerai-db");
    const sessionsCollection = db.collection('interview_sessions');
    const messagesCollection = db.collection('interview_messages');
    
    // Verify session exists and belongs to the user
    const session = await sessionsCollection.findOne({ 
      sessionId: sessionId,
      userId: userId
    });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found or unauthorized' },
        { status: 404 }
      );
    }
    
    // Update session status if it's still in 'created' state
    if (session.status === 'created') {
      await sessionsCollection.updateOne(
        { sessionId: sessionId },
        { $set: { status: 'in_progress' } }
      );
    }

    // Get resume data if available
    let resumeContent = '';
    if (session.fileId) {
      const resumeFiles = db.collection('resume_files');
      const resumeFile = await resumeFiles.findOne({ _id: new ObjectId(session.fileId) });
      
      if (resumeFile && resumeFile.parsedContent) {
        resumeContent = `Resume Content: ${resumeFile.parsedContent}\n\n`;
      }
    }
    
    // Build enhanced system prompt with resume and job details
    const enhancedSystemPrompt = `
      ${systemPrompt || 'You are an AI interviewer conducting a job interview.'}
      
      ${resumeContent}
      
      Job Title: ${session.jobTitle}
      Company Name: ${session.companyName}
      Job Description: ${session.jobDescription}
      Interview Type: ${session.interviewType}
      
      Use this information to ask relevant questions based on the candidate's background and the job requirements.
      If this is a technical interview, focus on technical skills, coding problems, and system design.
      If this is a behavioral interview, use the STAR method (Situation, Task, Action, Result) for questions.
    `.trim();

    // Format messages for OpenAI API
    const formattedMessages = [
      {
        role: 'system',
        content: enhancedSystemPrompt
      },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Make request to OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini-realtime-preview-2024-12-17',
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiMessage = response.choices[0].message.content;
    
    // Save message to database (only if not using WebSockets elsewhere)
    // This prevents duplicate messages if your WebSocket handler already saves them
    const messageDoc = {
      sessionId: sessionId,
      content: aiMessage,
      userId: userId,
      role: 'assistant',
      timestamp: new Date()
    };
    
    await messagesCollection.insertOne(messageDoc);
    
    // Return the response
    return NextResponse.json({
      message: aiMessage,
      sessionId: sessionId
    });
  } catch (error: any) {
    console.error('Error in interview API route:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during the interview' },
      { status: 500 }
    );
  }
}