'use client';

import React, { useState, useEffect } from 'react';
import AuthWrapper from '@/components/AuthWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Trophy, 
  Crown, 
  Star, 
  Target, 
  Flame, 
  Shield, 
  Heart,
  Calendar,
  Zap,
  Award,
  Lock,
  Unlock
} from 'lucide-react';
import Link from 'next/link';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'streak' | 'ritual' | 'community' | 'growth' | 'special';
  progress: number;
  total: number;
  unlocked: boolean;
  unlockedAt?: string;
  reward: {
    xp: number;
    bytes: number;
    title?: string;
  };
}

interface AchievementData {
  user: {
    username: string;
    level: number;
    totalAchievements: number;
    unlockedAchievements: number;
    totalXP: number;
    totalBytes: number;
  };
  achievements: Achievement[];
  categories: Record<string, number>;
}

const rarityColors = {
  common: 'from-gray-500 to-gray-600',
  rare: 'from-blue-500 to-blue-600',
  epic: 'from-purple-500 to-purple-600',
  legendary: 'from-yellow-500 to-orange-500'
};

const rarityBorder = {
  common: 'border-gray-500',
  rare: 'border-blue-500',
  epic: 'border-purple-500',
  legendary: 'border-yellow-500'
};

export default function AchievementsPage() {
  const [achievementData, setAchievementData] = useState<AchievementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockData: AchievementData = {
        user: {
          username: 'Healing Warrior',
          level: 8,
          totalAchievements: 24,
          unlockedAchievements: 12,
          totalXP: 2500,
          totalBytes: 450
        },
        achievements: [
          {
            id: '1',
            title: 'First Steps',
            description: 'Complete your first healing ritual',
            icon: '🌱',
            rarity: 'common',
            category: 'ritual',
            progress: 1,
            total: 1,
            unlocked: true,
            unlockedAt: new Date().toISOString(),
            reward: { xp: 100, bytes: 25 }
          },
          {
            id: '2',
            title: 'Week Warrior',
            description: 'Maintain your healing streak for 7 days',
            icon: '🔥',
            rarity: 'rare',
            category: 'streak',
            progress: 5,
            total: 7,
            unlocked: false,
            reward: { xp: 250, bytes: 50 }
          },
          {
            id: '3',
            title: 'Community Helper',
            description: 'Share your first post on the Wall of Wounds',
            icon: '💬',
            rarity: 'common',
            category: 'community',
            progress: 1,
            total: 1,
            unlocked: true,
            unlockedAt: new Date(Date.now() - 86400000).toISOString(),
            reward: { xp: 150, bytes: 30 }
          },
          {
            id: '4',
            title: 'Growth Mindset',
            description: 'Reach Level 5',
            icon: '📈',
            rarity: 'epic',
            category: 'growth',
            progress: 8,
            total: 5,
            unlocked: true,
            unlockedAt: new Date(Date.now() - 172800000).toISOString(),
            reward: { xp: 500, bytes: 100, title: 'Rising Phoenix' }
          },
          {
            id: '5',
            title: 'Ritual Master',
            description: 'Complete 50 healing rituals',
            icon: '🎯',
            rarity: 'epic',
            category: 'ritual',
            progress: 32,
            total: 50,
            unlocked: false,
            reward: { xp: 750, bytes: 150, title: 'Ritual Guardian' }
          },
          {
            id: '6',
            title: 'Legendary Healer',
            description: 'Maintain a 30-day healing streak',
            icon: '👑',
            rarity: 'legendary',
            category: 'streak',
            progress: 14,
            total: 30,
            unlocked: false,
            reward: { xp: 1000, bytes: 250, title: 'Ascended Healer' }
          }
        ],
        categories: {
          streak: 2,
          ritual: 2,
          community: 1,
          growth: 1,
          special: 0
        }
      };
      
      setAchievementData(mockData);
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAchievements = achievementData?.achievements.filter(
    achievement => selectedCategory === 'all' || achievement.category === selectedCategory
  ) || [];

  const categories = [
    { id: 'all', name: 'All', icon: Star },
    { id: 'streak', name: 'Streaks', icon: Flame },
    { id: 'ritual', name: 'Rituals', icon: Target },
    { id: 'community', name: 'Community', icon: Heart },
    { id: 'growth', name: 'Growth', icon: Zap },
    { id: 'special', name: 'Special', icon: Crown }
  ];

  if (loading) {
    return (
      <AuthWrapper>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-purple-200">Loading achievements...</p>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  if (!achievementData) {
    return (
      <AuthWrapper>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400">Failed to load achievements</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  const { user, achievements } = achievementData;
  const completionPercentage = (user.unlockedAchievements / user.totalAchievements) * 100;

  return (
    <AuthWrapper>
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
                    <Trophy className="inline h-8 w-8 mr-3 text-yellow-400" />
                    Achievements
                  </h1>
                  <p className="text-purple-300 mt-2">
                    Celebrate your healing milestones and unlock rewards
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <Card className="bg-gray-900/50 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-400" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {user.unlockedAchievements}
                  </div>
                  <div className="text-sm text-gray-400">Achievements Unlocked</div>
                  <div className="text-xs text-gray-500">
                    of {user.totalAchievements} total
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">
                    {Math.round(completionPercentage)}%
                  </div>
                  <div className="text-sm text-gray-400">Completion Rate</div>
                  <Progress value={completionPercentage} className="mt-2 h-2" />
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {user.totalXP.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">XP from Achievements</div>
                  <div className="text-xs text-gray-500">
                    Level {user.level}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {user.totalBytes}
                  </div>
                  <div className="text-sm text-gray-400">Bytes Earned</div>
                  <div className="text-xs text-gray-500">
                    from rewards
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{category.name}</span>
                    {category.id !== 'all' && (
                      <Badge variant="secondary" className="ml-1">
                        {achievementData.categories[category.id] || 0}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`group transition-all duration-200 ${
                  achievement.unlocked 
                    ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} border-2 ${rarityBorder[achievement.rarity]} hover:scale-105` 
                    : 'bg-gray-900/50 border-gray-700 hover:bg-gray-800/50'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`text-2xl p-2 rounded-lg ${
                        achievement.unlocked 
                          ? 'bg-white/20' 
                          : 'bg-gray-700 grayscale'
                      }`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          achievement.unlocked ? 'text-white' : 'text-gray-400'
                        }`}>
                          {achievement.title}
                        </h3>
                        <Badge 
                          className={`text-xs ${
                            achievement.unlocked 
                              ? 'bg-white/20 text-white' 
                              : 'bg-gray-700 text-gray-400'
                          }`}
                        >
                          {achievement.rarity.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    {achievement.unlocked ? (
                      <Unlock className="h-5 w-5 text-green-400" />
                    ) : (
                      <Lock className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  
                  <p className={`text-sm mb-4 ${
                    achievement.unlocked ? 'text-gray-200' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                  
                  {!achievement.unlocked && achievement.total > 1 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-gray-400">
                          {achievement.progress} / {achievement.total}
                        </span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.total) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}
                  
                  <div className="border-t border-gray-600 pt-3 mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Zap className="h-4 w-4 text-cyan-400" />
                          <span className="text-cyan-400">+{achievement.reward.xp}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">+{achievement.reward.bytes}</span>
                          <span className="text-yellow-400">✨</span>
                        </div>
                      </div>
                      
                      {achievement.unlocked && achievement.unlockedAt && (
                        <div className="text-xs text-gray-400">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    {achievement.reward.title && achievement.unlocked && (
                      <div className="mt-2">
                        <Badge className="bg-purple-600 text-white">
                          Title: {achievement.reward.title}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex justify-center space-x-4">
            <Link href="/daily-rituals">
              <Button className="bg-green-600 hover:bg-green-700">
                <Target className="h-4 w-4 mr-2" />
                Continue Rituals
              </Button>
            </Link>
            <Link href="/progress">
              <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/20">
                <Trophy className="h-4 w-4 mr-2" />
                View Progress
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </AuthWrapper>
  );
}
