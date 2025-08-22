import { db } from '@/lib/db';
import { users, userByteHistory, streakBonuses, byteEarningRules } from '@/lib/db/schema';
import { eq, and, gte, desc, sum } from 'drizzle-orm';
import { BYTE_EARNING_ACTIVITIES, STREAK_BONUSES, GLITCH_BONUSES } from './constants';
import { randomUUID } from 'crypto';

// Import achievement system
import { AchievementService } from './AchievementService';

export class ByteService {
  
  /**
   * Award bytes for completing an activity
   */
  static async awardBytes(
    userId: string, 
    activity: keyof typeof BYTE_EARNING_ACTIVITIES,
    metadata?: Record<string, any>
  ) {
    try {
      const rule = BYTE_EARNING_ACTIVITIES[activity];
      
      // Check if user has already earned bytes for this activity today
      if (rule.dailyLimit) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayEarnings = await db
          .select({ count: sum(userByteHistory.amount) })
          .from(userByteHistory)
          .where(and(
            eq(userByteHistory.userId, userId),
            eq(userByteHistory.activity, activity),
            gte(userByteHistory.createdAt, today),
            gte(userByteHistory.amount, 0) // Only positive amounts (earnings)
          ));
        
        const earnedToday = Number(todayEarnings[0]?.count || 0);
        const maxDaily = rule.bytes * rule.dailyLimit;
        
        if (earnedToday >= maxDaily) {
          return {
            success: false,
            message: `Daily limit reached for ${activity}`,
            bytesAwarded: 0
          };
        }
      }

      // Check weekly limits for AI therapy
      if ('weeklyLimit' in rule && rule.weeklyLimit && activity === 'AI_THERAPY_SESSION') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const weeklyEarnings = await db
          .select({ count: sum(userByteHistory.amount) })
          .from(userByteHistory)
          .where(and(
            eq(userByteHistory.userId, userId),
            eq(userByteHistory.activity, activity),
            gte(userByteHistory.createdAt, weekAgo),
            gte(userByteHistory.amount, 0)
          ));
        
        const earnedThisWeek = Number(weeklyEarnings[0]?.count || 0);
        const maxWeekly = rule.bytes * rule.weeklyLimit;
        
        if (earnedThisWeek >= maxWeekly) {
          return {
            success: false,
            message: `Weekly limit reached for AI therapy sessions. You can still use AI therapy, but bytes are awarded only once per week.`,
            bytesAwarded: 0
          };
        }
      }
      
      // Get current user balance
      const [user] = await db
        .select({ bytes: users.bytes })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      const currentBalance = user.bytes || 0;
      let finalAmount: number = rule.bytes;

      // Apply multipliers if available
      try {
        const multipliedAmount = await AchievementService.applyMultipliers(userId, rule.bytes, activity);
        finalAmount = multipliedAmount;
      } catch (error) {
        console.error('Error applying multipliers:', error);
        finalAmount = rule.bytes; // Fallback to base amount
      }

      const newBalance = currentBalance + finalAmount;
      
      // Update user balance and create history record in transaction
      await db.transaction(async (tx) => {
        // Update user balance
        await tx
          .update(users)
          .set({ 
            bytes: newBalance,
            updatedAt: new Date()
          })
          .where(eq(users.id, userId));
        
        // Create history record
        await tx.insert(userByteHistory).values({
          id: randomUUID(),
          userId,
          type: 'earned',
          activity,
          amount: rule.bytes,
          balanceBefore: currentBalance,
          balanceAfter: newBalance,
          description: rule.description,
          metadata: metadata ? JSON.stringify(metadata) : null
        });
      });
      
      // Check for achievements after awarding bytes
      try {
        await AchievementService.checkAchievements(userId, activity, metadata);
      } catch (error) {
        console.error('Error checking achievements:', error);
        // Don't fail the byte award if achievement check fails
      }
      
      console.log(`✅ Awarded ${finalAmount} Bytes to user ${userId} for ${activity}`);
      
