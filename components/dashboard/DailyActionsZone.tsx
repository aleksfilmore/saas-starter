"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MessageSquare, Shield, Brain, CheckCircle, Clock, Zap, Flame } from 'lucide-react';

interface Ritual {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  duration: string;
  icon: string;
}

interface Streaks {
  rituals: number;
  noContact: number;
}

interface Props {
  rituals: Ritual[];
  streaks: Streaks;
  onRitualClick: (id: string) => void;
  onCheckInClick: () => void;
  onAITherapyClick: () => void;
  onNoContactClick: () => void;
}

const difficultyColors = {
  easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  hard: 'bg-red-500/20 text-red-400 border-red-500/30'
};

export function DailyActionsZone({ 
  rituals, 
  streaks, 
  onRitualClick, 
  onCheckInClick, 
  onAITherapyClick, 
  onNoContactClick 
}: Props) {
  const completedRituals = rituals.filter(r => r.completed).length;
  const completionRate = rituals.length > 0 ? (completedRituals / rituals.length) * 100 : 0;

  return (
    <div className="space-y-6 group">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white tracking-wide flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-400 animate-pulse" />
          Today&apos;s Healing Actions
        </h2>
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="text-gray-400">{completedRituals}/{rituals.length || 1}</span>
          <div className="w-20 h-2 bg-gray-700/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-green-400 to-lime-300 transition-all duration-700 ease-out"
              style={{ width: `${completionRate || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Action Buttons Row */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          onClick={onCheckInClick}
      className="h-20 bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-[0_0_0_1px_#60a5fa,inset_0_0_12px_-2px_rgba(96,165,250,0.5)] hover:from-blue-600 hover:to-blue-700 text-white flex flex-col items-center justify-center space-y-1 transition-all"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="text-sm font-medium">Check In</span>
          <span className="text-xs opacity-75">{streaks.rituals} day streak</span>
        </Button>

        <Button
          onClick={onAITherapyClick}
          className="relative h-20 bg-gradient-to-r from-purple-600 to-purple-700 hover:shadow-[0_0_0_1px_#a855f7,inset_0_0_14px_-2px_rgba(168,85,247,0.6)] text-white flex flex-col items-center justify-center space-y-1 transition-all"
        >
          <span className="absolute top-1 right-1 text-[10px] bg-yellow-400/20 text-yellow-300 px-1.5 py-0.5 rounded-md border border-yellow-500/30">Premium</span>
          <Brain className="h-6 w-6" />
          <span className="text-sm font-medium">AI Therapy</span>
          <span className="text-xs opacity-75">Quick chat</span>
        </Button>

        <Button
          onClick={onNoContactClick}
          className="h-20 bg-gradient-to-r from-amber-600 to-amber-700 hover:shadow-[0_0_0_1px_#f59e0b,inset_0_0_12px_-2px_rgba(245,158,11,0.5)] text-white flex flex-col items-center justify-center space-y-1 transition-all"
        >
          <Shield className="h-6 w-6" />
          <span className="text-sm font-medium">No Contact</span>
          <span className="text-xs opacity-75">{streaks.noContact} days strong</span>
        </Button>

        <Button
          variant="outline"
          className="h-20 border-gray-600 bg-gray-800/60 hover:shadow-[0_0_0_1px_#10b981,inset_0_0_10px_-2px_rgba(16,185,129,0.5)] hover:bg-gray-700/60 text-gray-200 flex flex-col items-center justify-center space-y-1 transition-all"
        >
          <Zap className="h-6 w-6" />
          <span className="text-sm font-medium">Quick Win</span>
          <span className="text-xs opacity-75">2 min boost</span>
        </Button>
      </div>

      {/* Today's Rituals */}
      <Card className="bg-gray-800/60 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <span>Today's Rituals</span>
            {completionRate === 100 && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                🎉 Complete!
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rituals.map((ritual) => (
            <div 
              key={ritual.id}
              className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                ritual.completed 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-gray-700/50 border-gray-600 hover:border-gray-500 hover:bg-gray-700/70'
              }`}
              onClick={() => onRitualClick(ritual.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{ritual.icon}</span>
                  <div>
                    <h3 className={`font-medium ${ritual.completed ? 'text-green-400' : 'text-white'}`}>
                      {ritual.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={difficultyColors[ritual.difficulty]}>
                        {ritual.difficulty}
                      </Badge>
                      <span className="text-gray-400 text-sm flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {ritual.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {ritual.completed ? (
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  ) : (
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Start
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {rituals.length === 0 && (
            <div className="text-center py-10 text-gray-300 border border-dashed border-gray-600 rounded-lg bg-gray-700/30">
              <Zap className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p className="font-medium mb-1">No ritual scheduled yet</p>
              <p className="text-xs text-gray-400 mb-4">Pick a small grounding action now to build momentum.</p>
              <button
                onClick={() => onRitualClick('new')}
                className="px-4 py-2 text-xs rounded-md bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:from-pink-400 hover:to-purple-500"
              >Choose a Ritual</button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
