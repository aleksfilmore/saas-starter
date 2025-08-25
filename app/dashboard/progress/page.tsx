/**
 * CTRL+ALT+BLOCK™ v1.1 - Progress Dashboard
 * Live metrics page with specification-compliant progress tracking per section 10
 */

'use client';

// Force dynamic rendering for auth-dependent pages
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, Calendar, Clock, Zap, Star, Brain, Heart, Shield,
  ArrowLeft, BarChart3, RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface ProgressMetrics {
  // 30-Day Commitment Progress
  commitmentDay: number;
  commitmentProgress: number;
  nextMilestone: { day: number; title: string } | null;
  
  // Core Streaks & Consistency
  currentStreak: number;
  longestStreak: number;
  ritualsCompleted: number;
  totalRituals: number;
  consistencyScore: number;
  
  // Journaling Quality Metrics (CTRL+ALT+BLOCK™ v1.1)
  journalValidationPasses: number;
  averageJournalQuality: number;
  averageWritingTime: number;
  uniqueContentRatio: number;
  
  // Emotional Progress
  moodTrend: 'improving' | 'stable' | 'declining' | 'volatile';
  averageMood: number;
  moodStability: number;
  
  // Progress Currency
  bytes: number;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    earned: boolean;
    earnedAt?: string;
    icon: string;
  }>;
  
  // Therapy Integration
  therapySessions: number;
  therapyEngagement: 'high' | 'medium' | 'low';
  
  // Archetype Development
  archetype?: string;
  archetypeProgress: number;
  personalizedContent: boolean;
}

