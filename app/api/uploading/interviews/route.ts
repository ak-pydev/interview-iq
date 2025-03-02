// File: app/api/uploading/interviews/route.ts
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'propelcareerdb';

// Collections for the interview platform
const COLLECTIONS = {
  SESSIONS: 'interview_sessions',
  PARTICIPANTS: 'interview_participants',
  MESSAGES: 'interview_messages'
};

export async function POST(request: Request) {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined");
    return NextResponse.json(
      { error: "Database configuration is missing" },
      { status: 500 }
    );
  }

  let client: MongoClient | null = null;

  try {
    // Determine if the request is multipart/form-data or JSON
    const contentType = request.headers.get("content-type") || "";
    let requestBody: any;
    let resumeFile: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      requestBody = {
        action: formData.get("action"),
        title: formData.get("title"),
        description: formData.get("description"),
        createdBy: formData.get("createdBy"),
        duration: Number(formData.get("duration")),
        interviewType: formData.get("interviewType"),
        participantRoles: JSON.parse(formData.get("participantRoles") as string),
        scheduledTime: formData.get("scheduledTime"),
        userQuestions: JSON.parse(formData.get("userQuestions") as string),
        selectedMode: formData.get("selectedMode")
      };
      resumeFile = formData.get("resumeFile") as File | null;
    } else {
      requestBody = await request.json();
    }

    const { action } = requestBody;
    if (!action) {
      return NextResponse.json(
        { error: "Missing required field: action" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);

    // Handle different actions
    switch (action) {
      case 'create_session': {
        const { title, description, createdBy, duration, interviewType, participantRoles, scheduledTime, userQuestions, selectedMode } = requestBody;
        if (!title || !interviewType || !participantRoles) {
          return NextResponse.json(
            { error: "Missing required fields for session creation" },
            { status: 400 }
          );
        }
        const sessionId = uuidv4();
        const now = new Date().toISOString();

        const sessionData = {
          _id: sessionId,
          title,
          description: description || '',
          createdBy: createdBy || 'system',
          duration: duration || 30,
          interviewType,
          participantRoles,
          scheduledTime: scheduledTime || now,
          status: 'scheduled',
          createdAt: now,
          updatedAt: now
        };

        const sessionsCollection = db.collection(COLLECTIONS.SESSIONS);
        await sessionsCollection.insertOne(sessionData);

        // Optionally, if a resume file was provided, handle file storage here.
        if (resumeFile) {
          console.log("Received resume file:", resumeFile.name);
          // For example, store the file in cloud storage and save its URL in sessionData.
        }

        const messagesCollection = db.collection(COLLECTIONS.MESSAGES);
        await messagesCollection.insertOne({
          _id: uuidv4(),
          sessionId,
          senderId: 'system',
          senderRole: 'system',
          content: `Interview session "${title}" has been created`,
          type: 'system',
          timestamp: now
        });

        return NextResponse.json({
          success: true,
          sessionId,
          joinLink: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/interview/${sessionId}`
        });
      }

      case 'join_session': {
        const { sessionId, userId, role, name, email } = requestBody;
        if (!sessionId || !userId || !role) {
          return NextResponse.json(
            { error: "Missing required fields: sessionId, userId, or role" },
            { status: 400 }
          );
        }

        const sessionsCollection = db.collection(COLLECTIONS.SESSIONS);
        const session = await sessionsCollection.findOne({ _id: sessionId });
        if (!session) {
          return NextResponse.json(
            { error: "Interview session not found" },
            { status: 404 }
          );
        }
        if (!session.participantRoles.includes(role)) {
          return NextResponse.json(
            { error: `Invalid role: ${role}` },
            { status: 400 }
          );
        }
        const participantsCollection = db.collection(COLLECTIONS.PARTICIPANTS);
        const existingRoleParticipant = await participantsCollection.findOne({
          sessionId,
          role,
          status: 'joined'
        });
        if (existingRoleParticipant) {
          return NextResponse.json(
            { error: `Role ${role} is already taken in this session` },
            { status: 400 }
          );
        }

        const now = new Date().toISOString();
        let participantId;
        const existingParticipant = await participantsCollection.findOne({
          sessionId,
          userId
        });
        if (existingParticipant) {
          participantId = existingParticipant._id;
          if (existingParticipant.status === 'left') {
            await participantsCollection.updateOne(
              { _id: participantId },
              {
                $set: {
                  status: 'joined',
                  joinedAt: now,
                  leftAt: null
                }
              }
            );
            const messagesCollection = db.collection(COLLECTIONS.MESSAGES);
            await messagesCollection.insertOne({
              _id: uuidv4(),
              sessionId,
              senderId: 'system',
              senderRole: 'system',
              content: `${name} has rejoined the interview as ${role}`,
              type: 'system',
              timestamp: now
            });
          }
        } else {
          participantId = uuidv4();
          await participantsCollection.insertOne({
            _id: participantId,
            sessionId,
            userId,
            role,
            name: name || 'Anonymous',
            email: email || null,
            joinedAt: now,
            status: 'joined'
          });
          const participantsCount = await participantsCollection.countDocuments({
            sessionId,
            status: 'joined'
          });
          if (participantsCount === 1) {
            await sessionsCollection.updateOne(
              { _id: sessionId },
              {
                $set: {
                  status: 'in-progress',
                  startTime: now,
                  updatedAt: now
                }
              }
            );
          }
          const messagesCollection = db.collection(COLLECTIONS.MESSAGES);
          await messagesCollection.insertOne({
            _id: uuidv4(),
            sessionId,
            senderId: 'system',
            senderRole: 'system',
            content: `${name || 'Anonymous'} has joined the interview as ${role}`,
            type: 'system',
            timestamp: now
          });
        }

        const updatedSession = await sessionsCollection.findOne({ _id: sessionId });
        const participants = await participantsCollection.find({ sessionId, status: 'joined' }).toArray();
        const messagesCollection = db.collection(COLLECTIONS.MESSAGES);
        const messages = await messagesCollection.find({ sessionId }).sort({ timestamp: 1 }).limit(50).toArray();
        
        return NextResponse.json({
          success: true,
          session: { ...updatedSession, participants, messages },
          role,
          participantId
        });
      }

      case 'send_message': {
        const { sessionId, userId, message, messageType } = requestBody;
        if (!sessionId || !userId || !message) {
          return NextResponse.json(
            { error: "Missing required fields: sessionId, userId, or message" },
            { status: 400 }
          );
        }
        const participantsCollection = db.collection(COLLECTIONS.PARTICIPANTS);
        const participant = await participantsCollection.findOne({
          sessionId,
          userId,
          status: 'joined'
        });
        if (!participant) {
          return NextResponse.json(
            { error: "You are not a participant in this interview session" },
            { status: 403 }
          );
        }
        const messageId = uuidv4();
        const timestamp = new Date().toISOString();
        const messagesCollection = db.collection(COLLECTIONS.MESSAGES);
        await messagesCollection.insertOne({
          _id: messageId,
          sessionId,
          senderId: userId,
          senderName: participant.name,
          senderRole: participant.role,
          content: message,
          type: messageType || 'text',
          timestamp,
          attachments: requestBody.attachments || [],
          metadata: requestBody.metadata || {}
        });
        const sessionsCollection = db.collection(COLLECTIONS.SESSIONS);
        await sessionsCollection.updateOne(
          { _id: sessionId },
          { $set: { updatedAt: timestamp } }
        );
        return NextResponse.json({
          success: true,
          messageId,
          timestamp
        });
      }

      case 'end_session': {
        const { sessionId, userId, reason, feedback } = requestBody;
        if (!sessionId || !userId) {
          return NextResponse.json(
            { error: "Missing required fields: sessionId or userId" },
            { status: 400 }
          );
        }
        const participantsCollection = db.collection(COLLECTIONS.PARTICIPANTS);
        const participant = await participantsCollection.findOne({
          sessionId,
          userId,
          role: 'interviewer',
          status: 'joined'
        });
        if (!participant) {
          return NextResponse.json(
            { error: "You don't have permission to end this interview" },
            { status: 403 }
          );
        }
        const now = new Date().toISOString();
        const sessionsCollection = db.collection(COLLECTIONS.SESSIONS);
        await sessionsCollection.updateOne(
          { _id: sessionId },
          {
            $set: {
              status: 'ended',
              endTime: now,
              updatedAt: now
            }
          }
        );
        await participantsCollection.updateMany(
          { sessionId, status: 'joined' },
          {
            $set: {
              status: 'left',
              leftAt: now
            }
          }
        );
        const endMessage = reason === 'completed'
          ? 'The interview has been completed'
          : `The interview has ended: ${reason || 'No reason provided'}`;
        const messagesCollection = db.collection(COLLECTIONS.MESSAGES);
        await messagesCollection.insertOne({
          _id: uuidv4(),
          sessionId,
          senderId: 'system',
          senderRole: 'system',
          content: endMessage,
          type: 'system',
          timestamp: now
        });
        if (feedback) {
          await messagesCollection.insertOne({
            _id: uuidv4(),
            sessionId,
            senderId: userId,
            senderRole: 'interviewer',
            content: feedback,
            type: 'feedback',
            timestamp: now
          });
        }
        return NextResponse.json({
          success: true,
          sessionStatus: 'ended',
          endTime: now
        });
      }

      case 'get_session': {
        const { sessionId } = requestBody;
        if (!sessionId) {
          return NextResponse.json(
            { error: "Missing required field: sessionId" },
            { status: 400 }
          );
        }
        const sessionsCollection = db.collection(COLLECTIONS.SESSIONS);
        const session = await sessionsCollection.findOne({ _id: sessionId });
        if (!session) {
          return NextResponse.json(
            { error: "Interview session not found" },
            { status: 404 }
          );
        }
        const participantsCollection = db.collection(COLLECTIONS.PARTICIPANTS);
        const participants = await participantsCollection.find({ sessionId, status: 'joined' }).toArray();
        const messagesCollection = db.collection(COLLECTIONS.MESSAGES);
        const messages = await messagesCollection.find({ sessionId })
          .sort({ timestamp: 1 })
          .limit(50)
          .toArray();
        
        return NextResponse.json({
          success: true,
          session: {
            ...session,
            participants,
            messages
          }
        });
      }

      case 'process_behavioral_interview': {
        const { conversation, interviewContext, tone, timeLimit } = requestBody;
        if (!conversation || !interviewContext) {
          return NextResponse.json(
            { error: "Missing required fields: conversation or interviewContext" },
            { status: 400 }
          );
        }
        const responseText = conversation.length > 0
          ? conversation[conversation.length - 1].content
          : "Welcome to the interview. The interviewer will join shortly.";
        const legacyCollection = db.collection('mockinterview-behavior');
        await legacyCollection.insertOne({
          conversation,
          interviewContext,
          tone: tone || 'casual, friendly',
          timeLimit: timeLimit || 5,
          response: responseText,
          timestamp: new Date().toISOString()
        });
        
        return NextResponse.json({
          success: true,
          question: responseText
        });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Error in interview platform API:", error);
    return NextResponse.json(
      { 
        error: "Failed to process request",
        details: error.message,
        code: error.code
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
