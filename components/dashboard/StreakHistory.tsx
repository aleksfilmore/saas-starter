"use client";
import React from 'react';
import { useHealingHub } from '@/contexts/HealingHubContext';

// Visualizes last ~14 days streak history coming from hub API
export function StreakHistory() {
  const { streakHistory } = useHealingHub();
  if (!streakHistory || streakHistory.length === 0) return null;
  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
      <h2 className="text-sm font-semibold text-purple-200 tracking-wide mb-3">Streak Timeline</h2>
      <div className="flex items-end gap-1">
        {streakHistory.map(day => {
          const completed = !!day.completed;
          return (
            <div key={day.date} className="flex flex-col items-center w-6 group">
              <div
                className={`w-full rounded-md transition h-10 flex items-end justify-center pb-1 text-[9px] font-medium tracking-wide ${
                  completed
                    ? 'bg-gradient-to-b from-pink-500 via-purple-500 to-indigo-500 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
                title={`${day.date}${completed ? ' – completed' : ' – missed'}`}
              >
                {completed ? '✔' : ''}
              </div>
              <span className="mt-1 text-[9px] text-gray-400">
                {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' }).slice(0,2)}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[10px] text-gray-400">Shows the last two weeks of ritual completion. Keep the chain alive.</p>
    </div>
  );
}
