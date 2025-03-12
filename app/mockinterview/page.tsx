import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GradientText } from '@/components/ui/GradientText';
import { ThinkingAnimation } from '@/components/ui/ThinkingAnimation';

// Resume Components
import ResumeUploader from '@/components/resume-components/ResumeUploader';
import JobDescriptionForm from '@/components/resume-components/JobDescriptionForm';

interface FormData {
  jobTitle: string;
  companyName: string;
  resumeFile: File | null;
  jobDescription: string;
}

export default function MockInterviewPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'technical' | 'behavior'>('technical');
  
  const [formData, setFormData] = useState<FormData>({
    jobTitle: '',
    companyName: '',
    resumeFile: null,
    jobDescription: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResumeUpload = (file: File | null) => {
    setFormData((prev) => ({ ...prev, resumeFile: file }));
  };

  const handleJobDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, jobDescription: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.resumeFile) {
      alert('Please upload a resume before starting the interview.');
      return;
    }
    setIsLoading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', formData.resumeFile);
      uploadData.append('jobTitle', formData.jobTitle);
      uploadData.append('companyName', formData.companyName);
      uploadData.append('jobDescription', formData.jobDescription);
      uploadData.append('interviewType', activeTab);
      
      const response = await fetch('/api/resume-enhance/upload', {
        method: 'POST',
        body: uploadData,
      });
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      router.push(`/mockinterview/${activeTab}?sessionId=${data.sessionId}`);
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to start interview. Please try again.');
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

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Setup Your Interview</CardTitle>
          <CardDescription>Provide your resume and job details to create a personalized interview experience</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="behavior">Behavioral</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium mb-2">Job Title</label>
                <Input id="jobTitle" name="jobTitle" placeholder="e.g. Frontend Developer" value={formData.jobTitle} onChange={handleInputChange} required />
              </div>
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium mb-2">Company Name</label>
                <Input id="companyName" name="companyName" placeholder="e.g. Acme Corp" value={formData.companyName} onChange={handleInputChange} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Upload Your Resume</label>
              <ResumeUploader onChange={handleResumeUpload} />
              <p className="text-sm text-muted-foreground mt-2">Supported formats: PDF, DOCX, DOC (Max 5MB)</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Job Description</label>
              <JobDescriptionForm value={formData.jobDescription} onChange={handleJobDescriptionChange} minRows={5} />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Link href="/" passHref>
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button onClick={() => document.querySelector('form')?.submit()} disabled={isLoading}>
            {isLoading ? <ThinkingAnimation message="Preparing interview..." stage="loading" /> : 'Start Interview'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
