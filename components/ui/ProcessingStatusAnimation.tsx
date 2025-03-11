// src/components/ui/ProcessingStatusAnimation.tsx
import React from 'react';
import { FileText, Code, Cpu, BarChart3, Award, Target, Zap } from 'lucide-react';

interface ProcessingStatusAnimationProps {
  step: number;
}

export const ProcessingStatusAnimation: React.FC<ProcessingStatusAnimationProps> = ({ step }) => {
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
        <p className="text-sm text-indigo-700 font-medium animate-ellipsis">
          {steps[step % steps.length].text}
        </p>
      </div>
    </div>
  );
};