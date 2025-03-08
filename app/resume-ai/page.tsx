'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Upload,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  Award,
  Target,
  Briefcase,
  X,
  ChevronRight,
  Scissors,
  Download,
  CheckCircle2,
  XCircle,
  Brain,
  Search,
  Cpu,
  Zap,
  BarChart3,
  Rocket,
  Bot,
  Code,
  LineChart,
  Network,
  LightbulbIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

// ------------------ Animation Styles ------------------
const animationStyles = `
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }

@keyframes shimmer { 0% { background-position: -468px 0; } 100% { background-position: 468px 0; } }
.animate-shimmer { 
  background: linear-gradient(to right, #f0f4ff 8%, #e0e7ff 18%, #f0f4ff 33%); 
  background-size: 800px 104px; 
  animation: shimmer 1.5s infinite linear; 
}

@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

@keyframes thinking { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
.animate-thinking { animation: thinking 1.5s ease-in-out infinite; }

@keyframes ellipsis { 0% { content: '.'; } 33% { content: '..'; } 66% { content: '...'; } 100% { content: '.'; } }
.animate-ellipsis::after { content: '.'; display: inline-block; width: 18px; text-align: left; animation: ellipsis 1.5s infinite; }

@keyframes gradientBg { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
.gradient-animate { 
  background: linear-gradient(-45deg, #6366f1, #8b5cf6, #4f46e5, #4338ca); 
  background-size: 400% 400%; 
  animation: gradientBg 15s ease infinite; 
}

@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
.animate-float { animation: float 3s ease-in-out infinite; }

@keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.animate-spin-slow { animation: spin-slow 3s linear infinite; }

.glass-morphism {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
}

.subtle-shadow {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
}

.neon-glow {
  box-shadow: 0 0 5px #4f46e5, 0 0 15px #4f46e5, 0 0 20px #4f46e5;
  transition: all 0.3s ease;
}

.neon-text {
  text-shadow: 0 0 5px #4f46e5, 0 0 10px #4f46e5;
}

.tech-border {
  border: 1px solid rgba(99, 102, 241, 0.3);
  position: relative;
  overflow: hidden;
}

.tech-border::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent);
  transform: translateX(-100%);
  animation: borderGlow 2s infinite linear;
}

@keyframes borderGlow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.glitch-effect {
  position: relative;
  color: white;
}

.glitch-effect::before, .glitch-effect::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-effect::before {
  left: 2px;
  text-shadow: -1px 0 #ff00ff;
  animation: glitch-1 2s infinite linear alternate-reverse;
}

.glitch-effect::after {
  left: -2px;
  text-shadow: 2px 0 #00ffff;
  animation: glitch-2 3s infinite linear alternate-reverse;
}

@keyframes glitch-1 {
  0%, 80%, 100% { clip-path: inset(0 0 0 0); }
  20% { clip-path: inset(10% 0 60% 0); }
  40% { clip-path: inset(40% 0 20% 0); }
  60% { clip-path: inset(70% 0 5% 0); }
}

@keyframes glitch-2 {
  0%, 80%, 100% { clip-path: inset(0 0 0 0); }
  20% { clip-path: inset(60% 0 10% 0); }
  40% { clip-path: inset(20% 0 40% 0); }
  60% { clip-path: inset(5% 0 70% 0); }
}

.circuit-lines {
  background-color: #ffffff;
  background-image: 
    radial-gradient(#e0e7ff 1px, transparent 1px),
    linear-gradient(to right, #e0e7ff 1px, transparent 1px),
    linear-gradient(to bottom, #e0e7ff 1px, transparent 1px);
  background-size: 20px 20px;
}

.data-grid {
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

.scanning-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 10px 3px rgba(99, 102, 241, 0.7);
  animation: scanning 2s ease-in-out infinite;
}

@keyframes scanning {
  0% { left: 0; }
  100% { left: calc(100% - 5px); }
}

.glow-effect {
  position: relative;
}

.glow-effect::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  box-shadow: 0 0 15px 2px rgba(99, 102, 241, 0.6);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.glow-effect:hover::after {
  opacity: 1;
}

.btn-gradient {
  background: linear-gradient(to right, #4f46e5, #7c3aed);
  border: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.btn-gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
}

.label-effect {
  display: inline-block;
  position: relative;
  transition: transform 0.3s;
}

.label-effect::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #6366f1;
  transition: width 0.3s ease;
}

.label-effect:hover {
  transform: translateY(-1px);
}

.label-effect:hover::after {
  width: 100%;
}
`;

