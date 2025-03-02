'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Upload,
  FileText,
  Briefcase,
  HelpCircle,
  X,
  LightbulbIcon,
  PlusCircle,
  Edit,
  ArrowRight,
  Clock,
  CheckCircle,
  Sparkles,
  AlertCircle,
  History
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Tip {
  title: string;
  content: string;
}

export default function BehavioralInterviewTab() {
  const router = useRouter();
  const [activeView, setActiveView] = useState('setup');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Required form fields
  const [interviewTitle, setInterviewTitle] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [interviewType, setInterviewType] = useState('behavioral');
  const [sessionDescription, setSessionDescription] = useState('');
  const [duration, setDuration] = useState(30);
  const [jobDescription, setJobDescription] = useState('');
  const [userQuestions, setUserQuestions] = useState(['']);
  const [selectedMode, setSelectedMode] = useState('standard');
  const [tipVisible, setTipVisible] = useState(true);
  const [activeTip, setActiveTip] = useState(0);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Interview mode options with original color codes
  const interviewModes = [
    { id: 'beginner', name: 'Beginner Mode', description: 'Gentle feedback with guiding questions', color: 'bg-emerald-900/30 border-emerald-500/30' },
    { id: 'standard', name: 'Standard Mode', description: 'Balanced challenge and support', color: 'bg-blue-900/30 border-blue-500/30' },
    { id: 'expert', name: 'Expert Mode', description: 'Challenging questions with detailed critique', color: 'bg-purple-900/30 border-purple-500/30' }
  ];

  // Quick tips
  const tips: Tip[] = [
    { 
      title: "Use the STAR Method", 
      content: "Structure your answers with Situation, Task, Action, and Result to provide clear, concise responses."
    },
    { 
      title: "Prepare Personal Examples", 
      content: "Have strong stories ready that showcase different skills and can be adapted to various questions."
    },
    { 
      title: "Quantify Your Achievements", 
      content: "Include metrics and outcomes to make your accomplishments impactful."
    },
    { 
      title: "Listen Carefully", 
      content: "Pay attention to what's being asked and answer specifically."
    }
  ];

  // Handle file change (only PDF and DOCX allowed)
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.docx')) {
        setFile(file);
      } else {
        alert('Only PDF and DOCX files are allowed.');
        setFile(null);
      }
    }
  };

  // Manage dynamic question fields
  const handleAddQuestion = () => {
    setUserQuestions([...userQuestions, '']);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updated = [...userQuestions];
    updated[index] = value;
    setUserQuestions(updated);
  };

  const handleRemoveQuestion = (index: number) => {
    if (userQuestions.length > 1) {
      setUserQuestions(userQuestions.filter((_, i) => i !== index));
    }
  };

  // Reset the form fields
  const handleResetForm = () => {
    setInterviewTitle('');
    setSelectedRole('');
    setResumeFile(null);
    setSessionDescription('');
    setDuration(30);
    setJobDescription('');
    setUserQuestions(['']);
    setSelectedMode('standard');
    setErrorMessage('');
  };

  // Start Interview: validate fields, process resume file (if any), collect setup data, and navigate to conversation page
  const startInterview = async () => {
    if (!interviewTitle.trim() || !selectedRole.trim() || !jobDescription.trim()) {
      setErrorMessage("Please fill in all required fields: Interview Title, Target Role, and Job Description.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Use FormData for file upload
      const formPayload = new FormData();
      formPayload.append('action', 'create_session');
      formPayload.append('title', interviewTitle);
      formPayload.append('description', sessionDescription);
      formPayload.append('createdBy', 'user-123'); // Simulated user ID
      formPayload.append('duration', duration.toString());
      formPayload.append('interviewType', interviewType);
      formPayload.append('participantRoles', JSON.stringify(['interviewer', 'candidate']));
      formPayload.append('scheduledTime', new Date().toISOString());
      
      if (resumeFile) {
        formPayload.append('resumeFile', resumeFile);
      }
      
      // Append additional fields
      formPayload.append('userQuestions', JSON.stringify(userQuestions.filter(q => q.trim() !== '')));
      formPayload.append('selectedMode', selectedMode);
      
      const response = await fetch('/api/uploading/interviews', {
        method: 'POST',
        body: formPayload,
      });
      
      if (!response.ok) {
        throw new Error('Failed to create session');
      }
      
      const data = await response.json();
      if (data.success && data.sessionId) {
        toast.success('Interview session created!');
        // Save setup data to localStorage for Gemini conversation page
        localStorage.setItem("interviewSetup", JSON.stringify({
          interviewTitle,
          selectedRole,
          sessionDescription,
          jobDescription,
          userQuestions: userQuestions.filter(q => q.trim() !== ''),
          resumeFileName: resumeFile ? resumeFile.name : null,
          selectedMode,
          timestamp: new Date().toISOString(),
          status: 'started'
        }));
        router.push(`/interview/${data.sessionId}`);
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error: any) {
      console.error('Error during interview setup:', error);
      setErrorMessage('There was an error starting your interview. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (errorMessage) setErrorMessage('');
  }, [interviewTitle, selectedRole, jobDescription]);

  // Framer Motion variants
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 15, stiffness: 100 } } };
  const tipContainerVariants = { hidden: { height: 0, opacity: 0 }, visible: { height: 'auto', opacity: 1, transition: { duration: 0.3 } }, exit: { height: 0, opacity: 0, transition: { duration: 0.3 } } };

  const renderTabNavigation = () => (
    <div className="flex space-x-1 mb-8 border-b border-gray-700">
      <button
        className={`px-4 py-3 font-medium flex items-center space-x-2 ${activeView === 'setup' ? 'text-white border-b-2 border-indigo-500' : 'text-gray-400 hover:text-white'}`}
        onClick={() => setActiveView('setup')}
      >
        <PlusCircle className="w-5 h-5" />
        <span>Create New Interview</span>
      </button>
      <button
        className={`px-4 py-3 font-medium flex items-center space-x-2 ${activeView === 'history' ? 'text-white border-b-2 border-indigo-500' : 'text-gray-400 hover:text-white'}`}
        onClick={() => setActiveView('history')}
      >
        <History className="w-5 h-5" />
        <span>Interview History</span>
      </button>
    </div>
  );

  return (
    <motion.div 
      className="w-full bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900 text-white min-h-screen p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600 rounded-full opacity-10 blur-3xl" />
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400"
          variants={itemVariants}
        >
          Behavioral Interview Preparation
        </motion.h1>
        
        {renderTabNavigation()}

        <AnimatePresence mode="wait">
          {activeView === 'setup' ? (
            <motion.div 
              key="setup" 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }} 
              transition={{ duration: 0.3 }}
            >
              {errorMessage && (
                <motion.div 
                  className="bg-red-900/40 border border-red-500/40 rounded-xl mb-4 p-4 flex items-start space-x-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-200">{errorMessage}</p>
                </motion.div>
              )}
              
              {/* Quick Tips Section */}
              <motion.div 
                className="bg-indigo-900/30 border border-indigo-500/40 rounded-xl mb-8 overflow-hidden shadow-lg shadow-indigo-900/10" 
                variants={itemVariants}
              >
                <div className="flex justify-between items-center p-4 cursor-pointer bg-indigo-900/50" onClick={() => setTipVisible(!tipVisible)}>
                  <div className="flex items-center space-x-2">
                    <LightbulbIcon className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-semibold text-white">Quick Interview Tips</h3>
                  </div>
                  <button className="text-gray-300 hover:text-white">
                    {tipVisible ? <X className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                  </button>
                </div>
                {tipVisible && (
                  <motion.div 
                    className="px-4 pb-5" 
                    variants={tipContainerVariants} 
                    initial="hidden" 
                    animate="visible" 
                    exit="exit"
                  >
                    <div className="flex overflow-x-auto py-3 space-x-2 mb-4">
                      {tips.map((tip, index) => (
                        <button
                          key={index}
                          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${activeTip === index ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-800/20' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                          onClick={() => setActiveTip(index)}
                        >
                          {tip.title}
                        </button>
                      ))}
                    </div>
                    <div className="bg-indigo-950/50 rounded-xl p-5 border border-indigo-800/30">
                      <h4 className="font-medium text-lg mb-2 text-indigo-200">{tips[activeTip].title}</h4>
                      <p className="text-gray-300">{tips[activeTip].content}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
              
              {/* Interview Setup Form */}
              <motion.div 
                className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-xl shadow-purple-900/5" 
                variants={itemVariants}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                    Behavioral Interview Setup
                  </h2>
                </div>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title">Interview Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={interviewTitle}
                        onChange={(e) => setInterviewTitle(e.target.value)}
                        placeholder="e.g., Frontend Developer Interview"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetRole">Target Role</Label>
                      <Input
                        id="targetRole"
                        name="targetRole"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        placeholder="e.g., Product Manager, Software Engineer"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg">
                    <div>
                      <Label htmlFor="interviewType">Interview Type</Label>
                      <select
                        id="interviewType"
                        name="interviewType"
                        className="flex h-10 w-full rounded-md border bg-gray-800 px-3 py-2 text-sm focus:outline-none"
                        value={interviewType}
                        onChange={(e) => setInterviewType(e.target.value)}
                      >
                        <option value="technical">Technical</option>
                        <option value="behavioral">Behavioral</option>
                        <option value="general">General</option>
                        <option value="case-study">Case Study</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="sessionDescription">Description</Label>
                      <textarea
                        id="sessionDescription"
                        name="sessionDescription"
                        className="min-h-[80px] w-full rounded-md border bg-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={sessionDescription}
                        onChange={(e) => setSessionDescription(e.target.value)}
                        placeholder="Brief description of the interview session"
                      ></textarea>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min="5"
                      max="120"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Upload Your Resume (Optional)</Label>
                    <div 
                      className="border-2 border-dashed rounded-xl p-6 cursor-pointer hover:border-indigo-500 transition-colors text-center bg-indigo-950/20"
                      onClick={() => resumeInputRef.current?.click()}
                    >
                      {resumeFile ? (
                        <div className="flex items-center justify-center space-x-2">
                          <FileText className="w-5 h-5 text-indigo-400" />
                          <span className="text-indigo-300">{resumeFile.name}</span>
                          <button 
                            className="text-gray-400 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              setResumeFile(null);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-3">
                          <Upload className="w-10 h-10 text-indigo-500" />
                          <span className="text-indigo-300">Upload your resume</span>
                          <span className="text-xs text-indigo-400">PDF (.pdf) or DOCX (.docx) only</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        ref={resumeInputRef}
                        onChange={(e) => handleFileChange(e, setResumeFile)} 
                        accept=".pdf,.docx"
                        className="hidden"
                      />
                    </div>
                    <p className="mt-2 text-xs text-indigo-300">Only PDF and DOCX files are accepted.</p>
                  </div>
                  <div>
                    <Label htmlFor="jobDescription">Job Description (Required)</Label>
                    <textarea
                      id="jobDescription"
                      name="jobDescription"
                      required
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description here..."
                      className="w-full h-36 rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Your Questions for the Interviewer (Optional)</Label>
                      <button 
                        className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center space-x-1 bg-indigo-950/30 px-3 py-1 rounded-full"
                        onClick={handleAddQuestion}
                      >
                        <PlusCircle className="w-5 h-5" />
                        <span>Add Question</span>
                      </button>
                    </div>
                    <div className="space-y-3">
                      {userQuestions.map((question, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="flex-grow relative">
                            <HelpCircle className="absolute left-3 top-3.5 w-5 h-5 text-indigo-400" />
                            <input
                              type="text"
                              value={question}
                              onChange={(e) => handleQuestionChange(index, e.target.value)}
                              placeholder="e.g. How would you describe the team culture?"
                              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-10 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          {userQuestions.length > 1 && (
                            <button 
                              className="text-gray-400 hover:text-white p-2 bg-gray-800 rounded-full"
                              onClick={() => handleRemoveQuestion(index)}
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-indigo-300 mt-2">
                      These questions will be available to ask at the end of your interview session.
                    </p>
                  </div>
                  <div>
                    <Label>Interview Difficulty</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {interviewModes.map((mode) => (
                        <div 
                          key={mode.id}
                          className={`border rounded-xl p-5 cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 ${selectedMode === mode.id ? `${mode.color} border-opacity-70` : 'border-gray-700 bg-gray-900/40 hover:border-gray-500'}`}
                          onClick={() => setSelectedMode(mode.id)}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <div className={`w-4 h-4 rounded-full border-2 ${selectedMode === mode.id ? 'border-indigo-500 bg-indigo-500' : 'border-gray-500'}`}></div>
                            <span className="font-medium text-white">{mode.name}</span>
                          </div>
                          <p className="ml-6 text-sm text-gray-300 mt-1">{mode.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-amber-900/30 to-yellow-900/20 border border-yellow-700/30 rounded-xl p-5 flex space-x-3 shadow-lg">
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                    <div>
                      <h4 className="font-medium text-yellow-200 mb-1">Personalized Experience</h4>
                      <p className="text-sm text-yellow-100/80">
                        Providing your resume and job description allows our AI to tailor questions to your background and target role.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center mt-10 space-x-4">
                    <motion.button
                      className="border border-gray-600 hover:border-gray-400 px-6 py-3 rounded-xl font-medium text-gray-300 hover:text-white bg-gray-900/30 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleResetForm}
                      disabled={isSubmitting}
                    >
                      Reset Form
                    </motion.button>
                    <motion.button
                      className={`bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center space-x-2 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                      whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      onClick={startInterview}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          <span>Starting Interview...</span>
                        </>
                      ) : (
                        <>
                          <span>Start Behavioral Interview</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="history" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }} 
              transition={{ duration: 0.3 }}
            >
              {/* Interview History view (omitted for brevity) */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
  
// Helper: Format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

// Helper: Join session by navigating to the interview route
const joinSession = (sessionId: string) => {
  const router = useRouter();
  router.push(`/interview/${sessionId}`);
};