export default function ProgressPage() {
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [metrics, setMetrics] = useState<ProgressMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (authUser && isAuthenticated && !authLoading) {
      fetchProgressMetrics();
    }
  }, [authUser, isAuthenticated, authLoading]);

  const fetchProgressMetrics = async () => {
    try {
      console.log('Fetching progress metrics for user:', authUser?.email);
      
      const response = await fetch('/api/progress/metrics', {
        headers: {
          'x-user-email': authUser?.email || ''
        }
      });
      
      console.log('Progress API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Progress data received:', data);
        setMetrics(data);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Progress API error:', response.status, errorData);
        // Set error state but don't crash
        setMetrics(null);
      }
    } catch (error) {
      console.error('Error fetching progress metrics:', error);
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Shield className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-300 mb-6">
            You need to be signed in to view your progress analytics and tracking data.
          </p>
          <div className="space-y-3">
            <Link href="/sign-in">
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                <Shield className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                Create Account
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200">Loading progress analytics...</p>
          <p className="text-gray-400 text-sm mt-2">Calculating your transformation metrics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <BarChart3 className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-400 mb-2">Progress Data Unavailable</h2>
            <p className="text-gray-300 mb-4">
              We're having trouble loading your progress metrics. This could be due to:
            </p>
            <ul className="text-sm text-gray-400 text-left space-y-1 mb-6">
              <li>• Database connectivity issues</li>
              <li>• Incomplete user data setup</li>
              <li>• Temporary system maintenance</li>
            </ul>
          </div>
          <div className="space-y-3">
            <Button 
              onClick={fetchProgressMetrics} 
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Loading
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
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
                  Progress Dashboard
                </h1>
                <p className="text-purple-300 mt-2">
                  Live metrics for your CTRL+ALT+BLOCK™ transformation journey
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-purple-300 border-purple-500">
                Day {metrics.commitmentDay}/30
              </Badge>
              {metrics.archetype && (
                <Badge variant="secondary" className="bg-cyan-600 text-white">
                  {metrics.archetype} Mode
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* 30-Day Commitment Progress */}
        <Card className="mb-8 bg-gray-900/50 border-cyan-700 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="h-5 w-5 text-cyan-400" />
              30-Day Commitment Progress
            </CardTitle>
            <CardDescription className="text-gray-300">
              Your systematic transformation using the CTRL+ALT+BLOCK™ protocol
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2 text-gray-300">
                  <span>Day {metrics.commitmentDay} of 30</span>
                  <span>{metrics.commitmentProgress}% complete</span>
                </div>
                <Progress value={metrics.commitmentProgress} className="h-3" />
              </div>
              
              {metrics.nextMilestone && (
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-white">Next Milestone</p>
                    <p className="text-gray-400 text-xs">{metrics.nextMilestone.title}</p>
                  </div>
                  <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                    Day {metrics.nextMilestone.day}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border-gray-700">
            <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="quality" className="text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white">Journal Quality</TabsTrigger>
            <TabsTrigger value="emotional" className="text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white">Emotional Health</TabsTrigger>
            <TabsTrigger value="achievements" className="text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white">Achievements</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Current Streak */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <Zap className="h-5 w-5 text-orange-500" />
                    Current Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-400">
                    {metrics.currentStreak}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    days in a row
                  </p>
                  {metrics.longestStreak > metrics.currentStreak && (
                    <p className="text-xs text-gray-500 mt-2">
                      Personal best: {metrics.longestStreak} days
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Consistency Score */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <Calendar className="h-5 w-5 text-green-500" />
                    Consistency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">
                    {metrics.consistencyScore}%
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {metrics.ritualsCompleted} of {metrics.totalRituals} rituals
                  </p>
                  <Progress value={metrics.consistencyScore} className="mt-3 h-2" />
                </CardContent>
              </Card>

              {/* Bytes Progress */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <Star className="h-5 w-5 text-purple-500" />
                    Byte Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400">
                    {metrics.bytes.toLocaleString()} Bytes
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Reward currency accumulated
                  </p>
                  <Progress 
                    value={100} 
                    className="mt-3 h-2" 
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Journal Quality Tab */}
          <TabsContent value="quality" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Validation Pass Rate */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Shield className="h-5 w-5 text-blue-400" />
                    Journal Quality Score
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    CTRL+ALT+BLOCK™ v1.1 validation metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2 text-gray-300">
                        <span>Validation Pass Rate</span>
                        <span>{Math.round((metrics.journalValidationPasses / metrics.ritualsCompleted) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(metrics.journalValidationPasses / metrics.ritualsCompleted) * 100} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2 text-gray-300">
                        <span>Average Quality Score</span>
                        <span>{Math.round(metrics.averageJournalQuality * 100)}%</span>
                      </div>
                      <Progress value={metrics.averageJournalQuality * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2 text-gray-300">
                        <span>Content Uniqueness</span>
                        <span>{Math.round(metrics.uniqueContentRatio * 100)}%</span>
                      </div>
                      <Progress value={metrics.uniqueContentRatio * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Writing Engagement */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Clock className="h-5 w-5 text-green-400" />
                    Writing Engagement
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Time spent in active journaling sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">
                    {Math.round(metrics.averageWritingTime)}s
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    average active writing time
                  </p>
                  <div className="mt-4 p-3 bg-green-900/20 rounded-lg border border-green-700/50">
                    <p className="text-xs text-green-400">
                      {metrics.averageWritingTime >= 45 
                        ? '✅ Meeting minimum 45s requirement' 
                        : '⚠️ Below 45s minimum threshold'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Emotional Health Tab */}
          <TabsContent value="emotional" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Mood Tracking */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Heart className="h-5 w-5 text-red-400" />
                    Emotional Progress
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Track your emotional healing journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2 text-gray-300">
                        <span>Average Mood</span>
                        <span>{metrics.averageMood.toFixed(1)}/10</span>
                      </div>
                      <Progress value={(metrics.averageMood / 10) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2 text-gray-300">
                        <span>Mood Stability</span>
                        <span>{Math.round(metrics.moodStability * 100)}%</span>
                      </div>
                      <Progress value={metrics.moodStability * 100} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-sm font-medium text-gray-300">Trend</span>
                      <Badge 
                        variant={
                          metrics.moodTrend === 'improving' ? 'default' :
                          metrics.moodTrend === 'stable' ? 'secondary' :
                          metrics.moodTrend === 'declining' ? 'destructive' : 'outline'
                        }
                        className={
                          metrics.moodTrend === 'improving' ? 'bg-green-600' :
                          metrics.moodTrend === 'stable' ? 'bg-blue-600' :
                          metrics.moodTrend === 'declining' ? 'bg-red-600' : 'bg-gray-600'
                        }
                      >
                        {metrics.moodTrend}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Therapy Integration */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Brain className="h-5 w-5 text-indigo-400" />
                    Therapy Integration
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Professional support engagement metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-indigo-400">
                    {metrics.therapySessions}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    sessions this month
                  </p>
                  <div className="mt-4 flex items-center justify-between p-3 bg-indigo-900/20 rounded-lg border border-indigo-700/50">
                    <span className="text-sm font-medium text-gray-300">Engagement Level</span>
                    <Badge 
                      variant={
                        metrics.therapyEngagement === 'high' ? 'default' :
                        metrics.therapyEngagement === 'medium' ? 'secondary' : 'outline'
                      }
                      className={
                        metrics.therapyEngagement === 'high' ? 'bg-green-600' :
                        metrics.therapyEngagement === 'medium' ? 'bg-yellow-600' : 'bg-gray-600'
                      }
                    >
                      {metrics.therapyEngagement}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.achievements.map((achievement) => (
                <Card 
                  key={achievement.id}
                  className={`transition-all ${
                    achievement.earned 
                      ? 'border-yellow-500 bg-gradient-to-br from-yellow-900/20 to-orange-900/20' 
                      : 'border-gray-700 bg-gray-900/50 opacity-60'
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3">
                      <div className={`text-2xl ${achievement.earned ? '' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-white">{achievement.title}</h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {achievement.description}
                        </p>
                        {achievement.earned && achievement.earnedAt && (
                          <p className="text-xs text-green-400 mt-2">
                            Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link href="/daily-rituals">
            <Button className="bg-green-600 hover:bg-green-700">
              <Target className="h-4 w-4 mr-2" />
              Continue Rituals
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/20">
              <Zap className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
