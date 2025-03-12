"use client";

import { useEffect, useState, useRef } from 'react';
import {useSearchParams } from 'next/navigation';
import Link from 'next/link';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/Avatar';
import { Textarea } from '@/components/ui/textarea';
import { ThinkingAnimation } from '@/components/ui/ThinkingAnimation';
import { 
  ArrowLeftIcon, 
  SendIcon, 
  Mic, 
  StopCircleIcon, 
  CheckCircleIcon,
  AlertCircleIcon,
  WifiIcon,
  WifiOffIcon
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

// Custom hooks
import { useMockWebRTCAudio } from '@/hooks/useWebRTCAudio';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  category?: string; // For categorizing behavioral questions
}

interface InterviewSession {
  id: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  interviewType: 'behavior';
  createdAt: string;
}

interface ScoreCategory {
  name: string;
  score: number;
  feedback: string;
}

const BehavioralInterviewPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId') || 'demo-session-1';
  
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scoreCategories, setScoreCategories] = useState<ScoreCategory[]>([
    { name: 'Communication', score: 0, feedback: '' },
    { name: 'Problem Solving', score: 0, feedback: '' },
    { name: 'Leadership', score: 0, feedback: '' },
    { name: 'Teamwork', score: 0, feedback: '' },
    { name: 'Adaptability', score: 0, feedback: '' }
  ]);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  // Use WebRTC hook - in production use the real hook, here we use the mock for demonstration
  const { 
    isRecording, 
    isConnected, 
    transcription, 
    error: audioError, 
    startRecording, 
    stopRecording
  } = useMockWebRTCAudio();
  
  // Update input value when transcription changes
  useEffect(() => {
    if (transcription) {
      setInputValue(transcription);
    }
  }, [transcription]);
  
  // Fetch session data
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        // In production, call your API
        const response = await fetch(`/api/session/${sessionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch session data');
        }
        
        const sessionData = await response.json();
        setSession(sessionData);
        
        // Start interview with session data
        startInterview(sessionData);
      } catch (error) {
        console.error('Error fetching session data:', error);
        // Fallback to mock data for demo
        const mockSession = {
          id: sessionId,
          jobTitle: "Product Manager",
          companyName: "TechCorp",
          jobDescription: "We're seeking a product manager who can lead cross-functional teams, define product requirements, and drive product strategy. The ideal candidate will have experience with agile methodologies and a track record of successful product launches.",
          interviewType: 'behavior' as const,
          createdAt: new Date().toISOString()
        };
        
        setSession(mockSession);
        startInterview(mockSession);
      }
    };
    
    fetchSessionData();
  }, [sessionId]);
  
  // Generate system prompt specifically for behavioral interviews
  const generateSystemPrompt = (sessionData: InterviewSession): string => {
    return `You are an AI behavioral interviewer conducting an interview for the role of ${sessionData.jobTitle} at ${sessionData.companyName}.

Job Description: ${sessionData.jobDescription}

Your task is to:
1. Ask relevant behavioral questions using the STAR method framework (Situation, Task, Action, Result)
2. Focus on past experiences, soft skills, and cultural fit
3. Follow up on the candidate's answers with probing questions
4. Maintain a conversational and professional tone
5. Keep your responses concise (1-3 paragraphs maximum)

For this behavioral interview, focus on:
- Leadership and team management experience
- Communication skills and style
- Problem-solving approach
- Conflict resolution
- Time management and prioritization
- Adaptability and response to change
- Examples of past successes and failures

Use these categories to organize your questions. Try to cover all categories throughout the interview.

Start by introducing yourself as the interviewer for ${sessionData.companyName}, welcome the candidate, and begin with your first behavioral question.`;
  };
  
  // Start the interview with an initial message
  const startInterview = async (sessionData: InterviewSession) => {
    // Generate the system prompt
    const systemPrompt = generateSystemPrompt(sessionData);
    
    // Add system message (not shown to user)
    const systemMessage: Message = {
      id: 'system-1',
      role: 'system',
      content: systemPrompt,
      timestamp: new Date()
    };
    
    // Create initial messages array with system message
    const initialMessages = [systemMessage];
    setMessages(initialMessages);
    
    // Now make API call to get the first interviewer message
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Let's start the behavioral interview for the ${sessionData.jobTitle} position at ${sessionData.companyName}.`
            }
          ],
          systemPrompt: systemPrompt
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to start interview');
      }
      
      const data = await response.json();
      
      // Add interviewer's first message
      const welcomeMessage: Message = {
        id: 'assistant-1',
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        category: 'Introduction'
      };
      
      setMessages([...initialMessages, welcomeMessage]);
      setProgress(10); // Start progress at 10%
    } catch (error) {
      console.error('Error starting interview:', error);
      
      // Fallback to generic welcome message
      const fallbackMessage: Message = {
        id: 'assistant-1',
        role: 'assistant',
        content: `Hello! I'm the interviewer from ${sessionData.companyName}. Thank you for joining us for this behavioral interview for the ${sessionData.jobTitle} position. I'll be asking you questions about your past experiences and how you've handled various situations. Let's get started with some questions to understand your work style and experience better.`,
        timestamp: new Date(),
        category: 'Introduction'
      };
      
      setMessages([...initialMessages, fallbackMessage]);
      setProgress(10); // Start progress at 10%
    } finally {
      setIsLoading(false);
    }
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Send message to API
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !session) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Update progress after each user response
    const newProgress = Math.min(progress + 10, 90); // Max progress before completion is 90%
    setProgress(newProgress);
    
    try {
      // Find the system message for the prompt
      const systemMessage = messages.find(msg => msg.role === 'system');
      const systemPrompt = systemMessage?.content || generateSystemPrompt(session);
      
      // Format messages for API (excluding system prompt which we'll send separately)
      const apiMessages = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      
      // Add the new user message
      apiMessages.push({
        role: 'user',
        content: inputValue
      });
      
      // Call the interview API
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          systemPrompt: systemPrompt
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get interview response');
      }
      
      const data = await response.json();
      
      // Determine category for the question (simplified demo logic)
      const categoryIndex = Math.floor(Math.random() * scoreCategories.length);
      const category = scoreCategories[categoryIndex].name;
      
      // Add assistant response
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        category: category
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Update mock scores as interview progresses
      if (newProgress >= 30) {
        updateMockScores();
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback response in case of error
      const errorMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: "I appreciate your response. Could you please elaborate a bit more on that experience? What specific actions did you take, and what was the outcome?",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle voice input
  const toggleVoiceInput = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  // Update mock scores for demonstration purposes
  const updateMockScores = () => {
    setScoreCategories(prev => 
      prev.map(category => ({
        ...category,
        score: Math.min(Math.max(Math.floor(Math.random() * 40) + 60, 60), 100), // Random score between 60-100
        feedback: getRandomFeedback(category.name)
      }))
    );
  };
  
  // Generate random feedback for each category
  const getRandomFeedback = (category: string): string => {
    const feedbackOptions = {
      'Communication': [
        'Clearly articulates ideas and experiences.',
        'Good at explaining complex situations concisely.',
        'Could provide more concrete examples when describing communication challenges.'
      ],
      'Problem Solving': [
        'Demonstrates structured approach to addressing challenges.',
        'Shows creativity in finding solutions to difficult problems.',
        'Could focus more on measuring outcomes of solutions implemented.'
      ],
      'Leadership': [
        'Effectively describes experiences leading teams through challenges.',
        'Shows ability to motivate team members and align on objectives.',
        'Could elaborate more on handling underperforming team members.'
      ],
      'Teamwork': [
        'Clear examples of collaboration and working across functions.',
        'Good at navigating team dynamics and building consensus.',
        'Could provide more examples of resolving team conflicts.'
      ],
      'Adaptability': [
        'Shows flexibility when dealing with changing requirements.',
        'Demonstrates comfort with ambiguity and uncertain situations.',
        'Could provide more examples of learning from failures.'
      ]
    };
    
    const options = feedbackOptions[category as keyof typeof feedbackOptions] || ['Demonstrates good skills in this area.'];
    return options[Math.floor(Math.random() * options.length)];
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // End the interview and generate final feedback
  const handleEndInterview = () => {
    setProgress(100);
    
    // Add a final message
    const finalMessage: Message = {
      id: `assistant-final`,
      role: 'assistant',
      content: `Thank you for completing this behavioral interview for the ${session?.jobTitle} position at ${session?.companyName}. I've compiled some feedback based on our conversation. You can view the detailed feedback in the assessment section. We appreciate your time and effort today!`,
      timestamp: new Date(),
      category: 'Conclusion'
    };
    
    setMessages(prev => [...prev, finalMessage]);
    
    // Update final scores
    updateMockScores();
  };
  
  // Show loading state while fetching session data
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
            <ThinkingAnimation message="Loading behavioral interview..." stage={1} />
      </div>
    );
  }
  
  // Filter out system messages for display
  const displayMessages = messages.filter(msg => msg.role !== 'system');
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 flex flex-col h-screen">
      <header className="flex items-center mb-4">
        <Link href="/mockinterview">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Behavioral Interview</h1>
          <p className="text-sm text-muted-foreground">
            {session.jobTitle} at {session.companyName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Badge variant="outline" className="gap-1 text-green-600 border-green-200 bg-green-50">
              <WifiIcon className="h-3 w-3" /> Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 text-red-600 border-red-200 bg-red-50">
              <WifiOffIcon className="h-3 w-3" /> Disconnected
            </Badge>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleEndInterview}
            disabled={progress === 100}
          >
            End Interview
          </Button>
        </div>
      </header>
      
      {audioError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>
            {audioError}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <Card className="mb-2">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Interview Progress</span>
                <span className="text-sm">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>
        </div>
        <div className="hidden md:block">
          <Card>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base">Assessment Areas</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <ul className="space-y-2">
                {scoreCategories.map(category => (
                  <li key={category.name} className="flex items-center justify-between">
                    <span className="text-sm">{category.name}</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">{category.score}</span>
                      {category.score >= 80 && <CheckCircleIcon className="h-4 w-4 text-green-500" />}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="border-b pb-3">
          <CardTitle className="text-lg">Behavioral Interview - STAR Method</CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {displayMessages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3 max-w-[80%]`}>
                <Avatar>
                  <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-semibold">
                    {message.role === 'user' ? 'You' : 'AI'}
                  </div>
                </Avatar>
                <div 
                  className={`rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  {message.category && message.role === 'assistant' && (
                    <span className="text-xs font-medium opacity-70 mb-1 block">
                      {message.category}
                    </span>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-row gap-3 max-w-[80%]">
                <Avatar>
                  <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-semibold">
                    AI
                  </div>
                </Avatar>
                <div className="rounded-lg p-3 bg-muted">
                                  <ThinkingAnimation message="" stage={1} />
                </div>
              </div>
            </div>
          )}
          
          {progress === 100 && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-medium text-green-800 mb-2">Interview Complete</h3>
              <p className="text-green-700 text-sm">
                Thank you for completing this behavioral interview. Below is your assessment based on your responses.
              </p>
              
              <Accordion type="single" collapsible className="mt-4">
                {scoreCategories.map((category) => (
                  <AccordionItem key={category.name} value={category.name}>
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center justify-between w-full pr-4">
                        <span>{category.name}</span>
                        <span className="text-sm bg-green-100 text-green-800 py-1 px-2 rounded">
                          {category.score}/100
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm">
                      {category.feedback}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
          
          <div ref={endOfMessagesRef} />
        </CardContent>
        
        <CardFooter className="border-t p-3">
          <div className="flex w-full items-center gap-2">
            <Button 
              variant={isRecording ? "destructive" : "outline"}
              size="icon" 
              onClick={toggleVoiceInput}
              className={isRecording ? 'animate-pulse' : ''}
              disabled={!isConnected || progress === 100}
            >
              {isRecording ? <StopCircleIcon className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? "Listening..." : "Type your response..."}
              className="min-h-10 max-h-32 resize-none"
              rows={1}
              disabled={isRecording || progress === 100}
            />
            
            <Button 
              variant="default" 
              size="icon" 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || progress === 100}
            >
              <SendIcon className="h-5 w-5" />
            </Button>
          </div>
          
          {isRecording && (
            <div className="w-full mt-2">
              <p className="text-xs text-muted-foreground animate-pulse">
                Speak clearly into your microphone...
              </p>
              <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
                <div className="bg-primary h-full w-full animate-[recording_2s_ease-in-out_infinite]"></div>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
      
      <style jsx global>{`
        @keyframes recording {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default BehavioralInterviewPage;