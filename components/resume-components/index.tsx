// src/components/resume-enhancer/AnalysisResults/index.tsx
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Search, Award, Target, LightbulbIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import  {ThinkingAnimation}  from '@/components/ui/ThinkingAnimation';
import  {ProcessingStatusAnimation} from '@/components/ui/ProcessingStatusAnimation';
import  {ResultsSkeleton}  from '@/components/ui/ResultsSkeleton';
import  {CircularProgressAnimation} from '@/components/ui/CircularProgressAnimation';
import MatchScore from '@/components/resume-components/MatchScore';
import KeywordsTab from '@/components/resume-components/KeywordsTab';
import StrengthsTab from '@/components/resume-components/StrengthsTab';
import WeaknessesTab from '@/components/resume-components/WeaknessTab';
import RecommendationsTab from '@/components/resume-components/RecommendationsTab';

interface AnalysisResultsProps {
  isLoading: boolean;
  feedback: string[];
  match: number;
  analysisStage?: number;
}

interface KeywordsData {
  matching: string[];
  missing: string[];
}

interface AnalysisData {
  keywords: KeywordsData;
  strengths: string[];
  weaknesses: string[];
  feedback: string[];
  match: number;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ isLoading, feedback, match, analysisStage = 0 }) => {
  // Sample analysis data - this would come from the API in a real implementation
  const analysisData: AnalysisData = {
    keywords: {
      matching: [
        "React", "JavaScript", "TypeScript", "Frontend Development", 
        "UI/UX", "REST APIs", "Git", "Responsive Design"
      ],
      missing: [
        "GraphQL", "CI/CD", "AWS", "Agile Development", 
        "Docker", "Microservices"
      ]
    },
    strengths: [
      "Strong frontend development skills with React ecosystem",
      "Experience in building responsive and accessible UI components",
      "Good knowledge of modern JavaScript and TypeScript",
      "Experience with state management solutions"
    ],
    weaknesses: [
      "Limited experience with cloud technologies mentioned in the job description",
      "No specific mention of GraphQL which is required for this role",
      "Missing experience with containerization and deployment pipelines",
      "No quantifiable metrics for past achievements"
    ],
    feedback,
    match
  };

  return (
    <div className="mt-8 rounded-xl overflow-hidden shadow-xl glass-card transition-all animate-fadeIn hover:shadow-2xl">
      <div className="gradient-animate px-6 py-5 relative">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Sparkles className="mr-2 h-5 w-5" />
          {isLoading ? 'Analyzing Your Resume...' : 'Resume Enhancement Analysis'}
        </h3>
        {!isLoading && (
          <p className="text-indigo-100 text-sm mt-1">
            Here's how your resume matches the job description
          </p>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-14 px-6 bg-gradient-to-br from-white to-indigo-50 circuit-lines">
          <ThinkingAnimation message="Neural network analyzing your resume" stage={analysisStage} />
          <ProcessingStatusAnimation step={analysisStage % 7} />
          <div className="w-full max-w-md mt-10">
            <ResultsSkeleton />
          </div>
          <CircularProgressAnimation progress={Math.min(Math.round((analysisStage / 10) * 100), 95)} />
        </div>
      ) : (
        <div>
          <div className="p-6 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border-b border-indigo-500/20">
            <MatchScore score={match} />
          </div>
          
          <Tabs defaultValue="keywords" className="p-6 bg-gradient-to-br from-indigo-950/80 to-purple-950/80">
            <TabsList className="mb-4 overflow-x-auto flex w-full bg-white/5 border border-indigo-500/30 rounded-lg p-1">
              <TabsTrigger 
                value="keywords" 
                className="px-4 py-2 whitespace-nowrap transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md"
              >
                <Search className="h-4 w-4 mr-2" />
                Keywords Match
              </TabsTrigger>
              <TabsTrigger 
                value="strengths" 
                className="px-4 py-2 whitespace-nowrap transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md"
              >
                <Award className="h-4 w-4 mr-2" />
                Strengths
              </TabsTrigger>
              <TabsTrigger 
                value="weaknesses" 
                className="px-4 py-2 whitespace-nowrap transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md"
              >
                <Target className="h-4 w-4 mr-2" />
                Areas to Improve
              </TabsTrigger>
              <TabsTrigger 
                value="improvements" 
                className="px-4 py-2 whitespace-nowrap transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md"
              >
                <LightbulbIcon className="h-4 w-4 mr-2" />
                AI Recommendations
                <Badge className="ml-2 bg-indigo-700 text-white border border-indigo-300/20">
                  {feedback.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="keywords">
              <KeywordsTab keywords={analysisData.keywords} />
            </TabsContent>
            
            <TabsContent value="strengths">
              <StrengthsTab strengths={analysisData.strengths} />
            </TabsContent>
            
            <TabsContent value="weaknesses">
              <WeaknessesTab weaknesses={analysisData.weaknesses} />
            </TabsContent>
            
            <TabsContent value="improvements">
              <RecommendationsTab feedback={analysisData.feedback} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;