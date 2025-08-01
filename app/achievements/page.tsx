'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  unlocked: boolean;
  unlockedAt?: Date;
  category: 'therapy' | 'rituals' | 'social' | 'milestone';
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Mock achievements data - in production this would come from your API
    const mockAchievements: Achievement[] = [
      {
        id: '1',
        title: 'First Session Complete',
        description: 'Complete your first AI therapy session',
        icon: '🎯',
        progress: 1,
        total: 1,
        unlocked: true,
        unlockedAt: new Date(),
        category: 'therapy'
      },
      {
        id: '2',
        title: 'Daily Ritual Starter',
        description: 'Complete 3 consecutive daily rituals',
        icon: '🌅',
        progress: 2,
        total: 3,
        unlocked: false,
        category: 'rituals'
      },
      {
        id: '3',
        title: 'Week Warrior',
        description: 'Maintain your routine for 7 days',
        icon: '⚔️',
        progress: 4,
        total: 7,
        unlocked: false,
        category: 'milestone'
      },
      {
        id: '4',
        title: 'Community Helper',
        description: 'Share an encouraging message on the wall',
        icon: '🤝',
        progress: 0,
        total: 1,
        unlocked: false,
        category: 'social'
      },
      {
        id: '5',
        title: 'Progress Pioneer',
        description: 'Log your mood for 5 consecutive days',
        icon: '📈',
        progress: 3,
        total: 5,
        unlocked: false,
        category: 'therapy'
      },
      {
        id: '6',
        title: 'Ritual Master',
        description: 'Complete 30 daily rituals',
        icon: '👑',
        progress: 8,
        total: 30,
        unlocked: false,
        category: 'rituals'
      }
    ];
    
    setAchievements(mockAchievements);
  }, []);

  const filteredAchievements = achievements.filter(achievement => 
    selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const categories = [
    { id: 'all', name: 'All', icon: '🏆' },
    { id: 'therapy', name: 'Therapy', icon: '🧠' },
    { id: 'rituals', name: 'Rituals', icon: '🌸' },
    { id: 'social', name: 'Social', icon: '👥' },
    { id: 'milestone', name: 'Milestones', icon: '🎖️' }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Your Achievements
          </h1>
          <p className="text-gray-600 mb-4">
            Track your progress and celebrate your journey to wellness
          </p>
          <div className="bg-white rounded-lg p-4 inline-block shadow-sm">
            <span className="text-2xl font-bold text-purple-600">{unlockedCount}</span>
            <span className="text-gray-600 ml-2">of {achievements.length} unlocked</span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-purple-50'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl p-6 shadow-lg border-2 transition-all hover:shadow-xl ${
                achievement.unlocked
                  ? 'border-purple-200 hover:border-purple-300'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Achievement Icon */}
              <div className={`text-4xl mb-4 ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                {achievement.icon}
              </div>

              {/* Achievement Info */}
              <h3 className={`text-xl font-bold mb-2 ${
                achievement.unlocked ? 'text-gray-800' : 'text-gray-500'
              }`}>
                {achievement.title}
              </h3>
              
              <p className={`text-sm mb-4 ${
                achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {achievement.description}
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className={achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}>
                    Progress
                  </span>
                  <span className={achievement.unlocked ? 'text-purple-600 font-semibold' : 'text-gray-400'}>
                    {achievement.progress}/{achievement.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      achievement.unlocked ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                    style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Status */}
              {achievement.unlocked ? (
                <div className="flex items-center justify-between">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    ✓ Unlocked
                  </span>
                  {achievement.unlockedAt && (
                    <span className="text-xs text-gray-500">
                      {achievement.unlockedAt.toLocaleDateString()}
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    🔒 Locked
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No achievements in this category yet
            </h3>
            <p className="text-gray-600">
              Keep working on your journey and achievements will appear here!
            </p>
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="text-center mt-12">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}