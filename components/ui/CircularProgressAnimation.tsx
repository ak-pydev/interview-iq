// src/components/ui/CircularProgressAnimation.tsx
import React from 'react';

interface CircularProgressAnimationProps {
  progress: number;
}

export const CircularProgressAnimation: React.FC<CircularProgressAnimationProps> = ({ progress }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="progress-circular relative w-20 h-20 mx-auto mt-4">
      <svg viewBox="0 0 100 100">
        <circle 
          className="track" 
          cx="50" 
          cy="50" 
          r={radius} 
          fill="none" 
          stroke="#cbd5e1" 
          strokeWidth="4" 
        />
        <circle 
          className="progress" 
          cx="50" 
          cy="50" 
          r={radius} 
          fill="none" 
          stroke="url(#gradient)" 
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.35s' }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-indigo-600 font-bold text-lg">{progress}%</span>
      </div>
    </div>
  );
};