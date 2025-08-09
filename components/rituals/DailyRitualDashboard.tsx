/**
 * Daily Ritual Dashboard Component
 * Main interface for paid users to access their daily ritual assignments
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Flame, Zap, Calendar, Trophy } from 'lucide-react';
import { DailyRitualCard } from './DailyRitualCard';
import { toast } from 'sonner';

interface DailyRitualData {
  assignments: any;
  rituals: Array<{
    ritual: any;
    state: 'available' | 'in-progress' | 'completed' | 'locked';
    canComplete: boolean;
    completionId?: number;
  }>;
  userState: {
    streakDays: number;
    ritualsCompletedToday: number;
    dailyCapReached: boolean;
    hasRerolledToday: boolean;
    totalWeeksActive: number;
  };
  canReroll: boolean;
}

export function DailyRitualDashboard() {
  const [ritualData, setRitualData] = useState<DailyRitualData | null>(null);
  const [loading, setLoading] = useState(true);
  const [rerolling, setRerolling] = useState(false);

  // Load today's rituals
  const loadTodaysRituals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/daily-rituals/today');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load rituals');
      }

      setRitualData(result.data);
    } catch (error) {
      console.error('Error loading today\'s rituals:', error);
      toast.error('Failed to load today\'s rituals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle ritual completion
  const handleRitualComplete = async (data: {
    xpEarned: number;
    bytesEarned: number;
    streakDays: number;
  }) => {
    // Show success message
    toast.success(`Ritual Completed! 🎉 Earned ${data.xpEarned} XP and ${data.bytesEarned} Bytes. Current streak: ${data.streakDays} days.`);

    // Reload ritual data
    await loadTodaysRituals();
  };

  // Handle reroll
  const handleReroll = async () => {
    if (!ritualData?.canReroll) return;

    try {
      setRerolling(true);
      const response = await fetch('/api/daily-rituals/reroll', {
        method: 'POST'
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to reroll rituals');
      }

      toast.success('Rituals Rerolled - You have new ritual assignments for today!');

      // Reload ritual data
      await loadTodaysRituals();
    } catch (error) {
      console.error('Error rerolling rituals:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to reroll rituals.';
      toast.error(errorMessage);
    } finally {
      setRerolling(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadTodaysRituals();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!ritualData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Unable to load ritual data. Please try again.</p>
          <Button onClick={loadTodaysRituals} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { rituals, userState, canReroll, assignments } = ritualData;
  const completedToday = rituals.filter(r => r.state === 'completed').length;
  const progressPercentage = (completedToday / 2) * 100;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Daily Ritual Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-bold">{userState.streakDays}</span>
              </div>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold">{completedToday}/2</span>
              </div>
              <p className="text-sm text-gray-600">Today's Progress</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">{userState.totalWeeksActive}</span>
              </div>
              <p className="text-sm text-gray-600">Weeks Active</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <RefreshCw className="h-5 w-5 text-purple-500" />
                <span className="text-2xl font-bold">{canReroll ? '1' : '0'}</span>
              </div>
              <p className="text-sm text-gray-600">Rerolls Left</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Today's Progress</span>
              <span className="text-sm text-gray-600">{completedToday}/2 completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleReroll}
          disabled={!canReroll || rerolling}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${rerolling ? 'animate-spin' : ''}`} />
          {rerolling ? 'Rerolling...' : 'Reroll Rituals'}
        </Button>
        
        {userState.dailyCapReached && (
          <Badge className="bg-green-100 text-green-800 px-3 py-2">
            Daily Goal Completed! 🎉
          </Badge>
        )}
      </div>

      {/* Ritual Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rituals.map((ritualData, index) => (
          <DailyRitualCard
            key={`${ritualData.ritual.id}-${index}`}
            ritual={ritualData.ritual}
            state={ritualData.state}
            canComplete={ritualData.canComplete}
            assignmentId={assignments?.id || 0}
            onComplete={handleRitualComplete}
          />
        ))}
      </div>

      {/* Helper Text */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-purple-900">Daily Ritual System</h3>
              <p className="text-sm text-purple-700 mt-1">
                Complete 2 rituals daily to maintain your streak and earn XP/Bytes. 
                You can reroll once per day if you don't like your assignments. 
                Each ritual requires journaling and reflection to complete.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
