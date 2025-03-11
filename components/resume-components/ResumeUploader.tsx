import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Upload, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface ResumeUploaderProps {
  resumeFile: File | null;
  onChange: (file: File | null) => void;
  onRemove: () => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ resumeFile, onChange, onRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      
      onChange(file);
      toast.success('Resume uploaded successfully!', {
        icon: '📄',
        style: { borderRadius: '10px', background: '#4F46E5', color: '#fff' },
      });
    }
  };

  const handleRemoveFile = () => {
    onRemove();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <Label 
        htmlFor="resume" 
        className="text-sm font-medium text-gray-700 mb-2 block label-effect"
      >
        Upload Resume
      </Label>
      
      {resumeFile ? (
        <div className="flex items-center p-3 rounded-lg border border-green-200 bg-green-50 shadow-sm hover:shadow-md transition-all">
          <div className="p-2 bg-green-100 rounded-full mr-3">
            <FileText className="h-5 w-5 text-green-600" />
          </div>
          <span className="text-green-700 font-medium flex-1 truncate">
            {resumeFile.name}
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
  );
};

export default ResumeUploader;