import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { 
  calculateDashboardType, 
  getDashboardConfig, 
  hasFeatureAccess,
  DashboardType 
} from '@/lib/user/user-tier-service';
import { getTodaysRitual } from '@/lib/ritual/ritual-engine';

export async function GET(request: NextRequest) {
  try {
    // Get user email from headers (temporary auth method)
    const userEmail = request.headers.get('x-user-email') || 'admin@ctrlaltblock.com';
    
    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user data
    const userData = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail))
      .limit(1);

    if (!userData.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userData[0];

    // Calculate current dashboard type
    const dashboardType = calculateDashboardType({
      id: user.id,
      tier: (user.tier as 'freemium' | 'paid') || 'freemium',
      status: (user.status as 'active' | 'cancelled' | 'trialing') || 'active',
      createdAt: user.createdAt,
      protocolDay: user.protocolDay || 0
    });

    // Update dashboard type if it changed
    if (user.dashboardType !== dashboardType) {
      await db
        .update(users)
        .set({ dashboardType })
        .where(eq(users.id, user.id));
    }

    // Get dashboard configuration
    const dashboardConfig = getDashboardConfig(dashboardType);

    // Get today's ritual
    const todaysRitual = await getTodaysRitual(user.id);

    // Calculate streak status
    const today = new Date();
    const lastRitual = user.lastRitualCompleted;
    const isStreakActive = lastRitual && 
      (today.getTime() - lastRitual.getTime()) < (24 * 60 * 60 * 1000);

    // Build feature flags based on dashboard type
    const featureGates = {
      noContactTracker: hasFeatureAccess(dashboardType, 'no_contact_tracker'),
      dailyLogs: hasFeatureAccess(dashboardType, 'emotional_dial'),
      aiTherapy: hasFeatureAccess(dashboardType, 'ai_therapy_weekly'),
      wallRead: true, // All users can read
      wallPost: hasFeatureAccess(dashboardType, 'wall_write_access'),
      progressAnalytics: dashboardType !== 'freemium',
      byteShop: hasFeatureAccess(dashboardType, 'byte_shop_limited') || 
                hasFeatureAccess(dashboardType, 'byte_shop_full'),
      ritualBank: hasFeatureAccess(dashboardType, 'ritual_bank_limited') ||
                  hasFeatureAccess(dashboardType, 'ritual_bank_full'),
      ritualScheduler: hasFeatureAccess(dashboardType, 'ritual_scheduler'),
      aiCompanion: hasFeatureAccess(dashboardType, 'ai_companion'),
      missionLogs: hasFeatureAccess(dashboardType, 'mission_logs')
    };

    // AI quota information
    const aiQuota = {
      msgsLeft: Math.max(0, 20 - (user.aiQuotaUsed || 0)),
      totalQuota: dashboardType === 'freemium' ? 0 : 20,
      resetAt: user.aiQuotaResetAt?.toISOString() || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      canPurchaseMore: dashboardType !== 'freemium',
      purchaseCost: dashboardType === 'freemium' ? 100 : 50
    };

    // User stats
    const userStats = {
      id: user.id,
      username: user.codename || user.email.split('@')[0],
      email: user.email,
      level: user.level || 1,
      xp: user.xp || 0,
      nextLevelXP: ((user.level || 1) + 1) * 1000,
      progressToNext: Math.floor(((user.xp || 0) % 1000) / 10),
      bytes: user.bytes || 100,
      streak: isStreakActive ? user.streakDays : 0,
      longestStreak: user.longestStreak || 0,
      noContactDays: user.noContactDays || 0,
      avatar: user.avatarStyle || '🔥',
      uxStage: user.uxStage || dashboardType,
      tier: user.tier || 'freemium',
      dashboardType,
      emotionalArchetype: user.emotionalArchetype,
      protocolDay: user.protocolDay || 0,
      joinDate: user.createdAt.toISOString(),
      lastActive: user.lastLogin?.toISOString() || user.createdAt.toISOString()
    };

    // Today's rituals array (for compatibility)
    const todayRituals = todaysRitual ? [
      {
        id: todaysRitual.id,
        title: todaysRitual.title,
        description: todaysRitual.description,
        category: todaysRitual.category,
        intensity: todaysRitual.intensity,
        duration: todaysRitual.duration,
        isCompleted: false,
        completedAt: null,
        xpReward: todaysRitual.xpReward,
        bytesReward: todaysRitual.bytesReward
      }
    ] : [];

    return NextResponse.json({
      user: userStats,
      todayRituals,
      todaysRitual,
      featureGates,
      aiQuota,
      dashboardConfig,
      stats: {
        ritualsCompleted: 0, // TODO: Calculate from database
        totalRituals: todayRituals.length,
        streakActive: isStreakActive,
        canReroll: true, // TODO: Implement reroll limitations
        currentStreak: isStreakActive ? user.streakDays : 0,
        longestStreak: user.longestStreak || 0,
        totalXP: user.xp || 0,
        currentBytes: user.bytes || 100,
        level: user.level || 1,
        noContactDays: user.noContactDays || 0,
        protocolDay: user.protocolDay || 0,
        tier: user.tier || 'freemium',
        dashboardType,
        uxStage: user.uxStage || 'newcomer'
      }
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function getFeatureGates(uxStage: string | null, level: number, noContactDays: number) {
  const gates = {
    noContactTracker: true, // Always available
    dailyLogs: level >= 1, // After first ritual
    aiTherapy: level >= 3 || noContactDays >= 3, // Day 3 or level 3
    wallRead: level >= 5 || noContactDays >= 5, // Day 5 or level 5
    wallPost: level >= 7 || noContactDays >= 7, // Day 7 or level 7
    progressAnalytics: level >= 14 || noContactDays >= 14 // Day 14 or level 14
  }

  // Override based on ux_stage if set
  if (uxStage === 'system_admin') {
    Object.keys(gates).forEach(key => {
      gates[key as keyof typeof gates] = true
    })
  }

  return gates
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
