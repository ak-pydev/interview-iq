import React from 'react';
import { Badge } from '@/components/ui/badge';

interface MatchScoreProps {
  score: number;
}

const MatchScore: React.FC<MatchScoreProps> = ({ score }) => {
  const getMatchColor = (score: number): string => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMatchBadgeColor = (score: number): string => {
    if (score >= 80) return 'bg-green-100 text-green-800 border border-green-300';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    return 'bg-red-100 text-red-800 border border-red-300';
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
        <p className="text-gray-300 text-sm">Job Match Score</p>
        <p className={`text-3xl font-bold ${getMatchColor(score)} neon-text`} data-text={`${score}%`}>
          {score}%
        </p>
      </div>
      <div className="flex-1 max-w-md mx-auto md:mx-4">
        <div className="h-4 bg-gray-800/60 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className={`h-full rounded-full ${
              score >= 80 ? 'bg-gradient-to-r from-green-500 to-green-600' : 
              score >= 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
              'bg-gradient-to-r from-red-500 to-red-600'
            } shadow-inner`}
            style={{ width: `${score}%`, transition: 'width 1s ease-out' }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
          <span>Needs Work</span>
          <span>Good Match</span>
          <span>Excellent</span>
        </div>
      </div>
      <Badge className={`px-3 py-1.5 ${getMatchBadgeColor(score)} shadow-sm`}>
        {score >= 80 ? 'Excellent Match' : score >= 60 ? 'Good Match' : 'Needs Improvement'}
      </Badge>
    </div>
  );
};

export default MatchScore;