"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Flame, Shield, Target, Star, Lock } from 'lucide-react';

interface XPData {
  current: number;
  level: number;
  nextLevelXP: number;
  progressFraction: number;
}

interface Streaks {
  rituals: number;
  noContact: number;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
}

interface MotivationMeter {
  level: number; // 1-10
  message: string;
}

interface Props {
  xp: XPData;
  streaks: Streaks;
  badges: Badge[];
  motivationMeter: MotivationMeter;
}

const motivationColors = [
  'from-red-500 to-red-600',      // 1-2
  'from-orange-500 to-orange-600', // 3-4
  'from-yellow-500 to-yellow-600', // 5-6
  'from-green-500 to-green-600',   // 7-8
  'from-emerald-500 to-emerald-600' // 9-10
];

export function ProgressZone({ xp, streaks, badges, motivationMeter }: Props) {
  const unlockedBadges = badges.filter(b => b.unlocked);
  const nextBadge = badges.find(b => !b.unlocked);
  const motivationColorIndex = Math.floor((motivationMeter.level - 1) / 2);
  const motivationGradient = motivationColors[motivationColorIndex] || motivationColors[0];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <h2 className="text-2xl font-bold text-white">Progress & Rewards</h2>

      {/* XP and Level Progress */}
      <Card className="bg-gray-800/60 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-400" />
            <span>Level {xp.level}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">XP Progress</span>
              <span className="text-white font-medium">{xp.current} / {xp.nextLevelXP}</span>
            </div>
            <div className="relative">
              <Progress 
                value={xp.progressFraction * 100} 
                className="h-3 bg-gray-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-80" 
                   style={{ width: `${xp.progressFraction * 100}%` }} />
            </div>
          </div>
          
          {xp.progressFraction > 0.8 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-yellow-400 text-sm font-medium">🎉 Almost there!</p>
              <p className="text-gray-300 text-sm">
                Just {xp.nextLevelXP - xp.current} XP until Level {xp.level + 1}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Streaks */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-800/60 border-gray-700">
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 bg-orange-500/20 rounded-full">
                <Flame className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{streaks.rituals}</p>
                <p className="text-gray-400 text-sm">Ritual Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/60 border-gray-700">
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{streaks.noContact}</p>
                <p className="text-gray-400 text-sm">No Contact Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Motivation Meter */}
      <Card className="bg-gray-800/60 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Motivation Meter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Energy Level</span>
              <span className="text-white font-medium">{motivationMeter.level}/10</span>
            </div>
            <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${motivationGradient} transition-all duration-1000`}
                style={{ width: `${motivationMeter.level * 10}%` }}
              />
            </div>
            <p className="text-center text-gray-300 font-medium">{motivationMeter.message}</p>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card className="bg-gray-800/60 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            <span>Badges</span>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              {unlockedBadges.length}/{badges.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {badges.slice(0, 6).map((badge) => (
              <div 
                key={badge.id}
                className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                  badge.unlocked 
                    ? 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20' 
                    : 'bg-gray-700/30 border-gray-600/50 opacity-50'
                }`}
              >
                {badge.unlocked ? (
                  <span className="text-2xl">{badge.icon}</span>
                ) : (
                  <Lock className="h-6 w-6 mx-auto text-gray-500" />
                )}
                <p className={`text-xs mt-1 ${badge.unlocked ? 'text-yellow-400' : 'text-gray-500'}`}>
                  {badge.name}
                </p>
              </div>
            ))}
          </div>
          
          {nextBadge && (
            <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <p className="text-purple-400 text-sm font-medium">Next Unlock:</p>
              <p className="text-gray-300 text-sm">{nextBadge.icon} {nextBadge.name}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
