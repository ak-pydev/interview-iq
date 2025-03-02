// @/lib/interview-utils.ts
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db'; // Assuming you have a database connection setup

// Types for interview platform
export interface InterviewSession {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  duration: number; // in minutes
  interviewType: string;
  participantRoles: string[];
  scheduledTime: string;
  startTime?: string;
  endTime?: string;
  status: 'scheduled' | 'in-progress' | 'ended' | 'cancelled';
  participants?: InterviewParticipant[];
  createdAt: string;
  updatedAt: string;
}

export interface InterviewParticipant {
  id: string;
  sessionId: string;
  userId: string;
  role: string;
  name: string;
  email?: string;
  joinedAt: string;
  leftAt?: string;
  status: 'invited' | 'joined' | 'left';
}

export interface InterviewMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderRole: string;
  content: string;
  type: 'text' | 'question' | 'answer' | 'feedback' | 'system';
  timestamp: string;
  attachments?: any[];
  metadata?: any;
}

/**
 * Create a new interview session
 */
export async function createInterviewSession(sessionData: Partial<InterviewSession>): Promise<InterviewSession> {
  const sessionId = uuidv4();
  const now = new Date().toISOString();
  
  const newSession: InterviewSession = {
    id: sessionId,
    title: sessionData.title || 'Untitled Interview',
    description: sessionData.description || '',
    createdBy: sessionData.createdBy || 'system',
    duration: sessionData.duration || 30,
    interviewType: sessionData.interviewType || 'general',
    participantRoles: sessionData.participantRoles || ['interviewer', 'candidate'],
    scheduledTime: sessionData.scheduledTime || now,
    status: sessionData.status || 'scheduled',
    createdAt: now,
    updatedAt: now
  };
  
  // Save session to database
  await db.interviewSessions.create({
    data: newSession
  });
  
  // Create a system message indicating session creation
  await saveInterviewMessage({
    sessionId,
    senderId: 'system',
    senderRole: 'system',
    content: `Interview session "${newSession.title}" has been created`,
    type: 'system',
    timestamp: now
  });
  
  return newSession;
}

/**
 * Join an existing interview session
 */
export async function joinInterviewSession(joinData: {
  sessionId: string;
  userId: string;
  role: string;
  name: string;
  email?: string;
}): Promise<{
  success: boolean;
  participantId?: string;
  message?: string;
}> {
  try {
    // Check if session exists
    const session = await db.interviewSessions.findUnique({
      where: { id: joinData.sessionId },
      include: { participants: true }
    });
    
    if (!session) {
      return { success: false, message: 'Interview session not found' };
    }
    
    // Check if role is valid for this session
    if (!session.participantRoles.includes(joinData.role)) {
      return { success: false, message: `Invalid role: ${joinData.role}` };
    }
    
    // Check if this role is already taken in the session
    const roleExists = session.participants?.some(p => 
      p.role === joinData.role && p.status === 'joined'
    );
    
    if (roleExists) {
      return { success: false, message: `Role ${joinData.role} is already taken in this session` };
    }
    
    // Check if user is already in the session
    const existingParticipant = session.participants?.find(p => p.userId === joinData.userId);
    
    if (existingParticipant) {
      // Update their status if they're rejoining
      if (existingParticipant.status === 'left') {
        await db.interviewParticipants.update({
          where: { id: existingParticipant.id },
          data: {
            status: 'joined',
            joinedAt: new Date().toISOString(),
            leftAt: null
          }
        });
        
        // Create system message for rejoining
        await saveInterviewMessage({
          sessionId: joinData.sessionId,
          senderId: 'system',
          senderRole: 'system',
          content: `${joinData.name} has rejoined the interview as ${joinData.role}`,
          type: 'system',
          timestamp: new Date().toISOString()
        });
        
        return { success: true, participantId: existingParticipant.id };
      }
      
      // They're already active in the session
      return { 
        success: true, 
        participantId: existingParticipant.id,
        message: 'Already joined this session'
      };
    }
    
    // Create new participant
    const participantId = uuidv4();
    const now = new Date().toISOString();
    
    await db.interviewParticipants.create({
      data: {
        id: participantId,
        sessionId: joinData.sessionId,
        userId: joinData.userId,
        role: joinData.role,
        name: joinData.name,
        email: joinData.email || null,
        joinedAt: now,
        status: 'joined'
      }
    });
    
    // If this is the first participant to join, update session status
    if (!session.participants || session.participants.length === 0) {
      await db.interviewSessions.update({
        where: { id: joinData.sessionId },
        data: {
          status: 'in-progress',
          startTime: now,
          updatedAt: now
        }
      });
    }
    
    // Create system message for joining
    await saveInterviewMessage({
      sessionId: joinData.sessionId,
      senderId: 'system',
      senderRole: 'system',
      content: `${joinData.name} has joined the interview as ${joinData.role}`,
      type: 'system',
      timestamp: now
    });
    
    return { success: true, participantId };
  } catch (error) {
    console.error('Error joining interview session:', error);
    return { success: false, message: 'Failed to join interview session' };
  }
}

