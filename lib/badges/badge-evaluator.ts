// CTRL+ALT+BLOCK™ Badge Evaluator Service
// Handles badge unlock conditions, minting, and reward generation

import { db } from '@/lib/db/drizzle';
import { 
  badges, 
  userBadges, 
  badgeEvents, 
  discountCodes, 
  badgeSettings,
  users,
  type BadgeEvent,
  type NewUserBadge,
  type NewDiscountCode,
  type ArchetypeCode 
} from '@/lib/db/badges-schema';
import { eq, and, count, desc, gte, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// =====================================
// EVENT TYPES & PAYLOADS
// =====================================

export type BadgeEventType = 
  | 'check_in_completed'
  | 'ritual_completed'
  | 'ritual_swap'
  | 'wall_reaction_added'
  | 'ai_therapy_session_completed'
  | 'game_bingo_won'
  | 'game_smash_score'
  | 'share_card_generated';

export interface CheckInCompletedPayload {
  timestamp: string;
  streakCount: number;
  shieldUsed?: boolean;
}

export interface RitualCompletedPayload {
  ritualId: string;
  journalWordCount: number;
  timeSpent: number;
  category: string;
}

export interface WallReactionPayload {
  postId: string;
  reactionType: 'heart' | 'fire' | 'cry';
}

export interface AITherapyPayload {
  sessionId: string;
  messagesCount: number;
  completionStatus: 'complete' | 'partial';
}

export interface GameEventPayload {
  gameType: 'bingo' | 'smash';
  score?: number;
  rounds?: number;
  achievement: string;
}

export type EventPayload = 
  | CheckInCompletedPayload
  | RitualCompletedPayload
  | WallReactionPayload
  | AITherapyPayload
  | GameEventPayload;

// =====================================
// BADGE EVALUATOR CLASS
// =====================================

export class BadgeEvaluator {
  private static instance: BadgeEvaluator;

  public static getInstance(): BadgeEvaluator {
    if (!BadgeEvaluator.instance) {
      BadgeEvaluator.instance = new BadgeEvaluator();
    }
    return BadgeEvaluator.instance;
  }

  /**
   * Main entry point: process an event and evaluate badge unlocks
   */
  async handleEvent(
    userId: string, 
    eventType: BadgeEventType, 
    payload: EventPayload
  ): Promise<string[]> {
    try {
      // 1. Log the event (append-only audit trail)
      await this.logEvent(userId, eventType, payload);

      // 2. Get user context
      const user = await this.getUser(userId);
      if (!user) {
        throw new Error(`User ${userId} not found`);
      }

      // 3. Evaluate potential badge unlocks
      const newBadges = await this.evaluateBadgeUnlocks(user, eventType, payload);

      // 4. Mint badges and create rewards
      const mintedBadgeIds: string[] = [];
      for (const badgeId of newBadges) {
        const minted = await this.mintBadge(userId, badgeId, eventType);
        if (minted) {
          mintedBadgeIds.push(badgeId);
        }
      }

      return mintedBadgeIds;
    } catch (error) {
      console.error('BadgeEvaluator.handleEvent error:', error);
      throw error;
    }
  }

  /**
   * Log event to audit trail
   */
  private async logEvent(
    userId: string, 
    eventType: BadgeEventType, 
    payload: EventPayload
  ): Promise<void> {
    await db.insert(badgeEvents).values({
      id: nanoid(),
      userId,
      eventType,
      payloadJson: payload,
      createdAt: new Date()
    });
  }

  /**
   * Get user with badge context
   */
  private async getUser(userId: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    return user;
  }

  /**
   * Evaluate which badges should be unlocked based on event
   */
  private async evaluateBadgeUnlocks(
    user: any, 
    eventType: BadgeEventType, 
    payload: EventPayload
  ): Promise<string[]> {
    const unlockCandidates: string[] = [];

    switch (eventType) {
      case 'check_in_completed':
        unlockCandidates.push(...await this.evaluateStreakBadges(user.id, payload as CheckInCompletedPayload));
        // Game badges also check streaks
        unlockCandidates.push(...await this.evaluateGameBadges(user.id, user.tier, payload));
        break;
      
      case 'ritual_completed':
        unlockCandidates.push(...await this.evaluateRitualBadges(user.id, payload as RitualCompletedPayload));
        // Game badges also check ritual counts
        unlockCandidates.push(...await this.evaluateGameBadges(user.id, user.tier, payload));
        break;
      
      case 'ritual_swap':
        unlockCandidates.push(...await this.evaluateSwapBadges(user.id));
        break;
      
      case 'wall_reaction_added':
        unlockCandidates.push(...await this.evaluateWallBadges(user.id, payload as WallReactionPayload));
        break;
      
      case 'ai_therapy_session_completed':
        unlockCandidates.push(...await this.evaluateTherapyBadges(user.id, user.archetype, payload as AITherapyPayload));
        break;
      
      case 'game_bingo_won':
      case 'game_smash_score':
        unlockCandidates.push(...await this.evaluateGameBadges(user.id, user.tier, payload as GameEventPayload));
        break;
    }

    // Filter out already-earned badges
    const earnedBadges = await this.getEarnedBadgeIds(user.id);
    return unlockCandidates.filter(badgeId => !earnedBadges.includes(badgeId));
  }

  /**
   * Evaluate ritual swap badges (F_SWAP_1, F_SWAP_10)
   */
  private async evaluateSwapBadges(userId: string): Promise<string[]> {
    const candidates: string[] = [];
    const user = await this.getUser(userId);
    if (!user || user.tier !== 'firewall') return candidates; // firewall only
    try {
      const rows = await db.execute(sql`SELECT COUNT(*) as c FROM user_ritual_swaps WHERE user_id = ${userId}`);
      const total = parseInt(((rows[0] as any)?.c ?? '0').toString(),10);
      if (total >= 1) candidates.push('F_SWAP_1');
      if (total >= 10) candidates.push('F_SWAP_10');
    } catch (e) {
      console.warn('Swap badge evaluation failed', e);
    }
    return candidates;
  }

  /**
   * Evaluate streak-based badges (G1, F1, F4)
   */
  private async evaluateStreakBadges(userId: string, payload: CheckInCompletedPayload): Promise<string[]> {
    const candidates: string[] = [];
    const streakCount = payload.streakCount;

    // G1 - Streak Spark (7 days)
    if (streakCount >= 7) {
      candidates.push('G1');
    }

    // Get user tier for Firewall badges
    const user = await this.getUser(userId);
    if (user?.tier === 'firewall' && user.archetype) {
      // F1 - Stream Stabilized (14 days) 
      if (streakCount >= 14) {
        const archetypeBadgeId = this.getArchetypeF1Badge(user.archetype as ArchetypeCode);
        if (archetypeBadgeId) candidates.push(archetypeBadgeId);
      }

      // F4 - Calm Conduit (30 days)
      if (streakCount >= 30) {
        const archetypeBadgeId = this.getArchetypeF4Badge(user.archetype as ArchetypeCode);
        if (archetypeBadgeId) candidates.push(archetypeBadgeId);
      }

      // F6 - Consistency Master (90 days)
      if (streakCount >= 90) {
        const archetypeBadgeId = this.getArchetypeF6Badge(user.archetype as ArchetypeCode);
        if (archetypeBadgeId) candidates.push(archetypeBadgeId);
      }
    }

    return candidates;
  }

  /**
   * Evaluate ritual completion badges (G2, F2, F3, X3)
   */
  private async evaluateRitualBadges(userId: string, payload: RitualCompletedPayload): Promise<string[]> {
    const candidates: string[] = [];

    // Count total ritual completions with journaling
    const ritualCount = await this.countUserRitualCompletions(userId);

    // G2 - Ritual Rookie (10 completions)
    if (ritualCount >= 10) {
      candidates.push('G2');
    }

    // Get user for Firewall badges
    const user = await this.getUser(userId);
    if (user?.tier === 'firewall' && user.archetype) {
      // F2 - Signal Tuner (25 completions)
      if (ritualCount >= 25) {
        const archetypeBadgeId = this.getArchetypeF2Badge(user.archetype as ArchetypeCode);
        if (archetypeBadgeId) candidates.push(archetypeBadgeId);
      }

      // F3 - Surge Controller (45 completions + 3 AI sessions)
      if (ritualCount >= 45) {
        const aiSessionCount = await this.countUserAITherapySessions(userId);
        if (aiSessionCount >= 3) {
          const archetypeBadgeId = this.getArchetypeF3Badge(user.archetype as ArchetypeCode);
          if (archetypeBadgeId) candidates.push(archetypeBadgeId);
        }
      }

      // F5 - Data Mastery (100 completions)
      if (ritualCount >= 100) {
        const archetypeBadgeId = this.getArchetypeF5Badge(user.archetype as ArchetypeCode);
        if (archetypeBadgeId) candidates.push(archetypeBadgeId);
      }

      // F8 - Ultimate Achievement (200 completions)
      if (ritualCount >= 200) {
        const archetypeBadgeId = this.getArchetypeF8Badge(user.archetype as ArchetypeCode);
        if (archetypeBadgeId) candidates.push(archetypeBadgeId);
      }

      // X3 - Ritual Forge (7 rituals in 7 days)
      const weeklyRitualDays = await this.countRitualDaysInWindow(userId, 7);
      if (weeklyRitualDays >= 7) {
        candidates.push('X3');
      }
    }

    return candidates;
  }

  /**
   * Evaluate wall engagement badges (G3)
   */
  private async evaluateWallBadges(userId: string, payload: WallReactionPayload): Promise<string[]> {
    const candidates: string[] = [];

    // Count distinct days with wall reactions
    const reactionDays = await this.countWallReactionDays(userId);
    
    // G3 - Quiet Momentum (5 different days)
    if (reactionDays >= 5) {
      candidates.push('G3');
    }

    // Get user for Firewall badges
    const user = await this.getUser(userId);
    if (user?.tier === 'firewall' && user.archetype) {
      // Count total wall interactions
      const totalInteractions = await this.countWallInteractions(userId);
      
      // F7 - Social Master (25 wall interactions)
      if (totalInteractions >= 25) {
        const archetypeBadgeId = this.getArchetypeF7Badge(user.archetype as ArchetypeCode);
        if (archetypeBadgeId) candidates.push(archetypeBadgeId);
      }
    }

    return candidates;
  }

  /**
   * Evaluate AI therapy badges (contributes to F3)
   */
  private async evaluateTherapyBadges(userId: string, archetype: string, payload: AITherapyPayload): Promise<string[]> {
    // This contributes to F3 but doesn't unlock badges directly
    // F3 evaluation happens in ritual completion
    return [];
  }

  /**
   * Evaluate game achievement badges (X1-X4)
   */
  private async evaluateGameBadges(userId: string, tier: string, payload: any): Promise<string[]> {
    const candidates: string[] = [];

    if (tier !== 'firewall') return candidates; // Games are Firewall-only

    // Get user's current statistics
    const userStats = await this.getUserGameStats(userId);

    // X1 - Digital Initiate (5 rituals + 3 categories + 7-day streak)
    if (userStats.totalRituals >= 5 && 
        userStats.ritualCategories >= 3 && 
        userStats.maxStreak >= 7) {
      candidates.push('X1_Initiate');
    }

    // X2 - System Awakened (25 rituals + 4 categories + 3 firewall badges + 30-day streak)
    if (userStats.totalRituals >= 25 && 
        userStats.ritualCategories >= 4 && 
        userStats.firewallBadges >= 3 && 
        userStats.maxStreak >= 30) {
      candidates.push('X2_Awakened');
    }

    // X3 - Digital Transcendent (75 rituals + 5 categories + 6 firewall badges + 60-day streak)
    if (userStats.totalRituals >= 75 && 
        userStats.ritualCategories >= 5 && 
        userStats.firewallBadges >= 6 && 
        userStats.maxStreak >= 60) {
      candidates.push('X3_Transcendent');
    }

    // X4 - Eternal Legend (150 rituals + 6 categories + 8 firewall badges + 90-day streak)
    if (userStats.totalRituals >= 150 && 
        userStats.ritualCategories >= 6 && 
        userStats.firewallBadges >= 8 && 
        userStats.maxStreak >= 90) {
      candidates.push('X4_Legend');
    }

    return candidates;
  }

  /**
   * Mint a badge for user and create associated rewards
   */
  private async mintBadge(userId: string, badgeId: string, sourceEvent: BadgeEventType): Promise<boolean> {
    try {
      // 1. Get badge details
      const badges = await db.execute(sql`
        SELECT * FROM badges WHERE id = ${badgeId}
      `);

      if (badges.length === 0) return false;
      const badge = badges[0];

      // 2. Check if already earned (idempotency)
      const existing = await db.execute(sql`
        SELECT id FROM user_badges 
        WHERE user_id = ${userId} AND badge_id = ${badgeId}
      `);

      if (existing.length > 0) return false;

      // 3. Create user badge entry
      const userBadgeId = nanoid();
      const appliedAsProfile = await this.shouldApplyAsProfile(userId, badge);

      // Use direct SQL to work with existing schema
      await db.execute(sql`
        INSERT INTO user_badges (id, user_id, badge_id, earned_at)
        VALUES (${userBadgeId}, ${userId}, ${badgeId}, ${new Date().toISOString()})
      `);

      // 4. Update profile badge if auto-applying
      if (appliedAsProfile) {
        await db.execute(sql`
          UPDATE users 
          SET profile_badge_id = ${badgeId}
          WHERE id = ${userId}
        `);
      }

      // 5. Generate discount code if badge has discount
      const discountPercent = badge.discount_percent as number;
      if (discountPercent && discountPercent > 0) {
        await this.generateDiscountCode(userId, badge, userBadgeId);
      }

      // 6. TODO: Send notifications (email, in-app toast)
      await this.sendBadgeNotification(userId, badge);

      return true;
    } catch (error) {
      console.error('Error minting badge:', error);
      return false;
    }
  }

  /**
   * Determine if badge should auto-apply as profile
   */
  private async shouldApplyAsProfile(userId: string, badge: any): Promise<boolean> {
    const user = await this.getUser(userId);
    
    if (user?.tier === 'ghost') {
      // Ghost: newest badge always auto-applies
      return true;
    } else {
      // Firewall: user chooses, don't auto-apply
      return false;
    }
  }

  /**
   * Generate discount code for badge reward
   */
  private async generateDiscountCode(userId: string, badge: any, userBadgeId: string): Promise<void> {
    const code = `BADGE_${badge.id}_${nanoid(8).toUpperCase()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90); // 90 day expiry

    // Use direct SQL to work with existing schema
    await db.execute(sql`
      INSERT INTO discount_codes (id, code, percent, cap_value, user_id, badge_id, expires_at, created_at)
      VALUES (
        ${nanoid()}, 
        ${code}, 
        ${badge.discount_percent || 15}, 
        ${badge.discount_cap || 2000}, 
        ${userId}, 
        ${badge.id}, 
        ${expiresAt.toISOString()}, 
        ${new Date().toISOString()}
      )
    `);

    console.log(`💰 Generated discount code: ${code} (${badge.discount_percent || 15}% off)`);
  }

  /**
   * Send badge unlock notification
   */
  private async sendBadgeNotification(userId: string, badge: any): Promise<void> {
    // Log to console (for server-side tracking)
    console.log(`🏆 Badge unlocked for user ${userId}: ${badge.name}`);
    
    // TODO: Trigger client-side notification via WebSocket or Server-Sent Events
    // For now, the client will check for new badges via API polling
  }

  // =====================================
  // HELPER QUERIES
  // =====================================

  private async getEarnedBadgeIds(userId: string): Promise<string[]> {
    const earned = await db
      .select({ badgeId: userBadges.badgeId })
      .from(userBadges)
      .where(eq(userBadges.userId, userId));
    
    return earned.map(row => row.badgeId);
  }

  private async countUserRitualCompletions(userId: string): Promise<number> {
    // Count ritual completion events with valid journaling using direct SQL
    const result = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM badge_events 
      WHERE user_id = ${userId} 
      AND event_type = 'ritual_completed'
      AND (payload_json->>'journalWordCount')::int >= 20
    `);
    
    return (result[0]?.count as number) || 0;
  }

  private async countUserAITherapySessions(userId: string): Promise<number> {
    const events = await db
      .select({ count: count() })
      .from(badgeEvents)
      .where(and(
        eq(badgeEvents.userId, userId),
        eq(badgeEvents.eventType, 'ai_therapy_session_completed'),
        sql`payload_json->>'completionStatus' = 'complete'`
      ));
    
    return events[0]?.count || 0;
  }

  private async countRitualDaysInWindow(userId: string, days: number): Promise<number> {
    const windowStart = new Date();
    windowStart.setDate(windowStart.getDate() - days);
    
    const events = await db
      .select({ 
        distinctDays: sql<number>`COUNT(DISTINCT DATE(created_at))` 
      })
      .from(badgeEvents)
      .where(and(
        eq(badgeEvents.userId, userId),
        eq(badgeEvents.eventType, 'ritual_completed'),
        gte(badgeEvents.createdAt, windowStart)
      ));
    
    return events[0]?.distinctDays || 0;
  }

  private async countWallReactionDays(userId: string): Promise<number> {
    const events = await db
      .select({ 
        distinctDays: sql<number>`COUNT(DISTINCT DATE(created_at))` 
      })
      .from(badgeEvents)
      .where(and(
        eq(badgeEvents.userId, userId),
        eq(badgeEvents.eventType, 'wall_reaction_added')
      ));
    
    return events[0]?.distinctDays || 0;
  }

  private async countWallInteractions(userId: string): Promise<number> {
    const events = await db
      .select({ 
        count: sql<number>`COUNT(*)` 
      })
      .from(badgeEvents)
      .where(and(
        eq(badgeEvents.userId, userId),
        eq(badgeEvents.eventType, 'wall_reaction_added')
      ));
    
    return events[0]?.count || 0;
  }

  private async getUserGameStats(userId: string): Promise<{
    totalRituals: number;
    ritualCategories: number;
    maxStreak: number;
    firewallBadges: number;
  }> {
    // Get total ritual completions
    const ritualEvents = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(badgeEvents)
      .where(and(
        eq(badgeEvents.userId, userId),
        eq(badgeEvents.eventType, 'ritual_completed')
      ));

    // Get distinct ritual categories
    const categoryEvents = await db
      .select({ count: sql<number>`COUNT(DISTINCT (payload->>'category'))` })
      .from(badgeEvents)
      .where(and(
        eq(badgeEvents.userId, userId),
        eq(badgeEvents.eventType, 'ritual_completed')
      ));

    // Get max streak
    const streakEvents = await db
      .select({ maxStreak: sql<number>`MAX((payload->>'streakCount')::integer)` })
      .from(badgeEvents)
      .where(and(
        eq(badgeEvents.userId, userId),
        eq(badgeEvents.eventType, 'check_in_completed')
      ));

    // Get firewall badges earned
    const firewallBadges = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(and(
        eq(userBadges.userId, userId),
        eq(badges.tierScope, 'firewall')
      ));

    return {
      totalRituals: ritualEvents[0]?.count || 0,
      ritualCategories: categoryEvents[0]?.count || 0,
      maxStreak: streakEvents[0]?.maxStreak || 0,
      firewallBadges: firewallBadges[0]?.count || 0
    };
  }

  private async hasEarnedBadgeInWindow(userId: string, badgeId: string, since: Date): Promise<boolean> {
    const recent = await db
      .select()
      .from(userBadges)
      .where(and(
        eq(userBadges.userId, userId),
        eq(userBadges.badgeId, badgeId),
        gte(userBadges.earnedAt, since)
      ))
      .limit(1);
    
    return recent.length > 0;
  }

  // =====================================
  // ARCHETYPE BADGE MAPPING
  // =====================================

  private getArchetypeF1Badge(archetype: ArchetypeCode): string | null {
    const mapping = {
      'DF': 'F1_DF', // Stream Stabilized
      'FB': 'F1_FB', // Barrier Synchronized  
      'GS': 'F1_GS', // Echo Stabilized
      'SN': 'F1_SN'  // Node Synchronized
    };
    return mapping[archetype] || null;
  }

  private getArchetypeF2Badge(archetype: ArchetypeCode): string | null {
    const mapping = {
      'DF': 'F2_DF', // Signal Tuner
      'FB': 'F2_FB', // Protocol Tuner
      'GS': 'F2_GS', // Echo Tuner  
      'SN': 'F2_SN'  // Node Tuner
    };
    return mapping[archetype] || null;
  }

  private getArchetypeF3Badge(archetype: ArchetypeCode): string | null {
    const mapping = {
      'DF': 'F3_DF', // Surge Controller
      'FB': 'F3_FB', // Threat Controller
      'GS': 'F3_GS', // Echo Controller
      'SN': 'F3_SN'  // Network Controller  
    };
    return mapping[archetype] || null;
  }

  private getArchetypeF4Badge(archetype: ArchetypeCode): string | null {
    const mapping = {
      'DF': 'F4_DF', // Calm Conduit
      'FB': 'F4_FB', // Secure Fortress
      'GS': 'F4_GS', // Stable Phantom
      'SN': 'F4_SN'  // Master Node
    };
    return mapping[archetype] || null;
  }

  private getArchetypeF5Badge(archetype: ArchetypeCode): string | null {
    const mapping = {
      'DF': 'F5_DF', // Data Deluge Master
      'FB': 'F5_FB', // Fortress Architect
      'GS': 'F5_GS', // Phantom Virtuoso
      'SN': 'F5_SN'  // Network Sovereign
    };
    return mapping[archetype] || null;
  }

  private getArchetypeF6Badge(archetype: ArchetypeCode): string | null {
    const mapping = {
      'DF': 'F6_DF', // Eternal Flow
      'FB': 'F6_FB', // Immutable Defense
      'GS': 'F6_GS', // Persistent Shade
      'SN': 'F6_SN'  // Steadfast Guardian
    };
    return mapping[archetype] || null;
  }

  private getArchetypeF7Badge(archetype: ArchetypeCode): string | null {
    const mapping = {
      'DF': 'F7_DF', // Stream Broadcaster
      'FB': 'F7_FB', // Community Bastion
      'GS': 'F7_GS', // Echo Amplifier
      'SN': 'F7_SN'  // Network Nexus
    };
    return mapping[archetype] || null;
  }

  private getArchetypeF8Badge(archetype: ArchetypeCode): string | null {
    const mapping = {
      'DF': 'F8_DF', // Data Deity
      'FB': 'F8_FB', // Eternal Sentinel
      'GS': 'F8_GS', // Digital Transcendence
      'SN': 'F8_SN'  // Omninet Overseer
    };
    return mapping[archetype] || null;
  }
}

// =====================================
// CONVENIENCE FUNCTIONS
// =====================================

/**
 * Quick access to badge evaluator
 */
export function getBadgeEvaluator(): BadgeEvaluator {
  return BadgeEvaluator.getInstance();
}

/**
 * Process badge event (main public API)
 */
export async function processBadgeEvent(
  userId: string,
  eventType: BadgeEventType,
  payload: EventPayload
): Promise<string[]> {
  const evaluator = getBadgeEvaluator();
  return evaluator.handleEvent(userId, eventType, payload);
}
