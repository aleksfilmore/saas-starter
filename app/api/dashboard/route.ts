import { NextRequest, NextResponse } from 'next/server';

interface DashboardPayload {
  ux_stage: 'starter' | 'core' | 'power';
  ritual: {
    id: string;
    name: string;
    difficulty: number;
    xpReward: number;
    emoji: string;
    description: string;
    canReroll: boolean;
    cooldownHours: number;
  } | null;
  streak: {
    days: number;
    shieldAvailable: boolean;
    checkinNeeded: boolean;
  };
  bytes: number;
  xp: number;
  level: number;
  quota: number;
  wallPreview?: Array<{
    id: string;
    content: string;
    hearts: number;
    replies: number;
    timestamp: string;
    anonymous: boolean;
  }>;
  stats?: {
    bytesChart: Array<{ date: string; bytes: number }>;
    xpChart: Array<{ date: string; xp: number }>;
  };
  user: {
    alias: string;
    signupDate: string;
    tier: 'ghost' | 'firewall' | 'cult_leader';
    hasSubscription: boolean;
    lastActivity: string;
  };
}

function determineUserStage(user: any): 'starter' | 'core' | 'power' {
  const signupDate = new Date(user.signupDate);
  const daysSinceSignup = Math.floor((Date.now() - signupDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Power stage: Day 14+ OR has subscription
  if (daysSinceSignup >= 14 || user.hasSubscription) {
    return 'power';
  }
  
  // Core stage: Day 5+ OR XP >= 50
  if (daysSinceSignup >= 5 || user.xp >= 50) {
    return 'core';
  }
  
  // Starter stage: Day 0-4
  return 'starter';
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const forceStage = url.searchParams.get('stage') as 'starter' | 'core' | 'power' | null;
    
    // Mock user data - replace with actual user lookup
    const mockUser = {
      alias: 'HealingWarrior',
      signupDate: '2025-08-01T00:00:00Z', // 5 days ago
      tier: 'ghost' as const,
      hasSubscription: false,
      lastActivity: new Date().toISOString(),
      xp: 75,
      bytes: 120,
      level: 2
    };

    const ux_stage = forceStage || determineUserStage(mockUser);

    // Mock ritual data
    const currentRitual = {
      id: 'ritual_breath_firewall',
      name: 'Breath Firewall',
      difficulty: 2,
      xpReward: 20,
      emoji: '🔥',
      description: 'Build emotional barriers through controlled breathing',
      canReroll: true,
      cooldownHours: 0
    };

    // Mock streak data
    const streak = {
      days: 3,
      shieldAvailable: true,
      checkinNeeded: false
    };

    // Base payload for all stages
    const basePayload: DashboardPayload = {
      ux_stage,
      ritual: currentRitual,
      streak,
      bytes: mockUser.bytes,
      xp: mockUser.xp,
      level: mockUser.level,
      quota: ux_stage === 'starter' ? 5 : (ux_stage === 'core' ? 180 : 1000),
      user: mockUser
    };

    // Stage-specific data
    if (ux_stage === 'core' || ux_stage === 'power') {
      // Add wall preview for core+ stages
      basePayload.wallPreview = [
        {
          id: 'post_1',
          content: 'Day 12 no contact. Finally feeling like myself again. The urge to text is fading...',
          hearts: 23,
          replies: 5,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          anonymous: true
        },
        {
          id: 'post_2',
          content: 'Panic attack at 3am thinking about them. Used the breath ritual and it actually worked.',
          hearts: 18,
          replies: 3,
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          anonymous: true
        },
        {
          id: 'post_3',
          content: 'Anyone else struggling with mutual friends? They keep bringing up my ex...',
          hearts: 31,
          replies: 12,
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          anonymous: true
        }
      ];
    }

    if (ux_stage === 'power') {
      // Add analytics data for power stage
      basePayload.stats = {
        bytesChart: Array.from({ length: 14 }, (_, i) => ({
          date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          bytes: Math.floor(Math.random() * 50) + 20
        })),
        xpChart: Array.from({ length: 14 }, (_, i) => ({
          date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          xp: Math.floor(Math.random() * 100) + 50
        }))
      };
    }

    return NextResponse.json(basePayload);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