// ------------------ Utility: Parse Gemini Response ------------------
interface ParsedFeedback {
  feedback: string[];
  match: number;
}

function parseGeminiResponse(rawResponse: string): ParsedFeedback {
  const normalized = rawResponse.replace(/\r\n/g, '\n').trim();
  const lines = normalized.split('\n');
  const bulletRegex = /^(\s*[-*•]\s+|\s*\d+[\.\)]\s+)?(.*)$/;
  const feedback: string[] = [];
  let matchScore = 65;
  
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const scoreMatch = trimmed.match(/match score:\s*(\d+)%/i);
    if (scoreMatch && scoreMatch[1]) {
      matchScore = parseInt(scoreMatch[1], 10);
    }
    if (/^[A-Z\s]+:$/.test(trimmed)) return;
    const m = trimmed.match(bulletRegex);
    if (m) {
      const content = m[2].trim();
      if (content.length >= 5) feedback.push(content);
    }
  });
  
  if (feedback.length === 0) {
    return { feedback: normalized.split(/[.\n]+/).map(s => s.trim()).filter(s => s.length > 0), match: matchScore };
  }
  return { feedback, match: matchScore };
}

// ------------------ Animated Components ------------------

const ResultsSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="h-8 w-3/4 rounded-md animate-shimmer animate-wave"></div>
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-20 w-full rounded-md animate-shimmer animate-wave" style={{ animationDelay: `${i * 0.3}s` }}></div>
      ))}
    </div>
  </div>
);

const CircularProgressAnimation: React.FC<{ progress: number }> = ({ progress }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="progress-circular relative w-20 h-20 mx-auto mt-4">
      <svg viewBox="0 0 100 100">
        <circle className="track" cx="50" cy="50" r={radius} fill="none" stroke="#cbd5e1" strokeWidth="4" />
        <circle 
          className="progress" 
          cx="50" 
          cy="50" 
          r={radius} 
          fill="none" 
          stroke="url(#gradient)" 
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.35s' }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-indigo-600 font-bold text-lg">{progress}%</span>
      </div>
    </div>
  );
};

interface ResumeEnhancerFormData {
  resumeFile: File | null;
  jobDescription: string;
  companyName: string;
  targetRole: string;
}

