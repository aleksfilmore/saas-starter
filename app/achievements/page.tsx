"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, Star, Award, Zap, Target, Users, Calendar, 
  Shield, Crown, Sparkles, Clock, CheckCircle
} from 'lucide-react';
import Link from 'next/link';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'onboarding' | 'therapy' | 'community' | 'progression' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  xpValue: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: {
    current: number;
    target: number;
  };
}

const mockAchievements: Achievement[] = [
  {
    id: 'welcome-aboard',
    title: 'Welcome Aboard',
    description: 'Joined the CTRL+ALT+BLOCK™ community',
    icon: '🎯',
    category: 'onboarding',
    rarity: 'common',
    xpValue: 50,
    unlocked: true,
    unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'first-session',
    title: 'First Steps',
    description: 'Completed your first therapy session',
    icon: '🎮',
    category: 'therapy',
    rarity: 'common',
    xpValue: 100,
    unlocked: true,
    unlockedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'week-streak',
    title: 'Week Warrior',
    description: '7-day healing session streak',
    icon: '🔥',
    category: 'progression',
    rarity: 'uncommon',
    xpValue: 200,
    unlocked: true,
    unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'wall-warrior',
    title: 'Wall Warrior',
    description: 'Posted 10 times on Wall of Wounds',
    icon: '📱',
    category: 'community',
    rarity: 'common',
    xpValue: 150,
    unlocked: false,
    progress: { current: 7, target: 10 }
  },
  {
    id: 'month-streak',
    title: 'Month Master',
    description: '30-day healing session streak',
    icon: '🏆',
    category: 'progression',
    rarity: 'rare',
    xpValue: 500,
    unlocked: false,
    progress: { current: 12, target: 30 }
  },
  {
    id: 'cult-leader-ascension',
    title: 'Cult Leader Ascension',
    description: 'Achieved ultimate healing tier',
    icon: '👑',
    category: 'special',
    rarity: 'legendary',
    xpValue: 1000,
    unlocked: false
  },
  {
    id: 'helper-healer',
    title: 'Helper Healer',
    description: 'Supported 50 community members',
    icon: '🤝',
    category: 'community',
    rarity: 'uncommon',
    xpValue: 300,
    unlocked: false,
    progress: { current: 23, target: 50 }
  },
  {
    id: 'protocol-ghost',
    title: 'Protocol Ghost',
    description: 'Had an extended conversation with the AI ghost',
    icon: '👻',
    category: 'special',
    rarity: 'uncommon',
    xpValue: 75,
    unlocked: true,
    unlockedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  }
];

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [achievements, setAchievements] = useState(mockAchievements);

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const stats = {
    total: achievements.length,
    unlocked: achievements.filter(a => a.unlocked).length,
    totalXP: achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xpValue, 0),
    inProgress: achievements.filter(a => !a.unlocked && a.progress).length
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-500/50 bg-gray-500/20';
      case 'uncommon': return 'text-green-400 border-green-500/50 bg-green-500/20';
      case 'rare': return 'text-blue-400 border-blue-500/50 bg-blue-500/20';
      case 'legendary': return 'text-purple-400 border-purple-500/50 bg-purple-500/20';
      default: return 'text-gray-400 border-gray-500/50 bg-gray-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'onboarding': return <Target className="w-4 h-4" />;
      case 'therapy': return <Zap className="w-4 h-4" />;
      case 'community': return <Users className="w-4 h-4" />;
      case 'progression': return <Trophy className="w-4 h-4" />;
      case 'special': return <Sparkles className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-blue-900/40 border-2 border-purple-500/50">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-white text-center" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              🏆 ACHIEVEMENT SYSTEM
            </CardTitle>
            <p className="text-purple-400 text-center text-lg">
              Track your healing milestones and celebrate progress
            </p>
          </CardHeader>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gray-800/50 border border-green-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{stats.unlocked}</div>
              <div className="text-sm text-gray-400">Unlocked</div>
              <CheckCircle className="w-6 h-6 text-green-400 mx-auto mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border border-blue-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
              <div className="text-sm text-gray-400">Total</div>
              <Trophy className="w-6 h-6 text-blue-400 mx-auto mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border border-purple-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{stats.totalXP}</div>
              <div className="text-sm text-gray-400">XP Earned</div>
              <Star className="w-6 h-6 text-purple-400 mx-auto mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border border-orange-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">{stats.inProgress}</div>
              <div className="text-sm text-gray-400">In Progress</div>
              <Clock className="w-6 h-6 text-orange-400 mx-auto mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <Card className="bg-gray-800/50 border border-gray-600">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setSelectedCategory('all')}
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                className={selectedCategory === 'all' ? 'bg-purple-500' : 'border-gray-600 text-gray-400'}
              >
                All ({achievements.length})
              </Button>
              {['onboarding', 'therapy', 'community', 'progression', 'special'].map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className={selectedCategory === category ? 'bg-purple-500' : 'border-gray-600 text-gray-400'}
                >
                  {getCategoryIcon(category)}
                  <span className="ml-1 capitalize">
                    {category} ({achievements.filter(a => a.category === category).length})
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <Card 
              key={achievement.id} 
              className={`border transition-all duration-300 hover:scale-105 ${
                achievement.unlocked 
                  ? 'bg-gray-800/70 border-green-500/50 shadow-lg shadow-green-500/20' 
                  : 'bg-gray-900/50 border-gray-600'
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity.toUpperCase()}
                    </Badge>
                    {achievement.unlocked && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                        ✓ UNLOCKED
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <CardTitle className={`text-lg ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                    {achievement.title}
                  </CardTitle>
                  <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress */}
                {achievement.progress && !achievement.unlocked && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">
                        {achievement.progress.current}/{achievement.progress.target}
                      </span>
                    </div>
                    <Progress 
                      value={(achievement.progress.current / achievement.progress.target) * 100} 
                      className="h-2" 
                    />
                  </div>
                )}

                {/* Reward */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-bold">+{achievement.xpValue} XP</span>
                  </div>
                  
                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="text-xs text-gray-500">
                      {achievement.unlockedAt.toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Category */}
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(achievement.category)}
                  <span className="text-xs text-gray-400 capitalize">{achievement.category}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-br from-green-900/20 via-blue-900/30 to-purple-900/20 border-2 border-green-500/50">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-white text-center">
              🎯 UNLOCK MORE ACHIEVEMENTS
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-xl text-gray-300">
              Continue your healing journey to unlock more milestones and earn XP rewards!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/enhanced-features-demo">
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                  🎮 Try Enhanced Features
                </Button>
              </Link>
              <Link href="/dashboard/enhanced">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  📊 Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
