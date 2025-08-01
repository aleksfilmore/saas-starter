"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TodaysRecommendedActivities from '@/components/dashboard/TodaysRecommendedActivities';
import WeeklyTherapySession from '@/components/ai-therapy/WeeklyTherapySession';
import ProgressVisualization from '@/components/gamification/ProgressVisualization';
import EnhancedWallOfWounds from '@/components/wall/EnhancedWallOfWounds';
import ProtocolGhostChat from '@/components/ai-therapy/ProtocolGhostChat';
import AuthWrapper from '@/components/AuthWrapper';
import { OnboardingChecklist } from '@/components/onboarding/OnboardingChecklist';
import { 
  XPConfetti,
  LevelUpNotification,
  BadgeUnlockModal,
  AchievementCelebration,
  AnimatedProgressRing
} from '@/components/gamification/GamificationFeedback';
import Link from 'next/link';
import { 
  Trophy, Zap, Flame, Calendar, MessageCircle, Target, 
  TrendingUp, Award, Timer, Heart, Brain, Shield, 
  ChevronRight, Star, Users, Activity, BarChart3,
  ShieldCheck, Sparkles, Bot, Gamepad2, Home, AlertTriangle,
  Clock, CheckCircle, Share2, Coins, Gift, Crown, Rocket, Eye, Play
} from 'lucide-react';

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
  completedTasks: string[];
  protocolType: '30-day' | '90-day';
  level: number;
  bytes: number;
  heartState: string;
  wallPosts: number;
  reactions: number;
  multiplierActive: boolean;
  lastStalkCheck: Date | null;
  emergencyUsedToday: boolean;
  badges?: string[];
}

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
  joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  lastActive: new Date(),
  completedTasks: ['day-15', 'day-16', 'day-14', 'day-13'],
  protocolType: '30-day',
  level: 3,
  bytes: 567,
  heartState: 'ANGER_PROCESSING',
  wallPosts: 7,
  reactions: 156,
  multiplierActive: true,
  lastStalkCheck: new Date(Date.now() - 2 * 60 * 60 * 1000),
  emergencyUsedToday: false,
  badges: []
};

const mockAchievements = [
  { 
    id: 'first-week', 
    title: 'First Week Complete', 
    description: 'Completed your first week of healing',
    type: 'milestone',
    xpValue: 100,
    rarity: 'common'
  },
  { 
    id: 'streak-master', 
    title: 'Streak Master', 
    description: '10-day healing streak achieved',
    type: 'streak',
    xpValue: 250,
    rarity: 'rare'
  }
];

const mockPosts = [
  {
    id: 'post1',
    alias: 'AnonymousHealer',
    avatar: '🔥',
    content: 'Today I realized that my ex\'s Instagram story doesn\'t define my worth. Small win, but it counts.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    emotionalTags: { numb: 5, vengeance: 2, logic: 8, helpOthers: 3 },
    upvotes: 35,
    commentCount: 8,
    isTopGlitch: false,
    isRelatableStream: true,
    userTier: 'firewall' as const
  },
  {
    id: 'post2', 
    alias: 'DigitalDetoxer',
    avatar: '🛡️',
    content: 'Week 4 complete. The urge to check their social media is getting weaker. Protocol is working.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    emotionalTags: { numb: 3, vengeance: 1, logic: 9, helpOthers: 6 },
    upvotes: 71,
    commentCount: 15,
    isTopGlitch: true,
    isRelatableStream: false,
    userTier: 'cult-leader' as const
  },
  {
    id: 'post3',
    alias: 'PhoenixRising',
    avatar: '🌟',
    content: 'Used the emergency firewall feature today. It stopped me from checking their Instagram and gave me exactly the support I needed. This self-accountability tool works.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    emotionalTags: { numb: 2, vengeance: 0, logic: 7, helpOthers: 9 },
    upvotes: 201,
    commentCount: 34,
    isTopGlitch: true,
    isRelatableStream: true,
    userTier: 'cult-leader' as const
  }
];

