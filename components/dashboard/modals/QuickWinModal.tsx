"use client";
import React, { useState } from 'react';
import { X, RefreshCcw } from 'lucide-react';
import { useDailyTasks } from '@/hooks/useDailyTasks';
import { useAuth } from '@/contexts/AuthContext';

interface QuickWinModalProps {
  onClose: () => void;
  onComplete?: () => void;
}

const WIN_LIBRARY = [
  { icon: '🌱', text: 'Take 3 deep belly breaths', category: 'calm' },
  { icon: '💧', text: 'Drink a full glass of water', category: 'physio' },
  { icon: '📨', text: 'Send yourself one kind message', category: 'self-talk' },
  { icon: '🧍‍♂️', text: 'Stand up & stretch for 30 seconds', category: 'movement' },
  { icon: '🧠', text: 'Label your current emotion out loud', category: 'awareness' },
  { icon: '📝', text: 'Write one boundary you respected recently', category: 'boundaries' },
  { icon: '🎧', text: 'Play 20 seconds of a calming sound', category: 'sensory' },
  { icon: '🤍', text: 'Put a hand over heart & breathe 5x', category: 'self-soothe' }
];

function randomSubset(n: number) {
  const shuffled = [...WIN_LIBRARY].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export function QuickWinModal({ onClose, onComplete }: QuickWinModalProps) {
  const { markTask, tasks } = useDailyTasks();
  const { user } = useAuth();
  const isPremium = user?.subscriptionTier === 'premium';
  const [wins, setWins] = useState(() => randomSubset(3));
  const [selected, setSelected] = useState<string | null>(null);

  const handleComplete = () => {
    markTask('quickWin');
    onComplete?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-gray-900/90 border border-purple-500/30 rounded-xl shadow-2xl p-6 animate-in fade-in zoom-in">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-200" aria-label="Close">
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">Quick Win</h2>
  <p className="text-xs text-gray-300 mb-4">Pick one tiny action to build momentum. Consistency &gt; intensity.</p>
        <div className="space-y-3 mb-4">
          {wins.map(w => (
            <button
              key={w.text}
              onClick={() => setSelected(w.text)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md border text-left text-sm transition ${selected === w.text ? 'bg-purple-600/30 border-purple-500 text-purple-100' : 'bg-gray-800/60 border-gray-700 hover:bg-gray-800'}`}
            >
              <span className="flex items-center space-x-2"><span className="text-lg">{w.icon}</span><span>{w.text}</span></span>
              {selected === w.text && <span className="text-xs text-purple-200">Selected</span>}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setWins(randomSubset(3))}
            className="flex items-center space-x-1 text-xs text-gray-300 hover:text-white"
          >
            <RefreshCcw className="h-4 w-4" /> <span>Shuffle</span>
          </button>
          {tasks.quickWin && <span className="text-[11px] text-green-400">Done today</span>}
        </div>
        <button
          onClick={handleComplete}
          disabled={!selected}
          className="w-full py-2.5 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium disabled:opacity-40"
        >
          Mark Complete
        </button>
        {!isPremium && (
          <p className="text-[10px] text-center text-purple-300/70 mt-3">Upgrade for advanced quick win packs & streak boosts.</p>
        )}
      </div>
    </div>
  );
}
