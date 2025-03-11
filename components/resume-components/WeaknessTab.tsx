import React from 'react';
import { Target, AlertTriangle } from 'lucide-react';

interface WeaknessesTabProps {
  weaknesses: string[];
}

const WeaknessesTab: React.FC<WeaknessesTabProps> = ({ weaknesses }) => {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-indigo-900/40 to-amber-900/20 rounded-xl p-6 border border-amber-500/20">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-amber-700/20 rounded-full mr-3">
            <Target className="h-6 w-6 text-amber-400" />
          </div>
          <h3 className="text-xl font-medium text-white">Areas to Improve</h3>
        </div>
        
        <div className="space-y-3">
          {weaknesses.map((weakness, idx) => (
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
    </div>
  );
};

export default WeaknessesTab;