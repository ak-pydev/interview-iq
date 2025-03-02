'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RefreshCw, MicIcon, MicOffIcon } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'recruiter';
  timestamp: Date;
}

const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function RecruiterInterviewSpeechPage() {
  const router = useRouter();
  const [conversation, setConversation] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const hasGreetedRef = useRef<boolean>(false);

  // Initialize SpeechRecognition on component mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech recognition is not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false; // Only final results
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.trim();
      if (!transcript) return;
      const userMsg = { id: generateId(), role: 'user', content: transcript, timestamp: new Date() };
      addMessage(userMsg);
      await sendMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event);
      toast.error('Speech recognition error. Please try again.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    // Greet the candidate only once on mount
    if (!hasGreetedRef.current) {
      greetUser();
      hasGreetedRef.current = true;
    }
  }, []);

  // Helper: Append a message to conversation
  const addMessage = useCallback((msg: Message) => {
    setConversation((prev) => [...prev, msg]);
  }, []);

  // Greet the candidate
  const greetUser = useCallback(() => {
    const greeting = "Hello, I'm your recruiter. Welcome to your interview. Please tell me a bit about yourself.";
    addMessage({ id: generateId(), role: 'recruiter', content: greeting, timestamp: new Date() });
    speakText(greeting);
  }, [addMessage]);

  // Send user's message to API and process recruiter response
  const sendMessage = useCallback(async (userMessage: string) => {
    setLoading(true);
    try {
      // Remove any trailing slash from endpoint if needed
      const endpoint = '/api/behavioral-interview';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from API:', response.status, errorText);
        throw new Error('Failed to fetch recruiter response');
      }
      const data = await response.json();
      const recruiterReply = data.response || "I'm sorry, could you please repeat that?";
      addMessage({ id: generateId(), role: 'recruiter', content: recruiterReply, timestamp: new Date() });
      speakText(recruiterReply);
    } catch (error: any) {
      console.error('Error in sendMessage:', error);
      toast.error(error.message || 'Something went wrong');
      // Restart listening on error
      startListening();
    } finally {
      setLoading(false);
    }
  }, [addMessage]);

  // Speak text using SpeechSynthesis API and restart listening afterward
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.onend = () => {
        setTimeout(() => {
          if (!loading) startListening();
        }, 500);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Speech synthesis is not supported in this browser.');
    }
  };

  // Start listening if not already listening
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Toggle listening manually
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      startListening();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-3xl shadow-lg rounded-xl border-none">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-t-xl p-4">
          <CardTitle className="text-2xl font-bold">
            Recruiter Interview (Speech-to-Speech)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Conversation log */}
          <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-md max-w-[80%] ${msg.role === 'user' ? 'bg-blue-100 text-blue-900 self-end ml-auto' : 'bg-gray-100 text-gray-900 self-start mr-auto'}`}
              >
                <p className="whitespace-pre-wrap">
                  <strong>{msg.role === 'user' ? 'You' : 'Recruiter'}: </strong>
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
          {/* Button to manually trigger speech recognition */}
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={toggleListening}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {isListening ? 'Stop Listening' : 'Start Speaking'}
                  {isListening ? <MicOffIcon className="h-4 w-4" /> : <MicIcon className="h-4 w-4" />}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
