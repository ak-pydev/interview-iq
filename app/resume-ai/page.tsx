// src/pages/ResumeEnhancerPage.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Rocket, RefreshCw, Sparkles, LightbulbIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import animationStyles from '@/components/resume-components/animationStyles';
import { parseGeminiResponse } from '@/utils/parseGeminiresponse';
import ResumeUploader from '@/components/resume-components/ResumeUploader';
import JobDescriptionForm from '@/components/resume-components/JobDescriptionForm';
import AnalysisResults from '@/components/resume-components/index';

// Interface for form data
interface ResumeEnhancerFormData {
  resumeFile: File | null;
  jobDescription: string;
  companyName: string;
  targetRole: string;
}

const ResumeEnhancerPage: React.FC = () => {
  // Inject global animation styles once
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = animationStyles;
    document.head.appendChild(styleEl);
    
    // Return cleanup function that properly removes the element
    return () => {
      if (styleEl && document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
    };
  }, []);
  const { user } = useUser(); // Retrieve Clerk user
  const [formData, setFormData] = useState<ResumeEnhancerFormData>({
    resumeFile: null,
    jobDescription: '',
    companyName: '',
    targetRole: '',
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [ocrResults, setOcrResults] = useState<string[]>([]);
  const [matchScore, setMatchScore] = useState<number>(65);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [analysisStage, setAnalysisStage] = useState<number>(0);
  const stageIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);
    };
  }, []);

  // Scroll to results when they are ready
  useEffect(() => {
    if (showResults && !isProcessing) {
      const el = document.getElementById('results-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showResults, isProcessing, ocrResults]);

  // Start or stop the analysis stage animation
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

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, resumeFile: file }));
  };

  const handleInputChange = (newFormData: ResumeEnhancerFormData) => {
    setFormData(newFormData);
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
                  <ResumeUploader 
                    resumeFile={formData.resumeFile} 
                    onChange={handleFileChange} 
                    onRemove={() => handleFileChange(null)} 
                  />
                  
                  <JobDescriptionForm 
                    formData={formData} 
                    onChange={handleInputChange} 
                  />
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
              <AnalysisResults
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

export default ResumeEnhancerPage;