/**
 * Save a message in an interview session
 */
export async function saveInterviewMessage(messageData: Partial<InterviewMessage>): Promise<InterviewMessage> {
  const messageId = uuidv4();
  const timestamp = messageData.timestamp || new Date().toISOString();
  
  const newMessage: InterviewMessage = {
    id: messageId,
    sessionId: messageData.sessionId || '',
    senderId: messageData.senderId || '',
    senderRole: messageData.senderRole || '',
    content: messageData.content || '',
    type: messageData.type || 'text',
    timestamp,
    attachments: messageData.attachments || [],
    metadata: messageData.metadata || {}
  };
  
  // Save message to database
  await db.interviewMessages.create({
    data: newMessage
  });
  
  // Update session's updatedAt timestamp
  await db.interviewSessions.update({
    where: { id: messageData.sessionId },
    data: { updatedAt: timestamp }
  });
  
  return newMessage;
}

/**
 * Get details about an interview session
 */
export async function getInterviewSession(sessionId: string): Promise<InterviewSession | null> {
  try {
    const session = await db.interviewSessions.findUnique({
      where: { id: sessionId },
      include: {
        participants: {
          where: { status: 'joined' }
        }
      }
    });
    
    if (!session) {
      return null;
    }
    
    // Get the latest 50 messages
    const messages = await db.interviewMessages.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' },
      take: 50
    });
    
    return {
      ...session,
      messages
    } as InterviewSession;
  } catch (error) {
    console.error('Error fetching interview session:', error);
    return null;
  }
}

/**
 * End an interview session
 */
export async function endInterviewSession(endData: {
  sessionId: string;
  endedBy: string;
  reason?: string;
  feedback?: string;
}): Promise<{ success: boolean; endTime: string; }> {
  try {
    const now = new Date().toISOString();
    
    // Update session status
    await db.interviewSessions.update({
      where: { id: endData.sessionId },
      data: {
        status: 'ended',
        endTime: now,
        updatedAt: now
      }
    });
    
    // Mark all participants as having left
    await db.interviewParticipants.updateMany({
      where: { 
        sessionId: endData.sessionId,
        status: 'joined'
      },
      data: {
        status: 'left',
        leftAt: now
      }
    });
    
    // Add a system message
    const endMessage = endData.reason === 'completed' 
      ? 'The interview has been completed' 
      : `The interview has ended: ${endData.reason}`;
      
    await saveInterviewMessage({
      sessionId: endData.sessionId,
      senderId: 'system',
      senderRole: 'system',
      content: endMessage,
      type: 'system',
      timestamp: now
    });
    
    // If feedback was provided, save it
    if (endData.feedback) {
      await saveInterviewMessage({
        sessionId: endData.sessionId,
        senderId: endData.endedBy,
        senderRole: 'interviewer', // Assuming feedback comes from interviewer
        content: endData.feedback,
        type: 'feedback',
        timestamp: now
      });
    }
    
    return {
      success: true,
      endTime: now
    };
  } catch (error) {
    console.error('Error ending interview session:', error);
    throw new Error('Failed to end interview session');
  }
}

/**
 * Get participant details
 */
export async function getParticipantDetails(
  sessionId: string, 
  userId: string
): Promise<InterviewParticipant | null> {
  try {
    const participant = await db.interviewParticipants.findFirst({
      where: {
        sessionId,
        userId,
        status: 'joined'
      }
    });
    
    return participant;
  } catch (error) {
    console.error('Error fetching participant details:', error);
    return null;
  }
}

/**
 * Legacy function for backward compatibility
 */
export async function processBehavioralInterview({ 
  conversation, 
  interviewContext, 
  tone, 
  timeLimit 
}: {
  conversation: any[],
  interviewContext: any,
  tone: string,
  timeLimit: number
}): Promise<{ response: string }> {
  // This function is kept for backwards compatibility
  // In the human-to-human interview platform, this would simply pass through
  // the latest message from the interviewer
  
  if (conversation && conversation.length > 0) {
    const lastMessage = conversation[conversation.length - 1];
    return {
      response: lastMessage.content || "Please provide your answer to the interviewer's question."
    };
  }
  
  return {
    response: "Welcome to the interview. The interviewer will join shortly."
  };
}