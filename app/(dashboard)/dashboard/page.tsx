"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import WeeklyTherapySession from '@/components/ai-therapy/WeeklyTherapySession';
import ProtocolGhostChat from '@/components/ai-therapy/ProtocolGhostChat';
import AuthWrapper from '@/components/AuthWrapper';
import Link from 'next/link';
import { 
  Trophy, Zap, Flame, Calendar, MessageCircle, Target, 
  TrendingUp, Award, Timer, Heart, Brain, Shield, 
  ChevronRight, Star, Users, Activity, BarChart3,
  ShieldCheck, Sparkles, Bot, Gamepad2, Home
} from 'lucide-react';

// Mock user data - in real app this would come from your auth/database
const mockUserData = {
  id: 'user_123',
  email: 'warrior@example.com',
  tier: 'firewall' as 'free' | 'firewall' | 'cult-leader',
  xp: 342,
  bytes: 567,
  level: 3,
  currentStreak: 17,
  longestStreak: 28,
  weekInHealing: 4,
  lastSessionDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
  dailyChatUsed: false,
  heartState: 'ANGER_PROCESSING', // From onboarding
  completedRituals: 23,
  wallPosts: 7,
  reactions: 156,
  joinDate: new Date('2024-12-15'),
  viewMode: 'overview' as 'beginner' | 'overview' | 'detailed'
};

