// src/components/ui/ThinkingAnimation.tsx
import React from 'react';
import { Rocket, Cpu, Brain } from 'lucide-react';

interface ThinkingAnimationProps {
  message: string;
  stage: number;
}

export const ThinkingAnimation: React.FC<ThinkingAnimationProps> = ({ message, stage }) => {
  const renderAnimation = () => {
    switch (stage % 3) {
      case 0: return <Rocket className="h-16 w-16 text-indigo-500 animate-spin-slow drop-shadow-lg" />;
      case 1: return <Cpu className="h-16 w-16 text-indigo-500 animate-pulse drop-shadow-lg" />;
      case 2: return <Brain className="h-16 w-16 text-indigo-500 animate-thinking drop-shadow-lg" />;
      default: return <Rocket className="h-16 w-16 text-indigo-500 animate-spin-slow drop-shadow-lg" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <div className="relative mb-4 p-4 bg-indigo-50 rounded-full shadow-md">
        {renderAnimation()}
      </div>
      <p className="text-indigo-800 text-lg font-medium animate-ellipsis bg-indigo-50 px-4 py-2 rounded-full shadow-sm">
        {message}
      </p>
    </div>
  );
};



