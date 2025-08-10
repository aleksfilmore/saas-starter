"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MessageSquare, Shield, Brain, CheckCircle, Clock, Zap } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Your Healing Actions Today</h2>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">{completedRituals}/{rituals.length} completed</span>
          <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Action Buttons Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          onClick={onCheckInClick}
          className="h-20 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex flex-col items-center justify-center space-y-1"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="text-sm font-medium">Check In</span>
          <span className="text-xs opacity-75">{streaks.rituals} day streak</span>
        </Button>

        <Button
          onClick={onAITherapyClick}
          className="h-20 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white flex flex-col items-center justify-center space-y-1"
        >
          <Brain className="h-6 w-6" />
          <span className="text-sm font-medium">AI Therapy</span>
          <span className="text-xs opacity-75">Quick chat</span>
        </Button>

        <Button
          onClick={onNoContactClick}
          className="h-20 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white flex flex-col items-center justify-center space-y-1"
        >
          <Shield className="h-6 w-6" />
          <span className="text-sm font-medium">No Contact</span>
          <span className="text-xs opacity-75">{streaks.noContact} days strong</span>
        </Button>

        <Button
          variant="outline"
          className="h-20 border-gray-600 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 flex flex-col items-center justify-center space-y-1"
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
            <div className="text-center py-8 text-gray-400">
              <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No rituals scheduled for today</p>
              <p className="text-sm">Check back tomorrow for new healing practices</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
