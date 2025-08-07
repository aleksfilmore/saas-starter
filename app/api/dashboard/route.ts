import { NextRequest, NextResponse } from 'next/server';

interface UserData {
  id: string;
  username: string;
  level: number;
  xp: number;
  nextLevelXP: number;
  progressToNext: number;
  bytes: number;
  streak: number;
  longestStreak: number;
  noContactDays: number;
  avatar: string;
  uxStage: string;
  wallPosts: number;
}

interface Ritual {
  id: string;
  title: string;
  description: string;
  category: string;
  intensity: number;
  duration: number;
  isCompleted: boolean;
  completedAt?: string;
}

interface DashboardData {
  user: UserData;
  todayRituals: Ritual[];
  featureGates: Record<string, boolean>;
  aiQuota: {
    msgsLeft: number;
    totalQuota: number;
    resetAt: string;
    canPurchaseMore: boolean;
    purchaseCost: number;
  };
  stats: {
    ritualsCompleted: number;
    totalRituals: number;
    streakActive: boolean;
    canReroll: boolean;
  };
}

function determineUserStage(days: number, xp: number): string {
  // Power stage: Day 14+ OR XP >= 200
  if (days >= 14 || xp >= 200) {
    return 'power';
  }
  
  // Core stage: Day 5+ OR XP >= 50
  if (days >= 5 || xp >= 50) {
    return 'core';
  }
  
  // Starter stage: Day 0-4
  return 'starter';
}

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email') || 'admin@ctrlaltblock.com';
    
    // Mock user data - in production, this would come from the database
    const mockUser: UserData = {
      id: 'user_1',
      username: 'HealingWarrior',
      level: 3,
      xp: 175,
      nextLevelXP: 200,
      progressToNext: 87.5, // (175/200) * 100
      bytes: 245,
      streak: 7,
      longestStreak: 12,
      noContactDays: 14,
      avatar: '🔥',
      uxStage: determineUserStage(14, 175),
      wallPosts: 3
    };

    // Mock today's ritual - matching useDashboard hook expectations
    const todayRitual = {
      id: 'ritual_breath_firewall',
      name: 'Breath Firewall',
      difficulty: 2,
      xpReward: 20,
      emoji: '🔥',
      description: 'Build emotional barriers through controlled breathing exercises',
      canReroll: true,
      cooldownHours: 24
    };

    // Response structure matching useDashboard hook expectations
    const response = {
      ux_stage: mockUser.uxStage as 'starter' | 'core' | 'power',
      ritual: todayRitual,
      streak: {
        days: mockUser.streak,
        shieldAvailable: mockUser.streak >= 7,
        checkinNeeded: false
      },
      bytes: mockUser.bytes,
      xp: mockUser.xp,
      level: mockUser.level,
      quota: mockUser.uxStage === 'starter' ? 5 : (mockUser.uxStage === 'core' ? 20 : 50),
      user: {
        alias: mockUser.username,
        signupDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        tier: 'ghost' as const,
        hasSubscription: false,
        lastActivity: new Date().toISOString()
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
