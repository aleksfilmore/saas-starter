"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AuthWrapper from '@/components/AuthWrapper';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  hasCompletedOnboarding: boolean;
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
  emergencyUsed: false,
  hasCompletedOnboarding: true
};

const coreActions = [
  {
    title: 'No-Contact Tracker',
    description: 'Track healing progress & maintain boundaries',
    icon: Shield,
    href: '/no-contact-tracker',
    status: `${mockUser.streakDays} day streak`,
    color: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10'
  },
  {
    title: 'Daily Rituals',
    description: 'Personalized healing protocols',
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
    description: 'Anonymous confessions & healing',
    icon: Sparkles,
    href: '/wall-enhanced',
    status: '127 new confessions',
    color: 'from-red-500 to-orange-500',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
    bgColor: 'bg-red-500/10'
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
    
    if (!onboardingCompleted && !mockUser.hasCompletedOnboarding) {
      router.push('/onboarding-quiz');
      return;
    }
    
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <AuthWrapper>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-white text-xl">Loading Dashboard...</p>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              🎛️ HEALING CONSOLE
            </h1>
            <p className="text-xl text-purple-400">
              Your transformation command center
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
                  <div className="text-center">
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Star className="h-4 w-4" />
                      <span className="font-bold">{mockUser.xp}</span>
                    </div>
                    <div className="text-xs text-gray-400">XP</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center space-x-1 text-purple-400">
                      <Crown className="h-4 w-4" />
                      <span className="font-bold">{mockUser.bytes}</span>
                    </div>
                    <div className="text-xs text-gray-400">Bytes</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center space-x-1 text-orange-400">
                      <Flame className="h-4 w-4" />
                      <span className="font-bold">{mockUser.streakDays}d</span>
                    </div>
                    <div className="text-xs text-gray-400">Streak</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Section */}
          <Card className="bg-gradient-to-r from-red-900/40 to-orange-900/40 border-2 border-red-500/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-400 animate-pulse" />
                  <div>
                    <h3 className="font-bold text-white">Emergency Protocols</h3>
                    <p className="text-sm text-gray-400">Crisis support tools available 24/7</p>
                  </div>
                </div>
                <Button 
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white border-0"
                  onClick={() => setEmergencyMode(true)}
                >
                  🚨 PANIC MODE
                </Button>
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
                <h4 className="font-bold text-white mb-1">Settings</h4>
                <p className="text-sm text-gray-400 mb-3">Manage account & preferences</p>
                <Link href="/settings">
                  <Button size="sm" variant="outline" className="border-purple-500 text-purple-400">
                    Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </AuthWrapper>
  );
}
