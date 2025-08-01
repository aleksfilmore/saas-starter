"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AuthWrapper from '@/components/AuthWrapper';
import Link from 'next/link';
import { 
  Shield, Brain, Sparkles, Trophy, Zap, MessageCircle, 
  Calendar, Timer, Heart, Activity, ChevronRight, 
  Star, Flame, Users, TrendingUp, CheckCircle, Eye,
  AlertTriangle, Crown, Target, Clock
} from 'lucide-react';

interface User {
  alias: string;
  level: number;
  xp: number;
  bytes: number;
  streakDays: number;
  tier: 'ghost' | 'firewall' | 'cult-leader';
  completedToday: number;
  lastStalkCheck: string;
  emergencyUsed: boolean;
}

const mockUser: User = {
  alias: 'DigitalPhoenix',
  level: 3,
  xp: 1247,
  bytes: 342,
  streakDays: 12,
  tier: 'firewall',
  completedToday: 3,
  lastStalkCheck: '2 hours ago',
  emergencyUsed: false
};

const coreActions = [
  {
    title: 'No-Contact Tracker',
    description: 'Track healing progress & maintain boundaries',
    icon: Shield,
    href: '/dashboard',
    status: `${mockUser.streakDays} day streak`,
    color: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10'
  },
  {
    title: 'Daily Rituals',
    description: 'Personalized healing protocols based on your archetype',
    icon: Zap,
    href: '/daily-rituals',
    status: `${mockUser.completedToday}/5 completed today`,
    color: 'from-purple-500 to-pink-500',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-500/10'
  },
  {
    title: 'AI Therapy',
    description: 'Text & voice sessions with emotional AI',
    icon: Brain,
    href: '/ai-therapy',
    status: 'Voice trials available',
    color: 'from-green-500 to-emerald-500',
    borderColor: 'border-green-500/30',
    textColor: 'text-green-400',
    bgColor: 'bg-green-500/10'
  },
  {
    title: 'Wall of Wounds™',
    description: 'Anonymous confessions & viral healing cards',
    icon: Sparkles,
    href: '/wall-enhanced',
    status: '127 new confessions',
    color: 'from-red-500 to-orange-500',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
    bgColor: 'bg-red-500/10'
  }
];

const quickStats = [
  { label: 'XP', value: mockUser.xp.toLocaleString(), icon: Star, color: 'text-yellow-400' },
  { label: 'Bytes', value: mockUser.bytes, icon: Crown, color: 'text-purple-400' },
  { label: 'Level', value: mockUser.level, icon: Trophy, color: 'text-blue-400' },
  { label: 'Streak', value: `${mockUser.streakDays}d`, icon: Flame, color: 'text-orange-400' }
];