      return {
        success: true,
        message: `Earned ${finalAmount} Bytes for ${rule.description}`,
        bytesAwarded: finalAmount,
        newBalance
      };
      
    } catch (error) {
      console.error('Error awarding bytes:', error);
      return {
        success: false,
        message: 'Failed to award bytes',
        bytesAwarded: 0
      };
    }
  }
  
  /**
   * Spend bytes on a purchase
   */
  static async spendBytes(
    userId: string,
    amount: number,
    description: string,
    relatedId?: string,
    metadata?: Record<string, any>
  ) {
    try {
      // Get current user balance
      const [user] = await db
        .select({ bytes: users.bytes })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      const currentBalance = user.bytes || 0;
      
      if (currentBalance < amount) {
        return {
          success: false,
          message: `Insufficient bytes. You have ${currentBalance}, need ${amount}`,
          newBalance: currentBalance
        };
      }
      
      const newBalance = currentBalance - amount;
      
      // Update balance and create history record in transaction
      await db.transaction(async (tx) => {
        // Update user balance
        await tx
          .update(users)
          .set({ 
            bytes: newBalance,
            updatedAt: new Date()
          })
          .where(eq(users.id, userId));
        
        // Create history record
        await tx.insert(userByteHistory).values({
          id: randomUUID(),
          userId,
          type: 'spent',
          activity: 'purchase',
          amount: -amount, // Negative for spending
          balanceBefore: currentBalance,
          balanceAfter: newBalance,
          description,
          relatedId,
          metadata: metadata ? JSON.stringify(metadata) : null
        });
      });
      
      console.log(`💰 User ${userId} spent ${amount} Bytes on: ${description}`);
      
      return {
        success: true,
        message: `Spent ${amount} Bytes on ${description}`,
        newBalance
      };
      
    } catch (error) {
      console.error('Error spending bytes:', error);
      return {
        success: false,
        message: 'Failed to spend bytes',
        newBalance: 0
      };
    }
  }
  
  /**
   * Award streak bonus
   */
  static async awardStreakBonus(
    userId: string,
    streakType: 'ritual' | 'no_contact' | 'checkin',
    streakDays: number
  ) {
    try {
      // Find matching streak bonus
      const bonusKey = Object.keys(STREAK_BONUSES).find(key => {
        const bonus = STREAK_BONUSES[key as keyof typeof STREAK_BONUSES];
        return bonus.days === streakDays;
      });
      
      if (!bonusKey) {
        return { success: false, message: 'No bonus defined for this streak length' };
      }
      
      const bonus = STREAK_BONUSES[bonusKey as keyof typeof STREAK_BONUSES];
      
      // Check if user already received this streak bonus
      const existingBonus = await db
        .select()
        .from(streakBonuses)
        .where(and(
          eq(streakBonuses.userId, userId),
          eq(streakBonuses.streakType, streakType),
          eq(streakBonuses.streakDays, streakDays)
        ))
        .limit(1);
      
      if (existingBonus.length > 0) {
        return { success: false, message: 'Streak bonus already awarded' };
      }
      
      // Award the bytes
      const byteResult = await this.awardBytes(userId, 'DAILY_RITUAL_1', {
        streakBonus: true,
        streakType,
        streakDays
      });
      
      if (!byteResult.success) {
        return byteResult;
      }
      
      // Record the streak bonus
      await db.insert(streakBonuses).values({
        id: randomUUID(),
        userId,
        streakType,
        streakDays,
        bonusBytes: bonus.bytes,
        badgeAwarded: bonus.badge,
        description: bonus.description
      });
      
      console.log(`🔥 Awarded ${streakDays}-day ${streakType} streak bonus to user ${userId}`);
      
      return {
        success: true,
        message: `${streakDays}-day streak bonus! +${bonus.bytes} Bytes`,
        bytesAwarded: bonus.bytes,
        badgeAwarded: bonus.badge
      };
      
    } catch (error) {
      console.error('Error awarding streak bonus:', error);
      return {
        success: false,
        message: 'Failed to award streak bonus'
      };
    }
  }
  
  /**
   * Generate surprise glitch bonus
   */
  static async generateGlitchBonus(userId: string) {
    try {
      // Random selection based on weights
      const random = Math.random() * 100;
      let bonusAmount: number;
      
      if (random < GLITCH_BONUSES.SMALL.weight) {
        bonusAmount = Math.floor(Math.random() * (GLITCH_BONUSES.SMALL.max - GLITCH_BONUSES.SMALL.min + 1)) + GLITCH_BONUSES.SMALL.min;
      } else if (random < GLITCH_BONUSES.SMALL.weight + GLITCH_BONUSES.MEDIUM.weight) {
        bonusAmount = Math.floor(Math.random() * (GLITCH_BONUSES.MEDIUM.max - GLITCH_BONUSES.MEDIUM.min + 1)) + GLITCH_BONUSES.MEDIUM.min;
      } else {
        bonusAmount = Math.floor(Math.random() * (GLITCH_BONUSES.LARGE.max - GLITCH_BONUSES.LARGE.min + 1)) + GLITCH_BONUSES.LARGE.min;
      }
      
      // Get current balance and award bonus
      const [user] = await db
        .select({ bytes: users.bytes })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      const currentBalance = user.bytes || 0;
      const newBalance = currentBalance + bonusAmount;
      
      // Update balance and create history record
      await db.transaction(async (tx) => {
        await tx
          .update(users)
          .set({ 
            bytes: newBalance,
            updatedAt: new Date()
          })
          .where(eq(users.id, userId));
        
        await tx.insert(userByteHistory).values({
          id: randomUUID(),
          userId,
          type: 'bonus',
          activity: 'glitch_bonus',
          amount: bonusAmount,
          balanceBefore: currentBalance,
          balanceAfter: newBalance,
          description: `Surprise Glitch Bonus! +${bonusAmount} Bytes`,
          metadata: JSON.stringify({ glitchBonus: true, bonusType: 'surprise' })
        });
      });
      
      console.log(`✨ Glitch bonus! Awarded ${bonusAmount} Bytes to user ${userId}`);
      
      return {
        success: true,
        message: `⚡ GLITCH BONUS! +${bonusAmount} Bytes appeared in your wallet!`,
        bytesAwarded: bonusAmount,
        newBalance
      };
      
    } catch (error) {
      console.error('Error generating glitch bonus:', error);
      return {
        success: false,
        message: 'Glitch bonus failed to materialize'
      };
    }
  }
  
  /**
   * Get user's byte balance and recent history
   */
  static async getUserByteInfo(userId: string) {
    try {
      const [user] = await db
        .select({ bytes: users.bytes })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Get recent byte history (last 10 transactions)
      const history = await db
        .select()
        .from(userByteHistory)
        .where(eq(userByteHistory.userId, userId))
        .orderBy(desc(userByteHistory.createdAt))
        .limit(10);
      
      // Get today's earnings
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayEarnings = await db
        .select({ total: sum(userByteHistory.amount) })
        .from(userByteHistory)
        .where(and(
          eq(userByteHistory.userId, userId),
          gte(userByteHistory.createdAt, today),
          gte(userByteHistory.amount, 0) // Only positive amounts
        ));
      
      return {
        balance: user.bytes || 0,
        todayEarnings: Number(todayEarnings[0]?.total || 0),
        recentHistory: history
      };
      
    } catch (error) {
      console.error('Error getting user byte info:', error);
      return {
        balance: 0,
        todayEarnings: 0,
        recentHistory: []
      };
    }
  }
  
  /**
   * Check if user can earn bytes for an activity today
   */
  static async canEarnBytesForActivity(
    userId: string,
    activity: keyof typeof BYTE_EARNING_ACTIVITIES
  ) {
    const rule = BYTE_EARNING_ACTIVITIES[activity];
    
    if (!rule.dailyLimit) {
      return { canEarn: true, remaining: Infinity };
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEarnings = await db
      .select({ count: sum(userByteHistory.amount) })
      .from(userByteHistory)
      .where(and(
        eq(userByteHistory.userId, userId),
        eq(userByteHistory.activity, activity),
        gte(userByteHistory.createdAt, today),
        gte(userByteHistory.amount, 0)
      ));
    
    const earnedToday = Number(todayEarnings[0]?.count || 0);
    const maxDaily = rule.bytes * rule.dailyLimit;
    const remaining = Math.max(0, maxDaily - earnedToday);
    
    return {
      canEarn: remaining > 0,
      remaining: remaining / rule.bytes, // Number of times they can still earn
      earnedToday,
      maxDaily
    };
  }

  /**
   * Get user's current byte balance
   */
  static async getUserBalance(userId: string) {
    try {
      const [user] = await db
        .select({ bytes: users.bytes })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      
      return user?.bytes || 0;
    } catch (error) {
      console.error('Error getting user balance:', error);
      return 0;
    }
  }

  /**
   * Get user's earning statistics
   */
  static async getEarningStats(userId: string) {
    try {
      // Get today's earnings
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayEarnings = await db
        .select({ total: sum(userByteHistory.amount) })
        .from(userByteHistory)
        .where(and(
          eq(userByteHistory.userId, userId),
          gte(userByteHistory.createdAt, today),
          gte(userByteHistory.amount, 0) // Only positive amounts (earnings)
        ));

      // Get this week's earnings
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const weeklyEarnings = await db
        .select({ total: sum(userByteHistory.amount) })
        .from(userByteHistory)
        .where(and(
          eq(userByteHistory.userId, userId),
          gte(userByteHistory.createdAt, weekAgo),
          gte(userByteHistory.amount, 0)
        ));

      // Get all-time earnings
      const allTimeEarnings = await db
        .select({ total: sum(userByteHistory.amount) })
        .from(userByteHistory)
        .where(and(
          eq(userByteHistory.userId, userId),
          gte(userByteHistory.amount, 0)
        ));

      // Get current streak (simplified - checking consecutive days with earnings)
      const recentDays = await db
        .select({ 
          date: userByteHistory.createdAt,
          amount: userByteHistory.amount 
        })
        .from(userByteHistory)
        .where(and(
          eq(userByteHistory.userId, userId),
          gte(userByteHistory.amount, 0)
        ))
        .orderBy(desc(userByteHistory.createdAt))
        .limit(30);

      // Calculate current streak
      let currentStreak = 0;
      const daysWithEarnings = new Set();
      
      for (const earning of recentDays) {
        const earnDate = earning.date.toDateString();
        daysWithEarnings.add(earnDate);
      }

      // Simple streak calculation - consecutive days from today
      const now = new Date();
      while (currentStreak < 30) {
        const checkDate = new Date(now);
        checkDate.setDate(checkDate.getDate() - currentStreak);
        
        if (daysWithEarnings.has(checkDate.toDateString())) {
          currentStreak++;
        } else {
          break;
        }
      }

      return {
        todayEarnings: Number(todayEarnings[0]?.total || 0),
        weeklyEarnings: Number(weeklyEarnings[0]?.total || 0),
        allTimeEarnings: Number(allTimeEarnings[0]?.total || 0),
        currentStreak
      };
    } catch (error) {
      console.error('Error getting earning stats:', error);
      return {
        todayEarnings: 0,
        weeklyEarnings: 0,
        allTimeEarnings: 0,
        currentStreak: 0
      };
    }
  }
}
