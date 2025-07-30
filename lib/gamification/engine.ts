// REFORMAT PROTOCOL™ Gamification Engine
// Handles XP, bytes, levels, badges, and progression tracking

import { db } from '../db/connection';
import { users, xpTransactions, byteTransactions, userBadges, badges } from '../db/reformat-schema';
import { eq, and, sql } from 'drizzle-orm';
import { generateId } from 'lucia';

// =====================================
// XP SYSTEM
// =====================================

export interface XPSource {
  RITUAL_COMPLETION: 'ritual_completion';
  WALL_POST: 'wall_post';
  WALL_REACTION: 'wall_reaction';
  WALL_COMMENT: 'wall_comment';
  STREAK_BONUS: 'streak_bonus';
  BADGE_EARNED: 'badge_earned';
  MILESTONE: 'milestone';
  LOGIN_STREAK: 'login_streak';
  ONBOARDING_COMPLETE: 'onboarding_complete';
}

export const XP_REWARDS: Record<keyof XPSource, number> = {
  RITUAL_COMPLETION: 25,
  WALL_POST: 15,
  WALL_REACTION: 2,
  WALL_COMMENT: 5,
  STREAK_BONUS: 50,
  BADGE_EARNED: 100,
  MILESTONE: 200,
  LOGIN_STREAK: 10,
  ONBOARDING_COMPLETE: 100,
};

