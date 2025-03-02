'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Send, Loader2, Mic, MicOff, Sparkles, Clock, Calendar 
} from 'lucide-react';

interface Message {
  role: 'user' | 'interviewer';
  text: string;
  timestamp: string;
}

export default function InterviewPage() {
  const router = useRouter();

  // Load interview setup data from localStorage
  const [interviewContext, setInterviewContext] = useState('');
  const [isSetupLoaded, setIsSetupLoaded] = useState(false);

  // Interview session state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [remainingTime, setRemainingTime] = useState(1800); // 30 minutes

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const setupData = localStorage.getItem("interviewSetup");
    if (setupData) {
      try {
        const { companyName, selectedRole, jobDescription, userQuestions } = JSON.parse(setupData);
        const context = `Company: ${companyName}. Role: ${selectedRole}. Job Description: ${jobDescription}. Additional Questions: ${userQuestions.filter((q: string) => q.trim()).join('; ')}`;
        setInterviewContext(context);
        setIsSetupLoaded(true);
      } catch (error) {
        console.error("Error parsing interview setup data", error);
        alert("There was an error loading your interview setup. Redirecting to setup.");
        router.push('/behavioral-tab');
      }
    } else {
      alert("No interview setup data found. Redirecting to setup.");
      router.push('/behavioral-tab');
    }
  }, [router]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        handleSendTranscript(transcript);
      };
      recognition.onend = () => {
        setIsRecording(false);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    if (isSetupLoaded && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error('Error accessing camera: ', err));
    }
  }, [isSetupLoaded]);

  useEffect(() => {
    if (isSetupLoaded) {
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            endInterview();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSetupLoaded]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendTranscript = async (transcript: string) => {
    if (!transcript.trim()) return;
    const userMessage: Message = {
      role: 'user',
      text: transcript,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    saveMessageToDB(userMessage);
    setLoading(true);
    const responseText = await fetchGeminiResponse([...messages, userMessage]);
    setLoading(false);
    const interviewerMessage: Message = {
      role: 'interviewer',
      text: responseText,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, interviewerMessage]);
    saveMessageToDB(interviewerMessage);
    speakResponse(responseText);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    await handleSendTranscript(input);
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const fetchGeminiResponse = async (conversation: Message[]) => {
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation,
          interviewContext,
          tone: 'casual, friendly',
          timeLimit: 1800,
        }),
      });
      if (!res.ok) throw new Error('Error fetching Gemini response');
      const data = await res.json();
      return data.question || data.response;
    } catch (error) {
      console.error(error);
      return "I'm sorry, something went wrong. Please try again.";
    }
  };

  // Now the saveMessageToDB function passes the collection name to your API
  const saveMessageToDB = async (message: Message) => {
    try {
      await fetch('/api/uploading/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          collection: "mockinterview-behavior",
          timestamp: new Date().toISOString(),
          type: message.role,
          content: message.text
        }),
      });
    } catch (error) {
      console.error('Error saving message to DB', error);
      // Continue even if saving fails
    }
  };

  const endInterview = () => {
    alert("Time's up! The interview has ended. Thank you for your time.");
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!isSetupLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Loading interview setup...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col">
      {/* Header with timer and camera preview */}
      <div className="flex justify-between items-center mb-4">
        <motion.h1 className="text-3xl font-bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Sparkles className="inline-block mr-2" /> Gemini Interviewer
        </motion.h1>
        <div className="flex items-center space-x-4">
          <span className="text-lg">Time Left: {formatTime(remainingTime)}</span>
          <div className="w-32 h-20 bg-gray-800 rounded-lg overflow-hidden">
            <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Conversation Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-800 rounded-lg shadow-md">
        {messages.length === 0 && (
          <p className="text-center text-gray-400">Your conversation will appear here...</p>
        )}
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            className={`mb-4 p-3 rounded-lg max-w-md ${msg.role === 'user' ? 'bg-blue-600 self-end ml-auto' : 'bg-gray-700 self-start'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm">{msg.text}</p>
            <span className="text-xs text-gray-400 mt-1 block">{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </motion.div>
        ))}
        {loading && (
          <motion.div
            className="flex items-center mb-4 p-3 rounded-lg bg-gray-700 self-start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
            <p className="text-sm">Interviewer is typing...</p>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          placeholder="Type or speak your answer..."
          className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button onClick={toggleRecording} className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition">
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
        <button onClick={handleSend} className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition">
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}