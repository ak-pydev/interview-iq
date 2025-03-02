"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Calendar,
  Clock,
  ArrowRight,
  User,
  Users,
  AlertCircle,
  Sparkles,
  X,
  LightbulbIcon,
  HelpCircle,
} from 'lucide-react';
import { toast } from 'sonner';
  
// You may import your UI components as needed
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function InterviewsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    interviewType: 'behavioral',
    duration: 30,
  });

  // Fetch interview sessions (for demo, we use mock data)
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const mockSessions = [
          {
            id: 'demo-session-1',
            title: 'Frontend Developer Interview',
            description: 'Technical interview for React position',
            interviewType: 'technical',
            status: 'scheduled',
            scheduledTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
            duration: 45,
            participants: [
              { name: 'Jane Smith', role: 'interviewer' }
            ]
          },
          {
            id: 'demo-session-2',
            title: 'Behavioral Interview Practice',
            description: 'Mock interview for leadership skills',
            interviewType: 'behavioral',
            status: 'scheduled',
            scheduledTime: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
            duration: 30,
            participants: []
          }
        ];
        setTimeout(() => {
          setSessions(mockSessions);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        toast.error('Failed to load interview sessions');
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  // Handle input changes for the creation form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create new interview session (simulate API call)
  const createSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('/api/uploading/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_session',
          title: formData.title,
          description: formData.description,
          createdBy: 'user-123', // Simulated user ID
          duration: parseInt(formData.duration.toString(), 10),
          interviewType: formData.interviewType,
          participantRoles: ['interviewer', 'candidate'],
          scheduledTime: new Date().toISOString(),
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create session');
      }
      const data = await response.json();
      if (data.success && data.sessionId) {
        toast.success('Interview session created!');
        router.push(`/interview/${data.sessionId}`);
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error: any) {
      console.error('Error creating session:', error);
      toast.error(error.message || 'Failed to create interview session');
    } finally {
      setLoading(false);
    }
  };

  // Join an existing session
  const joinSession = (sessionId: string) => {
    router.push(`/interview/${sessionId}`);
  };

  // Format date and time for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Render tab navigation
  const renderTabNavigation = () => (
    <div className="flex space-x-1 mb-8 border-b border-gray-700">
      <button
        className={`px-4 py-3 font-medium flex items-center space-x-2 ${!showCreateForm ? 'text-white border-b-2 border-indigo-500' : 'text-gray-400 hover:text-white'}`}
        onClick={() => setShowCreateForm(false)}
      >
        <span>Interview Sessions</span>
      </button>
      <button
        className={`px-4 py-3 font-medium flex items-center space-x-2 ${showCreateForm ? 'text-white border-b-2 border-indigo-500' : 'text-gray-400 hover:text-white'}`}
        onClick={() => setShowCreateForm(true)}
      >
        <Plus className="w-5 h-5" />
        <span>Create New Interview</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Interview Sessions</h1>
          <Button onClick={() => setShowCreateForm(!showCreateForm)} className="flex items-center">
            {showCreateForm ? 'Cancel' : 'Create New Interview'}
            {!showCreateForm && <Plus className="ml-2 h-4 w-4" />}
          </Button>
        </div>
        
        {renderTabNavigation()}

        {showCreateForm ? (
          <Card className="mb-8 shadow-md">
            <CardHeader>
              <CardTitle>Create New Interview Session</CardTitle>
              <CardDescription>
                Set up a new interview session and invite participants.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createSession} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Interview Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Frontend Developer Interview"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="interviewType">Interview Type</Label>
                    <select
                      id="interviewType"
                      name="interviewType"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                      value={formData.interviewType}
                      onChange={handleInputChange}
                    >
                      <option value="technical">Technical</option>
                      <option value="behavioral">Behavioral</option>
                      <option value="general">General</option>
                      <option value="case-study">Case Study</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the interview"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="5"
                    max="120"
                    value={formData.duration}
                    onChange={handleInputChange}
                  />
                </div>
                <Button type="submit" className="w-full mt-4" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Interview Session'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">No Interview Sessions</h2>
                <p className="text-gray-600 mb-6">
                  Create your first interview session to get started.
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  Create New Interview
                  <Plus className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-medium text-gray-700 mt-6 mb-3">Upcoming Interviews</h2>
                {sessions.map((session) => (
                  <Card key={session.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between mb-2">
                        <h3 className="text-lg font-semibold">{session.title}</h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            session.status === 'in-progress'
                              ? 'bg-green-100 text-green-800'
                              : session.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{session.description}</p>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {formatDate(session.scheduledTime)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          {session.duration} minutes
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {session.participants && session.participants.length > 0 ? (
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {session.participants.length} participant(s)
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="text-sm text-gray-600">No participants yet</span>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => joinSession(session.id)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          Join Session
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper: Join session by navigating to the interview route
const joinSession = (sessionId: string) => {
  const router = useRouter();
  router.push(`/interview/${sessionId}`);
};

// Helper: Format date strings for display
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};
