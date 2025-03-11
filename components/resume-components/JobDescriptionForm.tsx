import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, Target } from 'lucide-react';

interface FormData {
  resumeFile: File | null;
  jobDescription: string;
  companyName: string;
  targetRole: string;
}

interface JobDescriptionFormProps {
  formData: FormData;
  onChange: (formData: FormData) => void;
}

const JobDescriptionForm: React.FC<JobDescriptionFormProps> = ({ formData, onChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label 
          htmlFor="jobDescription" 
          className="text-sm font-medium text-gray-700 mb-2 block label-effect"
        >
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
          <Label 
            htmlFor="companyName" 
            className="text-sm font-medium text-gray-700 mb-2 block label-effect"
          >
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
          <Label 
            htmlFor="targetRole" 
            className="text-sm font-medium text-gray-700 mb-2 block label-effect"
          >
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
  );
};

export default JobDescriptionForm;