export async function awardXP(
  userId: string,
  source: keyof XPSource,
  amount?: number,
  description?: string,
  relatedId?: string
) {
  const xpAmount = amount || XP_REWARDS[source];
  const xpDescription = description || `XP earned from ${source.replace('_', ' ')}`;

  try {
    // Start transaction
    await db.transaction(async (tx) => {
      // Record XP transaction
      await tx.insert(xpTransactions).values({
        id: generateId(15),
        userId,
        amount: xpAmount,
        source,
        description: xpDescription,
        relatedId,
      });

      // Update user's total XP
      await tx.update(users)
        .set({
          xpPoints: sql`${users.xpPoints} + ${xpAmount}`,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      // Check for level up
      await checkLevelUp(tx, userId);
    });

    return { success: true, xpAwarded: xpAmount };
  } catch (error) {
    console.error('Error awarding XP:', error);
    return { success: false, error: 'Failed to award XP' };
  }
}

// Calculate level from XP using progressive curve
export function calculateLevel(xp: number): number {
  if (xp < 100) return 1;
  return Math.floor(Math.sqrt(xp / 50)) + 1;
}

// Calculate XP needed for next level
export function xpForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 50;
}

// Check and handle level ups
async function checkLevelUp(tx: any, userId: string) {
  const user = await tx.select({
    xpPoints: users.xpPoints,
    glowUpLevel: users.glowUpLevel
  }).from(users).where(eq(users.id, userId)).limit(1);

  if (!user.length) return;

  const currentXP = user[0].xpPoints;
  const currentLevel = user[0].glowUpLevel;
  const newLevel = calculateLevel(currentXP);

  if (newLevel > currentLevel) {
    // Level up!
    await tx.update(users)
      .set({
        glowUpLevel: newLevel,
        currentPhase: getPhaseForLevel(newLevel),
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    // Award level up bonus
    await awardXP(userId, 'MILESTONE', 100, `Level ${newLevel} achieved!`);
  }
}

// Phase names based on level
function getPhaseForLevel(level: number): string {
  if (level <= 5) return 'kernel_wounded';
  if (level <= 10) return 'system_stabilizing';
  if (level <= 20) return 'firewall_active';
  if (level <= 35) return 'protocol_loading';
  if (level <= 50) return 'reformat_initialized';
  return 'glow_up_complete';
}

// =====================================
// BYTE SYSTEM (Virtual Currency)
// =====================================

export interface ByteSource {
  EARNED: 'earned';
  SPENT: 'spent';
  PURCHASED: 'purchased';
  BONUS: 'bonus';
  REFUND: 'refund';
}

export const BYTE_REWARDS: Record<string, number> = {
  wall_post: 25,
  wall_comment: 5,
  wall_reaction: 1,
  ritual_completion: 15,
  daily_login: 10,
  streak_milestone: 50,
  onboarding_complete: 100,
};

export const BYTE_COSTS: Record<string, number> = {
  ai_closure_simulator: 50,
  ai_letter_generator: 30,
  ai_tarot_reading: 25,
  ai_reframe_tool: 40,
  streak_shield: 100,
  anonymous_posting: 10,
  priority_wall_boost: 75,
};

export async function awardBytes(
  userId: string,
  amount: number,
  source: keyof ByteSource,
  description: string,
  relatedId?: string
) {
  try {
    await db.transaction(async (tx) => {
      // Record byte transaction
      await tx.insert(byteTransactions).values({
        id: generateId(15),
        userId,
        amount,
        source,
        description,
        relatedId,
      });

      // Update user's byte balance
      await tx.update(users)
        .set({
          byteBalance: sql`${users.byteBalance} + ${amount}`,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
    });

    return { success: true, bytesAwarded: amount };
  } catch (error) {
    console.error('Error awarding bytes:', error);
    return { success: false, error: 'Failed to award bytes' };
  }
}

export async function spendBytes(
  userId: string,
  amount: number,
  purpose: string,
  relatedId?: string
) {
  try {
    // Check if user has enough bytes
    const user = await db.select({
      byteBalance: users.byteBalance
    }).from(users).where(eq(users.id, userId)).limit(1);

    if (!user.length || user[0].byteBalance < amount) {
      return { success: false, error: 'Insufficient bytes' };
    }

    await db.transaction(async (tx) => {
      // Record negative byte transaction
      await tx.insert(byteTransactions).values({
        id: generateId(15),
        userId,
        amount: -amount,
        source: 'spent',
        description: `Spent on ${purpose}`,
        relatedId,
      });

      // Deduct from user's balance
      await tx.update(users)
        .set({
          byteBalance: sql`${users.byteBalance} - ${amount}`,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
    });

    return { success: true, bytesSpent: amount };
  } catch (error) {
    console.error('Error spending bytes:', error);
    return { success: false, error: 'Failed to spend bytes' };
  }
}

// =====================================
// BADGE SYSTEM
// =====================================

export async function checkAndAwardBadges(userId: string, triggerEvent: string, metadata?: any) {
  try {
    // Get user's current stats
    const userStats = await getUserStats(userId);
    
    // Get available badges that user hasn't earned yet
    const availableBadges = await db.select()
      .from(badges)
      .where(
        and(
          eq(badges.isActive, true),
          sql`${badges.id} NOT IN (
            SELECT badge_id FROM ${userBadges} WHERE user_id = ${userId}
          )`
        )
      );

    const badgesEarned = [];

    for (const badge of availableBadges) {
      if (checkBadgeCondition(badge, userStats, triggerEvent, metadata)) {
        // Award the badge
        await db.insert(userBadges).values({
          id: generateId(15),
          userId,
          badgeId: badge.id,
        });

        // Award XP/bytes for earning badge
        if (badge.xpReward > 0) {
          await awardXP(userId, 'BADGE_EARNED', badge.xpReward, `Badge earned: ${badge.name}`);
        }
        if (badge.byteReward > 0) {
          await awardBytes(userId, badge.byteReward, 'BONUS', `Badge reward: ${badge.name}`);
        }

        badgesEarned.push(badge);
      }
    }

    return { success: true, badgesEarned };
  } catch (error) {
    console.error('Error checking badges:', error);
    return { success: false, error: 'Failed to check badges' };
  }
}

function checkBadgeCondition(badge: any, userStats: any, triggerEvent: string, metadata?: any): boolean {
  const condition = badge.unlockCondition;
  if (!condition) return false;

  // Simple condition checking - can be expanded
  switch (badge.id) {
    case 'first_ritual':
      return triggerEvent === 'ritual_completion' && userStats.ritualsCompleted === 1;
    
    case 'wall_warrior':
      return userStats.wallPosts >= 10;
    
    case 'streak_starter':
      return userStats.noContactStreak >= 7;
    
    case 'byte_collector':
      return userStats.totalBytesEarned >= 1000;
    
    // Add more badge conditions
    default:
      return false;
  }
}

// =====================================
// USER STATS & ANALYTICS
// =====================================

export async function getUserStats(userId: string) {
  try {
    const [userInfo] = await db.select({
      xpPoints: users.xpPoints,
      byteBalance: users.byteBalance,
      glowUpLevel: users.glowUpLevel,
      noContactStreak: users.noContactStreak,
      longestStreak: users.longestStreak,
    }).from(users).where(eq(users.id, userId));

    // Get ritual completion count
    const ritualCount = await db.select({ count: sql`count(*)` })
      .from(sql`user_rituals`)
      .where(sql`user_id = ${userId} AND is_completed = true`);

    // Get wall activity
    const wallStats = await db.select({ count: sql`count(*)` })
      .from(sql`wall_posts`)
      .where(sql`user_id = ${userId}`);

    // Get total bytes earned
    const bytesEarned = await db.select({ total: sql`sum(amount)` })
      .from(byteTransactions)
      .where(
        and(
          eq(byteTransactions.userId, userId),
          sql`amount > 0`
        )
      );

    // Get badges earned
    const badgeCount = await db.select({ count: sql`count(*)` })
      .from(userBadges)
      .where(eq(userBadges.userId, userId));

    return {
      ...userInfo,
      ritualsCompleted: ritualCount[0]?.count || 0,
      wallPosts: wallStats[0]?.count || 0,
      totalBytesEarned: bytesEarned[0]?.total || 0,
      badgesEarned: badgeCount[0]?.count || 0,
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return null;
  }
}

// =====================================
// STREAK MANAGEMENT
// =====================================

export async function updateNoContactStreak(userId: string, brokeStreak: boolean = false) {
  try {
    if (brokeStreak) {
      // Reset streak but save longest
      const user = await db.select({
        noContactStreak: users.noContactStreak,
        longestStreak: users.longestStreak,
      }).from(users).where(eq(users.id, userId)).limit(1);

      if (user.length) {
        const currentStreak = user[0].noContactStreak;
        const longestStreak = Math.max(user[0].longestStreak, currentStreak);

        await db.update(users)
          .set({
            noContactStreak: 0,
            longestStreak,
            lastContactDate: new Date(),
            updatedAt: new Date()
          })
          .where(eq(users.id, userId));
      }
    } else {
      // Increment streak
      await db.update(users)
        .set({
          noContactStreak: sql`${users.noContactStreak} + 1`,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      // Award streak milestone bonuses
      const updatedUser = await db.select({ noContactStreak: users.noContactStreak })
        .from(users).where(eq(users.id, userId)).limit(1);

      if (updatedUser.length) {
        const streak = updatedUser[0].noContactStreak;
        
        // Award bonuses for milestone streaks
        if ([7, 14, 30, 60, 90, 180, 365].includes(streak)) {
          await awardXP(userId, 'STREAK_BONUS', streak * 2, `${streak} day streak bonus!`);
          await awardBytes(userId, streak * 5, 'BONUS', `${streak} day streak bonus!`);
        }
      }
    }

    // Check for streak-related badges
    await checkAndAwardBadges(userId, 'streak_update');

    return { success: true };
  } catch (error) {
    console.error('Error updating streak:', error);
    return { success: false, error: 'Failed to update streak' };
  }
}

// =====================================
// PROGRESSION TRACKING
// =====================================

export async function getProgressionSummary(userId: string) {
  try {
    const stats = await getUserStats(userId);
    if (!stats) return null;

    const currentLevel = stats.glowUpLevel;
    const nextLevelXP = xpForNextLevel(currentLevel);
    const progressToNext = ((stats.xpPoints - xpForNextLevel(currentLevel - 1)) / 
                           (nextLevelXP - xpForNextLevel(currentLevel - 1))) * 100;

    return {
      level: currentLevel,
      xp: stats.xpPoints,
      nextLevelXP,
      progressToNext: Math.min(100, Math.max(0, progressToNext)),
      bytes: stats.byteBalance,
      streak: stats.noContactStreak,
      longestStreak: stats.longestStreak,
      phase: getPhaseForLevel(currentLevel),
      ritualsCompleted: stats.ritualsCompleted,
      wallPosts: stats.wallPosts,
      badgesEarned: stats.badgesEarned,
    };
  } catch (error) {
    console.error('Error getting progression summary:', error);
    return null;
  }
}
