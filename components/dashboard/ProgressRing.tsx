import React from 'react';

interface ProgressRingProps {
  size?: number;
  stroke?: number;
  progress: number; // 0-1
  centerContent?: React.ReactNode;
  gradientId?: string;
  trackColor?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  size = 140,
  stroke = 6,
  progress,
  centerContent,
  gradientId = 'progress-ring-gradient',
  trackColor = 'text-gray-800'
}) => {
  const radius = 50 - stroke/2;
  const circ = 2 * Math.PI * radius;
  const dash = Math.min(Math.max(progress, 0), 1) * circ;
  return (
    <div style={{ width: size, height: size }} className="relative">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth={stroke} fill="none" className={trackColor} />
        <circle cx="50" cy="50" r={radius} stroke={`url(#${gradientId})`} strokeWidth={stroke} fill="none" strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-center">
        {centerContent}
      </div>
    </div>
  );
};
