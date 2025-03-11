// src/components/ui/ResultsSkeleton.tsx
import React from 'react';

export const ResultsSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="h-8 w-3/4 rounded-md animate-shimmer"></div>
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div 
          key={i} 
          className="h-20 w-full rounded-md animate-shimmer" 
          style={{ animationDelay: `${i * 0.3}s` }}
        ></div>
      ))}
    </div>
  </div>
);

