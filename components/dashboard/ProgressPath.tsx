"use client";
import { useDailyTasks } from '@/hooks/useDailyTasks';
import { useHealingHub } from '@/contexts/HealingHubContext';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2, Bot, Flame, Shield, Sparkles, RefreshCw } from 'lucide-react';
import React from 'react';

interface StepDef {
  key: string;
  label: string;
  icon: React.ReactNode;
  done: boolean;
  locked?: boolean;
  onClick?: () => void;
  premium?: boolean; // mark if this step is a premium upsell for current user
}

export function ProgressPath({ onOpen, onUpgrade }: { onOpen: (modal: string) => void; onUpgrade?: () => void }) {
  const { tasks } = useDailyTasks(); // shared state from parent tree
  const { ritual, noContact, rerollRitual, rerollCooldownHoursLeft } = useHealingHub();
  const { user } = useAuth();
  const isPremium = user?.subscriptionTier === 'premium';

  const steps: StepDef[] = [
    {
      key: 'checkIn',
      label: 'Daily Check-In',
      icon: <CheckCircle2 className="h-4 w-4" />,
      done: tasks.checkIn,
      onClick: () => onOpen('checkin')
    },
    {
      key: 'ritual',
      label: ritual?.isCompleted ? 'Ritual Complete' : 'Do Today\'s Ritual',
      icon: <Flame className="h-4 w-4" />,
      done: !!ritual?.isCompleted || tasks.ritual,
      onClick: ritual ? () => onOpen(`ritual-${ritual.id}`) : undefined
    },
    {
      key: 'ai',
      label: 'AI Therapy',
      icon: <Bot className="h-4 w-4" />,
      done: tasks.aiTherapy,
      onClick: isPremium ? () => onOpen('ai-therapy') : (onUpgrade ? () => onUpgrade() : undefined),
      premium: !isPremium
    },
    {
      key: 'noContact',
      label: noContact?.status === 'checked_in_today' ? 'No-Contact Logged' : 'No-Contact Check',
      icon: <Shield className="h-4 w-4" />,
      done: tasks.noContact || noContact?.status === 'checked_in_today',
      onClick: () => onOpen('no-contact')
    },
    {
      key: 'quickWin',
      label: 'Quick Win',
      icon: <Sparkles className="h-4 w-4" />,
      done: false,
      onClick: isPremium ? () => onOpen('quick-win') : (onUpgrade ? () => onUpgrade() : undefined),
      premium: !isPremium
    }
  ];

  const total = steps.length;
  const doneCount = steps.filter(s => s.done).length;
  const pct = Math.round((doneCount / total) * 100);

  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-purple-200 tracking-wide">YOUR HEALING PATH TODAY</h2>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <span>{doneCount}/{total} done</span>
          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
  <div className="flex flex-wrap gap-2">
        {steps.map(step => {
          const premiumLocked = step.premium && !isPremium;
          return (
            <button
              key={step.key}
              onClick={step.onClick}
              disabled={!step.onClick}
              className={`group relative px-3 py-2 rounded-lg text-xs flex items-center space-x-2 border transition ${
                step.done ? 'bg-green-600/20 border-green-500/30 text-green-300' : premiumLocked ? 'bg-gray-700/40 border-purple-600/40 text-gray-300 hover:bg-gray-700/60' : 'bg-gray-700/40 border-gray-600 text-gray-200 hover:bg-gray-700'
              } ${premiumLocked ? 'cursor-pointer' : ''}`}
              title={premiumLocked ? 'Upgrade to unlock' : undefined}
            >
              {step.icon}
              <span>{step.label}</span>
              {premiumLocked && !step.done && (
                <span className="text-[10px] uppercase tracking-wide font-medium text-pink-300 ml-1">Pro</span>
              )}
            </button>
          );
        })}
        {ritual && !ritual.isCompleted && (
          <button
            onClick={() => !rerollCooldownHoursLeft && rerollRitual()}
            disabled={!!rerollCooldownHoursLeft}
            className={`group relative px-3 py-2 rounded-lg text-xs flex items-center space-x-2 border transition ${
              rerollCooldownHoursLeft
                ? 'bg-gray-800/40 border-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700/40 border-orange-500/40 text-orange-300 hover:bg-gray-700'
            }`}
            title={rerollCooldownHoursLeft ? `Reroll available in ${rerollCooldownHoursLeft.toFixed(1)}h` : 'Get a different ritual for today'}
          >
            <RefreshCw className={`h-4 w-4 ${rerollCooldownHoursLeft ? 'opacity-50' : ''}`} />
            <span>{rerollCooldownHoursLeft ? `Reroll (${rerollCooldownHoursLeft.toFixed(1)}h)` : 'Reroll Ritual'}</span>
          </button>
        )}
      </div>
      {!ritual && (
        <div className="mt-3 text-[11px] text-purple-300/80 italic">
          No ritual assigned yet. We'll match one to you soon—stay consistent with the other steps in the meantime.
        </div>
      )}
    </div>
  );
}
