'use client';

// REFORMAT PROTOCOL™ - Adaptive Dashboard
// Progressive disclosure with beginner/advanced modes

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Coins, 
  Flame, 
  Target, 
  Calendar,
  Star,
  Settings,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
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

interface AdaptiveDashboardProps {
  userStats: UserStats;
  onNavigate: (section: string) => void;
}

export function AdaptiveDashboard({ userStats, onNavigate }: AdaptiveDashboardProps) {
  const [viewMode, setViewMode] = useState<'focus' | 'overview' | 'detailed'>('focus');
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);

  const phaseColors: Record<string, string> = {
    'kernel_wounded': 'bg-red-900/20 text-red-400 border-red-700',
    'system_stabilizing': 'bg-yellow-900/20 text-yellow-400 border-yellow-700',
    'firewall_active': 'bg-blue-900/20 text-blue-400 border-blue-700',
    'protocol_loading': 'bg-purple-900/20 text-purple-400 border-purple-700',
    'reformat_initialized': 'bg-green-900/20 text-green-400 border-green-700',
    'glow_up_complete': 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white border-transparent'
  };

  // Determine if user is a beginner (first 2 weeks)
  const isBeginnerLevel = userStats.level <= 5;
  const shouldShowSimplified = isBeginnerLevel && viewMode === 'focus';

  if (shouldShowSimplified) {
    return <BeginnerFocusView userStats={userStats} onNavigate={onNavigate} setViewMode={setViewMode} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Adaptive Header */}
      <div className="border-b border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
              {userStats.codename || 'AGENT_UNKNOWN'}
            </h1>
            <p className="text-gray-400">Level {userStats.level} • {userStats.phase.replace('_', ' ').toUpperCase()}</p>
          </div>
          
          {/* View Mode Selector */}
          <div className="flex items-center gap-2">
            <div className="bg-gray-800 rounded-lg p-1 flex">
              {(['focus', 'overview', 'detailed'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === mode
                      ? 'bg-cyan-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        {viewMode === 'overview' && <OverviewView userStats={userStats} onNavigate={onNavigate} />}
        {viewMode === 'detailed' && <DetailedView userStats={userStats} onNavigate={onNavigate} />}
      </div>
    </div>
  );
}

// 🎯 BEGINNER FOCUS VIEW - Minimal, encouraging
function BeginnerFocusView({ 
  userStats, 
  onNavigate, 
  setViewMode 
}: { 
  userStats: UserStats; 
  onNavigate: (section: string) => void;
  setViewMode: (mode: 'focus' | 'overview' | 'detailed') => void;
}) {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Welcome Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-3xl">
          {userStats.avatar || '🌟'}
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {userStats.codename}</h1>
        <p className="text-gray-400">You're doing great. Let's keep the momentum going.</p>
      </div>

      {/* Today's Focus */}
      <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-700 mb-8">
        <CardHeader>
          <CardTitle className="text-center text-xl text-white">Today's Focus</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {/* Simple Progress Ring */}
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="6" fill="none" className="text-gray-800" />
              <circle
                cx="50" cy="50" r="45" stroke="url(#simple-gradient)" strokeWidth="6" fill="none"
                strokeDasharray={`${userStats.progressToNext * 2.827} 282.7`} strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="simple-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-white">{userStats.level}</div>
              <div className="text-xs text-gray-400">LEVEL</div>
            </div>
          </div>

          {/* Primary Action */}
          <Button 
            onClick={() => onNavigate('today-ritual')}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-4 text-lg"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Start Today's Ritual
          </Button>

          {/* Secondary Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-400">{userStats.streak}</div>
              <div className="text-sm text-gray-400">Day Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{userStats.bytes}</div>
              <div className="text-sm text-gray-400">Bytes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expand Options */}
      <div className="text-center">
        <button
          onClick={() => setViewMode('overview')}
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 mx-auto"
        >
          <Eye className="h-4 w-4" />
          See more tools & stats
        </button>
      </div>
    </div>
  );
}

// 📊 OVERVIEW VIEW - Balanced information density
function OverviewView({ userStats, onNavigate }: { userStats: UserStats; onNavigate: (section: string) => void }) {
  return (
    <div className="space-y-8">
      {/* Hero Section - XP Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gray-900 border-gray-800">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Progress</h2>
                <p className="text-gray-400">Level {userStats.level} → {userStats.level + 1}</p>
              </div>
              <Badge className="bg-purple-900/20 text-purple-400 border-purple-700">
                {Math.round(userStats.progressToNext)}% Complete
              </Badge>
            </div>

            {/* Simplified XP Ring */}
            <div className="relative w-40 h-40 mx-auto">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-800" />
                <circle
                  cx="50" cy="50" r="45" stroke="url(#overview-gradient)" strokeWidth="4" fill="none"
                  strokeDasharray={`${userStats.progressToNext * 2.827} 282.7`} strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="overview-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-white">{userStats.level}</div>
                <div className="text-xs text-gray-400">{userStats.xp.toLocaleString()} XP</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">Streak</p>
                  <p className="text-2xl font-bold text-orange-400">{userStats.streak} days</p>
                </div>
                <Flame className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">Bytes</p>
                  <p className="text-2xl font-bold text-yellow-400">{userStats.bytes}</p>
                </div>
                <Coins className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <Target className="h-6 w-6" />
          <span>Wall of Wounds</span>
        </Button>
        
        <Button 
          onClick={() => onNavigate('ai-tools')}
          className="h-20 flex flex-col gap-2 bg-yellow-600 hover:bg-yellow-700"
        >
          <Star className="h-6 w-6" />
          <span>AI Tools</span>
        </Button>
      </div>
    </div>
  );
}

// 📈 DETAILED VIEW - Full feature access
function DetailedView({ userStats, onNavigate }: { userStats: UserStats; onNavigate: (section: string) => void }) {
  return (
    <div className="space-y-6">
      {/* Full XP Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detailed XP Progress */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <Zap className="h-5 w-5" />
              Experience Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Original complex XP ring implementation */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-800" />
                <circle
                  cx="50" cy="50" r="45" stroke="url(#detailed-gradient)" strokeWidth="4" fill="none"
                  strokeDasharray={`${userStats.progressToNext * 2.827} 282.7`} strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="detailed-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-white">{userStats.level}</div>
                <div className="text-sm text-gray-400">LEVEL</div>
                <div className="text-xs text-cyan-400 mt-1">{userStats.xp.toLocaleString()} XP</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All other detailed components... */}
        <div className="grid grid-cols-2 gap-4">
          {/* Simplified versions of the other stats */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <Coins className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-400">{userStats.bytes}</div>
              <div className="text-sm text-gray-400">Bytes</div>
            </CardContent>
          </Card>
          {/* More detailed stats... */}
        </div>
      </div>

      {/* Full action grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* All the action buttons from original */}
      </div>
    </div>
  );
}
