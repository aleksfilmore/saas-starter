"use client";
import React from 'react';
import { Trophy, Target, Lock, Sparkles } from 'lucide-react';
import { useHealingHub } from '@/contexts/HealingHubContext';

interface Milestone {
  key: string;
  title: string;
  desc: string;
  required: number; // streak or level threshold
  type: 'streak' | 'level' | 'rituals';
  premium?: boolean;
}

const MILESTONES: Milestone[] = [
  { key: 'streak3', title: '3‑Day Spark', desc: 'Ignited consistency', required: 3, type: 'streak' },
  { key: 'streak7', title: '1 Week Anchor', desc: 'First foundation laid', required: 7, type: 'streak' },
  { key: 'streak14', title: '2 Week Momentum', desc: 'Healing rhythm forming', required: 14, type: 'streak' },
  { key: 'streak30', title: '30 Day Shift', desc: 'Deep neural rewiring begins', required: 30, type: 'streak', premium: true },
  { key: 'level10', title: 'Level 10 Rising', desc: 'XP mastery emerging', required: 10, type: 'level' },
  { key: 'ritual25', title: '25 Rituals Done', desc: 'Practice to pattern', required: 25, type: 'rituals', premium: true }
];

export function MilestonePath() {
  const { streaks, xp, completedRituals } = useHealingHub();
  const ritualStreak = streaks?.rituals || 0;
  const level = xp?.level || 1;
  // completedRituals now provided by hub API (real count)

  function progressFor(m: Milestone) {
    const current = m.type === 'streak' ? ritualStreak : m.type === 'level' ? level : completedRituals;
    return Math.min(1, current / m.required);
  }

  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-purple-200 tracking-wide flex items-center space-x-2"><Target className="h-4 w-4 text-pink-400" /><span>Milestone Path</span></h2>
        <span className="text-[10px] text-gray-400 uppercase">Phase 2</span>
      </div>
      <div className="space-y-3">
        {MILESTONES.map(m => {
          const pct = progressFor(m);
            const done = pct >= 1;
          return (
            <div key={m.key} className={`relative p-3 rounded-lg border flex items-center justify-between ${done ? 'border-green-500/40 bg-green-600/10' : 'border-gray-600 bg-gray-700/30'} ${m.premium && !done ? 'after:absolute after:inset-0 after:bg-gradient-to-r after:from-purple-900/20 after:to-pink-900/20' : ''}`}> 
              <div className="flex items-center space-x-3">
                {done ? <Trophy className="h-5 w-5 text-yellow-400" /> : m.premium ? <Lock className="h-5 w-5 text-pink-400" /> : <Sparkles className="h-5 w-5 text-purple-300" />}
                <div>
                  <p className="text-xs font-medium text-gray-100">{m.title}</p>
                  <p className="text-[10px] text-gray-400">{done ? 'Achieved' : m.desc}</p>
                </div>
              </div>
              <div className="w-28 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${Math.round(pct*100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
