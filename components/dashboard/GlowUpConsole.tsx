'use client';

// REFORMAT PROTOCOL™ Glow-Up Console
// Main dashboard interface with XP rings, byte wallet, status displays

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Coins, 
  Flame, 
  Shield, 
  Target, 
  TrendingUp,
  Calendar,
  Star,
  Award,
  Users
} from 'lucide-react';

interface UserStats {
  level: number;
  xp: number;
  nextLevelXP: number;
  progressToNext: number;
  bytes: number;
  streak: number;
  longestStreak: number;
  phase: string;
  ritualsCompleted: number;
  wallPosts: number;
  badgesEarned: number;
  codename: string;
  avatar: string;
}

interface GlowUpConsoleProps {
  userStats: UserStats;
  onNavigate: (section: string) => void;
}

export function GlowUpConsole({ userStats, onNavigate }: GlowUpConsoleProps) {
  const phaseDisplayNames: Record<string, string> = {
    'kernel_wounded': 'KERNEL_WOUNDED',
    'system_stabilizing': 'SYSTEM_STABILIZING', 
    'firewall_active': 'FIREWALL_ACTIVE',
    'protocol_loading': 'PROTOCOL_LOADING',
    'reformat_initialized': 'REFORMAT_INITIALIZED',
    'glow_up_complete': 'GLOW_UP_COMPLETE'
  };

  const phaseColors: Record<string, string> = {
    'kernel_wounded': 'bg-red-900/20 text-red-400 border-red-700',
    'system_stabilizing': 'bg-yellow-900/20 text-yellow-400 border-yellow-700',
    'firewall_active': 'bg-blue-900/20 text-blue-400 border-blue-700',
    'protocol_loading': 'bg-purple-900/20 text-purple-400 border-purple-700',
    'reformat_initialized': 'bg-green-900/20 text-green-400 border-green-700',
    'glow_up_complete': 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white border-transparent'
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
              GLOW-UP CONSOLE
            </h1>
            <p className="text-gray-400">REFORMAT PROTOCOL™ v2.1.0</p>
          </div>
          <Badge className={`text-sm px-4 py-2 ${phaseColors[userStats.phase] || phaseColors['kernel_wounded']}`}>
            {phaseDisplayNames[userStats.phase] || 'KERNEL_WOUNDED'}
          </Badge>
        </div>
        
        {/* Identity Display */}
        <div className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
            {userStats.avatar || '👤'}
          </div>
          <div>
            <h2 className="text-xl font-mono text-cyan-400">{userStats.codename || 'UNASSIGNED'}</h2>
            <p className="text-gray-400">Level {userStats.level} Agent</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* XP Ring Display */}
        <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <Zap className="h-5 w-5" />
              Experience Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-48 h-48 mx-auto mb-6">
              {/* XP Progress Ring */}
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-800"
                />
                {/* Progress ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#xp-gradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${userStats.progressToNext * 2.827} 282.7`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="xp-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-white">{userStats.level}</div>
                <div className="text-sm text-gray-400">LEVEL</div>
                <div className="text-xs text-cyan-400 mt-1">
                  {userStats.xp.toLocaleString()} XP
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-400 mb-2">
                {Math.round(userStats.progressToNext)}% to Level {userStats.level + 1}
              </p>
              <p className="text-sm text-gray-500">
                {(userStats.nextLevelXP - userStats.xp).toLocaleString()} XP needed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Byte Wallet & Quick Stats */}
        <div className="space-y-6">
          {/* Byte Wallet */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Coins className="h-5 w-5" />
                Byte Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {userStats.bytes.toLocaleString()}
              </div>
              <p className="text-gray-400 text-sm mb-4">Digital currency for AI tools</p>
              <Button 
                onClick={() => onNavigate('ai-tools')}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                Spend Bytes
              </Button>
            </CardContent>
          </Card>

          {/* Streak Counter */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <Flame className="h-5 w-5" />
                No-Contact Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-400 mb-1">
                {userStats.streak}
              </div>
              <p className="text-gray-400 text-sm mb-2">days strong</p>
              {userStats.longestStreak > userStats.streak && (
                <p className="text-xs text-gray-500">
                  Best: {userStats.longestStreak} days
                </p>
              )}
              
              {userStats.streak >= 7 && (
                <Badge className="mt-2 bg-orange-900/20 text-orange-400 border-orange-700">
                  Streak Master
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Card 
          className="bg-gray-900 border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors"
          onClick={() => onNavigate('rituals')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Rituals Complete</p>
                <p className="text-2xl font-bold text-purple-400">{userStats.ritualsCompleted}</p>
              </div>
              <Target className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-gray-900 border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors"
          onClick={() => onNavigate('wall')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Wall Posts</p>
                <p className="text-2xl font-bold text-blue-400">{userStats.wallPosts}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-gray-900 border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors"
          onClick={() => onNavigate('badges')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Badges Earned</p>
                <p className="text-2xl font-bold text-green-400">{userStats.badgesEarned}</p>
              </div>
              <Award className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-gray-900 border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors"
          onClick={() => onNavigate('progress')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Progress</p>
                <p className="text-2xl font-bold text-cyan-400">{Math.round(userStats.progressToNext)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            onClick={() => onNavigate('today-ritual')}
            className="h-20 flex flex-col gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <Calendar className="h-6 w-6" />
            <span>Today's Ritual</span>
          </Button>
          
          <Button 
            onClick={() => onNavigate('wall')}
            className="h-20 flex flex-col gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Users className="h-6 w-6" />
            <span>Wall of Wounds</span>
          </Button>
          
          <Button 
            onClick={() => onNavigate('ai-tools')}
            className="h-20 flex flex-col gap-2 bg-yellow-600 hover:bg-yellow-700"
          >
            <Star className="h-6 w-6" />
            <span>AI Tools</span>
          </Button>
          
          <Button 
            onClick={() => onNavigate('streak-shield')}
            className="h-20 flex flex-col gap-2 bg-orange-600 hover:bg-orange-700"
          >
            <Shield className="h-6 w-6" />
            <span>Streak Shield</span>
          </Button>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-mono text-sm">SYSTEM_ONLINE</span>
          </div>
          <div className="text-gray-500 text-xs font-mono">
            PROTOCOL_VERSION: 2.1.0 | UPTIME: 24:7:365
          </div>
        </div>
      </div>
    </div>
  );
}
