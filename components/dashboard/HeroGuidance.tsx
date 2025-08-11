"use client";
import React from 'react';
import useSWR from 'swr';
import { Heart, ArrowRight } from 'lucide-react';
import { useDailyTasks } from '@/hooks/useDailyTasks';
import { useAuth } from '@/contexts/AuthContext';

const fetcher = (u:string)=>fetch(u).then(r=>r.json()).catch(()=>null);

interface Props {
  onActionSelect: (key: string) => void;
  dailyInsight?: string | null;
}

const ACTION_ORDER: Array<{ key: string; label: string; cta: string }> = [
  { key: 'checkIn', label: 'Check-In', cta: 'Open Check-In' },
  { key: 'ritual', label: "Today's Ritual", cta: 'Start Ritual' },
  { key: 'aiTherapy', label: 'AI Therapy', cta: 'Open Chat' },
  { key: 'noContact', label: 'No‑Contact Check', cta: 'Log Progress' },
  { key: 'quickWin', label: 'Quick Win', cta: 'Do Quick Win' }
];

export function HeroGuidance({ onActionSelect, dailyInsight }: Props) {
  const { tasks } = useDailyTasks();
  const { user } = useAuth();
  const { data: nudgeData } = useSWR('/api/nudges', fetcher, { refreshInterval: 5*60*1000 });
  // Username intentionally not shown here to avoid repetition (shown in header only)

  const nextAction = ACTION_ORDER.find(a => !(tasks as any)[a.key]);
  const supportive = nudgeData?.nudge?.message || dailyInsight || 'One small action compounds into healing.';

  return (
    <div className="w-full relative overflow-hidden rounded-xl border border-purple-700/40 bg-gradient-to-r from-purple-900/70 via-fuchsia-800/40 to-pink-700/40 p-5 flex items-start gap-5 shadow-[0_0_0_1px_rgba(168,85,247,0.2),0_0_18px_-4px_rgba(236,72,153,0.4)]">
      <div className="p-3 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-600/20 backdrop-blur-sm ring-1 ring-pink-400/40">
        <Heart className="h-7 w-7 text-pink-300 animate-pulse" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed line-clamp-3">
          {supportive}
        </p>
        {nextAction && (
          <div className="mt-4 flex items-center flex-wrap gap-3">
            <span className="text-[10px] uppercase tracking-wider text-purple-300/70">Suggested Action</span>
            <button
              onClick={()=>onActionSelect(nextAction.key)}
              className="group inline-flex items-center px-3 py-1.5 rounded-md bg-gradient-to-r from-pink-600 to-violet-600 text-white text-[11px] font-medium shadow hover:from-pink-500 hover:to-violet-500 transition relative overflow-hidden"
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_center,white,transparent_60%)] transition" />
              {nextAction.label}
              <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
