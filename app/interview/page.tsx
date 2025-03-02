'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RefreshCw, MicIcon, MicOffIcon } from 'lucide-react';

interface ExtendedSpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface Message {
  role: 'user' | 'recruiter';
  content: string;
}

export default function RecruiterInterviewSpeechPage() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const hasGreetedRef = useRef<boolean>(false);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech recognition is not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event: ExtendedSpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      addMessage({ role: 'user', content: transcript });
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

    // Greet the candidate once on mount
    if (!hasGreetedRef.current) {
      greetUser();
      hasGreetedRef.current = true;
    }
  }, []);

  // Append a message to the conversation log
  const addMessage = (message: Message) => {
    setConversation((prev) => [...prev, message]);
  };

  // Initial greeting from the recruiter
  const greetUser = useCallback(() => {
    const greeting =
      "Hello, I'm your recruiter. Welcome to your interview. Please tell me a bit about yourself.";
    addMessage({ role: 'recruiter', content: greeting });
    speakText(greeting);
  }, []);

  // Send user's message to the behavioral-interview API and handle recruiter reply
  const sendMessage = useCallback(async (userMessage: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/behavioral-interview/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch recruiter response');
      }
      const data = await response.json();
      const recruiterResponse = data.response || "I'm sorry, could you please repeat that?";
      addMessage({ role: 'recruiter', content: recruiterResponse });
      speakText(recruiterResponse);
    } catch (error: any) {
      console.error('Error in sendMessage:', error);
      toast.error(error.message || 'Something went wrong');
      // Restart listening on error
      startListening();
    } finally {
      setLoading(false);
    }
  }, []);

  // Speak text using SpeechSynthesis API and restart listening after speaking ends
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.onend = () => {
        // Restart listening after speaking if not loading
        if (!loading) {
          setTimeout(() => {
            startListening();
          }, 500);
        }
      };
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Speech synthesis is not supported in this browser.');
    }
  };

  // Start listening if not already
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
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
          {/* Conversation Log */}
          <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-md max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-blue-100 text-blue-900 self-end ml-auto'
                    : 'bg-gray-100 text-gray-900 self-start mr-auto'
                }`}
              >
                <p className="whitespace-pre-wrap">
                  <strong>{msg.role === 'user' ? 'You' : 'Recruiter'}: </strong>
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
          {/* Button to manually start speech recognition */}
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={startListening}
              disabled={loading || isListening}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {isListening ? 'Listening...' : 'Start Speaking'}
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
