"use client"

import { MoodCheckIn } from './MoodCheckIn';
import { BreathingExercise } from './BreathingExercise';
import { MindfulnessMoment } from './MindfulnessMoment';

interface QuickActionsProps {
  onActionComplete?: (action: string, data: any) => void;
}

export function QuickActions({ onActionComplete }: QuickActionsProps) {
  const handleMoodComplete = (mood: any) => {
    onActionComplete?.('mood-checkin', mood);
  };

  const handleBreathingComplete = (pattern: any, cycles: number) => {
    onActionComplete?.('breathing-exercise', { pattern, cycles });
  };

  const handleMindfulnessComplete = (exercise: any) => {
    onActionComplete?.('mindfulness-moment', exercise);
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-lg p-8 border border-purple-500/10">
      <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MoodCheckIn onComplete={handleMoodComplete} />
        <BreathingExercise onComplete={handleBreathingComplete} />
        <MindfulnessMoment onComplete={handleMindfulnessComplete} />
      </div>
    </div>
  );
}

export { MoodCheckIn, BreathingExercise, MindfulnessMoment };
