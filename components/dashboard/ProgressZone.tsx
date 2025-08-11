"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge as UIBadge } from '@/components/ui/badge';
import { Trophy, Lock } from 'lucide-react';

interface BadgeSummary {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
}
interface Props { badges: BadgeSummary[]; }

export function ProgressZone({ badges }: Props) {
  const unlockedBadges = badges.filter(b => b.unlocked);
  const nextBadge = badges.find(b => !b.unlocked);
  const total = badges.length || 1;
  const progressPct = Math.round((unlockedBadges.length / total) * 100);
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white tracking-wide">Badges</h2>
      <Card className="bg-gray-800/60 border-gray-700 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.4),transparent_60%)]" />
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            <span>Badges</span>
            <UIBadge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              {unlockedBadges.length}/{badges.length}
            </UIBadge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 h-2 bg-gray-700/60 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {badges.slice(0, 9).map(badge => (
              <div key={badge.id} className={`p-3 rounded-lg border text-center transition-all ${badge.unlocked ? 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20' : 'bg-gray-700/30 border-gray-600/50 opacity-50'}`}>
                {badge.unlocked ? <span className="text-2xl">{badge.icon}</span> : <Lock className="h-6 w-6 mx-auto text-gray-500" />}
                <p className={`text-xs mt-1 ${badge.unlocked ? 'text-yellow-400' : 'text-gray-500'}`}>{badge.name}</p>
              </div>
            ))}
          </div>
          {nextBadge && (
            <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-xs">
              <p className="text-purple-300 font-medium mb-1 flex items-center gap-2">Next Unlock <span className="px-1.5 py-0.5 rounded-md bg-purple-600/30 text-[10px] border border-purple-500/40">Preview</span></p>
              <p className="text-gray-300 mb-2">{nextBadge.icon} {nextBadge.name}</p>
              <div className="h-1.5 bg-purple-900/40 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-gradient-to-r from-pink-400 to-purple-500" />
              </div>
              <p className="mt-1 text-[10px] text-purple-200/70">Complete more daily actions to progress.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
