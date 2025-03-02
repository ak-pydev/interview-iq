import { NextResponse } from 'next/server';
import { 
  createInterviewSession, 
  joinInterviewSession,
  saveInterviewMessage,
  getInterviewSession,
  endInterviewSession,
  getParticipantDetails
} from '@/lib/interview-utils';

export async function POST(request: Request) {
  try {
    // Parse the request payload
    const requestBody = await request.json();
    
    // Determine the action type
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
          duration: duration || 30, // Default 30 minutes
          interviewType, // e.g., 'technical', 'behavioral', 'general'
          participantRoles, // e.g., ['interviewer', 'candidate']
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
        
        // Get session details to return to the client
        const sessionDetails = await getInterviewSession(sessionId);
        
        return NextResponse.json({
          success: true,
          session: sessionDetails,
          role: role,
          participantId: joinResult.participantId
        });
      }
      
      case 'send_message': {
        // Send a message in an interview session
        if (!sessionId || !userId || !message) {
          return NextResponse.json(
            { error: "Missing required fields: sessionId, userId, or message" },
            { status: 400 }
          );
        }
        
        // Get participant details to verify they're in the session
        const participant = await getParticipantDetails(sessionId, userId);
        if (!participant) {
          return NextResponse.json(
            { error: "You are not a participant in this interview session" },
            { status: 403 }
          );
        }
        
        // Save the message
        const savedMessage = await saveInterviewMessage({
          sessionId,
          senderId: userId,
          senderRole: participant.role,
          content: message,
          type: requestBody.messageType || 'text', // 'text', 'question', 'answer', 'feedback'
          timestamp: new Date().toISOString(),
          attachments: requestBody.attachments || [],
          metadata: requestBody.metadata || {}
        });
        
        return NextResponse.json({
          success: true,
          messageId: savedMessage.id,
          timestamp: savedMessage.timestamp
        });
      }
      
      case 'end_session': {
        // End an interview session
        if (!sessionId || !userId) {
          return NextResponse.json(
            { error: "Missing required fields: sessionId or userId" },
            { status: 400 }
          );
        }
        
        // Verify the user has permission to end the session
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
        // Get details about an interview session
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