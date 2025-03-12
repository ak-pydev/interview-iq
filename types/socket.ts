// types/socket.ts
import { NextApiResponse } from 'next';
import { Server as NetServer } from 'http';
import { Socket as NetSocket } from 'net';
import { Server as SocketIOServer } from 'socket.io';

export interface SocketServer extends NetServer {
  io?: SocketIOServer;
}

export interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

export interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export interface InterviewMessage {
  _id?: string;
  sessionId: string;
  content: string;
  userId: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  category?: string; // For behavioral interviews
  codeBlock?: string; // For technical interviews
}

export interface InterviewSession {
  _id?: string;
  sessionId: string;
  userId: string;
  fileId: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  interviewType: 'technical' | 'behavior';
  status: 'created' | 'in_progress' | 'completed';
  createdAt: Date;
  completedAt?: Date;
}

export interface SocketEvent {
  joinSession: (sessionId: string, userId: string) => void;
  sendMessage: (data: {
    sessionId: string;
    content: string;
    userId: string;
    role: 'user' | 'assistant' | 'system';
  }) => void;
  transcribe: (audioData: ArrayBuffer, sessionId: string, userId: string) => void;
}

export interface SocketResponse {
  sessionHistory: InterviewMessage[];
  newMessage: InterviewMessage;
  processingAI: boolean;
  error: string;
  transcription: string;
}