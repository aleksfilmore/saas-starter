// Gamification System - XP, Bytes, and Badge Management
import { db } from './drizzle';
import { 
  users, 
  xpTransactions, 
  byteTransactions, 
  badges, 
  userBadges,
  anonymousPosts,
  wallPostReactions,
  wallPostComments
} from './schema';
import { eq, desc, and, gte, count, sum } from 'drizzle-orm';
import { generateId } from 'lucia';

// =====================================
// XP SYSTEM - GLOW-UP PROGRESSION
// =====================================

export interface XPReward {
  amount: number;
  source: string;
  description: string;
  relatedId?: string;
}

export async function awardXP(userId: string, reward: XPReward): Promise<{ newXP: number; newLevel: number; leveledUp: boolean }> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  
  if (!user) throw new Error('User not found');
  
  // Calculate new XP
  const newXP = user.xpPoints + reward.amount;
  const oldLevel = user.glowUpLevel;
  const newLevel = calculateGlowUpLevel(newXP);
  const leveledUp = newLevel > oldLevel;
  
  // Update user XP and level
  await db.update(users)
    .set({ 
      xpPoints: newXP, 
      glowUpLevel: newLevel,
      updatedAt: new Date()
    })
    .where(eq(users.id, userId));
  
  // Record XP transaction
  await db.insert(xpTransactions).values({
    id: generateId(15),
    userId,
    amount: reward.amount,
    source: reward.source,
    description: reward.description,
    relatedId: reward.relatedId,
  });
  
  // If leveled up, award bonus and check for badges
  if (leveledUp) {
    await awardBytes(userId, {
      amount: 50 + (newLevel * 10), // Bonus bytes for leveling up
      source: 'level_up',
      description: `Level up bonus: ${getGlowUpTitle(newLevel)}`,
    });
    
    // Check for level-based badges
    await checkLevelBadges(userId, newLevel);
  }
  
  return { newXP, newLevel, leveledUp };
}

export function calculateGlowUpLevel(xp: number): number {
  if (xp < 150) return Math.floor(xp / 30) + 1; // Levels 1-5 (0-149 XP)
  if (xp < 400) return Math.floor((xp - 150) / 50) + 6; // Levels 6-10 (150-399 XP)
  if (xp < 900) return Math.floor((xp - 400) / 50) + 11; // Levels 11-20 (400-899 XP)
  if (xp < 1400) return Math.floor((xp - 900) / 50) + 21; // Levels 21-30 (900-1399 XP)
  if (xp < 1850) return Math.floor((xp - 1400) / 50) + 31; // Levels 31-39 (1400-1849 XP)
  return 40; // Level 40+ (Cult Leader Tier)
}

export function getGlowUpTitle(level: number): string {
  if (level <= 5) return 'Booting...';
  if (level <= 10) return 'System Stabilized';
  if (level <= 20) return 'Emotional Core Online';
  if (level <= 30) return 'Firewall Fully Activated';
  if (level <= 39) return 'Certified Emotional Engineer';
  return 'Cult Leader Tier';
}

// XP Sources and Rewards
export const XP_REWARDS = {
  RITUAL_COMPLETE: { amount: 35, source: 'ritual_complete', description: 'Completed daily ritual' },
  AI_TOOL_USE: { amount: 25, source: 'ai_tool_use', description: 'Used AI tool' },
  STREAK_5_DAYS: { amount: 50, source: 'streak_bonus', description: '5-day streak bonus' },
  STREAK_10_DAYS: { amount: 100, source: 'streak_bonus', description: '10-day streak bonus' },
  JOURNAL_ENTRY: { amount: 30, source: 'journal_entry', description: 'Saved journal entry' },
  QUIZ_COMPLETE: { amount: 15, source: 'quiz_complete', description: 'Completed quiz/poll' },
  WALL_POST: { amount: 20, source: 'wall_post', description: 'Posted to Wall of Wounds' },
  WALL_POST_VIRAL: { amount: 75, source: 'wall_viral', description: 'Wall post went viral (10+ reactions)' },
};

// =====================================
// BYTE SYSTEM - EMOTIONAL CURRENCY
// =====================================

