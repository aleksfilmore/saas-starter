"use client";
import React from 'react';
import { useHealingHub } from '@/contexts/HealingHubContext';

// Combined momentum visualization: ritual streak arc, no-contact arc, inner level progress circle.
export function MomentumRing() {
  const { streaks, xp, badges } = useHealingHub();
  const ritual = streaks?.rituals || 0;
  const noContact = streaks?.noContact || 0;
  const level = xp?.level || 1;
  const levelFrac = xp?.progressFraction || 0;
  const ritualFrac = Math.min(1, ritual / 30); // normalize to 30-day visible target
  const noContactFrac = Math.min(1, noContact / 30);
  const size = 150;
  const center = size / 2;
  const radiusOuter = 70;
  const circumference = 2 * Math.PI * radiusOuter;
  const gap = 8; // stroke gap offset for layering
  const strokeWidth = 10;

  const ritualDash = ritualFrac * circumference;
  const noContactDash = noContactFrac * circumference;
  const nextBadge = (badges || []).find(b => !b.unlocked);
  const xpDelta = xp ? xp.nextLevelXP - xp.current : 0;

  return (
    <div className="relative rounded-xl border border-purple-700/40 bg-gray-900/40 backdrop-blur-sm p-5 flex flex-col items-center shadow-lg">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background circle */}
          <circle cx={center} cy={center} r={radiusOuter} stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} fill="none" />
          {/* Ritual streak arc */}
          <circle
            cx={center}
            cy={center}
            r={radiusOuter}
            stroke="url(#grad-ritual)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${ritualDash} ${circumference - ritualDash}`}
          />
          {/* No-contact arc (slightly inset) */}
          <circle
            cx={center}
            cy={center}
            r={radiusOuter - gap}
            stroke="url(#grad-nc)"
            strokeWidth={strokeWidth - 2}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${noContactDash} ${circumference - noContactDash}`}
          />
          {/* Level progress inner ring */}
          <circle
            cx={center}
            cy={center}
            r={radiusOuter - gap * 2}
            stroke="url(#grad-level)"
            strokeWidth={strokeWidth - 4}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${levelFrac * circumference} ${circumference - levelFrac * circumference}`}
          />
          <defs>
            <linearGradient id="grad-ritual" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="grad-nc" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <linearGradient id="grad-level" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <div className="text-[10px] uppercase tracking-wider text-purple-300/70">Level</div>
          <div className="text-xl font-semibold bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent">{level}</div>
          <div className="text-[10px] text-gray-400">{Math.round(levelFrac*100)}%</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center w-full">
        <div>
          <div className="text-sm font-medium text-pink-300">{ritual}</div>
          <div className="text-[10px] uppercase tracking-wide text-gray-400">Ritual Streak</div>
        </div>
        <div>
          <div className="text-sm font-medium text-cyan-300">{noContact}</div>
          <div className="text-[10px] uppercase tracking-wide text-gray-400">No Contact</div>
        </div>
        <div>
          <div className="text-sm font-medium text-amber-300">-{xpDelta}</div>
          <div className="text-[10px] uppercase tracking-wide text-gray-400">To Next Lv</div>
        </div>
      </div>
      {nextBadge && (
        <div className="mt-3 text-[11px] text-purple-200/80 bg-purple-700/20 border border-purple-600/30 px-3 py-1.5 rounded-md w-full text-center">
          Next Badge: <span className="font-medium text-yellow-300">{nextBadge.icon} {nextBadge.name}</span>
        </div>
      )}
    </div>
  );
}