export default function EnhancedDashboard() {
  const [user, setUser] = useState<User>(mockUser);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAchievementCelebration, setShowAchievementCelebration] = useState(false);
  const [newAchievement, setNewAchievement] = useState<any>(null);
  const [systemStatus, setSystemStatus] = useState('Firewall Active: Last 24h, 8 users survived a trigger without contact.');
  
  // Gamification feedback states
  const [showXPConfetti, setShowXPConfetti] = useState(false);
  const [showLevelUpNotification, setShowLevelUpNotification] = useState(false);
  const [showBadgeUnlock, setShowBadgeUnlock] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<any>(null);
  const [showOnboardingChecklist, setShowOnboardingChecklist] = useState(false);

  const handleCompleteTask = (taskId: string, xp: number) => {
    const multiplier = user.multiplierActive ? 1.5 : 1;
    const finalXP = Math.floor(xp * multiplier);
    
    const newUser = {
      ...user,
      xp: user.xp + finalXP,
      dailyXP: user.dailyXP + finalXP,
      completedTasks: [...user.completedTasks, taskId]
    };
    
    setUser(newUser);
    
    // Trigger XP confetti for task completion
    setShowXPConfetti(true);
    setTimeout(() => setShowXPConfetti(false), 3000);
    
    // Check for badge unlocks
    checkForBadgeUnlocks(newUser.xp, newUser.completedTasks);
    
    checkLevelUp(newUser.xp);
  };

  const handleEmergencyProtocol = () => {
    // Emergency Firewall: Self-accountability tool for crisis moments
    setUser(prev => ({ ...prev, emergencyUsedToday: true }));
    
    // Show emergency support options
    alert(`EMERGENCY FIREWALL ACTIVATED 🔥
    
This is your safe space. You're about to make a choice you might regret.
    
✅ What happens now:
• Your streak is PROTECTED for 24 hours
• Emergency Protocol Ghost chat is open
• Crisis coping strategies are available
• No judgment - just support

Take a breath. You've got this. 💪`);
    
    // Could trigger:
    // - Open Protocol Ghost in crisis mode
    // - Show emergency coping techniques
    // - Provide distraction activities
    // - Connect to community support
  };

  const handleStalkCheck = (stalked: boolean) => {
    setUser(prev => ({ ...prev, lastStalkCheck: new Date() }));
    if (stalked) {
      triggerEmergencyRitual();
    }
  };

  const triggerEmergencyRitual = () => {
    alert('SYSTEM GLITCH DETECTED! Activating Emergency Ritual...');
  };

  const checkLevelUp = (newXP: number) => {
    const xpToNextLevel = 500;
    const currentLevel = Math.floor(newXP / xpToNextLevel) + 1;
    if (currentLevel > user.level) {
      // Update user level
      setUser(prev => ({ ...prev, level: currentLevel }));
      
      // Trigger level-up notification
      setShowLevelUpNotification(true);
      setTimeout(() => setShowLevelUpNotification(false), 5000);
      
      triggerAchievementCelebration({
        id: 'level-up',
        title: `LEVEL ${currentLevel} UNLOCKED!`,
        description: `System upgraded to Level ${currentLevel}`,
        type: 'milestone',
        xpValue: 0,
        rarity: 'rare'
      });
    }
  };

  const triggerAchievementCelebration = (achievement: any) => {
    setNewAchievement(achievement);
    setShowAchievementCelebration(true);
    setTimeout(() => setShowAchievementCelebration(false), 3000);
  };

  const triggerBadgeUnlock = (badge: any) => {
    setUnlockedBadge(badge);
    setShowBadgeUnlock(true);
    setTimeout(() => setShowBadgeUnlock(false), 4000);
  };

  const checkForBadgeUnlocks = (newXP: number, completedTasks: string[]) => {
    // Check for various badge unlock conditions
    if (newXP >= 1000 && !user.badges?.includes('first-thousand')) {
      const badge = {
        id: 'first-thousand',
        title: 'XP Pioneer',
        description: 'Earned your first 1000 XP',
        icon: '🏅',
        rarity: 'common' as const
      };
      
      // Update user badges
      setUser(prev => ({
        ...prev,
        badges: [...(prev.badges || []), 'first-thousand']
      }));
      
      triggerBadgeUnlock(badge);
    }
    
    if (completedTasks.length >= 10 && !user.badges?.includes('task-master')) {
      const badge = {
        id: 'task-master',
        title: 'Task Master',
        description: 'Completed 10 tasks',
        icon: '✅',
        rarity: 'rare' as const
      };
      
      // Update user badges
      setUser(prev => ({
        ...prev,
        badges: [...(prev.badges || []), 'task-master']
      }));
      
      triggerBadgeUnlock(badge);
    }
  };

  const getNextBestAction = () => {
    if (user.bytes >= 500) {
      return {
        icon: <Coins className="w-5 h-5" />,
        text: "Bytes Ready: Visit the Glitch-Core Marketplace to unlock 'Chaos Gradient' skin!",
        action: () => alert('Marketplace coming soon!'),
        color: 'text-yellow-400'
      };
    }
    if (user.streakDays >= 14) {
      return {
        icon: <Share2 className="w-5 h-5" />,
        text: "Streak Optimized: Share your Firewall Activated badge!",
        action: () => alert('Badge shared to social media!'),
        color: 'text-green-400'
      };
    }
    if (user.completedTasks.length >= 5) {
      return {
        icon: <Gift className="w-5 h-5" />,
        text: "Task Master: Claim your weekly ritual completion reward!",
        action: () => alert('Reward claimed!'),
        color: 'text-purple-400'
      };
    }
    return {
      icon: <Rocket className="w-5 h-5" />,
      text: "Keep going! Complete today's tasks to unlock new possibilities.",
      action: () => setActiveTab('activities'),
      color: 'text-blue-400'
    };
  };

  const progressPercentage = (user.dailyXP / user.weeklyXPTarget) * 100;
  const tierColor = user.tier === 'free' ? 'text-blue-400' : 
                   user.tier === 'firewall' ? 'text-orange-400' : 'text-purple-400';
  
  const daysSinceJoined = Math.floor((Date.now() - user.joinedAt.getTime()) / (1000 * 60 * 60 * 24));
  const xpToNextLevel = 500;
  const xpProgress = (user.xp % xpToNextLevel) / xpToNextLevel * 100;
  const xpUntilNext = xpToNextLevel - (user.xp % xpToNextLevel);
  const nextBestAction = getNextBestAction();

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 p-4">
        {showAchievementCelebration && newAchievement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-purple-900 to-pink-900 p-8 rounded-lg border-2 border-yellow-500 max-w-md mx-4 text-center animate-pulse">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-black text-yellow-400 mb-2">{newAchievement.title}</h2>
              <p className="text-white mb-4">{newAchievement.description}</p>
              <div className="flex gap-2 justify-center">
                <Button className="bg-yellow-500 text-black hover:bg-yellow-400">
                  <Share2 className="w-4 h-4 mr-1" />
                  Share Achievement
                </Button>
                <Button variant="outline" onClick={() => setShowAchievementCelebration(false)}>
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Gamification Feedback Components */}
        {showXPConfetti && (
          <XPConfetti 
            show={showXPConfetti} 
            amount={50} 
            onComplete={() => setShowXPConfetti(false)} 
          />
        )}
        {showLevelUpNotification && (
          <LevelUpNotification 
            show={showLevelUpNotification}
            newLevel={user.level} 
            xpGained={100}
            onClose={() => setShowLevelUpNotification(false)} 
          />
        )}
        {showBadgeUnlock && unlockedBadge && (
          <BadgeUnlockModal 
            show={showBadgeUnlock}
            badge={unlockedBadge}
            onClose={() => setShowBadgeUnlock(false)}
          />
        )}
        <AchievementCelebration 
          show={showAchievementCelebration}
          achievement={newAchievement}
          onClose={() => setShowAchievementCelebration(false)}
        />

        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              🎛️ GLOW-UP CONSOLE
            </h1>
            <p className="text-xl text-purple-400">
              Your healing command center • Week {user.week} • Level {user.level}
            </p>
          </div>

          <Card className="bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-blue-900/40 border-2 border-purple-500/50">
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  {/* User Avatar */}
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 p-1">
                    <div className="h-full w-full rounded-full bg-gray-900 flex items-center justify-center">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <CardTitle className="text-3xl font-black text-white flex items-center">
                      Welcome back, {user.alias} 🔥
                    </CardTitle>
                    <p className="text-purple-400 text-lg mt-2">
                      Week {user.week} • Day {daysSinceJoined} • {user.heartState}
                    </p>
                    <div className="mt-2 text-sm text-gray-400 animate-pulse">
                      {systemStatus}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Badge className={`bg-green-500/20 text-green-400 border-green-500/50 text-lg px-3 py-1 ${user.multiplierActive ? 'animate-pulse' : ''}`}>
                    <Star className="h-4 w-4 mr-1" />
                    {user.xp.toLocaleString()} XP {user.multiplierActive && '⚡'}
                  </Badge>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 text-lg px-3 py-1">
                    <Coins className="h-4 w-4 mr-1" />
                    {user.bytes} Bytes
                  </Badge>
                  <Badge className={`bg-orange-500/20 border-orange-500/50 text-lg px-3 py-1 ${tierColor}`}>
                    {user.tier.toUpperCase()} TIER
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 text-lg px-3 py-1">
                    <Flame className="h-4 w-4 mr-1" />
                    {user.streakDays} Day Streak 🔥
                  </Badge>
                  
                  {user.level <= 3 && (
                    <Button 
                      onClick={() => setShowOnboardingChecklist(!showOnboardingChecklist)}
                      className="bg-purple-500/20 text-purple-400 border border-purple-500/50 hover:bg-purple-500/30"
                      size="sm"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      {showOnboardingChecklist ? 'Hide Guide' : 'View Guide'}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className={`bg-gray-800/50 border border-green-500/30 ${user.multiplierActive ? 'shadow-lg shadow-green-500/20' : ''}`}>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <svg className={`w-20 h-20 transform -rotate-90 ${user.multiplierActive ? 'animate-pulse' : ''}`}>
                      <circle 
                        cx="40" cy="40" r="32" 
                        stroke="rgb(34 197 94 / 0.2)" 
                        strokeWidth="6" 
                        fill="none" 
                      />
                      <circle 
                        cx="40" cy="40" r="32" 
                        stroke={user.multiplierActive ? "rgb(250 204 21)" : "rgb(34 197 94)"} 
                        strokeWidth="6" 
                        fill="none" 
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 32}`}
                        strokeDashoffset={`${2 * Math.PI * 32 * (1 - xpProgress / 100)}`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`font-bold text-sm ${user.multiplierActive ? 'text-yellow-400' : 'text-green-400'}`}>
                        {Math.round(xpProgress)}%
                      </span>
                    </div>
                  </div>
                  <div className={`font-bold text-lg ${user.multiplierActive ? 'text-yellow-400' : 'text-green-400'}`}>
                    {user.dailyXP} XP
                  </div>
                  <div className="text-gray-400 text-xs">Level {user.level} Progress</div>
                  <div className="text-xs text-gray-500 mt-1">{xpUntilNext} to Level {user.level + 1}</div>
                  {user.multiplierActive && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 text-xs mt-1">
                      1.5x MULTIPLIER ACTIVE
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border border-blue-500/30">
              <CardContent className="p-4">
                <div className="text-center">
                  <Brain className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-400">{user.totalSessions}</div>
                  <div className="text-sm text-gray-400">Sessions</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border border-purple-500/30">
              <CardContent className="p-4">
                <div className="text-center">
                  <Trophy className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-400">{mockAchievements.length}</div>
                  <div className="text-sm text-gray-400">Achievements</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border border-pink-500/30">
              <CardContent className="p-4">
                <div className="text-center">
                  <Heart className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-pink-400">{user.reactions}</div>
                  <div className="text-sm text-gray-400">Reactions</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border border-orange-500/30">
              <CardContent className="p-4">
                <div className="text-center">
                  <Coins className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-400">{user.bytes}</div>
                  <div className="text-sm text-gray-400">Bytes</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-2 border-blue-500/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {nextBestAction.icon}
                  <div>
                    <h3 className="text-lg font-bold text-white">Next Best Action</h3>
                    <p className={`${nextBestAction.color} font-medium`}>
                      {nextBestAction.text}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={nextBestAction.action}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Take Action
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-900/40 to-orange-900/40 border-2 border-red-500/50">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2 text-red-400" />
                Emergency Protocols
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="border-red-500 text-red-400 hover:bg-red-500/20 h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => handleEmergencyProtocol()}
                  disabled={user.emergencyUsedToday}
                >
                  <Shield className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-bold">Emergency Firewall</div>
                    <div className="text-sm opacity-75">Self-accountability pause</div>
                  </div>
                  {user.emergencyUsedToday && <Badge className="bg-gray-500">Used Today</Badge>}
                </Button>

                <Button 
                  variant="outline" 
                  className="border-orange-500 text-orange-400 hover:bg-orange-500/20 h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => alert('Opening Crisis Chat...')}
                >
                  <MessageCircle className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-bold">Crisis Chat</div>
                    <div className="text-sm opacity-75">Immediate AI support</div>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/20 h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => handleStalkCheck(false)}
                >
                  <Eye className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-bold">Stalk Check</div>
                    <div className="text-sm opacity-75">Check if you've stalked</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-gray-600">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500">
                📊 Overview
              </TabsTrigger>
              <TabsTrigger value="activities" className="data-[state=active]:bg-purple-500">
                📅 Today's Tasks
              </TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-purple-500">
                🏆 Progress
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TodaysRecommendedActivities 
                  userDay={daysSinceJoined}
                  userWeek={user.week}
                  emotionalTone={user.emotionalTone}
                  completedTasks={user.completedTasks}
                  onCompleteTask={handleCompleteTask}
                  protocolType={user.protocolType}
                />

                <WeeklyTherapySession 
                  userXP={user.xp}
                  userWeek={user.week}
                  userTier={user.tier}
                  lastSessionDate={user.lastActive}
                  onComplete={(xp, bytes) => handleCompleteTask('session', xp)}
                  dailyXPGained={user.dailyXP}
                  weeklyXPTarget={user.weeklyXPTarget}
                  emotionalToneDial={user.emotionalTone === 'helpOthers' ? 'help-others' : user.emotionalTone}
                />
              </div>

              {/* Show onboarding checklist for new users */}
              {(user.level <= 2 || showOnboardingChecklist) && (
                <OnboardingChecklist 
                  userId={user.alias}
                  onItemComplete={(taskId: string) => handleCompleteTask(taskId, 25)}
                />
              )}

              <EnhancedWallOfWounds 
                posts={mockPosts} 
                userAlias={user.alias}
                userTier={user.tier}
                userEmotionalTone={user.emotionalTone === 'helpOthers' ? 'help-others' : user.emotionalTone}
                onSubmitPost={(content) => console.log('Post submitted:', content)}
                onReactToPost={(postId, reaction) => console.log('Reaction:', postId, reaction)}
                onCommentOnPost={(postId, comment) => console.log('Comment:', postId, comment)}
                onSharePost={(postId) => console.log('Share:', postId)}
                onReportPost={(postId) => console.log('Report:', postId)}
              />
            </TabsContent>

            <TabsContent value="activities" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <TodaysRecommendedActivities 
                    userDay={daysSinceJoined}
                    userWeek={user.week}
                    emotionalTone={user.emotionalTone}
                    completedTasks={user.completedTasks}
                    onCompleteTask={handleCompleteTask}
                    protocolType={user.protocolType}
                  />
                </div>
                <div>
                  <ProtocolGhostChat />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProgressVisualization 
                  userXP={user.xp || 0}
                  dailyXPGained={25} // Default daily XP gained
                  weeklyXPTarget={1000} // Default weekly target
                  userTier={user.tier || 'free'}
                  recentAchievements={[]} // Default empty achievements
                  onShareAchievement={(achievement) => {
                    console.log(`Shared achievement: ${achievement.title}`);
                  }}
                  onClaimReward={(achievementId) => {
                    console.log('Reward claimed!');
                  }}
                />
                
                <Card className="bg-gray-800/50 border border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-purple-400" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockAchievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                        <div className="text-2xl">🏆</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{achievement.title}</h4>
                          <p className="text-sm text-gray-400">{achievement.description}</p>
                        </div>
                        <Badge className="bg-purple-500/20 text-purple-400">
                          +{achievement.xpValue} XP
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthWrapper>
  );
}