import { db } from '@/lib/db';
import { referrals, users, subscriptionEvents } from '@/lib/db/schema';
import { eq, and, count, sql } from 'drizzle-orm';
import { AnalyticsService } from '@/lib/analytics/service';
import { AnalyticsEvents } from '@/lib/analytics/events';

/**
 * Referral System
 * Handles referral code generation, tracking, and rewards
 */
export class ReferralService {
  
  /**
   * Generate a unique referral code for a user
   */
  static async generateReferralCode(userId: string): Promise<string> {
    // Generate a unique 8-character code
    const code = this.createRandomCode();
    
    try {
      await db.insert(referrals).values({
        id: crypto.randomUUID(),
        referrerId: userId,
        referralCode: code,
        status: 'pending',
        createdAt: new Date()
      });

      // Track analytics event
      await AnalyticsService.track({
        userId,
        event: AnalyticsEvents.REFERRAL_LINK_GENERATED,
        properties: { referralCode: code }
      });

      return code;
    } catch (error) {
      // If code collision (unlikely), try again
      if (error instanceof Error && error.message.includes('unique constraint')) {
        return this.generateReferralCode(userId);
      }
      throw error;
    }
  }

  /**
   * Get or create referral code for user
   */
  static async getUserReferralCode(userId: string): Promise<string> {
    // Check if user already has a referral code
    const existing = await db
      .select({ referralCode: referrals.referralCode })
      .from(referrals)
      .where(eq(referrals.referrerId, userId))
      .limit(1);

    if (existing.length > 0) {
      return existing[0].referralCode;
    }

    // Generate new one
    return this.generateReferralCode(userId);
  }

  /**
   * Track referral click
   */
  static async trackReferralClick(referralCode: string, ip?: string, userAgent?: string) {
    try {
      const referral = await db
        .select()
        .from(referrals)
        .where(eq(referrals.referralCode, referralCode))
        .limit(1);

      if (referral.length === 0) {
        throw new Error('Invalid referral code');
      }

      // Update click timestamp if not already clicked
      if (!referral[0].clickedAt) {
        await db
          .update(referrals)
          .set({ clickedAt: new Date() })
          .where(eq(referrals.referralCode, referralCode));
      }

      // Track analytics
      await AnalyticsService.track({
        event: 'referral_clicked',
        properties: {
          referralCode,
          referrerId: referral[0].referrerId,
          ip,
          userAgent
        }
      });

      return referral[0];
    } catch (error) {
      console.error('Referral click tracking error:', error);
      throw error;
    }
  }

  /**
   * Complete referral when referee signs up
   */
  static async completeReferralSignup(referralCode: string, refereeId: string) {
    try {
      const referral = await db
        .select()
        .from(referrals)
        .where(eq(referrals.referralCode, referralCode))
        .limit(1);

      if (referral.length === 0) {
        throw new Error('Invalid referral code');
      }

      // Update referral with referee info
      await db
        .update(referrals)
        .set({
          refereeId,
          signedUpAt: new Date(),
          status: 'completed'
        })
        .where(eq(referrals.referralCode, referralCode));

      // Track analytics for both users
      await Promise.all([
        AnalyticsService.track({
          userId: referral[0].referrerId,
          event: AnalyticsEvents.REFERRAL_SIGNUP_COMPLETED,
          properties: {
            referralCode,
            refereeId,
            type: 'referrer'
          }
        }),
        AnalyticsService.track({
          userId: refereeId,
          event: AnalyticsEvents.REFERRAL_SIGNUP_COMPLETED,
          properties: {
            referralCode,
            referrerId: referral[0].referrerId,
            type: 'referee'
          }
        })
      ]);

      // Check for rewards eligibility
      await this.processReferralRewards(referral[0].referrerId, refereeId);

      return referral[0];
    } catch (error) {
      console.error('Referral signup completion error:', error);
      throw error;
    }
  }

