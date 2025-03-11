import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';

interface StrengthsTabProps {
  strengths: string[];
}

const StrengthsTab: React.FC<StrengthsTabProps> = ({ strengths }) => {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-indigo-900/40 to-green-900/20 rounded-xl p-6 border border-green-500/20">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-green-700/20 rounded-full mr-3">
            <Award className="h-6 w-6 text-green-400" />
          </div>
          <h3 className="text-xl font-medium text-white">Your Resume Strengths</h3>
        </div>
        
        <div className="space-y-3">
          {strengths.map((strength, idx) => (
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
    </div>
  );
};

export default StrengthsTab;