export default function DashboardPage() {
  const [userData, setUserData] = useState(mockUserData);
  const [activeTab, setActiveTab] = useState<'overview' | 'therapy' | 'progress' | 'community'>('overview');

  // Calculate progress metrics
  const xpToNextLevel = 500;
  const xpProgress = (userData.xp % xpToNextLevel) / xpToNextLevel * 100;
  const daysActive = Math.floor((Date.now() - userData.joinDate.getTime()) / (1000 * 60 * 60 * 24));

  const handleTherapyComplete = (xp: number, bytes: number) => {
    setUserData(prev => ({
      ...prev,
      xp: prev.xp + xp,
      bytes: prev.bytes + bytes,
      lastSessionDate: new Date(),
      completedRituals: prev.completedRituals + 1
    }));
  };

  const handleXPUnlock = (cost: number) => {
    setUserData(prev => ({
      ...prev,
      xp: prev.xp - cost,
      lastSessionDate: new Date()
    }));
  };

  const handlePurchaseSession = () => {
    // In real app, trigger Stripe payment
    console.log('Purchasing emergency session for $5');
    setUserData(prev => ({
      ...prev,
      lastSessionDate: new Date()
    }));
  };

  const handleChatUsed = () => {
    setUserData(prev => ({
      ...prev,
      dailyChatUsed: true
    }));
  };

  return (
    <AuthWrapper>
      <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: 'url(/bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Floating background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-glitch-pink rounded-full animate-float opacity-40"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-float opacity-60" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-purple-400 rounded-full animate-float opacity-30" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/6 right-1/6 w-1 h-1 bg-glitch-cyan rounded-full animate-float opacity-50" style={{animationDelay: '3s'}}></div>
          <div className="absolute bottom-1/6 left-2/3 w-2 h-2 bg-purple-400 rounded-full animate-float opacity-40" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Header */}
        <div className="relative z-10 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm fixed top-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-black text-white" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  CTRL+ALT+BLOCK™
                </h1>
                <p className="text-sm text-gray-400">
                  Welcome back, <span className="text-purple-400 font-medium">Healing Warrior</span>
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-bold">{userData.xp} XP</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-blue-400" />
                  <span className="text-blue-400 font-bold">{userData.bytes} Bytes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Flame className="h-5 w-5 text-orange-400" />
                  <span className="text-orange-400 font-bold">{userData.currentStreak} day streak</span>
                </div>
                <Badge className={`${
                  userData.tier === 'free' ? 'bg-blue-500/20 text-blue-400' :
                  userData.tier === 'firewall' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {userData.tier.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-xl mb-8">
            {[
              { id: 'overview', label: '🏠 Overview', icon: BarChart3 },
              { id: 'therapy', label: '🎮 AI Therapy', icon: Brain },
              { id: 'progress', label: '📈 Progress', icon: TrendingUp },
              { id: 'community', label: '👥 Community', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Progress Overview */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Level Progress */}
                <Card className="bg-gradient-to-br from-purple-900/20 via-pink-900/30 to-red-900/20 border-2 border-purple-500/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-400">
                      <Trophy className="h-5 w-5 mr-2" />
                      Level {userData.level} Warrior
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Progress to Level {userData.level + 1}</span>
                          <span className="text-purple-400 font-bold">{Math.round(xpProgress)}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                            style={{ width: `${xpProgress}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-black text-white">{userData.xp} / {xpToNextLevel}</p>
                        <p className="text-xs text-gray-400">Experience Points</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* No Contact Streak */}
                <Card className="bg-gradient-to-br from-orange-900/20 via-red-900/30 to-pink-900/20 border-2 border-orange-500/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-orange-400">
                      <ShieldCheck className="h-5 w-5 mr-2" />
                      No Contact Streak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div>
                        <p className="text-6xl font-black text-white">{userData.currentStreak}</p>
                        <p className="text-orange-400 font-medium">days strong</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Personal best:</span>
                          <span className="text-orange-400 font-bold">{userData.longestStreak} days</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div 
                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                            style={{ width: `${(userData.currentStreak / userData.longestStreak) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Healing Timeline */}
                <Card className="bg-gradient-to-br from-blue-900/20 via-cyan-900/30 to-green-900/20 border-2 border-blue-500/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-400">
                      <Calendar className="h-5 w-5 mr-2" />
                      Healing Journey
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-3xl font-black text-white">Week {userData.weekInHealing}</p>
                        <p className="text-sm text-blue-400">in your healing protocol</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Days active:</span>
                          <span className="text-blue-400 font-bold">{daysActive}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Heart state:</span>
                          <Badge className="bg-red-500/20 text-red-400 text-xs">
                            {userData.heartState.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-gray-900/50 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
                      onClick={() => setActiveTab('therapy')}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-purple-400 mb-1">AI Therapy Session</h3>
                        <p className="text-sm text-gray-400">Deep healing protocol</p>
                      </div>
                      <div className="text-3xl group-hover:scale-110 transition-transform">🎮</div>
                    </div>
                    <div className="mt-4">
                      <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                        Next available: {userData.tier === 'free' ? 'Monthly' : 'Bi-weekly'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border border-green-500/30 hover:border-green-500/50 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-green-400 mb-1">Protocol Ghost</h3>
                        <p className="text-sm text-gray-400">24/7 AI confidant</p>
                      </div>
                      <div className="text-3xl group-hover:animate-bounce">👻</div>
                    </div>
                    <div className="mt-4">
                      <Badge className={`text-xs ${
                        userData.dailyChatUsed 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {userData.tier === 'free' 
                          ? (userData.dailyChatUsed ? 'Daily limit used' : 'Daily chat available')
                          : 'Unlimited chats'
                        }
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-orange-400 mb-1">Wall of Wounds</h3>
                        <p className="text-sm text-gray-400">Anonymous confessional</p>
                      </div>
                      <div className="text-3xl group-hover:scale-110 transition-transform">💬</div>
                    </div>
                    <div className="mt-4">
                      <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                        🔥 347 new posts today
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Features Showcase */}
              <Card className="bg-gradient-to-br from-purple-900/20 via-pink-900/30 to-blue-900/20 border-2 border-purple-500/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-400">
                    <Sparkles className="h-5 w-5 mr-2" />
                    🚀 Enhanced Platform Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link href="/dashboard/enhanced">
                      <Card className="bg-gray-800/50 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="text-2xl">📊</div>
                            <div>
                              <h4 className="font-bold text-white group-hover:text-purple-400 transition-colors">Enhanced Dashboard</h4>
                              <p className="text-xs text-gray-400">Next-gen healing center</p>
                            </div>
                          </div>
                          <Badge className="bg-purple-500/20 text-purple-400 text-xs">NEW</Badge>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link href="/enhanced-features-demo">
                      <Card className="bg-gray-800/50 border border-green-500/30 hover:border-green-500/50 transition-all duration-300 cursor-pointer group">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="text-2xl">🎮</div>
                            <div>
                              <h4 className="font-bold text-white group-hover:text-green-400 transition-colors">Interactive Demo</h4>
                              <p className="text-xs text-gray-400">Try all enhanced features</p>
                            </div>
                          </div>
                          <Badge className="bg-green-500/20 text-green-400 text-xs">DEMO</Badge>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link href="/enhanced">
                      <Card className="bg-gray-800/50 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="text-2xl">🎨</div>
                            <div>
                              <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">Enhanced Home</h4>
                              <p className="text-xs text-gray-400">Marketing showcase</p>
                            </div>
                          </div>
                          <Badge className="bg-blue-500/20 text-blue-400 text-xs">ENHANCED</Badge>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link href="/sign-up/enhanced">
                      <Card className="bg-gray-800/50 border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 cursor-pointer group">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="text-2xl">📝</div>
                            <div>
                              <h4 className="font-bold text-white group-hover:text-orange-400 transition-colors">Enhanced Sign-Up</h4>
                              <p className="text-xs text-gray-400">Improved registration</p>
                            </div>
                          </div>
                          <Badge className="bg-orange-500/20 text-orange-400 text-xs">FLOW</Badge>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link href="/implementation-status">
                      <Card className="bg-gray-800/50 border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer group">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="text-2xl">📋</div>
                            <div>
                              <h4 className="font-bold text-white group-hover:text-yellow-400 transition-colors">Implementation Status</h4>
                              <p className="text-xs text-gray-400">Development progress</p>
                            </div>
                          </div>
                          <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">STATUS</Badge>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link href="/achievements">
                      <Card className="bg-gray-800/50 border border-pink-500/30 hover:border-pink-500/50 transition-all duration-300 cursor-pointer group">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="text-2xl">🏆</div>
                            <div>
                              <h4 className="font-bold text-white group-hover:text-pink-400 transition-colors">Achievements</h4>
                              <p className="text-xs text-gray-400">Milestone tracking</p>
                            </div>
                          </div>
                          <Badge className="bg-pink-500/20 text-pink-400 text-xs">REWARDS</Badge>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Link href="/enhanced-features-demo">
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        🚀 Explore All Enhanced Features
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Protocol Tasks */}
              <Card className="bg-gradient-to-br from-blue-900/20 via-cyan-900/30 to-teal-900/20 border-2 border-blue-500/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-400">
                    <Calendar className="h-5 w-5 mr-2" />
                    📅 Today's Protocol Tasks
                  </CardTitle>
                  <p className="text-blue-300 text-sm">
                    Day {daysActive} • Week {userData.weekInHealing} • REPROGRAMMING Phase
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Today's Main Task */}
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-blue-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-blue-400" />
                          <span className="font-medium text-white">Daily Ritual</span>
                          <Badge className="bg-blue-500/20 text-blue-400 text-xs">Week 3</Badge>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400">+75 XP</Badge>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Start a new ritual: every morning, speak out your codename and one core value.
                      </p>
                      <div className="mt-3 flex items-center space-x-2">
                        <Timer className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">5 mins</span>
                      </div>
                    </div>

                    {/* Suggested Based on Mood */}
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-purple-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Brain className="w-4 h-4 text-purple-400" />
                          <span className="font-medium text-white">Mood-Based Suggestion</span>
                          <Badge className="bg-purple-500/20 text-purple-400 text-xs">For Your State</Badge>
                        </div>
                        <Badge className="bg-purple-500/20 text-purple-400">+100 XP</Badge>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Do one thing your ex hated (the food, the playlist, the lipstick). Revel in it.
                      </p>
                      <div className="mt-3 flex items-center space-x-2">
                        <Timer className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">30 mins</span>
                      </div>
                    </div>

                    {/* Emergency Protocol */}
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-orange-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-orange-400" />
                          <span className="font-medium text-white">Emergency Protocol</span>
                          <Badge className="bg-orange-500/20 text-orange-400 text-xs">Always Available</Badge>
                        </div>
                        <Badge className="bg-orange-500/20 text-orange-400">+75 XP</Badge>
                      </div>
                      <p className="text-gray-300 text-sm">
                        "Run Joy Surge" — find a song that makes you dance like a glitch.
                      </p>
                      <div className="mt-3 flex items-center space-x-2">
                        <Timer className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">10 mins</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Link href="/dashboard/enhanced">
                      <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                        📋 View All Today's Tasks & Protocol
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card className="bg-gradient-to-br from-yellow-900/20 via-amber-900/30 to-orange-900/20 border-2 border-yellow-500/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-400">
                    <Award className="h-5 w-5 mr-2" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { emoji: '🎯', title: 'Boundary Boss', desc: 'Set 5 healthy boundaries', new: true },
                      { emoji: '💪', title: 'Week 1 Survivor', desc: 'Completed first week', new: false },
                      { emoji: '🚫', title: 'No Stalking', desc: '7 days no social media stalking', new: false },
                      { emoji: '👻', title: 'Ghost Whisperer', desc: 'Had 10 Protocol Ghost chats', new: true }
                    ].map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/30">
                        <span className="text-2xl">{achievement.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-bold text-white text-sm">{achievement.title}</p>
                            {achievement.new && (
                              <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">NEW</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{achievement.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'therapy' && (
            <div className="space-y-8">
              <WeeklyTherapySession 
                userXP={userData.xp}
                userWeek={userData.weekInHealing}
                userTier={userData.tier}
                lastSessionDate={userData.lastSessionDate}
                onComplete={handleTherapyComplete}
                onXPUnlock={handleXPUnlock}
                onPurchaseSession={handlePurchaseSession}
              />
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-8">
              <Card className="bg-gray-900/50 border border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-blue-400 flex items-center">
                    <BarChart3 className="h-6 w-6 mr-2" />
                    📈 Progress Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center space-y-4">
                      <p className="text-gray-400 text-lg">
                        Advanced progress tracking and analytics dashboard.
                      </p>
                      <p className="text-sm text-gray-500">
                        Detailed mood tracking, therapy session analytics, and healing progress visualization.
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <Link href="/enhanced-features-demo?tab=progress">
                        <Card className="bg-gray-800/50 border border-green-500/30 hover:border-green-500/50 transition-all duration-300 cursor-pointer">
                          <CardContent className="p-4 text-center">
                            <div className="text-3xl mb-3">📊</div>
                            <h4 className="font-bold text-green-400 mb-2">Enhanced Progress Visualization</h4>
                            <p className="text-xs text-gray-400 mb-3">Advanced XP tracking with achievement celebrations</p>
                            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                              🎮 Try Interactive Demo
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                      
                      <Link href="/dashboard/enhanced">
                        <Card className="bg-gray-800/50 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 cursor-pointer">
                          <CardContent className="p-4 text-center">
                            <div className="text-3xl mb-3">🚀</div>
                            <h4 className="font-bold text-purple-400 mb-2">Enhanced Dashboard</h4>
                            <p className="text-xs text-gray-400 mb-3">Full-featured dashboard with all enhancements</p>
                            <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white">
                              📊 Open Enhanced View
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'community' && (
            <div className="space-y-8">
              <Card className="bg-gray-900/50 border border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-purple-400 flex items-center">
                    <Users className="h-6 w-6 mr-2" />
                    🏗️ Wall of Wounds Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center space-y-4">
                      <p className="text-gray-400 text-lg">
                        Anonymous confessional community with enhanced features.
                      </p>
                      <p className="text-sm text-gray-500">
                        Drop your heartbreak into the void. Get reactions from fellow warriors with viral mechanics and emotional tagging.
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <Link href="/enhanced-features-demo?tab=community">
                        <Card className="bg-gray-800/50 border border-pink-500/30 hover:border-pink-500/50 transition-all duration-300 cursor-pointer">
                          <CardContent className="p-4 text-center">
                            <div className="text-3xl mb-3">📱</div>
                            <h4 className="font-bold text-pink-400 mb-2">Enhanced Wall of Wounds</h4>
                            <p className="text-xs text-gray-400 mb-3">Viral mechanics, emotional tagging, tier indicators</p>
                            <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white">
                              🎮 Try Interactive Demo
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                      
                      <Link href="/wall">
                        <Card className="bg-gray-800/50 border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 cursor-pointer">
                          <CardContent className="p-4 text-center">
                            <div className="text-3xl mb-3">💬</div>
                            <h4 className="font-bold text-orange-400 mb-2">Current Wall</h4>
                            <p className="text-xs text-gray-400 mb-3">Basic community features</p>
                            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                              💬 Join Community
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Protocol Ghost Chat - Always Available */}
        <ProtocolGhostChat 
          userTier={userData.tier}
          dailyChatUsed={userData.dailyChatUsed}
          onChatUsed={handleChatUsed}
        />
        
        {/* CSS for animations */}
        <style jsx global>{`
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
            100% { transform: translateY(0px) rotate(360deg); opacity:0.4; }
          }
        `}</style>
      </div>
    </AuthWrapper>
  );
}