export interface ByteReward {
  amount: number;
  source: string;
  description: string;
  relatedId?: string;
}

export async function awardBytes(userId: string, reward: ByteReward): Promise<{ newBalance: number }> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  
  if (!user) throw new Error('User not found');
  
  // Calculate new balance
  const newBalance = user.byteBalance + reward.amount;
  
  // Update user balance
  await db.update(users)
    .set({ 
      byteBalance: newBalance,
      updatedAt: new Date()
    })
    .where(eq(users.id, userId));
  
  // Record byte transaction
  await db.insert(byteTransactions).values({
    id: generateId(15),
    userId,
    amount: reward.amount,
    source: reward.source,
    description: reward.description,
    relatedId: reward.relatedId,
  });
  
  return { newBalance };
}

export async function spendBytes(userId: string, amount: number, source: string, description: string): Promise<{ newBalance: number; success: boolean }> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  
  if (!user) throw new Error('User not found');
  if (user.byteBalance < amount) return { newBalance: user.byteBalance, success: false };
  
  const newBalance = user.byteBalance - amount;
  
  await db.update(users)
    .set({ 
      byteBalance: newBalance,
      updatedAt: new Date()
    })
    .where(eq(users.id, userId));
  
  await db.insert(byteTransactions).values({
    id: generateId(15),
    userId,
    amount: -amount,
    source,
    description,
  });
  
  return { newBalance, success: true };
}

// Byte Sources and Rewards
export const BYTE_REWARDS = {
  WALL_POST: { amount: 25, source: 'wall_post', description: 'Posted to Wall of Wounds' },
  UPVOTE_RECEIVED: { amount: 8, source: 'upvote_received', description: 'Received reaction on wall post' },
  COMMENT_MADE: { amount: 5, source: 'comment_made', description: 'Commented on wall post' },
  STREAK_SHIELD_USE: { amount: 10, source: 'streak_shield_use', description: 'Used streak shield' },
  STREAK_RECOVERY: { amount: 20, source: 'streak_recovery', description: 'Bounced back from streak break' },
  WEEKLY_CHALLENGE: { amount: 50, source: 'weekly_challenge', description: 'Completed weekly challenge' },
  RITUAL_FEEDBACK: { amount: 10, source: 'ritual_feedback', description: 'Submitted ritual feedback' },
  CULT_BUBBLE_CREATE: { amount: 75, source: 'cult_bubble_create', description: 'Created cult bubble' },
  BADGE_SHARE: { amount: 50, source: 'badge_share', description: 'Shared badge achievement' },
};

// =====================================
// BADGE SYSTEM
// =====================================

export async function checkAndAwardBadges(userId: string, trigger: string, metadata?: any): Promise<string[]> {
  const awardedBadges: string[] = [];
  
  // Get user's current badges
  const userCurrentBadges = await db.query.userBadges.findMany({
    where: eq(userBadges.userId, userId),
    with: { badge: true }
  });
  
  const currentBadgeIds = userCurrentBadges.map(ub => ub.badgeId);
  
  // Check different badge types based on trigger
  switch (trigger) {
    case 'wall_post':
      awardedBadges.push(...(await checkWallPostBadges(userId, currentBadgeIds)));
      break;
    case 'streak':
      awardedBadges.push(...(await checkStreakBadges(userId, currentBadgeIds, metadata?.days)));
      break;
    case 'ritual_complete':
      awardedBadges.push(...(await checkRitualBadges(userId, currentBadgeIds)));
      break;
    case 'level_up':
      awardedBadges.push(...(await checkLevelBadges(userId, metadata?.level)));
      break;
  }
  
  return awardedBadges;
}

