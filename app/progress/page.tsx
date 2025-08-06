'use client';

import React, { useState, useEffect } from 'react';
import AuthWrapper from '@/components/AuthWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  TrendingUp, 
  Calendar, 
  Flame, 
  Target, 
  Award, 
  BarChart3,
  Zap,
  Coins,
  Shield,
  Heart
} from 'lucide-react';
import Link from 'next/link';

interface ProgressData {
  user: {
    level: number;
    xp: number;
    nextLevelXP: number;
    progressToNext: number;
    streak: number;
    longestStreak: number;
    bytes: number;
    username: string;
    avatar: string;
  };
  stats: {
    ritualsCompleted: number;
    totalRituals: number;
    wallPosts: number;
    aiSessionsUsed: number;
    totalDays: number;
    averageMood: number;
    improvementScore: number;
  };
  recent: {
    rituals: Array<{
      id: string;
      title: string;
      completedAt: string;
      xpGained: number;
    }>;
    moods: Array<{
      date: string;
      mood: number;
      notes?: string;
    }>;
  };
}

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');

  useEffect(() => {
    fetchProgressData();
  }, [timeRange]);

  const fetchProgressData = async () => {
    try {
      const userEmail = localStorage.getItem('user-email') || 'admin@ctrlaltblock.com';
      
      const response = await fetch(`/api/progress?range=${timeRange}`, {
        headers: {
          'x-user-email': userEmail
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProgressData(data);
      }
    } catch (error) {
      console.error('Failed to fetch progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-400';
    if (streak >= 14) return 'text-blue-400';
    if (streak >= 7) return 'text-green-400';
    if (streak >= 3) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getImprovementBadge = (score: number) => {
    if (score >= 80) return { text: 'Excellent', color: 'bg-green-500' };
    if (score >= 60) return { text: 'Great', color: 'bg-blue-500' };
    if (score >= 40) return { text: 'Good', color: 'bg-yellow-500' };
    if (score >= 20) return { text: 'Progress', color: 'bg-orange-500' };
    return { text: 'Starting', color: 'bg-gray-500' };
  };

  if (loading) {
    return (
      <AuthWrapper>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-purple-200">Loading progress analytics...</p>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  if (!progressData) {
    return (
      <AuthWrapper>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400">Failed to load progress data</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  const { user, stats, recent } = progressData;
  const improvementBadge = getImprovementBadge(stats.improvementScore);

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-purple-300 hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white">
                    <BarChart3 className="inline h-8 w-8 mr-3 text-cyan-400" />
                    Progress Analytics
                  </h1>
                  <p className="text-purple-300 mt-2">
                    Track your healing journey with detailed insights
                  </p>
                </div>
              </div>
              
              {/* Time Range Selector */}
              <div className="bg-gray-800 rounded-lg p-1 flex">
                {(['week', 'month', 'all'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      timeRange === range
                        ? 'bg-cyan-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Level Progress */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Level Progress</p>
                    <p className="text-2xl font-bold text-cyan-400">{user.level}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-xl">
                    {user.avatar}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">XP</span>
                    <span className="text-gray-300">{user.xp.toLocaleString()} / {user.nextLevelXP.toLocaleString()}</span>
                  </div>
                  <Progress value={user.progressToNext} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Streak */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Current Streak</p>
                    <p className={`text-2xl font-bold ${getStreakColor(user.streak)}`}>
                      {user.streak}
                    </p>
                  </div>
                  <Flame className={`h-8 w-8 ${getStreakColor(user.streak)}`} />
                </div>
                <div className="text-sm text-gray-400">
                  Best: {user.longestStreak} days
                </div>
                {user.streak >= 7 && (
                  <Badge className="mt-2 bg-orange-900/20 text-orange-400 border-orange-700">
                    Streak Master
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Rituals Completed */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Rituals Done</p>
                    <p className="text-2xl font-bold text-green-400">
                      {stats.ritualsCompleted}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-green-400" />
                </div>
                <div className="text-sm text-gray-400">
                  {Math.round((stats.ritualsCompleted / stats.totalRituals) * 100)}% completion rate
                </div>
              </CardContent>
            </Card>

            {/* Improvement Score */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Improvement</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {stats.improvementScore}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-400" />
                </div>
                <Badge className={`${improvementBadge.color} text-white`}>
                  {improvementBadge.text}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Recent Activity */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-400" />
                  Recent Rituals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recent.rituals.length > 0 ? recent.rituals.map((ritual) => (
                  <div key={ritual.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">{ritual.title}</h4>
                      <p className="text-sm text-gray-400">
                        {new Date(ritual.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-cyan-400 text-sm">+{ritual.xpGained} XP</span>
                      <Zap className="h-4 w-4 text-cyan-400" />
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-400 text-center py-8">
                    No recent rituals completed
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Mood Tracking */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-pink-400" />
                  Mood Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-pink-400">
                    {stats.averageMood.toFixed(1)}
                  </div>
                  <p className="text-sm text-gray-400">Average Mood</p>
                </div>
                
                {recent.moods.length > 0 ? recent.moods.slice(0, 5).map((mood, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="text-white">{new Date(mood.date).toLocaleDateString()}</p>
                      {mood.notes && (
                        <p className="text-sm text-gray-400 truncate">{mood.notes}</p>
                      )}
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg ${
                            star <= mood.mood ? 'text-yellow-400' : 'text-gray-600'
                          }`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-400 text-center py-8">
                    No mood data available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Achievement Summary */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-400" />
                Achievements & Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-lg font-bold text-white">{stats.ritualsCompleted}</div>
                  <div className="text-sm text-gray-400">Rituals</div>
                </div>
                
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl mb-2">💬</div>
                  <div className="text-lg font-bold text-white">{stats.wallPosts}</div>
                  <div className="text-sm text-gray-400">Wall Posts</div>
                </div>
                
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl mb-2">🤖</div>
                  <div className="text-lg font-bold text-white">{stats.aiSessionsUsed}</div>
                  <div className="text-sm text-gray-400">AI Sessions</div>
                </div>
                
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl mb-2">📅</div>
                  <div className="text-lg font-bold text-white">{stats.totalDays}</div>
                  <div className="text-sm text-gray-400">Days Active</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <Link href="/daily-rituals">
              <Button className="bg-green-600 hover:bg-green-700">
                <Target className="h-4 w-4 mr-2" />
                Continue Rituals
              </Button>
            </Link>
            <Link href="/dashboard/glow-up-console">
              <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/20">
                <Zap className="h-4 w-4 mr-2" />
                GLOW-UP Console
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </AuthWrapper>
  );
}
