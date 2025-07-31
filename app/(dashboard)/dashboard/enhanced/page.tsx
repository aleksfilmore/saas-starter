"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WeeklyTherapySession from '@/components/ai-therapy/WeeklyTherapySession';
import ProgressVisualization from '@/components/gamification/ProgressVisualization';
import EnhancedWallOfWounds from '@/components/wall/EnhancedWallOfWounds';
import ProtocolGhostChat from '@/components/ai-therapy/ProtocolGhostChat';
import { useRouter } from 'next/navigation';
import { validateRequest } from '@/lib/auth';

// User Interface
interface User {
  id: string;
  username: string;
  alias: string;
  xp: number;
  week: number;
  tier: 'free' | 'firewall' | 'cult-leader';
  dailyXP: number;
  weeklyXPTarget: number;
  emotionalTone: 'numb' | 'vengeance' | 'logic' | 'helpOthers';
  streakDays: number;
  totalSessions: number;
  joinedAt: Date;
  lastActive: Date;
}

// Mock user data - in real app this would come from database
const mockUser: User = {
  id: 'user_123',
  username: 'healing_seeker',
  alias: 'DigitalPhoenix',
  xp: 847,
  week: 3,
  tier: 'firewall',
  dailyXP: 127,
  weeklyXPTarget: 500,
  emotionalTone: 'logic',
  streakDays: 12,
  totalSessions: 18,
  joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  lastActive: new Date()
};

const mockAchievements = [
  {
    id: 'streak-master',
    title: 'Streak Master',
    description: '14-day healing streak',
    type: 'milestone' as const,
    xpValue: 300,
    unlockedAt: new Date(Date.now() - 3600000)
  },
  {
    id: 'wall-warrior',
    title: 'Wall Warrior',
    description: 'Posted 10 times on Wall of Wounds',
    type: 'standard' as const,
    xpValue: 150,
    unlockedAt: new Date(Date.now() - 7200000)
  }
];

const mockWallPosts = [
  {
    id: '1',
    alias: 'VoidWalker',
    avatar: '🌙',
    content: 'Six months clean from my toxic ex\'s social media. The urge to check is almost gone. Small victories count, right?',
    timestamp: new Date(Date.now() - 1800000), // 30 min ago
    emotionalTags: { numb: 8, vengeance: 1, logic: 7, helpOthers: 9 },
    upvotes: 23,
    commentCount: 5,
    isTopGlitch: true,
    userTier: 'firewall' as const
  },
  {
    id: '2',
    alias: 'GlitchHealer',
    avatar: '✨',
    content: 'Today marks 100 days since I started this journey. To anyone struggling: it gets better, but you have to do the work.',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    emotionalTags: { numb: 2, vengeance: 0, logic: 9, helpOthers: 15 },
    upvotes: 67,
    commentCount: 14,
    isRelatableStream: true,
    userTier: 'cult-leader' as const
  }
];