export default function GlowUpConsole() {
  const [emergencyMode, setEmergencyMode] = useState(false);

  const tierColors = {
    ghost: 'text-gray-400 bg-gray-500/20',
    firewall: 'text-orange-400 bg-orange-500/20',
    'cult-leader': 'text-purple-400 bg-purple-500/20'
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              🎛️ GLOW-UP CONSOLE
            </h1>
            <p className="text-xl text-purple-400">
              Your healing command center
            </p>
          </div>

          {/* User Status Bar */}
          <Card className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-gray-600/50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-1">
                    <div className="h-full w-full rounded-full bg-gray-900 flex items-center justify-center">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Welcome back, {mockUser.alias}</h2>
                    <p className="text-gray-400">Level {mockUser.level} • {mockUser.tier.toUpperCase()} Tier</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {quickStats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className={`flex items-center space-x-1 ${stat.color}`}>
                        <stat.icon className="h-4 w-4" />
                        <span className="font-bold">{stat.value}</span>
                      </div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                  <Badge className={`${tierColors[mockUser.tier]} border-0 px-3 py-1`}>
                    {mockUser.tier.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Section */}
          <Card className="bg-gradient-to-r from-red-900/40 to-orange-900/40 border-2 border-red-500/50 relative">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-400 animate-pulse" />
                  <div>
                    <h3 className="font-bold text-white">Emergency Protocols</h3>
                    <p className="text-sm text-gray-400">Crisis support tools available 24/7</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white border-0 px-6 py-3 text-lg font-bold"
                    disabled={mockUser.emergencyUsed}
                  >
                    🚨 PANIC MODE
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Stalk Resistance Check
                  </Button>
                </div>
              </div>
              
              {/* Quick Crisis Tools */}
              <div className="mt-4 pt-4 border-t border-red-500/30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button variant="ghost" className="justify-start text-sm text-red-300 hover:text-white hover:bg-red-500/20">
                    📞 Crisis Hotline
                  </Button>
                  <Button variant="ghost" className="justify-start text-sm text-orange-300 hover:text-white hover:bg-orange-500/20">
                    🧘 5-Min Breathing Protocol
                  </Button>
                  <Button variant="ghost" className="justify-start text-sm text-purple-300 hover:text-white hover:bg-purple-500/20">
                    💪 Emergency Affirmations
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Core Functions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Card className={`${action.bgColor} border ${action.borderColor} hover:scale-105 transition-all duration-300 cursor-pointer group`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${action.color}`}>
                        <action.icon className="h-8 w-8 text-white" />
                      </div>
                      <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{action.title}</h3>
                    <p className="text-gray-400 mb-4">{action.description}</p>
                    
                    {action.title === 'AI Therapy' && (
                      <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-400 font-semibold text-sm">🎙️ Voice Oracle Trial</p>
                            <p className="text-gray-400 text-xs">3-minute session • 300 Bytes or $3</p>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // Handle voice trial purchase
                            }}
                          >
                            Try Now
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Badge className={`${action.textColor} bg-transparent border border-current`}>
                        {action.status}
                      </Badge>
                      <Button 
                        size="sm" 
                        className={`bg-gradient-to-r ${action.color} hover:opacity-90 text-white border-0`}
                      >
                        Open
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Live Community Metrics */}
          <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-400">194,322</div>
                  <div className="text-xs text-gray-400">Community XP Earned Today</div>
                </div>
                <div className="h-8 w-px bg-purple-500/30"></div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">1,407</div>
                  <div className="text-xs text-gray-400">Confessions Posted</div>
                </div>
                <div className="h-8 w-px bg-purple-500/30"></div>
                <div>
                  <div className="text-2xl font-bold text-green-400">89</div>
                  <div className="text-xs text-gray-400">Streaks Protected</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-800/50 border border-gray-600/50">
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <h4 className="font-bold text-white mb-1">Achievements</h4>
                <p className="text-sm text-gray-400 mb-3">View progress & unlock badges</p>
                <Link href="/achievements">
                  <Button size="sm" variant="outline" className="border-yellow-500 text-yellow-400">
                    View All
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border border-gray-600/50">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <h4 className="font-bold text-white mb-1">Community</h4>
                <p className="text-sm text-gray-400 mb-3">Connect with other healers</p>
                <Link href="/wall-enhanced">
                  <Button size="sm" variant="outline" className="border-blue-500 text-blue-400">
                    Join Wall
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border border-gray-600/50">
              <CardContent className="p-4 text-center">
                <Crown className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <h4 className="font-bold text-white mb-1">Upgrade</h4>
                <p className="text-sm text-gray-400 mb-3">Unlock premium features</p>
                <Link href="/pricing">
                  <Button size="sm" variant="outline" className="border-purple-500 text-purple-400">
                    View Plans
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-gray-800/50 border border-gray-600/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div className="flex-1">
                  <p className="text-white">Completed daily ritual: Morning Firewall Protocol</p>
                  <p className="text-sm text-gray-400">2 hours ago • +25 XP</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                <Shield className="h-5 w-5 text-blue-400" />
                <div className="flex-1">
                  <p className="text-white">Successfully resisted stalking check</p>
                  <p className="text-sm text-gray-400">5 hours ago • Streak maintained</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                <Heart className="h-5 w-5 text-red-400" />
                <div className="flex-1">
                  <p className="text-white">Posted to Wall of Wounds</p>
                  <p className="text-sm text-gray-400">1 day ago • 47 reactions</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </AuthWrapper>
  );
}