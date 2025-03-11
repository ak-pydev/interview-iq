import React from 'react';
import { AlertTriangle, Search } from 'lucide-react';

interface RecommendationsTabProps {
  feedback: string[];
}

const RecommendationsTab: React.FC<RecommendationsTabProps> = ({ feedback }) => {
  return (
    <div className="space-y-4 mt-2">
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
    </div>
  );
};

export default RecommendationsTab;