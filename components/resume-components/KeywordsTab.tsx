import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, LightbulbIcon } from 'lucide-react';

interface KeywordsData {
  matching: string[];
  missing: string[];
}

interface KeywordsTabProps {
  keywords: KeywordsData;
}

const KeywordsTab: React.FC<KeywordsTabProps> = ({ keywords }) => {
  const { matching, missing } = keywords;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matching Keywords */}
        <div className="glass-morphism rounded-xl p-4">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-700/20 rounded-full mr-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-lg font-medium text-white">Matching Keywords</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {matching.map((keyword, idx) => (
              <Badge 
                key={idx} 
                className="bg-green-900/30 text-green-300 border border-green-500/20 py-1.5 px-3"
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Missing Keywords */}
        <div className="glass-morphism rounded-xl p-4">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-red-700/20 rounded-full mr-2">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-white">Missing Keywords</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {missing.map((keyword, idx) => (
              <Badge 
                key={idx} 
                className="bg-red-900/30 text-red-300 border border-red-500/20 py-1.5 px-3"
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-500/30 mt-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-800/50 rounded-full mt-0.5">
            <LightbulbIcon className="h-4 w-4 text-indigo-300" />
          </div>
          <div>
            <p className="text-indigo-200 text-sm">
              <span className="font-semibold">Pro Tip:</span> Include these missing keywords in your resume to 
              significantly increase your match score. Make sure to include them naturally within relevant 
              experience or skills sections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordsTab;