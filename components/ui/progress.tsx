'use client';

import * as React from "react";

interface ProgressProps {
  value?: number;
  className?: string;
}

export function Progress({ value = 0, className = "" }: ProgressProps) {
  return (
    <div className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-800 ${className}`}>
      <div 
        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
