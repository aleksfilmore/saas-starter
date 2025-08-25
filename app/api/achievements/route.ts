/**
 * Achievement API Endpoint for CTRL+ALT+BLOCK
 * 
 * Provides achievement data, progress tracking, and multiplier info
 */

import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { AchievementService } from '@/lib/shop/AchievementService';
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES, getAchievementsByCategory } from '@/lib/shop/achievements';

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'overview';

    switch (action) {
      case 'overview':
        return await getAchievementOverview(user.id);
      
      case 'categories':
        return await getAchievementCategories(user.id);
      
      case 'multipliers':
        return await getActiveMultipliers(user.id);
      
      case 'progress':
        return await getAchievementProgress(user.id);
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Achievement API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievement data' },
      { status: 500 }
    );
  }
}

async function getAchievementOverview(userId: string) {
  const achievements = await AchievementService.getUserAchievements(userId);
  const multipliers = await AchievementService.getActiveMultipliers(userId);

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        totalEarned: achievements.totalEarned,
        totalBytes: achievements.totalBytes,
        activeMultipliers: multipliers.length,
        categories: Object.keys(ACHIEVEMENT_CATEGORIES).length
      },
      recentAchievements: achievements.earned.slice(0, 5),
      nextAchievements: achievements.available.slice(0, 3),
      activeMultipliers: multipliers
    }
  });
}

async function getAchievementCategories(userId: string) {
  const achievements = await AchievementService.getUserAchievements(userId);
  const earnedIds = new Set(achievements.earned.map(a => a.id));

  const categoryData = Object.entries(ACHIEVEMENT_CATEGORIES).map(([key, category]) => {
    const categoryAchievements = getAchievementsByCategory(key);
    const earnedInCategory = categoryAchievements.filter(a => earnedIds.has(a.id));
    
    return {
      id: key,
      ...category,
      total: categoryAchievements.length,
      earned: earnedInCategory.length,
      percentage: Math.round((earnedInCategory.length / categoryAchievements.length) * 100),
      achievements: categoryAchievements.map(achievement => ({
        ...achievement,
        isEarned: earnedIds.has(achievement.id)
      }))
    };
  });

  return NextResponse.json({
    success: true,
    data: {
      categories: categoryData,
      totalAchievements: Object.keys(ACHIEVEMENTS).length,
      totalEarned: achievements.totalEarned
    }
  });
}

async function getActiveMultipliers(userId: string) {
  const multipliers = await AchievementService.getActiveMultipliers(userId);

  return NextResponse.json({
    success: true,
    data: {
      activeMultipliers: multipliers,
      totalActive: multipliers.length,
      highestMultiplier: multipliers.reduce((max, m) => 
        Math.max(max, m.multiplier), 1
      )
    }
  });
}

async function getAchievementProgress(userId: string) {
  // This would require implementing progress tracking
  // For now, return basic structure
  return NextResponse.json({
    success: true,
    data: {
      nearCompletion: [], // Achievements close to completion
      recentProgress: [], // Recent progress updates
      streaks: {
        current: 0,
        longest: 0
      }
    }
  });
}
