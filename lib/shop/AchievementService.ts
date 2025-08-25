/**
 * Achievement Service for CTRL+ALT+BLOCK Byte Economy
 * 
 * Handles tracking, checking, and awarding achievements to users
 */

import { db } from '@/lib/db';
import { users, userByteHistory, userAchievements, userMultipliers } from '@/lib/db/unified-schema';
import { eq, and, gte, count, sum, desc, sql } from 'drizzle-orm';
import { ACHIEVEMENTS, MULTIPLIERS, Achievement, Multiplier } from './achievements';
import { BYTE_EARNING_ACTIVITIES } from './constants';
import { randomUUID } from 'crypto';

export class AchievementService {
  
  /**
   * Check and award achievements for a user after an activity
   */
  static async checkAchievements(
    userId: string, 
    activity: string,
    metadata?: Record<string, any>
  ) {
    try {
      const achievementsToAward: Achievement[] = [];
      
      // Get user's current achievements
      const userAchievementRecords = await db
        .select({ achievementId: userAchievements.achievementId })
        .from(userAchievements)
        .where(eq(userAchievements.userId, userId));
      
      const earnedAchievements = new Set(
        userAchievementRecords.map(record => record.achievementId)
      );

      // Check each achievement
      for (const [achievementId, achievement] of Object.entries(ACHIEVEMENTS)) {
        if (earnedAchievements.has(achievementId)) {
          continue; // Already earned
        }

        const qualifies = await this.checkAchievementRequirement(
          userId, 
          achievement, 
          activity, 
          metadata
        );

        if (qualifies) {
          achievementsToAward.push(achievement);
        }
      }

      // Award achievements
      const results = [];
      for (const achievement of achievementsToAward) {
        const result = await this.awardAchievement(userId, achievement);
        results.push(result);
      }

      return {
        success: true,
        achievementsAwarded: results.filter(r => r.success),
        newAchievements: achievementsToAward.length
      };

    } catch (error) {
      console.error('Error checking achievements:', error);
      return {
        success: false,
        error: 'Failed to check achievements',
        achievementsAwarded: [],
        newAchievements: 0
      };
    }
  }

  /**
   * Check if user meets requirement for specific achievement
   */
  static async checkAchievementRequirement(
    userId: string,
    achievement: Achievement,
    currentActivity?: string,
    metadata?: Record<string, any>
  ): Promise<boolean> {
    const { requirements } = achievement;

    try {
      switch (requirements.type) {
        case 'count':
          return await this.checkCountRequirement(userId, requirements);
        
        case 'streak':
          return await this.checkStreakRequirement(userId, requirements);
        
        case 'total':
          return await this.checkTotalRequirement(userId, requirements);
        
        case 'combination':
          return await this.checkCombinationRequirement(userId, requirements);
        
        default:
          return false;
      }
    } catch (error) {
      console.error('Error checking achievement requirement:', error);
      return false;
    }
  }

  /**
   * Check count-based requirements
   */
  static async checkCountRequirement(
    userId: string,
    requirements: Achievement['requirements']
  ): Promise<boolean> {
    if (!requirements.activity) return false;

    const [result] = await db
      .select({ count: count() })
      .from(userByteHistory)
      .where(and(
        eq(userByteHistory.userId, userId),
        eq(userByteHistory.activity, requirements.activity),
        gte(userByteHistory.amount, 0) // Only positive amounts (earnings)
      ));

    return (result?.count || 0) >= requirements.target;
  }

  /**
   * Check streak-based requirements
   */
  static async checkStreakRequirement(
    userId: string,
    requirements: Achievement['requirements']
  ): Promise<boolean> {
    // Get recent activities to calculate streak
    const recentActivities = await db
      .select({ 
        date: userByteHistory.createdAt,
        activity: userByteHistory.activity
      })
      .from(userByteHistory)
      .where(and(
        eq(userByteHistory.userId, userId),
        gte(userByteHistory.amount, 0)
      ))
      .orderBy(desc(userByteHistory.createdAt))
      .limit(100);

    // Calculate current streak
    const currentStreak = this.calculateStreak(recentActivities);
    return currentStreak >= requirements.target;
  }

  /**
   * Check total earnings requirement
   */
  static async checkTotalRequirement(
    userId: string,
    requirements: Achievement['requirements']
  ): Promise<boolean> {
    const [result] = await db
      .select({ total: sum(userByteHistory.amount) })
      .from(userByteHistory)
      .where(and(
        eq(userByteHistory.userId, userId),
        gte(userByteHistory.amount, 0)
      ));

    return Number(result?.total || 0) >= requirements.target;
  }

  /**
   * Check combination requirements (perfect weeks, etc.)
   */
  static async checkCombinationRequirement(
    userId: string,
    requirements: Achievement['requirements']
  ): Promise<boolean> {
    // For now, implement perfect week logic
    if (requirements.timeframe === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const weekActivities = await db
        .select({ 
          date: userByteHistory.createdAt,
          activity: userByteHistory.activity
        })
        .from(userByteHistory)
        .where(and(
          eq(userByteHistory.userId, userId),
          gte(userByteHistory.createdAt, weekAgo),
          gte(userByteHistory.amount, 0)
        ));

      // Check if user had activities every day for 7 days
      const daysWithActivities = new Set();
      weekActivities.forEach(activity => {
        const day = activity.date.toDateString();
        daysWithActivities.add(day);
      });

      return daysWithActivities.size >= requirements.target;
    }

    return false;
  }

