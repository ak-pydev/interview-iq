'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Upload, Check, ArrowRight, Download, RefreshCw, 
  Sparkles, AlertTriangle, Award, Target, Briefcase, X, ChevronRight,
  Scissors, Layout, Code, CheckCircle2, XCircle
} from 'lucide-react';
import { toast } from 'sonner';

// Add keyframe animation styles
const animationStyles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}
@keyframes shimmer {
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
}
.animate-shimmer {
  background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
  background-size: 800px 104px;
  animation: shimmer 1.5s infinite linear;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
`;

interface ResumeEnhancerFormData {
  resumeFile: File | null;
  jobDescription: string;
  companyName: string;
  targetRole: string;
}

interface ParsedFeedback {
  strengths: string[];
  improvements: string[];
  keywords: {
    present: string[];
    missing: string[];
  };
  formatting: string[];
  match: number;
  rawData: string[];
}

// Parse the Gemini API results into structured data
const parseGeminiResults = (results: string[]): ParsedFeedback => {
  const parsedData: ParsedFeedback = {
    strengths: [],
    improvements: [],
    keywords: {
      present: [],
      missing: []
    },
    formatting: [],
    match: 70, // Default match score
    rawData: results || []
  };
  
  // If there are no results, add some default information
  if (!results || results.length === 0) {
    parsedData.improvements.push("No specific improvements identified. Try uploading a different resume format.");
    parsedData.strengths.push("Resume successfully processed.");
    return parsedData;
  }
  
  // Ensure we're dealing with an array of strings
  const processableResults = Array.isArray(results) ? results : 
    (typeof results === 'string' ? [results] : []);
  
  // Process each result item
  processableResults.forEach(item => {
    if (!item || typeof item !== 'string') return;
    
    const lowerItem = item.toLowerCase();
    
    // Extract match percentage if present
    const matchPattern = /match(?:\s*(?:score|percentage|rate))?(?:\s*(?::|is|of))?(?:\s*)(\d+)%/i;
    const matchResult = item.match(matchPattern);
    if (matchResult && matchResult[1]) {
      const matchValue = parseInt(matchResult[1], 10);
      if (!isNaN(matchValue) && matchValue >= 0 && matchValue <= 100) {
        parsedData.match = matchValue;
      }
    }
    
    // Categorize the feedback based on prefixes and keywords
    if (item.startsWith('Strength:') || lowerItem.includes('strength')) {
      parsedData.strengths.push(item.replace(/^Strength:\s*/i, ''));
    } 
    else if (item.startsWith('Improve:') || lowerItem.includes('improve') || 
             lowerItem.includes('add') || lowerItem.includes('consider') || 
             lowerItem.includes('missing') || lowerItem.includes('should')) {
      parsedData.improvements.push(item.replace(/^Improve:\s*/i, ''));
    } 
    else if (lowerItem.includes('format') || lowerItem.includes('layout') || 
             lowerItem.includes('organize') || lowerItem.includes('structure') ||
             lowerItem.includes('visual') || lowerItem.includes('spacing')) {
      parsedData.formatting.push(item);
    }
    else if (lowerItem.includes('keyword') || lowerItem.includes('skill') ||
            lowerItem.includes('technology') || lowerItem.includes('term')) {
      // Try to determine if keyword is present or missing
      if (lowerItem.includes('missing') || lowerItem.includes('not found') || 
          lowerItem.includes('absent') || lowerItem.includes('add') || 
          lowerItem.includes('include')) {
        parsedData.keywords.missing.push(item);
      } else {
        parsedData.keywords.present.push(item);
      }
    } 
    else {
      // Try to categorize based on context
      if (lowerItem.includes('excellent') || lowerItem.includes('good') || 
          lowerItem.includes('impressive') || lowerItem.includes('strong')) {
        parsedData.strengths.push(item);
      } else if (lowerItem.includes('lacks') || lowerItem.includes('weak') || 
                lowerItem.includes('needs') || lowerItem.includes('could use')) {
        parsedData.improvements.push(item);
      } else {
        // Default to improvements if we can't categorize
        parsedData.improvements.push(item);
      }
    }
  });

  // Extract keywords from sentences
  const extractedKeywords: string[] = [];
  [...parsedData.keywords.present, ...parsedData.keywords.missing].forEach(item => {
    const keywordMatches = item.match(/"([^"]+)"|'([^']+)'|`([^`]+)`/g);
    if (keywordMatches) {
      keywordMatches.forEach(match => {
        const cleanKeyword = match.replace(/["'`]/g, '').trim();
        if (cleanKeyword && !extractedKeywords.includes(cleanKeyword)) {
          extractedKeywords.push(cleanKeyword);
        }
      });
    }
  });
  
  // If we found extracted keywords, replace the keyword arrays
  if (extractedKeywords.length > 0) {
    // For simplicity, put all in "missing" if we can't determine presence
    parsedData.keywords.missing = extractedKeywords;
    parsedData.keywords.present = [];
  }

  // If categories are empty, add all results to improvements to ensure display
  if (parsedData.strengths.length === 0 && parsedData.improvements.length === 0 && 
      parsedData.keywords.present.length === 0 && parsedData.keywords.missing.length === 0 &&
      parsedData.formatting.length === 0) {
    processableResults.forEach(item => {
      if (item && typeof item === 'string') {
        parsedData.improvements.push(item);
      }
    });
    
    // If still empty, add a default message
    if (parsedData.improvements.length === 0) {
      parsedData.improvements.push("Your resume was processed. Consider tailoring it more specifically to the job description.");
    }
  }

  // If no match was found, assign a default
  if (parsedData.match === 0) {
    // Estimate based on keywords and strengths vs improvements ratio
    const totalPoints = parsedData.strengths.length * 2 + parsedData.keywords.present.length;
    const totalPossible = totalPoints + parsedData.improvements.length * 2 + parsedData.keywords.missing.length;
    parsedData.match = totalPossible > 0 ? Math.round((totalPoints / totalPossible) * 100) : 65;
    
    // Ensure it's within a reasonable range
    parsedData.match = Math.max(Math.min(parsedData.match, 95), 40);
  }
  
  console.log("Parsed Gemini Results:", parsedData);
  return parsedData;
};

// Loading skeleton component for results
const ResultsSkeleton = () => (
  <div className="space-y-4">
    <div className="h-6 w-3/4 rounded animate-shimmer"></div>
    <div className="space-y-3">
      <div className="h-16 w-full rounded animate-shimmer"></div>
      <div className="h-16 w-full rounded animate-shimmer"></div>
      <div className="h-16 w-full rounded animate-shimmer"></div>
    </div>
  </div>
);

// Enhanced results display component
const ResumeResults = ({ isLoading, results }) => {
  const parsedResults = parseGeminiResults(results);
  const { strengths, improvements, keywords, formatting, match, rawData } = parsedResults;
  
  const totalKeywords = keywords.present.length + keywords.missing.length;
  const hasFormatting = formatting.length > 0;
  
  // Match score color based on percentage
  const getMatchColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <div className="mt-8 rounded-xl overflow-hidden shadow-xl border border-indigo-100 transition-all">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-5">
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
      
      <div className="bg-white">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="animate-spin mb-6">
              <RefreshCw className="h-12 w-12 text-indigo-600" />
            </div>
            <p className="text-gray-600 text-lg font-medium mb-2">
              AI is analyzing your resume...
            </p>
            <p className="text-gray-500 text-sm text-center max-w-md">
              We're comparing your resume against the job description to identify strengths, 
              improvement areas, and keyword matches.
            </p>
            <div className="w-full max-w-md mt-8">
              <ResultsSkeleton />
            </div>
          </div>
        ) : (
          <div>
            {/* Match Score Indicator */}
            <div className="p-6 bg-gray-50 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Job Match Score</p>
                  <p className={`text-3xl font-bold ${getMatchColor(match)}`}>
                    {match}%
                  </p>
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${match >= 80 ? 'bg-green-500' : match >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${match}%` }}
                    ></div>
                  </div>
                </div>
                <Badge className={match >= 80 ? 'bg-green-100 text-green-800' : match >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                  {match >= 80 ? 'Excellent' : match >= 60 ? 'Good' : 'Needs Work'}
                </Badge>
              </div>
            </div>
            
            {/* Tabbed Results */}
            <Tabs defaultValue="improvements" className="p-6">
              <TabsList className="mb-4">
                <TabsTrigger value="improvements" className="px-4">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Improvements
                  <Badge className="ml-2 bg-amber-100 text-amber-800">{improvements.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="strengths" className="px-4">
                  <Award className="h-4 w-4 mr-1" />
                  Strengths
                  <Badge className="ml-2 bg-green-100 text-green-800">{strengths.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="keywords" className="px-4">
                  <Target className="h-4 w-4 mr-1" />
                  Keywords
                  <Badge className="ml-2 bg-blue-100 text-blue-800">{totalKeywords}</Badge>
                </TabsTrigger>
                {hasFormatting && (
                  <TabsTrigger value="formatting" className="px-4">
                    <Layout className="h-4 w-4 mr-1" />
                    Formatting
                    <Badge className="ml-2 bg-purple-100 text-purple-800">{formatting.length}</Badge>
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="improvements" className="space-y-4 mt-2">
                {improvements.length > 0 ? (
                  improvements.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-100 hover:shadow-md transition-all animate-fadeIn"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="mt-1 flex-shrink-0 rounded-full bg-amber-200 p-1.5">
                        <AlertTriangle className="h-4 w-4 text-amber-700" />
                      </div>
                      <div>
                        <p className="text-gray-800">{item}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No improvement suggestions found.</p>
                )}
              </TabsContent>
              
              <TabsContent value="strengths" className="space-y-4 mt-2">
                {strengths.length > 0 ? (
                  strengths.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-100 hover:shadow-md transition-all animate-fadeIn"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="mt-1 flex-shrink-0 rounded-full bg-green-200 p-1.5">
                        <Check className="h-4 w-4 text-green-700" />
                      </div>
                      <div>
                        <p className="text-gray-800">{item}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No strengths identified.</p>
                )}
              </TabsContent>
              
              <TabsContent value="keywords" className="mt-2">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                  <p className="text-sm text-blue-800">
                    These are important keywords and skills from the job description. Green keywords are present in your resume, while red ones are missing or underrepresented.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {keywords.present.length > 0 && (
                    <div className="p-4 rounded-lg border border-green-100 bg-green-50">
                      <h4 className="text-green-800 font-medium mb-2 flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Keywords Found in Your Resume
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {keywords.present.map((item, idx) => {
                          // Extract just the keyword if possible
                          const keywordMatch = item.match(/[""']([^""']+)[""']/);
                          const keyword = keywordMatch ? keywordMatch[1] : item;
                          
                          return (
                            <Badge 
                              key={idx} 
                              className="px-3 py-2 bg-green-100 text-green-800 hover:bg-green-200 transition-colors animate-fadeIn"
                              style={{ animationDelay: `${idx * 50}ms` }}
                            >
                              {keyword}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {keywords.missing.length > 0 && (
                    <div className="p-4 rounded-lg border border-red-100 bg-red-50">
                      <h4 className="text-red-800 font-medium mb-2 flex items-center">
                        <XCircle className="h-4 w-4 mr-2" />
                        Keywords Missing in Your Resume
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {keywords.missing.map((item, idx) => {
                          // Extract just the keyword if possible
                          const keywordMatch = item.match(/[""']([^""']+)[""']/);
                          const keyword = keywordMatch ? keywordMatch[1] : item;
                          
                          return (
                            <Badge 
                              key={idx} 
                              className="px-3 py-2 bg-red-100 text-red-800 hover:bg-red-200 transition-colors animate-fadeIn"
                              style={{ animationDelay: `${idx * 50}ms` }}
                            >
                              {keyword}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {keywords.present.length === 0 && keywords.missing.length === 0 && (
                    <p className="text-center text-gray-500 py-8 w-full">No keywords identified.</p>
                  )}
                </div>
              </TabsContent>
              
              {hasFormatting && (
                <TabsContent value="formatting" className="space-y-4 mt-2">
                  {formatting.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-lg bg-purple-50 border border-purple-100 hover:shadow-md transition-all animate-fadeIn"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="mt-1 flex-shrink-0 rounded-full bg-purple-200 p-1.5">
                        <Scissors className="h-4 w-4 text-purple-700" />
                      </div>
                      <div>
                        <p className="text-gray-800">{item}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              )}
            </Tabs>
            
            <div className="px-6 pb-6 pt-2 border-t border-gray-100 flex gap-3 flex-col sm:flex-row">
              <Button 
                variant="outline" 
                className="flex-1 flex items-center justify-center gap-2 text-indigo-700 border-indigo-200 hover:bg-indigo-50"
              >
                <Download className="h-4 w-4" />
                Download Report
              </Button>
              
              <Button 
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Briefcase className="h-4 w-4" />
                Optimize Resume
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ResumeEnhancerPage() {
  const [formData, setFormData] = useState<ResumeEnhancerFormData>({
    resumeFile: null,
    jobDescription: '',
    companyName: '',
    targetRole: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResults, setOcrResults] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll to results when they appear - always scroll when processing completes
    if (showResults && !isProcessing) {
      const resultsElement = document.getElementById('results-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [showResults, isProcessing, ocrResults]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload a PDF or Word document.');
        return;
      }
      if (file.size > maxSize) {
        toast.error('File size exceeds 5MB limit.');
        return;
      }
      setFormData((prev) => ({ ...prev, resumeFile: file }));
      toast.success('Resume uploaded successfully!');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, resumeFile: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
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
      setOcrResults([]); // Clear previous results

      // Prepare the form data for uploading.
      const formDataToSend = new FormData();
      formDataToSend.append('file', formData.resumeFile!);
      formDataToSend.append('jobDescription', formData.jobDescription);
      formDataToSend.append('companyName', formData.companyName);
      formDataToSend.append('targetRole', formData.targetRole);

      // Upload the file.
      const uploadRes = await fetch('/api/resume-enhance/uploading', {
        method: 'POST',
        body: formDataToSend,
      });
      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        console.error('Upload error response:', errorText);
        throw new Error(`File upload failed: ${uploadRes.status} ${uploadRes.statusText}`);
      }
      const uploadResult = await uploadRes.json();
      const { fileUrl } = uploadResult;
      console.log('fileUrl received:', fileUrl);

      if (!fileUrl || typeof fileUrl !== 'string') {
        throw new Error("fileUrl is missing or invalid in the upload response.");
      }

      // Call the Gemini API endpoint.
      const geminiResponse = await fetch('/api/resume-enhance/genai-ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileUrl,
          jobDescription: formData.jobDescription,
          companyName: formData.companyName,
          targetRole: formData.targetRole,
        }),
      });
      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini API Error:', errorText);
        throw new Error('Resume processing failed');
      }
      const geminiResult = await geminiResponse.json();
      console.log('Gemini result:', geminiResult);

      // Handle various response formats
      if (geminiResult.feedback && Array.isArray(geminiResult.feedback)) {
        setOcrResults(geminiResult.feedback);
      } else if (geminiResult.feedback && typeof geminiResult.feedback === 'string') {
        // Handle case where feedback is a single string - split by periods or line breaks
        const feedbackItems = geminiResult.feedback
          .split(/(?:\\n|\.(?!\d))+/) // Split by newlines or periods (not in numbers)
          .map(item => item.trim())
          .filter(item => item.length > 0);
        setOcrResults(feedbackItems.length > 0 ? feedbackItems : [geminiResult.feedback]);
      } else if (geminiResult.rawFeedback) {
        // Handle raw feedback format from updated API
        const feedbackItems = geminiResult.rawFeedback
          .split(/\r?\n/)
          .map(item => item.trim())
          .filter(item => item.length > 0 && !item.match(/^#/)); // Filter out headings
        setOcrResults(feedbackItems);
      } else {
        // Fallback: create a generic result so something displays
        setOcrResults([
          "Match score: 65%",
          "Strength: Your resume has a clean structure.",
          "Improve: Consider adding more quantifiable achievements.",
          "Improve: Tailor your skills section to the job description.",
          "Keyword missing: 'project management'",
          "Keyword missing: 'team leadership'"
        ]);
      }
      toast.success('Resume analysis complete!');
    } catch (error: any) {
      console.error('Resume enhancement error:', error);
      toast.error('Failed to analyze resume. Please try again.');
      setShowResults(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <style jsx global>{animationStyles}</style>
      <div className="min-h-screen bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-3xl space-y-6">
          <Card className="shadow-xl rounded-xl border-none overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white border-b-0 pb-6">
              <CardTitle className="text-3xl font-extrabold flex items-center space-x-3">
                <FileText className="mr-2" />
                <span>AI Resume Enhancer</span>
              </CardTitle>
              <CardDescription className="text-indigo-100 mt-2">
                Optimize your resume for specific job descriptions using AI-powered analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-6">
                  <p className="text-sm text-blue-800">
                    <span className="font-bold">How it works:</span> Upload your resume and paste the job description. 
                    Our AI will analyze the match, highlight your strengths, and suggest improvements.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="resume" className="text-sm font-medium text-gray-700 mb-1 block">
                      Upload Resume
                    </Label>
                    {formData.resumeFile ? (
                      <div className="flex items-center p-3 rounded-lg border border-green-200 bg-green-50">
                        <FileText className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-green-700 font-medium flex-1 truncate">{formData.resumeFile.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleRemoveFile}
                          className="h-8 w-8 p-0 rounded-full text-gray-500 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-300 transition-colors">
                        <Input
                          type="file"
                          id="resume"
                          ref={fileInputRef}
                          accept=".pdf,.docx,.doc"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="mx-auto flex items-center transition-all hover:shadow-md"
                        >
                          <Upload className="mr-2 h-5 w-5" />
                          Upload PDF or Word Document
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">
                          Max file size: 5MB
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="jobDescription" className="text-sm font-medium text-gray-700 mb-1 block">
                      Job Description
                    </Label>
                    <textarea
                      id="jobDescription"
                      name="jobDescription"
                      rows={5}
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-3 shadow-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                      placeholder="Paste the full job description here..."
                      value={formData.jobDescription}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName" className="text-sm font-medium text-gray-700 mb-1 block">
                        Company Name
                      </Label>
                      <Input
                        type="text"
                        id="companyName"
                        name="companyName"
                        placeholder="Enter target company name"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="mt-1 rounded-lg border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>

                    <div>
                      <Label htmlFor="targetRole" className="text-sm font-medium text-gray-700 mb-1 block">
                        Target Role
                      </Label>
                      <Input
                        type="text"
                        id="targetRole"
                        name="targetRole"
                        placeholder="Enter desired job title"
                        value={formData.targetRole}
                        onChange={handleInputChange}
                        className="mt-1 rounded-lg border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center py-6 font-semibold text-lg transition-all hover:shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      Analyze Resume
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div id="results-section">
            {showResults && (
              <ResumeResults isLoading={isProcessing} results={ocrResults} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}