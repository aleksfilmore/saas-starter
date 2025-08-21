'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimplifiedHeader } from '@/components/dashboard/SimplifiedHeader';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award,
  BarChart3,
  Heart,
  Zap,
  RefreshCw
} from 'lucide-react';

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
      notes: string;
    }>;
  };
}

export default function ProgressPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('month');

  const fetchProgressData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/progress?range=${timeRange}`, {
        headers: {
          'x-user-email': user.email || '',
          'Authorization': `Bearer ${localStorage.getItem('auth-token') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setProgressData(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch progress data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      fetchProgressData();
    }
  }, [isAuthenticated, user, isLoading, timeRange]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-purple-200">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Please sign in to view your progress</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Unable to load progress data</p>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={fetchProgressData} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">No progress data available</p>
        </div>
      </div>
    );
  }

  const getMoodColor = (mood: number) => {
    if (mood >= 4) return 'text-green-400';
    if (mood >= 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 4) return '😊';
    if (mood >= 3) return '😐';
    return '😔';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <SimplifiedHeader 
        user={{
          username: user?.username || user?.email?.split('@')[0] || 'User',
          streak: 0, // Could be fetched from progress data
          bytes: 100, // Could be fetched from progress data
          level: 1, // Could be fetched from progress data
          noContactDays: 0, // Could be fetched from progress data
          subscriptionTier: 'free' // Could be determined from user data
        }}
        hasShield={false}
        onCheckin={() => {}}
        onBreathing={() => {}}
        onCrisis={() => window.location.href = '/crisis-support'}
      />
      
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Progress Dashboard</h1>
            <p className="text-gray-300">Track your healing journey with advanced insights and milestone celebrations</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2"
            >
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="all">All Time</option>
            </select>
            <Button onClick={fetchProgressData} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Level & XP */}
          <Card className="bg-gray-800/80 border border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-purple-400">
                  <Zap className="h-6 w-6" />
                </div>
                <Badge className="bg-purple-600 text-white">
                  Level {progressData.user.level}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress to next level</span>
                  <span className="text-white">{progressData.user.progressToNext.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={progressData.user.progressToNext} 
                  className="h-2"
                />
                <div className="text-xs text-gray-500">
                  {progressData.user.xp} / {progressData.user.nextLevelXP} XP
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Streak */}
          <Card className="bg-gray-800/80 border border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-orange-400">
                  <Target className="h-6 w-6" />
                </div>
                <Badge className="bg-orange-600 text-white">
                  {progressData.user.streak} days
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-white font-semibold">Current Streak</div>
                <div className="text-sm text-gray-400">
                  Best: {progressData.user.longestStreak} days
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rituals Completed */}
          <Card className="bg-gray-800/80 border border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-green-400">
                  <Calendar className="h-6 w-6" />
                </div>
                <Badge className="bg-green-600 text-white">
                  {Math.round((progressData.stats.ritualsCompleted / progressData.stats.totalRituals) * 100)}%
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-white font-semibold">Rituals</div>
                <div className="text-sm text-gray-400">
                  {progressData.stats.ritualsCompleted} / {progressData.stats.totalRituals} completed
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Improvement Score */}
          <Card className="bg-gray-800/80 border border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-blue-400">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <Badge className="bg-blue-600 text-white">
                  {progressData.stats.improvementScore}%
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-white font-semibold">Improvement</div>
                <div className="text-sm text-gray-400">
                  Overall progress score
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Progress */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-600">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="rituals" className="data-[state=active]:bg-purple-600">
              Recent Rituals
            </TabsTrigger>
            <TabsTrigger value="moods" className="data-[state=active]:bg-purple-600">
              Mood Tracking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Stats Summary */}
              <Card className="bg-gray-800/80 border border-gray-600/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">
                        {progressData.stats.wallPosts}
                      </div>
                      <div className="text-sm text-gray-400">Wall Posts</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">
                        {progressData.stats.aiSessionsUsed}
                      </div>
                      <div className="text-sm text-gray-400">AI Sessions</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">
                        {progressData.stats.totalDays}
                      </div>
                      <div className="text-sm text-gray-400">Days Active</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400">
                        {progressData.stats.averageMood.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-400">Avg Mood</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Profile */}
              <Card className="bg-gray-800/80 border border-gray-600/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{progressData.user.avatar}</div>
                    <div className="text-xl font-bold text-white mb-1">
                      {progressData.user.username}
                    </div>
                    <Badge className="bg-purple-600 text-white mb-4">
                      Level {progressData.user.level}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bytes</span>
                      <span className="text-white">{progressData.user.bytes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total XP</span>
                      <span className="text-white">{progressData.user.xp.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rituals" className="space-y-6">
            <Card className="bg-gray-800/80 border border-gray-600/50">
              <CardHeader>
                <CardTitle className="text-white">Recent Ritual Completions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressData.recent.rituals.map((ritual) => (
                    <div key={ritual.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{ritual.title}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(ritual.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge className="bg-green-600 text-white">
                        +{ritual.xpGained} XP
                      </Badge>
                    </div>
                  ))}
                  
                  {progressData.recent.rituals.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      No recent rituals completed. Start your healing journey today!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moods" className="space-y-6">
            <Card className="bg-gray-800/80 border border-gray-600/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Mood Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressData.recent.moods.map((moodEntry, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">
                          {getMoodEmoji(moodEntry.mood)}
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {new Date(moodEntry.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-400">
                            {moodEntry.notes}
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${getMoodColor(moodEntry.mood)}`}>
                        {moodEntry.mood}/5
                      </div>
                    </div>
                  ))}
                  
                  {progressData.recent.moods.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      No mood entries yet. Start tracking your emotional journey!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
}
