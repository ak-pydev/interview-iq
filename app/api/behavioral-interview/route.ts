import { NextResponse } from 'next/server';
import { 
  createInterviewSession, 
  joinInterviewSession,
  saveInterviewMessage,
  getInterviewSession,
  endInterviewSession,
  getParticipantDetails,
  processBehavioralInterview
} from '@/lib/interview-utils';

export async function POST(request: Request) {
  try {
    // Parse the request payload
    const requestBody = await request.json();
    const { action, sessionId, userId, message, role } = requestBody;
    
    if (!action) {
      return NextResponse.json(
        { error: "Missing required field: action" },
        { status: 400 }
      );
    }

    // Handle different action types
    switch (action) {
      case 'create_session': {
        // Create a new interview session
        const { title, description, duration, interviewType, participantRoles } = requestBody;
        if (!title || !interviewType || !participantRoles) {
          return NextResponse.json(
            { error: "Missing required fields for session creation" },
            { status: 400 }
          );
        }
        
        const newSession = await createInterviewSession({
          title,
          description: description || '',
          createdBy: userId,
          duration: duration || 30,
          interviewType,
          participantRoles,
          scheduledTime: requestBody.scheduledTime || new Date().toISOString(),
          status: 'scheduled'
        });
        
        return NextResponse.json({
          success: true,
          sessionId: newSession.id,
          joinLink: `${process.env.NEXT_PUBLIC_BASE_URL}/interview/${newSession.id}`
        });
      }
      
      case 'join_session': {
        // Join an existing interview session
        if (!sessionId || !userId || !role) {
          return NextResponse.json(
            { error: "Missing required fields: sessionId, userId, or role" },
            { status: 400 }
          );
        }
        
        const joinResult = await joinInterviewSession({
          sessionId,
          userId,
          role, // 'interviewer' or 'candidate'
          name: requestBody.name || 'Anonymous',
          email: requestBody.email || null
        });
        
        if (!joinResult.success) {
          return NextResponse.json(
            { error: joinResult.message || "Failed to join session" },
            { status: 400 }
          );
        }
        
        const sessionDetails = await getInterviewSession(sessionId);
        
        return NextResponse.json({
          success: true,
          session: sessionDetails,
          role,
          participantId: joinResult.participantId
        });
      }
      
      case 'send_message': {
        // Save the user's message and generate a recruiter reply
        if (!sessionId || !userId || !message) {
          return NextResponse.json(
            { error: "Missing required fields: sessionId, userId, or message" },
            { status: 400 }
          );
        }
        
        // Verify the user is a participant in the session
        const participant = await getParticipantDetails(sessionId, userId);
        if (!participant) {
          return NextResponse.json(
            { error: "You are not a participant in this interview session" },
            { status: 403 }
          );
        }
        
        // Save the user's message
        const savedMessage = await saveInterviewMessage({
          sessionId,
          senderId: userId,
          senderRole: participant.role,
          content: message,
          type: requestBody.messageType || 'text',
          timestamp: new Date().toISOString(),
          attachments: requestBody.attachments || [],
          metadata: requestBody.metadata || {}
        });
        
        // Retrieve the conversation history (latest messages)
        const sessionData = await getInterviewSession(sessionId);
        const conversationHistory = sessionData?.messages || [];
        
        // Process conversation history to generate a recruiter reply
        const aiResult = await processBehavioralInterview({
          conversation: conversationHistory,
          interviewContext: {}, // You can pass additional context if needed
          tone: 'friendly',
          timeLimit: 60
        });
        
        // Save the recruiter's reply as a system message
        const recruiterMessage = await saveInterviewMessage({
          sessionId,
          senderId: 'system',
          senderRole: 'system',
          content: aiResult.response,
          type: 'text',
          timestamp: new Date().toISOString()
        });
        
        return NextResponse.json({
          success: true,
          messageId: savedMessage.id,
          recruiterResponse: aiResult.response,
          recruiterMessageId: recruiterMessage.id
        });
      }
      
      case 'end_session': {
        if (!sessionId || !userId) {
          return NextResponse.json(
            { error: "Missing required fields: sessionId or userId" },
            { status: 400 }
          );
        }
        
        // Verify that only interviewers can end the session
        const participant = await getParticipantDetails(sessionId, userId);
        if (!participant || participant.role !== 'interviewer') {
          return NextResponse.json(
            { error: "You don't have permission to end this interview" },
            { status: 403 }
          );
        }
        
        const endResult = await endInterviewSession({
          sessionId,
          endedBy: userId,
          reason: requestBody.reason || 'completed',
          feedback: requestBody.feedback || null
        });
        
        return NextResponse.json({
          success: true,
          sessionStatus: 'ended',
          endTime: endResult.endTime
        });
      }
      
      case 'get_session': {
        if (!sessionId) {
          return NextResponse.json(
            { error: "Missing required field: sessionId" },
            { status: 400 }
          );
        }
        
        const session = await getInterviewSession(sessionId);
        if (!session) {
          return NextResponse.json(
            { error: "Interview session not found" },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          success: true,
          session
        });
      }
      
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Error in interview platform API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process interview request' },
      { status: 500 }
    );
  }
}
