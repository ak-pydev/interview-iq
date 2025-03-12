// hooks/useInterviewSocket.ts
import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@clerk/nextjs';
import { InterviewMessage } from '@/types/socket';

interface UseInterviewSocketProps {
  sessionId: string;
}

export default function useInterviewSocket({ sessionId }: UseInterviewSocketProps) {
  const { userId: authUserId } = useAuth();
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    if (!sessionId || !authUserId) return;

    // Initialize Socket.io connection
    const initializeSocket = async () => {
      await fetch('/api/socket');
      
      socketRef.current = io();

      // Connection events
      socketRef.current.on('connect', () => {
        setIsConnected(true);
        setError(null);
        
        // Join interview session
        socketRef.current?.emit('joinSession', sessionId, authUserId);
      });

      socketRef.current.on('disconnect', () => {
        setIsConnected(false);
      });

      socketRef.current.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
        setError('Failed to connect to server');
        setIsConnected(false);
      });

      // Interview message events
      socketRef.current.on('sessionHistory', (history: InterviewMessage[]) => {
        setMessages(history);
      });

      socketRef.current.on('newMessage', (message: InterviewMessage) => {
        setMessages(prev => [...prev, message]);
      });

      socketRef.current.on('processingAI', (status: boolean) => {
        setIsProcessing(status);
      });

      socketRef.current.on('error', (errorMessage: string) => {
        setError(errorMessage);
      });

      socketRef.current.on('transcription', (text: string) => {
        setTranscription(text);
      });
    };

    initializeSocket();

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [sessionId, authUserId]);

  // Send a message
  const sendMessage = useCallback((content: string) => {
    if (!socketRef.current || !isConnected || !sessionId || !authUserId) {
      setError('Not connected to server');
      return;
    }

    socketRef.current.emit('sendMessage', {
      sessionId,
      content,
      userId: authUserId,
      role: 'user'
    });
  }, [isConnected, sessionId, authUserId]);

  // Start voice recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        if (!socketRef.current || !isConnected) {
          setError('Not connected to server');
          return;
        }
        
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const arrayBuffer = await audioBlob.arrayBuffer();
        
        // Send to server for transcription
        socketRef.current.emit('transcribe', arrayBuffer, sessionId, authUserId);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Failed to access microphone');
    }
  }, [isConnected, sessionId, authUserId]);

  // Stop voice recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    setIsRecording(false);
  }, []);

  // Clear transcription
  const clearTranscription = useCallback(() => {
    setTranscription('');
  }, []);

  return {
    messages,
    isConnected,
    isProcessing,
    error,
    sendMessage,
    isRecording,
    transcription,
    startRecording,
    stopRecording,
    clearTranscription
  };
}