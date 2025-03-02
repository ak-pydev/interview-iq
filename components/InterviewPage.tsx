'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Clock, 
  User, 
  Users, 
  MessageSquare, 
  FileText, 
  Video, 
  MicIcon,
  PhoneCall,
  PhoneOff,
  ThumbsUp,
  Share2,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

// Interview message interface
interface Message {
  id: string;
  senderId: string;
  senderRole: string;
  senderName?: string;
  content: string;
  type: 'text' | 'question' | 'answer' | 'feedback' | 'system';
  timestamp: string;
  attachments?: any[];
}

// Interview participant interface
interface Participant {
  id: string;
  userId: string;
  role: string;
  name: string;
  status: 'invited' | 'joined' | 'left';
}

// Session interface
interface Session {
  id: string;
  title: string;
  description: string;
  interviewType: string;
  status: 'scheduled' | 'in-progress' | 'ended' | 'cancelled';
  scheduledTime: string;
  startTime?: string;
  endTime?: string;
  duration: number;
  participants?: Participant[];
  messages?: Message[];
}

export default function InterviewSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userParticipantId, setUserParticipantId] = useState<string | null>(null);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.sessionId as string;
  
  // Simulated user for demo purposes - in a real app, this would come from authentication
  const currentUser = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatarUrl: ''
  };
  
  // Poll for updates
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;
    
    const pollForUpdates = () => {
      if (session?.status === 'in-progress') {
        fetchSessionDetails();
      }
    };
    
    if (session) {
      pollInterval = setInterval(pollForUpdates, 5000); // Poll every 5 seconds
    }
    
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [session?.status]);
  
  // Fetch session details on load
  useEffect(() => {
    if (sessionId) {
      fetchSessionDetails();
    } else {
      setError('No session ID provided');
      setIsLoading(false);
    }
  }, [sessionId]);
  
  // Start timer when session starts
  useEffect(() => {
    if (session?.status === 'in-progress' && !timerId) {
      const startTimeMs = session.startTime 
        ? new Date(session.startTime).getTime() 
        : Date.now();
      
      const timer = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeMs) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
      
      setTimerId(timer);
    }
    
    // Clean up timer
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [session?.status, session?.startTime]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Fetch session details
  const fetchSessionDetails = async () => {
    try {
      const response = await fetch('/api/interview/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get_session',
          sessionId: sessionId,
          userId: currentUser.id
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch session details');
      }
      
      const data = await response.json();
      
      if (data.success && data.session) {
        setSession(data.session);
        setMessages(data.session.messages || []);
        
        // Find current user's role
        const userParticipant = data.session.participants?.find(
          (p: Participant) => p.userId === currentUser.id
        );
        
        if (userParticipant) {
          setUserRole(userParticipant.role);
          setUserParticipantId(userParticipant.id);
        } else if (data.session.status === 'scheduled' || data.session.status === 'in-progress') {
          // If user is not a participant, prompt them to join
          promptToJoinSession();
        }
      } else {
        setError(data.error || 'Failed to load session');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load session');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Join the session
  const joinSession = async (role: string) => {
    try {
      const response = await fetch('/api/interview/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'join_session',
          sessionId,
          userId: currentUser.id,
          role,
          name: currentUser.name,
          email: currentUser.email
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to join session');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setUserRole(data.role);
        setUserParticipantId(data.participantId);
        fetchSessionDetails(); // Refresh session data
        toast.success(`Joined as ${role}`);
      } else {
        toast.error(data.error || 'Failed to join session');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to join session');
    }
  };
  
  // Prompt user to join session
  const promptToJoinSession = () => {
    // In a real app, you'd show a modal here
    // For simplicity, we'll use a confirm dialog
    const availableRoles = session?.participants?.map(p => p.role) || [];
    const allRoles = ['interviewer', 'candidate'];
    const availableRolesForJoining = allRoles.filter(r => !availableRoles.includes(r));
    
    if (availableRolesForJoining.length === 0) {
      toast.error('All roles in this session are taken');
      return;
    }
    
    if (availableRolesForJoining.length === 1) {
      const role = availableRolesForJoining[0];
      const shouldJoin = confirm(`Would you like to join this session as ${role}?`);
      if (shouldJoin) {
        joinSession(role);
      }
    } else {
      const roleOptions = availableRolesForJoining.join(' or ');
      const shouldJoinAsInterviewer = confirm(
        `Would you like to join this session as ${roleOptions}?\n\n` +
        `Click OK to join as ${availableRolesForJoining[0]} or Cancel to join as ${availableRolesForJoining[1]}`
      );
      
      if (shouldJoinAsInterviewer !== null) {
        const selectedRole = shouldJoinAsInterviewer 
          ? availableRolesForJoining[0] 
          : availableRolesForJoining[1];
        joinSession(selectedRole);
      }
    }
  };
  
  // Send a message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !userRole || sendingMessage) {
      return;
    }
    
    try {
      setSendingMessage(true);
      
      const response = await fetch('/api/interview/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send_message',
          sessionId,
          userId: currentUser.id,
          message: newMessage,
          messageType: userRole === 'interviewer' ? 'question' : 'answer',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Add message to local state immediately for better UX
        const newMessageObj: Message = {
          id: data.messageId || `temp-${Date.now()}`,
          senderId: currentUser.id,
          senderRole: userRole,
          senderName: currentUser.name,
          content: newMessage,
          type: userRole === 'interviewer' ? 'question' : 'answer',
          timestamp: data.timestamp || new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, newMessageObj]);
        setNewMessage('');
      } else {
        toast.error(data.error || 'Failed to send message');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };
  
  // End the interview
  const endInterview = async () => {
    if (!userRole || userRole !== 'interviewer') {
      toast.error('Only the interviewer can end the session');
      return;
    }
    
    const confirmEnd = confirm('Are you sure you want to end this interview?');
    if (!confirmEnd) return;
    
    try {
      const response = await fetch('/api/interview/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'end_session',
          sessionId,
          userId: currentUser.id,
          reason: 'completed'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to end session');
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Interview has ended');
        
        // Update session locally
        setSession(prev => {
          if (!prev) return null;
          return {
            ...prev,
            status: 'ended',
            endTime: data.endTime
          };
        });
        
        if (timerId) {
          clearInterval(timerId);
          setTimerId(null);
        }
      } else {
        toast.error(data.error || 'Failed to end session');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to end session');
    }
  };
  
  // Format elapsed time as mm:ss
  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get message sender display name
  const getMessageSender = (message: Message) => {
    if (message.type === 'system') {
      return 'System';
    }
    
    if (message.senderName) {
      return message.senderName;
    }
    
    // Find sender from participants
    const sender = session?.participants?.find(p => p.userId === message.senderId);
    return sender?.name || `${message.senderRole}`;
  };
  
  // Get avatar letter for participant
  const getAvatarLetter = (name: string) => {
    return name.charAt(0).toUpperCase();
  };
  
  // Get message sender avatar
  const getMessageAvatar = (message: Message) => {
    if (message.type === 'system') {
      return (
        <Avatar className="h-8 w-8 bg-gray-300">
          <AvatarFallback>S</AvatarFallback>
        </Avatar>
      );
    }
    
    const isCurrentUser = message.senderId === currentUser.id;
    const senderName = getMessageSender(message);
    
    return (
      <Avatar className={`h-8 w-8 ${isCurrentUser ? 'bg-blue-500' : 'bg-gray-500'}`}>
        <AvatarFallback>{getAvatarLetter(senderName)}</AvatarFallback>
      </Avatar>
    );
  };
  
  // Determine if we should show join button
  const shouldShowJoinButton = () => {
    return (
      !userRole && 
      (session?.status === 'scheduled' || session?.status === 'in-progress')
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin mr-2">
          <svg className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24">
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4" 
              fill="none" 
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
            />
          </svg>
        </div>
        <p className="text-lg text-gray-700">Loading interview session...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 mb-4 text-5xl">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Interview</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => router.push('/interviews')}>Return to Interviews</Button>
      </div>
    );
  }
  
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-yellow-500 mb-4 text-5xl">🔍</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Interview Not Found</h1>
        <p className="text-gray-600 mb-6">The interview session you requested could not be found.</p>
        <Button onClick={() => router.push('/interviews')}>Return to Interviews</Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content: Interview session */}
        <div className="lg:col-span-3">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">{session.title}</CardTitle>
                  <CardDescription className="text-indigo-100 mt-1">
                    {session.description || session.interviewType + ' Interview'}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-white border-white">
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </Badge>
                  {session.status === 'in-progress' && (
                    <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{formatElapsedTime(elapsedTime)}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Messages container */}
              <div className="h-[60vh] overflow-y-auto p-6">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                    <p className="text-lg">No messages yet</p>
                    <p className="text-sm mt-2">
                      {userRole === 'interviewer' 
                        ? 'Start the interview by asking your first question' 
                        : 'Wait for the interviewer to begin the session'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${
                          message.senderId === currentUser.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div className={`flex max-w-[80%] ${
                          message.senderId === currentUser.id ? 'flex-row-reverse' : 'flex-row'
                        }`}>
                          <div className={`flex-shrink-0 ${
                            message.senderId === currentUser.id ? 'ml-3' : 'mr-3'
                          }`}>
                            {getMessageAvatar(message)}
                          </div>
                          
                          <div>
                            <div className={`px-4 py-3 rounded-lg ${
                              message.type === 'system' 
                                ? 'bg-gray-100 text-gray-600' 
                                : message.senderId === currentUser.id
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-white border border-gray-200 text-gray-800'
                            }`}>
                              <div className="text-xs mb-1 font-medium">
                                {getMessageSender(message)}
                                {message.type !== 'system' && (
                                  <span className="ml-2 opacity-60">
                                    {new Date(message.timestamp).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                )}
                              </div>
                              <div className="whitespace-pre-wrap">{message.content}</div>
                            </div>
                            
                            {/* Message actions */}
                            {message.type !== 'system' && (
                              <div className={`flex mt-1 text-xs text-gray-500 ${
                                message.senderId === currentUser.id ? 'justify-end' : 'justify-start'
                              }`}>
                                <button className="hover:text-indigo-600 mr-3">
                                  <ThumbsUp className="h-3 w-3 inline mr-1" />
                                  Like
                                </button>
                                <button className="hover:text-indigo-600">
                                  <Share2 className="h-3 w-3 inline mr-1" />
                                  Share
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
              {/* Input area */}
              {session.status === 'in-progress' && userRole ? (
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={sendMessage} className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder={userRole === 'interviewer' 
                        ? "Type your question here..." 
                        : "Type your answer here..."
                      }
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                      disabled={sendingMessage}
                    />
                    <Button type="submit" disabled={!newMessage.trim() || sendingMessage}>
                      {sendingMessage ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 rounded-full border-t-transparent" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="text-center text-gray-500">
                    {session.status === 'ended' ? (
                      <p>This interview has ended. No new messages can be sent.</p>
                    ) : session.status === 'scheduled' ? (
                      <p>This interview is scheduled but hasn&apos;t started yet.</p>
                    ) : !userRole ? (
                      <Button onClick={() => promptToJoinSession()}>
                        Join Interview Session
                      </Button>
                    ) : (
                      <p>Waiting for the session to begin...</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar: Interview details and participants */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <Card className="shadow-md border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Type</div>
                  <div>{session.interviewType.charAt(0).toUpperCase() + session.interviewType.slice(1)} Interview</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500">Duration</div>
                  <div>{session.duration} minutes</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500">Status</div>
                  <div className="flex items-center">
                    <Badge className={
                      session.status === 'in-progress' 
                        ? 'bg-green-100 text-green-800' 
                        : session.status === 'ended'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }>
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                {/* Session actions */}
                <div className="pt-2">
                  {session.status === 'in-progress' && userRole === 'interviewer' && (
                    <Button variant="destructive" className="w-full" onClick={endInterview}>
                      <PhoneOff className="h-4 w-4 mr-2" />
                      End Interview
                    </Button>
                  )}
                  
                  {session.status === 'scheduled' && userRole === 'interviewer' && (
                    <Button className="w-full">
                      <PhoneCall className="h-4 w-4 mr-2" />
                      Start Interview
                    </Button>
                  )}
                  
                  {shouldShowJoinButton() && (
                    <Button className="w-full" onClick={() => promptToJoinSession()}>
                      <User className="h-4 w-4 mr-2" />
                      Join Interview
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {session.participants && session.participants.length > 0 ? (
                    session.participants.map((participant) => (
                      <div key={participant.id} className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                        <Avatar className="h-8 w-8 bg-indigo-500 mr-3">
                          <AvatarFallback>{getAvatarLetter(participant.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{participant.name}</div>
                          <div className="text-xs text-gray-500 flex items-center">
                            {participant.role.charAt(0).toUpperCase() + participant.role.slice(1)}
                            {participant.id === userParticipantId && (
                              <Badge className="ml-2 bg-indigo-100 text-indigo-800 text-[10px] py-0">You</Badge>
                            )}
                          </div>
                        </div>
                        <div className="ml-auto">
                          <div className="h-2 w-2 rounded-full bg-green-500" title="Online"></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-20" />
                      <p>No participants have joined yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" disabled={session.status === 'ended'}>
                    <FileText className="h-4 w-4 mr-2" />
                    Notes
                  </Button>
                  <Button variant="outline" disabled={session.status === 'ended'}>
                    <Video className="h-4 w-4 mr-2" />
                    Video
                  </Button>
                  <Button variant="outline" disabled={session.status === 'ended'}>
                    <MicIcon className="h-4 w-4 mr-2" />
                    Audio
                  </Button>
                  <Button variant="outline" disabled={session.status === 'ended'}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}