  /**
   * Calculate current streak from activity history
   */
  static calculateStreak(activities: Array<{ date: Date; activity: string }>): number {
    if (activities.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const daysWithActivity = new Set();
    activities.forEach(activity => {
      const activityDate = new Date(activity.date);
      activityDate.setHours(0, 0, 0, 0);
      daysWithActivity.add(activityDate.getTime());
    });

    let streak = 0;
    let checkDate = new Date(today);

    while (streak < 365) { // Max check 1 year
      if (daysWithActivity.has(checkDate.getTime())) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Award achievement to user
   */
  static async awardAchievement(userId: string, achievement: Achievement) {
    try {
      await db.transaction(async (tx) => {
        // Record achievement
        await tx.insert(userAchievements).values({
          id: randomUUID(),
          userId,
          achievementId: achievement.id,
          awardedAt: new Date(),
          byteReward: achievement.rewards.bytes
        });

        // Award Bytes
        if (achievement.rewards.bytes > 0) {
          // Get current balance first
          const userProfile = await tx.select({
            bytes: users.bytes
          }).from(users).where(eq(users.id, userId)).limit(1);
          
          const currentBalance = userProfile[0]?.bytes || 0;
          const newBalance = currentBalance + achievement.rewards.bytes;
          
          // Award bytes directly - avoiding circular dependency
          await tx.insert(userByteHistory).values({
            userId,
            type: 'earned',
            activity: 'ACHIEVEMENT_UNLOCK',
            amount: achievement.rewards.bytes,
            balanceBefore: currentBalance,
            balanceAfter: newBalance,
            description: `Achievement unlocked: ${achievement.name}`,
            metadata: JSON.stringify({
              achievement: true,
              achievementId: achievement.id,
              achievementName: achievement.name
            })
          });

          // Update user balance using raw SQL to add bytes
          await tx.execute(sql`
            UPDATE users 
            SET bytes = bytes + ${achievement.rewards.bytes}
            WHERE id = ${userId}
          `);
        }

        // Unlock multipliers if specified
        if (achievement.rewards.unlocks) {
          for (const unlockId of achievement.rewards.unlocks) {
            const multiplier = MULTIPLIERS[unlockId];
            if (multiplier) {
              await this.awardMultiplier(userId, multiplier, tx);
            }
          }
        }
      });

      console.log(`🏆 Achievement "${achievement.name}" awarded to user ${userId}`);
      
      return {
        success: true,
        achievement,
        message: `Achievement unlocked: ${achievement.name}! +${achievement.rewards.bytes} Bytes`
      };

    } catch (error) {
      console.error('Error awarding achievement:', error);
      return {
        success: false,
        achievement,
        message: 'Failed to award achievement'
      };
    }
  }

  /**
   * Award multiplier to user
   */
  static async awardMultiplier(userId: string, multiplier: Multiplier, tx?: any) {
    const dbInstance = tx || db;
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + parseInt(multiplier.duration));

    await dbInstance.insert(userMultipliers).values({
      id: randomUUID(),
      userId,
      multiplierId: multiplier.id,
      multiplier: multiplier.multiplier,
      activatedAt: new Date(),
      expiresAt,
      isActive: true
    });

    console.log(`⚡ Multiplier "${multiplier.name}" awarded to user ${userId}`);
  }

  /**
   * Get user's achievements
   */
  static async getUserAchievements(userId: string) {
    try {
      const userAchievementRecords = await db
        .select()
        .from(userAchievements)
        .where(eq(userAchievements.userId, userId))
        .orderBy(desc(userAchievements.awardedAt));

      const achievements = userAchievementRecords.map(record => ({
        ...ACHIEVEMENTS[record.achievementId],
        awardedAt: record.awardedAt,
        byteReward: record.byteReward
      }));

      // Calculate progress for unearned achievements
      const earnedIds = new Set(userAchievementRecords.map(r => r.achievementId));
      const availableAchievements = Object.values(ACHIEVEMENTS)
        .filter(achievement => !achievement.isHidden && !earnedIds.has(achievement.id));

      return {
        earned: achievements,
        available: availableAchievements,
        totalEarned: achievements.length,
        totalBytes: achievements.reduce((sum, ach) => sum + ach.byteReward, 0)
      };

    } catch (error) {
      console.error('Error getting user achievements:', error);
      return {
        earned: [],
        available: [],
        totalEarned: 0,
        totalBytes: 0
      };
    }
  }

  /**
   * Get active multipliers for user
   */
  static async getActiveMultipliers(userId: string) {
    try {
      const now = new Date();
      
      const activeMultipliers = await db
        .select()
        .from(userMultipliers)
        .where(and(
          eq(userMultipliers.userId, userId),
          eq(userMultipliers.isActive, true),
          gte(userMultipliers.expiresAt, now)
        ));

      return activeMultipliers.map(record => ({
        ...MULTIPLIERS[record.multiplierId],
        activatedAt: record.activatedAt,
        expiresAt: record.expiresAt,
        multiplier: record.multiplier
      }));

    } catch (error) {
      console.error('Error getting active multipliers:', error);
      return [];
    }
  }

  /**
   * Apply multipliers to byte amount
   */
  static async applyMultipliers(
    userId: string, 
    baseAmount: number, 
    activity: string
  ): Promise<number> {
    try {
      const activeMultipliers = await this.getActiveMultipliers(userId);
      
      let finalAmount = baseAmount;
      
      for (const multiplier of activeMultipliers) {
        // Check if multiplier applies to this activity
        if (!multiplier.conditions || 
            multiplier.conditions.includes(activity) || 
            multiplier.conditions.includes('ALL_ACTIVITIES')) {
          finalAmount *= multiplier.multiplier;
        }
      }

      return Math.floor(finalAmount);

    } catch (error) {
      console.error('Error applying multipliers:', error);
      return baseAmount;
    }
  }
}