async function checkWallPostBadges(userId: string, currentBadgeIds: string[]): Promise<string[]> {
  const awarded: string[] = [];
  
  // Count user's wall posts
  const postCount = await db.select({ count: count() })
    .from(anonymousPosts)
    .where(eq(anonymousPosts.userId, userId));
  
  const posts = postCount[0]?.count || 0;
  
  // Void Whisperer badges (5, 20, 50 posts)
  if (posts >= 5 && !currentBadgeIds.includes('void_whisperer_bronze')) {
    await awardBadge(userId, 'void_whisperer_bronze');
    awarded.push('void_whisperer_bronze');
  }
  if (posts >= 20 && !currentBadgeIds.includes('void_whisperer_silver')) {
    await awardBadge(userId, 'void_whisperer_silver');
    awarded.push('void_whisperer_silver');
  }
  if (posts >= 50 && !currentBadgeIds.includes('void_whisperer_gold')) {
    await awardBadge(userId, 'void_whisperer_gold');
    awarded.push('void_whisperer_gold');
  }
  
  return awarded;
}

async function awardBadge(userId: string, badgeId: string): Promise<void> {
  const badge = await db.query.badges.findFirst({
    where: eq(badges.id, badgeId),
  });
  
  if (!badge) return;
  
  // Award the badge
  await db.insert(userBadges).values({
    id: generateId(15),
    userId,
    badgeId,
  });
  
  // Award XP and Bytes
  if (badge.xpReward > 0) {
    await awardXP(userId, {
      amount: badge.xpReward,
      source: 'badge_unlock',
      description: `Badge unlocked: ${badge.name}`,
      relatedId: badgeId,
    });
  }
  
  if (badge.byteReward > 0) {
    await awardBytes(userId, {
      amount: badge.byteReward,
      source: 'badge_unlock',
      description: `Badge unlocked: ${badge.name}`,
      relatedId: badgeId,
    });
  }
}

async function checkStreakBadges(userId: string, currentBadgeIds: string[], days: number): Promise<string[]> {
  const awarded: string[] = [];
  
  // Define streak milestones
  const streakMilestones = [
    { days: 5, badgeId: 'firewall_activated' },
    { days: 30, badgeId: 'reboot_complete' },
    { days: 60, badgeId: 'protocol_mastered' },
    { days: 90, badgeId: 'deep_reset_achieved' },
  ];
  
  for (const milestone of streakMilestones) {
    if (days >= milestone.days && !currentBadgeIds.includes(milestone.badgeId)) {
      await awardBadge(userId, milestone.badgeId);
      awarded.push(milestone.badgeId);
    }
  }
  
  return awarded;
}

async function checkRitualBadges(userId: string, currentBadgeIds: string[]): Promise<string[]> {
  // This would check ritual completion counts for various badges
  // Implementation depends on ritual completion tracking
  return [];
}

async function checkLevelBadges(userId: string, level: number): Promise<string[]> {
  const awarded: string[] = [];
  
  // Level-based achievements could unlock special badges
  if (level >= 10) {
    // Check for system stability badge
  }
  if (level >= 30) {
    // Check for firewall master badge
  }
  if (level >= 40) {
    // Check for cult leader badge
  }
  
  return awarded;
}

// =====================================
// LEADERBOARD & ANALYTICS
// =====================================

export async function getWeeklyWallOracles(): Promise<any[]> {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  // Get top byte earners from wall activity in the past week
  const topEarners = await db.select({
    userId: byteTransactions.userId,
    totalBytes: sum(byteTransactions.amount),
  })
  .from(byteTransactions)
  .where(
    and(
      gte(byteTransactions.createdAt, weekAgo),
      eq(byteTransactions.source, 'wall_post')
    )
  )
  .groupBy(byteTransactions.userId)
  .orderBy(desc(sum(byteTransactions.amount)))
  .limit(10);
  
  return topEarners;
}

export async function getUserStats(userId: string): Promise<any> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  
  if (!user) return null;
  
  const userBadgeCount = await db.select({ count: count() })
    .from(userBadges)
    .where(eq(userBadges.userId, userId));
  
  const wallPostCount = await db.select({ count: count() })
    .from(anonymousPosts)
    .where(eq(anonymousPosts.userId, userId));
  
  return {
    level: user.glowUpLevel,
    title: getGlowUpTitle(user.glowUpLevel),
    xp: user.xpPoints,
    bytes: user.byteBalance,
    badges: userBadgeCount[0]?.count || 0,
    wallPosts: wallPostCount[0]?.count || 0,
    tier: user.subscriptionTier,
  };
}