  /**
   * Get referral stats for a user
   */
  static async getUserReferralStats(userId: string) {
    // Get all referrals by this user
    const userReferrals = await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerId, userId));

    // Count by status
    const stats = {
      totalReferrals: userReferrals.length,
      pending: userReferrals.filter(r => r.status === 'pending').length,
      completed: userReferrals.filter(r => r.status === 'completed').length,
      rewarded: userReferrals.filter(r => r.status === 'rewarded').length,
      totalRewards: userReferrals.reduce((sum, r) => sum + (r.rewardAmount || 0), 0),
      conversionRate: 0
    };

    // Calculate conversion rate
    const clicked = userReferrals.filter(r => r.clickedAt).length;
    if (clicked > 0) {
      stats.conversionRate = Math.round((stats.completed / clicked) * 10000) / 100;
    }

    return {
      ...stats,
      referrals: userReferrals,
      referralCode: userReferrals[0]?.referralCode
    };
  }

  /**
   * Get top referrers (leaderboard)
   */
  static async getTopReferrers(limit: number = 10) {
    const topReferrers = await db
      .select({
        referrerId: referrals.referrerId,
        referralCount: count(referrals.id),
        totalRewards: count(referrals.rewardAmount)
      })
      .from(referrals)
      .where(eq(referrals.status, 'completed'))
      .groupBy(referrals.referrerId)
      .orderBy(count(referrals.id))
      .limit(limit);

    // Get user info for top referrers
    const referrerStats = await Promise.all(
      topReferrers.map(async (referrer) => {
        const user = await db
          .select({ username: users.username, avatar: users.avatar })
          .from(users)
          .where(eq(users.id, referrer.referrerId))
          .limit(1);

        return {
          ...referrer,
          username: user[0]?.username || 'Anonymous',
          avatar: user[0]?.avatar
        };
      })
    );

    return referrerStats;
  }

  /**
   * Process referral rewards
   */
  private static async processReferralRewards(referrerId: string, refereeId: string) {
    try {
      // Define reward structure
      const REFERRAL_REWARDS = {
        SIGNUP_BONUS: 100, // 100 bytes for successful referral
        SUBSCRIPTION_BONUS: 500, // 500 bytes if referee subscribes
        REFERRER_DISCOUNT: 0.1 // 10% off next subscription
      };

      // Give immediate signup bonus
      await this.giveReferralReward(
        referrerId,
        'signup_bonus',
        REFERRAL_REWARDS.SIGNUP_BONUS,
        'Referral signup bonus'
      );

      // Set up listener for subscription (would be called from subscription webhook)
      // For now, we'll just log that subscription tracking is needed
      console.log('Set up subscription tracking for referee:', refereeId);

    } catch (error) {
      console.error('Referral reward processing error:', error);
    }
  }

  /**
   * Give referral reward to user
   */
  private static async giveReferralReward(
    userId: string,
    rewardType: string,
    amount: number,
    description: string
  ) {
    try {
      // Update user's byte balance (or other reward mechanism)
      await db
        .update(users)
        .set({
          bytes: sql`${users.bytes} + ${amount}`
        })
        .where(eq(users.id, userId));

      // Track analytics
      await AnalyticsService.track({
        userId,
        event: AnalyticsEvents.REFERRAL_REWARD_EARNED,
        properties: {
          rewardType,
          amount,
          description
        }
      });

    } catch (error) {
      console.error('Referral reward error:', error);
    }
  }

  /**
   * Generate random referral code
   */
  private static createRandomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Validate referral code format
   */
  static isValidReferralCode(code: string): boolean {
    if (!code || typeof code !== 'string') return false;
    if (code.length !== 8) return false;
    
    // Check if all characters are A-Z or 0-9
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      if (!(char >= 'A' && char <= 'Z') && !(char >= '0' && char <= '9')) {
        return false;
      }
    }
    return true;
  }

  /**
   * Get referral link for sharing
   */
  static getReferralLink(code: string, baseUrl: string = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'http://localhost:3000'): string {
    return `${baseUrl}/sign-up?ref=${code}`;
  }
}
