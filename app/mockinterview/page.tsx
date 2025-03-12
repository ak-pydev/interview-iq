"use client";

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GradientText from '@/components/ui/GradientText';
import { ThinkingAnimation } from '@/components/ui/ThinkingAnimation';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Types
type InterviewType = 'technical' | 'behavior';

interface FormData {
  jobTitle: string;
  companyName: string;
  resumeFile: File | null;
  jobDescription: string;
}

const MockInterviewPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<InterviewType>('technical');
  const [formData, setFormData] = useState<FormData>({
    jobTitle: '',
    companyName: '',
    resumeFile: null,
    jobDescription: ''
  });
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user makes changes
    setError(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit. Please select a smaller file.');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Please upload a PDF or Word document.');
        return;
      }
      
      setFormData(prev => ({ ...prev, resumeFile: file }));
      setError(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit. Please select a smaller file.');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Please upload a PDF or Word document.');
        return;
      }
      
      setFormData(prev => ({ ...prev, resumeFile: file }));
      setError(null);
    }
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, resumeFile: null }));
  };

  const validateForm = (): boolean => {
    if (!formData.resumeFile) {
      setError('Please upload a resume before starting the interview.');
      return false;
    }
    
    if (!formData.jobTitle.trim()) {
      setError('Please enter a job title.');
      return false;
    }
    
    if (!formData.companyName.trim()) {
      setError('Please enter a company name.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    
    // Clear any previous errors
    setError(null);
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const uploadData = new FormData();
      
      if (formData.resumeFile) {
        uploadData.append('file', formData.resumeFile);
      }
      
      uploadData.append('jobTitle', formData.jobTitle);
      uploadData.append('companyName', formData.companyName);
      uploadData.append('jobDescription', formData.jobDescription);
      uploadData.append('interviewType', activeTab);
      
      console.log('Sending form data:', {
        file: formData.resumeFile?.name,
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        interviewType: activeTab
      });
      
      const response = await fetch('/api/resume-enhance/upload', {
        method: 'POST',
        body: uploadData,
      });
      
      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || `Upload failed: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      // Navigate to the appropriate interview type page
      router.push(`/mockinterview/${activeTab}?sessionId=${data.sessionId}`);
    } catch (error) {
      console.error('Error starting interview:', error);
      setError(error instanceof Error ? error.message : 'Failed to start interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          <GradientText>AI-Powered Mock Interview</GradientText>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Practice with our intelligent interview simulator tailored to your resume and target job.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Setup Your Interview</CardTitle>
          <CardDescription>
            Provide your resume and job details to create a personalized interview experience
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8" id="interviewForm">
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as InterviewType)}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="technical">Technical Interview</TabsTrigger>
                <TabsTrigger value="behavior">Behavioral Interview</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input 
                  id="jobTitle" 
                  name="jobTitle" 
                  placeholder="e.g. Frontend Developer" 
                  value={formData.jobTitle} 
                  onChange={handleInputChange} 
                  className="mt-2"
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input 
                  id="companyName" 
                  name="companyName" 
                  placeholder="e.g. Acme Corp" 
                  value={formData.companyName} 
                  onChange={handleInputChange} 
                  className="mt-2"
                  required 
                />
              </div>
            </div>

            <div>
              <Label htmlFor="resumeUpload">Upload Your Resume</Label>
              <div 
                className={`mt-2 border-2 border-dashed rounded-md p-6 text-center ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                {formData.resumeFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-sm font-medium">{formData.resumeFile.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {(formData.resumeFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRemoveFile}
                      className="mt-2"
                    >
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <>
                    <input
                      id="resumeUpload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label 
                      htmlFor="resumeUpload" 
                      className="flex flex-col items-center gap-2 cursor-pointer"
                    >
                      <div className="text-sm font-medium">
                        Drag and drop your resume here or click to browse
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Supported formats: PDF, DOCX, DOC (Max 5MB)
                      </div>
                      <Button type="button" variant="outline" size="sm" className="mt-2">
                        Select File
                      </Button>
                    </label>
                  </>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea 
                id="jobDescription" 
                name="jobDescription" 
                placeholder="Paste the job description here..."
                value={formData.jobDescription} 
                onChange={handleInputChange} 
                className="mt-2"
                rows={8}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Adding a job description helps tailor the interview to the specific role requirements.
              </p>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-4">
          <Link href="/">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button 
            onClick={() => handleSubmit()} 
            disabled={isLoading}
          >
            {isLoading ? (
              <ThinkingAnimation message="Preparing interview..." stage={1} />
            ) : (
              'Start Interview'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MockInterviewPage;