export default function EnhancedDashboard() {
  const [user, setUser] = useState<User>(mockUser);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading user data
    const loadUserData = async () => {
      try {
        // In real app, validate session and load user data
        // const { user } = await validateRequest();
        // if (!user) {
        //   router.push('/sign-in');
        //   return;
        // }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load user data:', error);
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  const handleTherapyComplete = (xp: number, bytes: number) => {
    setUser(prev => ({
      ...prev,
      xp: prev.xp + xp,
      dailyXP: prev.dailyXP + xp,
      totalSessions: prev.totalSessions + 1
    }));
  };

  const handleAchievementUnlock = (achievement: any) => {
    setUser(prev => ({
      ...prev,
      xp: prev.xp + achievement.xpValue
    }));
  };

  const handleWallActions = {
    onSubmitPost: async (content: string) => {
      console.log('Submitting post:', content);
      // In real app: API call to create post
      alert('Post submitted to the Wall of Wounds!');
    },
    onReactToPost: async (postId: string, reaction: string) => {
      console.log('Reacting to post:', postId, reaction);
      // In real app: API call to react
    },
    onCommentOnPost: async (postId: string, comment: string) => {
      console.log('Commenting on post:', postId, comment);
      // In real app: API call to comment
    },
    onSharePost: async (postId: string) => {
      console.log('Sharing post:', postId);
      alert('Healing vibes shared with the community!');
    },
    onReportPost: async (postId: string) => {
      console.log('Reporting post:', postId);
      alert('Post reported. Our AI moderation will review it.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your healing dashboard...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = (user.dailyXP / user.weeklyXPTarget) * 100;
  const tierColor = user.tier === 'free' ? 'text-blue-400' : 
                   user.tier === 'firewall' ? 'text-orange-400' : 'text-purple-400';
  
  const daysSinceJoined = Math.floor((Date.now() - user.joinedAt.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-blue-900/40 border-2 border-purple-500/50">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div>
                <CardTitle className="text-3xl font-black text-white" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  Welcome back, {user.alias} 🔥
                </CardTitle>
                <p className="text-purple-400 text-lg mt-2">
                  Week {user.week} • Day {daysSinceJoined} of your healing journey
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-lg px-3 py-1">
                  {user.xp.toLocaleString()} XP
                </Badge>
                <Badge className={`bg-orange-500/20 border-orange-500/50 text-lg px-3 py-1 ${tierColor}`}>
                  {user.tier.toUpperCase()} TIER
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 text-lg px-3 py-1">
                  {user.streakDays} Day Streak 🔥
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-800/50 border border-green-500/30">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{user.dailyXP}</div>
                <div className="text-sm text-gray-400">Daily XP</div>
                <Progress value={progressPercentage} className="mt-2 h-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border border-blue-500/30">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{user.totalSessions}</div>
                <div className="text-sm text-gray-400">Sessions Completed</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border border-purple-500/30">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{mockAchievements.length}</div>
                <div className="text-sm text-gray-400">Achievements</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border border-pink-500/30">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">{daysSinceJoined}</div>
                <div className="text-sm text-gray-400">Days on Platform</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-600">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500">
              📊 Overview
            </TabsTrigger>
            <TabsTrigger value="therapy" className="data-[state=active]:bg-purple-500">
              🎮 Therapy
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-purple-500">
              🏆 Progress
            </TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-purple-500">
              📱 Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Quick Session Access */}
              <Card className="bg-gray-800/50 border border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-400">🎯 Quick Start</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => setActiveTab('therapy')}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    🎮 Start Weekly Therapy Session
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('community')}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    📱 Check Wall of Wounds
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('progress')}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    🏆 View Progress & Achievements
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-gray-800/50 border border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-green-400">🔥 Recent Wins</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAchievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                        <div className="text-2xl">🏆</div>
                        <div className="flex-1">
                          <div className="font-medium text-white">{achievement.title}</div>
                          <div className="text-sm text-gray-400">{achievement.description}</div>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400">
                          +{achievement.xpValue} XP
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Emotional Tone Selector */}
            <Card className="bg-gray-800/50 border border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-xl text-purple-400">🎛️ Current Emotional Tone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(['numb', 'vengeance', 'logic', 'helpOthers'] as const).map((tone) => (
                    <Button
                      key={tone}
                      onClick={() => setUser(prev => ({ ...prev, emotionalTone: tone }))}
                      variant={user.emotionalTone === tone ? 'default' : 'outline'}
                      className={`p-4 h-auto flex-col space-y-2 ${
                        user.emotionalTone === tone 
                          ? 'bg-purple-500 text-white' 
                          : 'border-gray-600 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      <div className="text-2xl">
                        {tone === 'numb' ? '😶' : 
                         tone === 'vengeance' ? '😤' : 
                         tone === 'logic' ? '🤖' : '🤝'}
                      </div>
                      <div className="capitalize font-medium">{tone.replace('helpOthers', 'Help Others')}</div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="therapy">
            <WeeklyTherapySession
              userXP={user.xp}
              userWeek={user.week}
              userTier={user.tier}
              onComplete={handleTherapyComplete}
              onAchievementUnlock={handleAchievementUnlock}
              dailyXPGained={user.dailyXP}
              weeklyXPTarget={user.weeklyXPTarget}
              emotionalToneDial={user.emotionalTone}
              onXPUnlock={(cost) => {
                setUser(prev => ({ ...prev, xp: prev.xp - cost }));
              }}
              onPurchaseSession={() => {
                alert('Emergency session purchased for $5!');
              }}
            />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressVisualization
              userXP={user.xp}
              dailyXPGained={user.dailyXP}
              weeklyXPTarget={user.weeklyXPTarget}
              userTier={user.tier}
              recentAchievements={mockAchievements}
              onShareAchievement={(achievement) => {
                alert(`Shared achievement: ${achievement.title}`);
              }}
              onClaimReward={(id) => {
                alert(`Claimed reward for ${id}!`);
              }}
            />
          </TabsContent>

          <TabsContent value="community">
            <EnhancedWallOfWounds
              posts={mockWallPosts}
              userAlias={user.alias}
              userTier={user.tier}
              userEmotionalTone={user.emotionalTone}
              {...handleWallActions}
            />
          </TabsContent>
        </Tabs>

        {/* Protocol Ghost Chat */}
        <ProtocolGhostChat />
      </div>
    </div>
  );
}
