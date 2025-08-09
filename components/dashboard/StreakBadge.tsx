import React from 'react';
import { Flame } from 'lucide-react';

interface StreakBadgeProps { streak: number; className?: string; }
export const StreakBadge: React.FC<StreakBadgeProps> = ({ streak, className }) => {
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-md bg-orange-600/20 text-orange-300 text-sm font-medium ${className||''}`}> 
      <Flame className="w-4 h-4" /> {streak}d
    </div>
  );
};
