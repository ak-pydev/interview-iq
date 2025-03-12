"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

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
  CodeIcon,
  AlertCircleIcon,
  WifiIcon,
  WifiOffIcon
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

// Use a simple message structure for now
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  codeBlock?: string;
}

interface Session {
  sessionId: string;
  userId: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  interviewType: string;
  status: string;
  createdAt: string;
}

const TechnicalInterviewPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId') || 'demo-session-1';
  const { userId } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'whiteboard'>('chat');
  const [codeEditor, setCodeEditor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  // Mock values for now
  const isConnected = true;
  const isRecording = false;
  
  // Fetch session data
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setIsLoading(true);
        console.log(`Fetching session data for ID: ${sessionId}`);
        
        if (!sessionId) {
          throw new Error("No session ID provided");
        }
        
        // Use a simple fetch with retry logic
        let response;
        let retries = 3;
        
        while (retries > 0) {
          try {
            response = await fetch(`/api/session/${sessionId}`);
            if (response.ok) break;
            retries--;
            await new Promise(r => setTimeout(r, 1000)); // Wait 1 second between retries
          } catch (e) {
            retries--;
            console.log(`Fetch attempt failed, ${retries} retries left`);
            if (retries <= 0) throw e;
            await new Promise(r => setTimeout(r, 1000));
          }
        }
        
        if (!response || !response.ok) {
          throw new Error(`Failed to fetch session data: ${response?.status} ${response?.statusText}`);
        }
        
        const sessionData = await response.json();
        console.log("Session data retrieved:", sessionData);
        
        setSession(sessionData);
        startInterview(sessionData);
      } catch (error) {
        console.error('Error fetching session data:', error);
        setError(`Failed to fetch session data: ${(error as Error).message}`);
        
        // Create a fallback session
        const fallbackSession = {
          sessionId: sessionId,
          userId: userId || 'anonymous',
          jobTitle: "Frontend Developer",
          companyName: "Acme Tech",
          jobDescription: "We're looking for a skilled frontend developer with experience in React, TypeScript, and modern JavaScript frameworks.",
          interviewType: "technical",
          status: "in_progress",
          createdAt: new Date().toISOString()
        };
        
        setSession(fallbackSession);
        startInterview(fallbackSession);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSessionData();
  }, [sessionId, router, userId]);
  
  // Start interview with initial message
  const startInterview = (sessionData: Session) => {
    const initialMessages: Message[] = [
      {
        id: 'assistant-1',
        role: 'assistant',
        content: `Hello! I'm the technical interviewer from ${sessionData.companyName}. I'll be asking you questions about your technical skills related to the ${sessionData.jobTitle} position. Let's get started!`,
        timestamp: new Date()
      },
      {
        id: 'assistant-2',
        role: 'assistant',
        content: `To begin with, could you tell me about your experience with React and TypeScript? Specifically, how have you used these technologies in your previous projects?`,
        timestamp: new Date(Date.now() + 1000)
      }
    ];
    
    setMessages(initialMessages);
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Send message to API
  const handleSendMessage = async () => {
    if ((!inputValue.trim() && activeTab === 'chat') || !session) return;
    
    // Get content based on active tab
    const messageContent = activeTab === 'chat' ? inputValue : codeEditor;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
      codeBlock: activeTab === 'whiteboard' ? messageContent : undefined
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Simple implementation for now - in a real app, call your API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      // Sample response based on message content
      let responseContent = '';
      
      if (messageContent.toLowerCase().includes('react')) {
        responseContent = "That's good experience with React. How familiar are you with hooks and the Context API?";
      } else if (messageContent.toLowerCase().includes('typescript')) {
        responseContent = "Great to hear about your TypeScript experience. Could you explain how you use interfaces and generics in your projects?";
      } else if (activeTab === 'whiteboard') {
        responseContent = "Thanks for sharing your code. I see you've implemented the solution using this approach. Can you explain your thought process and any performance considerations?";
      } else {
        responseContent = "Interesting perspective. Could you elaborate more on how you've applied these skills in your previous work?";
      }
      
      // Add assistant response
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError(`Failed to get response: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && activeTab === 'chat') {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // End interview
  const handleEndInterview = () => {
    // Add a final message
    const finalMessage: Message = {
      id: 'assistant-final',
      role: 'assistant',
      content: "Thank you for participating in this technical interview. I've gathered all the information I need. Our team will review your responses and get back to you soon.",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, finalMessage]);
    
    // In a real app, call your API to end the session
    setTimeout(() => {
      router.push('/dashboard');
    }, 3000);
  };
  
  // Format messages for display
  const formatMessage = (message: Message) => {
    if (message.role === 'user' && message.codeBlock) {
      // Message with code block
      return {
        ...message,
        content: 'I\'ve shared the following code:',
        codeBlock: message.codeBlock
      };
    }
    
    return message;
  };
  
  const displayMessages = messages.map(formatMessage);
  
  // Show loading state while fetching session data
  if (isLoading && !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ThinkingAnimation message="Loading technical interview..." stage={1} />
      </div>
    );
  }
  
  if (error && !session) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col gap-4 max-w-md mx-auto text-center p-4">
        <AlertCircleIcon className="h-12 w-12 text-red-500" />
        <h3 className="text-xl font-bold">Error Loading Interview</h3>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => router.push('/mockinterview')}>
          Return to Interview Setup
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 flex flex-col h-screen">
      <header className="flex items-center mb-4">
        <Link href="/mockinterview">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Technical Interview</h1>
          <p className="text-sm text-muted-foreground">
            {session?.jobTitle} at {session?.companyName}
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
          >
            End Interview
          </Button>
        </div>
      </header>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as 'chat' | 'whiteboard')}
        className="mb-4"
      >
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="chat">Interview Chat</TabsTrigger>
          <TabsTrigger value="whiteboard">Code Whiteboard</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {activeTab === 'chat' ? (
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-lg">Technical Interview - Q&A</CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {displayMessages.map((message, index) => (
              <div 
                key={message.id || index} 
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
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.codeBlock && (
                      <div className="mt-2 p-2 bg-gray-800 rounded text-white font-mono text-sm overflow-x-auto">
                        <pre>{message.codeBlock}</pre>
                      </div>
                    )}
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
            
            <div ref={endOfMessagesRef} />
          </CardContent>
          
          <CardFooter className="border-t p-3">
            <div className="flex w-full items-center gap-2">
              <Button 
                variant={isRecording ? "destructive" : "outline"}
                size="icon" 
                onClick={() => {}}
                className={isRecording ? 'animate-pulse' : ''}
                disabled={!isConnected}
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
                disabled={isRecording}
              />
              
              <Button 
                variant="default" 
                size="icon" 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
              >
                <SendIcon className="h-5 w-5" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-lg">Technical Interview - Code Whiteboard</CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 flex flex-col">
            <Textarea 
              value={codeEditor}
              onChange={(e) => setCodeEditor(e.target.value)}
              placeholder="Write or paste code here to share with the interviewer..."
              className="flex-1 resize-none rounded-none font-mono p-4 border-0"
              style={{ minHeight: "300px" }}
            />
          </CardContent>
          
          <CardFooter className="border-t p-3 justify-between">
            <Button variant="outline" size="sm" onClick={() => setCodeEditor('')}>
              Clear Code
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleSendMessage}
              disabled={!codeEditor.trim() || isLoading}
            >
              <CodeIcon className="h-4 w-4 mr-2" />
              Send Code
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default TechnicalInterviewPage;