const ResumeEnhancerPage: React.FC = () => {
  // Inject global animation styles once.
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = animationStyles;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  const { user } = useUser(); // Retrieve Clerk user
  const [formData, setFormData] = useState<ResumeEnhancerFormData>({
    resumeFile: null,
    jobDescription: '',
    companyName: '',
    targetRole: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResults, setOcrResults] = useState<string[]>([]);
  const [matchScore, setMatchScore] = useState<number>(65);
  const [showResults, setShowResults] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stageIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (showResults && !isProcessing) {
      const el = document.getElementById('results-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showResults, isProcessing, ocrResults]);

  useEffect(() => {
    if (isProcessing) {
      stageIntervalRef.current = setInterval(() => {
        setAnalysisStage(prev => prev + 1);
      }, 1000);
    } else {
      if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);
    }
    return () => {
      if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);
    };
  }, [isProcessing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
      ];
      const maxSize = 5 * 1024 * 1024;
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload a PDF or Word document.');
        return;
      }
      if (file.size > maxSize) {
        toast.error('File size exceeds 5MB limit.');
        return;
      }
      setFormData(prev => ({ ...prev, resumeFile: file }));
      toast.success('Resume uploaded successfully!', {
        icon: '📄',
        style: { borderRadius: '10px', background: '#4F46E5', color: '#fff' },
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, resumeFile: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateForm = (): boolean => {
    const { resumeFile, jobDescription, companyName, targetRole } = formData;
    if (!resumeFile) {
      toast.error('Please upload your resume');
      return false;
    }
    if (!jobDescription.trim()) {
      toast.error('Please provide the job description');
      return false;
    }
    if (!companyName.trim()) {
      toast.error('Please enter the company name');
      return false;
    }
    if (!targetRole.trim()) {
      toast.error('Please specify the target role');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setIsProcessing(true);
      setShowResults(true);
      setOcrResults([]);
      setAnalysisStage(0);

      const formDataToSend = new FormData();
      formDataToSend.append('file', formData.resumeFile!);
      formDataToSend.append('jobDescription', formData.jobDescription);
      formDataToSend.append('companyName', formData.companyName);
      formDataToSend.append('targetRole', formData.targetRole);
      if (user?.id) {
        formDataToSend.append('userId', user.id);
      }

      toast('Beginning resume analysis...', {
        icon: '🔍',
        style: { borderRadius: '10px', background: '#4F46E5', color: '#fff' },
      });

      // First, upload the file
      const uploadResponse = await fetch('/api/resume-enhance/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload resume');
      }

      const uploadData = await uploadResponse.json();
      const fileId = uploadData.fileId;
      
      toast('Processing document structure...', {
        icon: '⚙️',
        style: { borderRadius: '10px', background: '#4F46E5', color: '#fff' },
      });

      // Next, perform OCR on the uploaded file
      const ocrResponse = await fetch('/api/resume-enhance/genai-ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId }),
      });

      if (!ocrResponse.ok) {
        throw new Error('Failed to process resume text');
      }

      const ocrData = await ocrResponse.json();
      
      toast('Matching with job requirements...', {
        icon: '🔄',
        style: { borderRadius: '10px', background: '#4F46E5', color: '#fff' },
      });
      
      // Finally, analyze the resume against the job description
      const analysisResponse = await fetch('/api/resume-enhance/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: ocrData.text,
          jobDescription: formData.jobDescription,
          companyName: formData.companyName,
          targetRole: formData.targetRole,
          fileId: fileId,
        }),
      });

      if (!analysisResponse.ok) {
        throw new Error('Failed to analyze resume');
      }

      const analysisData = await analysisResponse.json();
      const parsedFeedback = parseGeminiResponse(analysisData.analysis);
      
      setOcrResults(parsedFeedback.feedback);
      setMatchScore(parsedFeedback.match);

      toast.success('Resume analysis complete!', { 
        duration: 3000, 
        icon: '🚀',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' }
      });
    } catch (error: any) {
      console.error('Resume enhancement error:', error);
      toast.error('Failed to analyze resume. Please try again.', { 
        duration: 4000,
        style: { borderRadius: '10px', background: '#EF4444', color: '#fff' }
      });
      setShowResults(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <style jsx global>{animationStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-100 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-3xl space-y-8">
          <Card className="shadow-2xl rounded-2xl border-none overflow-hidden subtle-shadow hover:shadow-indigo-200/50 transition-all duration-500">
            <CardHeader className="gradient-animate text-white border-b-0 pb-8 pt-8">
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl md:text-4xl font-extrabold flex items-center space-x-3">
                  <Bot className="mr-3 h-8 w-8 animate-float" />
                  <span className="relative">
                    <span className="glitch-effect" data-text="AI Resume Enhancer">AI Resume Enhancer</span>
                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-white/30 rounded-full"></span>
                  </span>
                </CardTitle>
                <Badge className="bg-white/20 text-white border-none px-3 py-1.5 backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5 mr-1" /> AI Powered
                </Badge>
              </div>
              <CardDescription className="text-white mt-3 opacity-90 max-w-2xl">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200 text-lg">
                  Optimize your resume for specific jobs with AI-powered analysis and tailored recommendations
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 bg-white shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-30 -mt-10 -mr-10"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full filter blur-3xl opacity-30 -mb-10 -ml-10"></div>
              
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-indigo-500 p-4 rounded-lg mb-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-100 p-2 rounded-full mt-0.5">
                      <LightbulbIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-indigo-900 mb-1">How it works:</p>
                      <p className="text-sm text-indigo-700">
                        Upload your resume and paste the job description. Our AI will analyze the match, 
                        highlight your strengths, and suggest tailored improvements to increase your chances.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="resume" className="text-sm font-medium text-gray-700 mb-2 block label-effect">
                      Upload Resume
                    </Label>
                    {formData.resumeFile ? (
                      <div className="flex items-center p-3 rounded-lg border border-green-200 bg-green-50 shadow-sm hover:shadow-md transition-all">
                        <div className="p-2 bg-green-100 rounded-full mr-3">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="text-green-700 font-medium flex-1 truncate">
                          {formData.resumeFile.name}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleRemoveFile}
                          className="h-8 w-8 p-0 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-indigo-200 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors bg-gradient-to-br from-white to-indigo-50/50">
                        <Input
                          type="file"
                          id="resume"
                          ref={fileInputRef}
                          accept=".pdf,.docx,.doc"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <div className="mb-4">
                          <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-3 animate-float">
                            <Upload className="h-8 w-8 text-indigo-600" />
                          </div>
                          <p className="text-indigo-700 font-medium">Drag & drop your resume here</p>
                          <p className="text-indigo-500 text-sm mt-1">or click to browse</p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="mx-auto flex items-center transition-all border-indigo-300 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-400"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload PDF or Word Document
                        </Button>
                        <p className="text-xs text-gray-500 mt-3 flex items-center justify-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Maximum file size: 5MB
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="jobDescription" className="text-sm font-medium text-gray-700 mb-2 block label-effect">
                      Job Description
                    </Label>
                    <textarea
                      id="jobDescription"
                      name="jobDescription"
                      rows={5}
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-3 shadow-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all resize-none"
                      placeholder="Paste the full job description here..."
                      value={formData.jobDescription}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="companyName" className="text-sm font-medium text-gray-700 mb-2 block label-effect">
                        Company Name
                      </Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          type="text"
                          id="companyName"
                          name="companyName"
                          placeholder="Enter target company name"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className="pl-10 rounded-lg border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="targetRole" className="text-sm font-medium text-gray-700 mb-2 block label-effect">
                        Target Role
                      </Label>
                      <div className="relative">
                        <Target className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          type="text"
                          id="targetRole"
                          name="targetRole"
                          placeholder="Enter desired job title"
                          value={formData.targetRole}
                          onChange={handleInputChange}
                          className="pl-10 rounded-lg border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center py-6 font-semibold text-lg transition-all btn-gradient text-white rounded-lg overflow-hidden relative group"
                >
                  <div className="absolute inset-0 data-grid opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white blur transition-opacity"></div>
                  <div className="relative z-10 flex items-center">
                    {isProcessing ? (
                      <>
                        <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing Resume...
                      </>
                    ) : (
                      <>
                        <Rocket className="mr-2 h-5 w-5 group-hover:animate-float" />
                        Analyze Resume
                      </>
                    )}
                  </div>
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div id="results-section">
            {showResults && (
              <ResumeResults
                isLoading={isProcessing}
                feedback={ocrResults}
                match={matchScore}
                analysisStage={analysisStage}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeEnhancerPage;const ThinkingAnimation: React.FC<{ message: string; stage: number }> = ({ message, stage }) => {
  const renderAnimation = () => {
    switch (stage % 3) {
      case 0: return <Rocket className="h-16 w-16 text-indigo-500 animate-spin-slow drop-shadow-lg" />;
      case 1: return <Cpu className="h-16 w-16 text-indigo-500 animate-pulse drop-shadow-lg" />;
      case 2: return <Brain className="h-16 w-16 text-indigo-500 animate-thinking drop-shadow-lg" />;
      default: return <Rocket className="h-16 w-16 text-indigo-500 animate-spin-slow drop-shadow-lg" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <div className="relative mb-4 p-4 bg-indigo-50 rounded-full shadow-md">{renderAnimation()}</div>
      <p className="text-indigo-800 text-lg font-medium animate-ellipsis bg-indigo-50 px-4 py-2 rounded-full shadow-sm">{message}</p>
    </div>
  );
};

const ProcessingStatusAnimation: React.FC<{ step: number }> = ({ step }) => {
  const steps = [
    { text: "Parsing document structure...", icon: <FileText className="h-5 w-5 text-indigo-600" /> },
    { text: "Extracting key information...", icon: <Code className="h-5 w-5 text-indigo-600" /> },
    { text: "Comparing with job description...", icon: <Cpu className="h-5 w-5 text-indigo-600" /> },
    { text: "Analyzing skills match...", icon: <BarChart3 className="h-5 w-5 text-indigo-600" /> },
    { text: "Identifying strengths...", icon: <Award className="h-5 w-5 text-indigo-600" /> },
    { text: "Finding improvement areas...", icon: <Target className="h-5 w-5 text-indigo-600" /> },
    { text: "Generating recommendations...", icon: <Zap className="h-5 w-5 text-indigo-600" /> }
  ];
  const progressPercent = Math.min(Math.round((step / (steps.length - 1)) * 100), 100);
  
  return (
    <div className="w-full max-w-md mx-auto mt-6 glass-morphism rounded-xl p-4 shadow-lg border border-indigo-100 transition-all hover:shadow-xl">
      <div className="flex mb-2 items-center justify-between">
        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-100">
          Processing
        </span>
        <span className="text-xs font-semibold inline-block text-indigo-600">{progressPercent}%</span>
      </div>
      <div className="overflow-hidden h-3 mb-4 flex rounded-full bg-indigo-100 relative">
        <div
          style={{ width: `${progressPercent}%` }}
          className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-500"
        ></div>
        <div className="scanning-bar"></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 shadow-inner">
          {steps[step % steps.length].icon}
        </div>
        <p className="text-sm text-indigo-700 font-medium animate-ellipsis">{steps[step % steps.length].text}</p>
      </div>
    </div>
  );
};

interface ResumeResultsProps {
  isLoading: boolean;
  feedback: string[];
  match: number;
  analysisStage?: number;
}

interface ResumeAnalysisData {
  keywords: {
    matching: string[];
    missing: string[];
  };
  strengths: string[];
  weaknesses: string[];
  feedback: string[];
  match: number;
}

const ResumeResults: React.FC<ResumeResultsProps> = ({ isLoading, feedback, match, analysisStage = 0 }) => {
  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMatchBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border border-green-300';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    return 'bg-red-100 text-red-800 border border-red-300';
  };

  // Sample analysis data - this would come from the API in a real implementation
  const analysisData: ResumeAnalysisData = {
    keywords: {
      matching: [
        "React", "JavaScript", "TypeScript", "Frontend Development", 
        "UI/UX", "REST APIs", "Git", "Responsive Design"
      ],
      missing: [
        "GraphQL", "CI/CD", "AWS", "Agile Development", 
        "Docker", "Microservices"
      ]
    },
    strengths: [
      "Strong frontend development skills with React ecosystem",
      "Experience in building responsive and accessible UI components",
      "Good knowledge of modern JavaScript and TypeScript",
      "Experience with state management solutions"
    ],
    weaknesses: [
      "Limited experience with cloud technologies mentioned in the job description",
      "No specific mention of GraphQL which is required for this role",
      "Missing experience with containerization and deployment pipelines",
      "No quantifiable metrics for past achievements"
    ],
    feedback: feedback,
    match: match
  };

  return (
    <div className="mt-8 rounded-xl overflow-hidden shadow-xl glass-card transition-all animate-fadeIn hover:shadow-2xl">
      <div className="gradient-animate px-6 py-5 relative">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Sparkles className="mr-2 h-5 w-5" />
          {isLoading ? 'Analyzing Your Resume...' : 'Resume Enhancement Analysis'}
        </h3>
        {!isLoading && (
          <p className="text-indigo-100 text-sm mt-1">
            Here's how your resume matches the job description
          </p>
        )}
      </div>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-14 px-6 bg-gradient-to-br from-white to-indigo-50 circuit-lines">
          <ThinkingAnimation message="Neural network analyzing your resume" stage={analysisStage} />
          <ProcessingStatusAnimation step={analysisStage % 7} />
          <div className="w-full max-w-md mt-10">
            <ResultsSkeleton />
          </div>
          <CircularProgressAnimation progress={Math.min(Math.round((analysisStage / 10) * 100), 95)} />
        </div>
      ) : (
        <div>
          <div className="p-6 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border-b border-indigo-500/20">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <p className="text-gray-300 text-sm">Job Match Score</p>
                <p className={`text-3xl font-bold ${getMatchColor(match)} neon-text`} data-text={`${match}%`}>{match}%</p>
              </div>
              <div className="flex-1 max-w-md mx-auto md:mx-4">
                <div className="h-4 bg-gray-800/60 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className={`h-full rounded-full ${
                      match >= 80 ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                      match >= 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                      'bg-gradient-to-r from-red-500 to-red-600'
                    } shadow-inner`}
                    style={{ width: `${match}%`, transition: 'width 1s ease-out' }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                  <span>Needs Work</span>
                  <span>Good Match</span>
                  <span>Excellent</span>
                </div>
              </div>
              <Badge className={`px-3 py-1.5 ${getMatchBadgeColor(match)} shadow-sm`}>
                {match >= 80 ? 'Excellent Match' : match >= 60 ? 'Good Match' : 'Needs Improvement'}
              </Badge>
            </div>
          </div>
          
          <Tabs defaultValue="keywords" className="p-6 bg-gradient-to-br from-indigo-950/80 to-purple-950/80">
            <TabsList className="mb-4 overflow-x-auto flex w-full bg-white/5 border border-indigo-500/30 rounded-lg p-1">
              <TabsTrigger 
                value="keywords" 
                className="px-4 py-2 whitespace-nowrap transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md"
              >
                <Search className="h-4 w-4 mr-2" />
                Keywords Match
              </TabsTrigger>
              <TabsTrigger 
                value="strengths" 
                className="px-4 py-2 whitespace-nowrap transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md"
              >
                <Award className="h-4 w-4 mr-2" />
                Strengths
              </TabsTrigger>
              <TabsTrigger 
                value="weaknesses" 
                className="px-4 py-2 whitespace-nowrap transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md"
              >
                <Target className="h-4 w-4 mr-2" />
                Areas to Improve
              </TabsTrigger>
              <TabsTrigger 
                value="improvements" 
                className="px-4 py-2 whitespace-nowrap transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md"
              >
                <LightbulbIcon className="h-4 w-4 mr-2" />
                AI Recommendations
                <Badge className="ml-2 bg-indigo-700 text-white border border-indigo-300/20">
                  {feedback.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            {/* Keywords Tab */}
            <TabsContent value="keywords" className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Matching Keywords */}
                <div className="glass-morphism rounded-xl p-4">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-green-700/20 rounded-full mr-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white">Matching Keywords</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.keywords.matching.map((keyword, idx) => (
                      <Badge key={idx} className="bg-green-900/30 text-green-300 border border-green-500/20 py-1.5 px-3">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Missing Keywords */}
                <div className="glass-morphism rounded-xl p-4">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-red-700/20 rounded-full mr-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white">Missing Keywords</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.keywords.missing.map((keyword, idx) => (
                      <Badge key={idx} className="bg-red-900/30 text-red-300 border border-red-500/20 py-1.5 px-3">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-500/30 mt-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-800/50 rounded-full mt-0.5">
                    <LightbulbIcon className="h-4 w-4 text-indigo-300" />
                  </div>
                  <div>
                    <p className="text-indigo-200 text-sm">
                      <span className="font-semibold">Pro Tip:</span> Include these missing keywords in your resume to 
                      significantly increase your match score. Make sure to include them naturally within relevant 
                      experience or skills sections.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Strengths Tab */}
            <TabsContent value="strengths" className="space-y-4 animate-fadeIn">
              <div className="bg-gradient-to-br from-indigo-900/40 to-green-900/20 rounded-xl p-6 border border-green-500/20">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-green-700/20 rounded-full mr-3">
                    <Award className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white">Your Resume Strengths</h3>
                </div>
                
                <div className="space-y-3">
                  {analysisData.strengths.map((strength, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-3 p-3 rounded-lg glass-morphism bg-green-900/10 hover:bg-green-900/20 transition-all animate-fadeIn"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="mt-1 flex-shrink-0 rounded-full bg-green-500/20 p-1">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      </div>
                      <p className="text-green-100">{strength}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-white/5 rounded-lg">
                  <p className="text-indigo-200 text-sm italic">
                    These are the key strengths that align well with the job requirements. Emphasize these points
                    during your interview to highlight your fit for the role.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            {/* Weaknesses Tab */}
            <TabsContent value="weaknesses" className="space-y-4 animate-fadeIn">
              <div className="bg-gradient-to-br from-indigo-900/40 to-amber-900/20 rounded-xl p-6 border border-amber-500/20">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-amber-700/20 rounded-full mr-3">
                    <Target className="h-6 w-6 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white">Areas to Improve</h3>
                </div>
                
                <div className="space-y-3">
                  {analysisData.weaknesses.map((weakness, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-3 p-3 rounded-lg glass-morphism bg-amber-900/10 hover:bg-amber-900/20 transition-all animate-fadeIn"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="mt-1 flex-shrink-0 rounded-full bg-amber-500/20 p-1">
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                      </div>
                      <p className="text-amber-100">{weakness}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-white/5 rounded-lg">
                  <p className="text-indigo-200 text-sm italic">
                    Addressing these gaps in your resume can significantly improve your chances of getting an interview.
                    Consider adding relevant experience or highlighting transferable skills.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            {/* AI Recommendations Tab */}
            <TabsContent value="improvements" className="space-y-4 mt-2">
              {feedback.length > 0 ? (
                feedback.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-lg glass-morphism hover:bg-indigo-800/30 backdrop-blur-sm transition-all animate-fadeIn"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="mt-1 flex-shrink-0 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 p-1.5 backdrop-blur-sm">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                    </div>
                    <p className="text-indigo-100">{item}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-300 py-12 rounded-lg border border-dashed border-indigo-500/30 glass-morphism">
                  <Search className="h-12 w-12 mx-auto mb-3 text-indigo-400 opacity-70" />
                  <p className="text-lg">No improvement suggestions found.</p>
                  <p className="text-sm text-indigo-300 mt-2">Your resume already matches this job description very well!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};