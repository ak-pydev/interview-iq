'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Users, MicIcon, ArrowRight, RefreshCw, Volume2, Info } from 'lucide-react';
import { toast } from 'sonner';
import VoiceInterviewConductor from '@/components/InterviewPage';

// Simulated user for demo - in a real app, this would come from authentication
const currentUser = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john.doe@example.com',
};

export default function StartInterviewPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    interviewType: 'behavioral' as 'behavioral' | 'technical' | 'case-study' | 'general',
    duration: 30 as 15 | 30 | 45 | 60,
  });
  const [showCreationForm, setShowCreationForm] = useState<boolean>(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'unavailable' | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check if a session ID is passed in the URL and then check microphone permission
  React.useEffect(() => {
    const id = searchParams.get('session');
    if (id) {
      setSessionId(id);
      setShowCreationForm(false);
    }
    checkMicrophonePermission();
  }, [searchParams]);
  
  // Check microphone availability and permissions
  const checkMicrophonePermission = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setMicPermission('granted');
      } else {
        setMicPermission('unavailable');
      }
    } catch (err) {
      console.error('Microphone permission error:', err);
      setMicPermission('denied');
    }
  };
  
  // Request microphone access from the user
  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicPermission('granted');
      toast.success('Microphone access granted!');
    } catch (err) {
      console.error('Failed to get microphone permission:', err);
      toast.error('Microphone access denied. Please enable it in your browser settings.');
      setMicPermission('denied');
    }
  };
  
  // Handle input changes for the form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Create a new interview session
  const createSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure microphone access is granted
    if (micPermission !== 'granted') {
      toast.error('Microphone access is required for voice interviews.');
      await requestMicrophonePermission();
      return;
    }
    
    if (!formData.title.trim()) {
      toast.error('Please enter an interview title');
      return;
    }
    
    try {
      setLoading(true);
      // Generate a unique session ID
      const mockSessionId = `mock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Simulate session creation delay
      setTimeout(() => {
        setSessionId(mockSessionId);
        setRole('interviewer'); // Default role when creating a session
        setShowCreationForm(false);
        setLoading(false);
        toast.success('Voice interview session created!');
      }, 500);
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create interview session');
      setLoading(false);
    }
  };
  
  // If a session exists, show the voice interview conductor
  if (!showCreationForm && sessionId) {
    return <VoiceInterviewConductor sessionId={sessionId} initialRole={role} />;
  }
  
  // If microphone permission is denied, display a warning
  if (micPermission === 'denied') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg rounded-xl border-none text-center">
          <CardHeader className="bg-red-50 text-red-800 px-6 py-8 rounded-t-xl">
            <div className="mx-auto mb-4 bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
              <Volume2 className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Microphone Access Required</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <p className="text-gray-600">
              Voice interviews require microphone access. Please enable microphone permissions in your browser settings.
            </p>
            <div className="space-y-4">
              <Button className="w-full" onClick={requestMicrophonePermission}>
                Request Microphone Access
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push('/interviews')}>
                Return to Interviews
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Otherwise, show the interview session creation form
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-lg rounded-xl border-none">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-t-xl">
          <div className="flex items-center mb-2">
            <MicIcon className="mr-3 h-6 w-6" />
            <CardTitle className="text-2xl font-bold">Voice Interview</CardTitle>
          </div>
          <CardDescription className="text-indigo-100">
            Create a new voice-based interview session for realistic practice.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {/* Display microphone permission status */}
          {micPermission === 'granted' ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    Microphone access granted. You're ready to start a voice interview.
                  </p>
                </div>
              </div>
            </div>
          ) : micPermission === 'unavailable' ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">
                    Your browser doesn't support microphone access. Please try a different browser.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    Voice interviews require microphone access.{' '}
                    <button className="ml-1 underline font-medium" onClick={requestMicrophonePermission}>
                      Grant access
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={createSession} className="space-y-6">
            <div>
              <Label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Interview Title
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Enter interview title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <Label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </Label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter a brief description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="interviewType" className="block text-sm font-medium text-gray-700">
                Interview Type
              </Label>
              <select
                id="interviewType"
                name="interviewType"
                value={formData.interviewType}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="behavioral">Behavioral</option>
                <option value="technical">Technical</option>
                <option value="case-study">Case Study</option>
                <option value="general">General</option>
              </select>
            </div>
            <div>
              <Label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration (minutes)
              </Label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value={15}>15</option>
                <option value={30}>30</option>
                <option value={45}>45</option>
                <option value={60}>60</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Session'}
              </Button>
              <Button variant="outline" onClick={() => router.push('/interviews')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// CheckCircle component since it's missing from imports
const CheckCircle = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
