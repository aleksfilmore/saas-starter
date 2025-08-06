import { NextRequest, NextResponse } from 'next/server';

// Mock achievements data - in production this would come from your database
const generateAchievementData = (userEmail: string) => {
  return {
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
        unlockedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
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
        unlockedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
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
        unlockedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
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
      },
      {
        id: '7',
        title: 'AI Companion',
        description: 'Have 10 AI therapy sessions',
        icon: '🤖',
        rarity: 'rare',
        category: 'growth',
        progress: 7,
        total: 10,
        unlocked: false,
        reward: { xp: 300, bytes: 75 }
      },
      {
        id: '8',
        title: 'Support Network',
        description: 'Share 10 encouraging comments',
        icon: '🤝',
        rarity: 'rare',
        category: 'community',
        progress: 6,
        total: 10,
        unlocked: false,
        reward: { xp: 200, bytes: 60 }
      },
      {
        id: '9',
        title: 'Mindful Moment',
        description: 'Complete a breathing exercise',
        icon: '🧘',
        rarity: 'common',
        category: 'ritual',
        progress: 1,
        total: 1,
        unlocked: true,
        unlockedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        reward: { xp: 75, bytes: 20 }
      },
      {
        id: '10',
        title: 'Month Milestone',
        description: 'Complete 30 days of healing',
        icon: '📅',
        rarity: 'legendary',
        category: 'streak',
        progress: 14,
        total: 30,
        unlocked: false,
        reward: { xp: 1500, bytes: 300, title: 'Healing Champion' }
      }
    ],
    categories: {
      streak: 3,
      ritual: 3,
      community: 2,
      growth: 2,
      special: 0
    }
  };
};

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email');

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email required' },
        { status: 401 }
      );
    }

    const achievementData = generateAchievementData(userEmail);

    return NextResponse.json(achievementData);
  } catch (error) {
    console.error('Achievements API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
