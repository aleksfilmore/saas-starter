/**
 * Daily Ritual Service for Paid Users (Firewall Mode)
 * CTRL+ALT+BLOCK™ v1.1 - Enhanced with specification-compliant validation
 */

import { db } from '@/lib/db';
import { eq, and, gte, sql } from 'drizzle-orm';
// Unified schema usage (minimal-schema deprecated)
import {
  dailyRitualAssignments,
  dailyRitualCompletions,
  userDailyState,
  userRitualHistory,
  users,
  type DailyRitualAssignment,
  type DailyRitualCompletion,
  type UserDailyState,
} from '@/lib/db/unified-schema';
import { 
  PAID_RITUAL_CATEGORIES, 
  PAID_RITUALS_DATABASE, 
  getGuidedPathRituals, 
  getRandomPaidRituals,
  getPaidRitualById,
  type PaidRitual 
} from './paid-rituals-database';
import { validateJournalEntry, checkRateLimit, validateLanguageContent } from '@/lib/validation/journal-validator';

export interface DailyRitualCard {
  ritual: PaidRitual;
  state: 'available' | 'in-progress' | 'completed' | 'locked';
  completionId?: number;
  canComplete: boolean;
}

export class DailyRitualService {

  /**
   * Get today's ritual assignments for a user
   */
  async getTodaysRituals(userId: string): Promise<{
    assignments: DailyRitualAssignment | null;
    rituals: DailyRitualCard[];
    userState: UserDailyState;
    canReroll: boolean;
  }> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get or create user daily state
      const userStateRecord = await this.getUserDailyState(userId, today);
      
      // Get today's assignments
      let assignments = await this.getTodaysAssignments(userId, today);
      
      // If no assignments exist, create them
      if (!assignments) {
        assignments = await this.createDailyAssignments(userId, today, userStateRecord.totalWeeksActive);
      }
      
      // Get ritual details and completion state
  const ritual1 = getPaidRitualById(assignments.ritual1Id);
  const ritual2 = getPaidRitualById(assignments.ritual2Id);
      
      if (!ritual1 || !ritual2) {
        throw new Error('Invalid ritual IDs in assignments');
      }
      
      // Check completion status
      const completions = await this.getTodaysCompletions(userId, assignments.id);
  const ritual1Completion = completions.find(c => c.ritualId === assignments.ritual1Id);
  const ritual2Completion = completions.find(c => c.ritualId === assignments.ritual2Id);
      
      const rituals: DailyRitualCard[] = [
        {
          ritual: ritual1,
          state: ritual1Completion ? 'completed' : 'available',
          completionId: ritual1Completion?.id,
      canComplete: !userStateRecord.dailyCapReached && !ritual1Completion
        },
        {
          ritual: ritual2,
          state: ritual2Completion ? 'completed' : 'available',
          completionId: ritual2Completion?.id,
      canComplete: !userStateRecord.dailyCapReached && !ritual2Completion
        }
      ];
      
    const canReroll = !userStateRecord.hasRerolledToday && 
                       !ritual1Completion && 
                       !ritual2Completion;
      
      return {
        assignments,
        rituals,
        userState: userStateRecord,
        canReroll
      };
    } catch (error) {
      console.error('Error getting today\'s rituals:', error);
      throw error;
    }
  }

  /**
   * Create daily ritual assignments for a user
   */
  private async createDailyAssignments(
    userId: string, 
    date: string, 
    userWeeks: number
  ): Promise<DailyRitualAssignment> {
    try {
      // Get recently used rituals for no-repeat enforcement (30 days)
  const thirtyDaysAgoDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentlyUsed = await db
        .select({ ritualId: userRitualHistory.ritualId })
        .from(userRitualHistory)
        .where(
          and(
            eq(userRitualHistory.userId, userId),
            gte(userRitualHistory.lastAssignedDate, thirtyDaysAgoDate)
          )
        );
      
      const excludeIds = recentlyUsed.map((r: { ritualId: string }) => r.ritualId);
      
      // Dual allocation strategy:
      // 1) ritual1: guided path progression
      // 2) ritual2: exploratory random (can surface any paid ritual not recently used and not ritual1)
      const guided = getGuidedPathRituals(userWeeks, 1, excludeIds);
      let ritual1 = guided[0];
      if (!ritual1) {
        ritual1 = getRandomPaidRituals(1, excludeIds)[0];
      }
      const excludeForSecond = [...excludeIds, ritual1.id];
      let ritual2 = getRandomPaidRituals(1, excludeForSecond)[0];
      if (!ritual2) {
        // extreme fallback: pick any different ritual
        ritual2 = getRandomPaidRituals(1, [ritual1.id])[0];
      }
      const selectedRituals = [ritual1, ritual2];
      
      // Create assignment
      const assignmentValues: any = {
        userId: userId,
        assignedDate: new Date(date),
        ritual1Id: selectedRituals[0].id,
        ritual2Id: selectedRituals[1].id,
        allocationMode: 'guided+explore',
        userWeeksAtAssignment: userWeeks
      };
      // Attach legacy ritualId if DB column exists (harmless if ignored)
      assignmentValues.ritualId = selectedRituals[0].id;

      const newAssignment = await db
        .insert(dailyRitualAssignments)
        .values(assignmentValues)
        .returning();
      
      // Update ritual history
      await this.updateRitualHistory(userId, selectedRituals, date);
      
      return newAssignment[0];
    } catch (error) {
      console.error('Error creating daily assignments:', error);
      throw error;
    }
  }

  /**
   * Complete a daily ritual
   */
  async completeRitual(
    userId: string,
    assignmentId: number,
    ritualId: string,
    journalText: string,
    moodRating: number,
    dwellTimeSeconds: number
  ): Promise<{
    success: boolean;
    bytesEarned: number;
    streakDays: number;
    error?: string;
  }> {
    try {
      // CTRL+ALT+BLOCK™ v1.1 Enhanced Validation
      
      // Rate limiting check: ≤2 completes/10 min
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const recentCompletions = await db
        .select()
        .from(dailyRitualCompletions)
        .where(
          and(
            eq(dailyRitualCompletions.userId, userId),
            gte(dailyRitualCompletions.completedAt, tenMinutesAgo)
          )
        );

      if (recentCompletions.length >= 2) {
        return {
          success: false,
          bytesEarned: 0,
          streakDays: 0,
          error: 'Rate limit exceeded. Please wait before completing another ritual (max 2 per 10 minutes).'
        };
      }

      // Get last journal entry for similarity check
      let lastJournalText = '';
      try {
        const lastEntry = await db
          .select({ journalText: dailyRitualCompletions.journalText })
          .from(dailyRitualCompletions)
          .where(eq(dailyRitualCompletions.userId, userId))
          .orderBy(sql`completed_at DESC`)
          .limit(1);
        
        if (lastEntry.length > 0) {
          lastJournalText = lastEntry[0].journalText || '';
        }
      } catch (error) {
        console.error('Error fetching last entry:', error);
      }

      // Comprehensive journal validation per specification
      const validationResult = await validateJournalEntry(
        {
          text: journalText,
          userId,
          timingSeconds: dwellTimeSeconds
        },
        lastJournalText
      );

      if (!validationResult.isValid) {
        return {
          success: false,
          bytesEarned: 0,
          streakDays: 0,
          error: `Validation failed: ${validationResult.errors.join(', ')}`
        };
      }

      // Language content validation
      if (!validateLanguageContent(journalText)) {
        return {
          success: false,
          bytesEarned: 0,
          streakDays: 0,
          error: 'Journal entry appears to contain insufficient meaningful content.'
        };
      }
      
      // Calculate word count for completion record
      const wordCount = journalText.trim().split(/\s+/).filter(w => w.length > 0).length;
      
      // Check if already completed
      const existingCompletion = await db
        .select()
        .from(dailyRitualCompletions)
        .where(
          and(
            eq(dailyRitualCompletions.userId, userId),
            eq(dailyRitualCompletions.assignmentId, assignmentId),
            eq(dailyRitualCompletions.ritualId, ritualId)
          )
        )
        .limit(1);
      
      if (existingCompletion.length > 0) {
        return {
          success: false,
          bytesEarned: 0,
          streakDays: 0,
          error: 'Ritual already completed today.'
        };
      }
      
      // Check daily cap
      const userStateRecord = await this.getUserDailyState(userId);
    if (userStateRecord.dailyCapReached) {
        return {
          success: false,
          bytesEarned: 0,
      streakDays: userStateRecord.streakDays,
          error: 'Daily ritual cap reached.'
        };
      }
      
      // Get ritual details for rewards
      const ritual = getPaidRitualById(ritualId);
      if (!ritual) {
        throw new Error('Invalid ritual ID');
      }
      
      const category = PAID_RITUAL_CATEGORIES[ritual.category as keyof typeof PAID_RITUAL_CATEGORIES];
      const baseBytes = category.baseBytes;
  // Calculate streak bonus (converted to bytes bonus – XP deprecated)
  const newStreakDays = await this.updateUserStreak(userId);
  let bytesBonus = 0;
  if (newStreakDays >= 7) bytesBonus = 5;
  else if (newStreakDays >= 3) bytesBonus = 3;
  const totalBytes = baseBytes + bytesBonus;
      
      // Create completion record
      await db.insert(dailyRitualCompletions).values({
        userId: userId,
        assignmentId: assignmentId,
        ritualId: ritualId,
        journalText: journalText,
        moodRating: moodRating,
        dwellTimeSeconds: dwellTimeSeconds,
        wordCount: wordCount,
        bytesEarned: totalBytes
      });
      
      // Update user daily state
      await this.updateUserDailyState(userId);
      
      // Award XP and Bytes to user profile
  await this.awardRewards(userId, totalBytes);
      
      return {
        success: true,
  bytesEarned: totalBytes,
        streakDays: newStreakDays
      };
    } catch (error) {
      console.error('Error completing ritual:', error);
      throw error;
    }
  }

  /**
   * Reroll today's rituals (once per day)
   */
  async rerollTodaysRituals(userId: string): Promise<{ success: boolean; newRituals?: DailyRitualCard[]; error?: string }> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Check if already rerolled today
  const userStateRecord = await this.getUserDailyState(userId, today);
  if (userStateRecord.hasRerolledToday) {
        return {
          success: false,
          error: 'Already rerolled today. You get one reroll per day.'
        };
      }
      
      // Check if any rituals completed today
      const currentAssignments = await this.getTodaysAssignments(userId, today);
      if (!currentAssignments) {
        return {
          success: false,
          error: 'No assignments found for today.'
        };
      }
      
      const completions = await this.getTodaysCompletions(userId, currentAssignments.id);
      if (completions.length > 0) {
        return {
          success: false,
          error: 'Cannot reroll after completing rituals.'
        };
      }
      
      // Delete current assignments
      await db
        .delete(dailyRitualAssignments)
        .where(eq(dailyRitualAssignments.id, currentAssignments.id));
      
      // Create new assignments
  const newAssignments = await this.createDailyAssignments(userId, today, userStateRecord.totalWeeksActive);
      
      // Mark as rerolled
      await db.update(userDailyState)
        .set({ hasRerolledToday: true, updatedAt: new Date() })
        .where(and(eq(userDailyState.userId, userId), eq(sql`DATE(${userDailyState.stateDate})`, today)));
      
      // Get new ritual cards
  const ritual1 = getPaidRitualById(newAssignments.ritual1Id);
  const ritual2 = getPaidRitualById(newAssignments.ritual2Id);
      
      if (!ritual1 || !ritual2) {
        throw new Error('Invalid ritual IDs after reroll');
      }
      
      const newRituals: DailyRitualCard[] = [
        {
          ritual: ritual1,
          state: 'available',
          canComplete: true
        },
        {
          ritual: ritual2,
          state: 'available',
          canComplete: true
        }
      ];
      
      return {
        success: true,
        newRituals
      };
    } catch (error) {
      console.error('Error rerolling rituals:', error);
      throw error;
    }
  }

  // Helper methods
  
  private async getTodaysAssignments(userId: string, date: string): Promise<DailyRitualAssignment | null> {
    const result = await db.select().from(dailyRitualAssignments)
      .where(and(eq(dailyRitualAssignments.userId, userId), eq(sql`DATE(${dailyRitualAssignments.assignedDate})`, date)))
      .limit(1);
    return result[0] || null;
  }

  private async getTodaysCompletions(userId: string, assignmentId: number): Promise<DailyRitualCompletion[]> {
    return await db.select().from(dailyRitualCompletions)
      .where(and(eq(dailyRitualCompletions.userId, userId), eq(dailyRitualCompletions.assignmentId, assignmentId)));
  }

  private async getUserDailyState(userId: string, date?: string): Promise<UserDailyState> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const existing = await db.select().from(userDailyState)
      .where(and(eq(userDailyState.userId, userId), eq(sql`DATE(${userDailyState.stateDate})`, targetDate)))
      .limit(1);
    if (existing.length > 0) return existing[0];
    const newState = await db.insert(userDailyState).values({
      userId: userId,
      stateDate: new Date(targetDate),
      ritualsCompletedToday: 0,
      dailyCapReached: false,
      hasRerolledToday: false,
      streakDays: 0,
      timezone: 'UTC',
      totalWeeksActive: 0
    }).returning();
    return newState[0];
  }
  
  private async updateUserDailyState(userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const todayDate = new Date(today);
    
    // Get current completions count
    const completions = await db.select().from(dailyRitualCompletions)
      .where(and(eq(dailyRitualCompletions.userId, userId), gte(dailyRitualCompletions.completedAt, todayDate)));
    
    const completionCount = completions.length;
    const capReached = completionCount >= 2;
    
    await db.update(userDailyState)
      .set({ ritualsCompletedToday: completionCount, dailyCapReached: capReached, updatedAt: new Date() })
      .where(and(eq(userDailyState.userId, userId), eq(sql`DATE(${userDailyState.stateDate})`, today)));
  }
  
  private async updateUserStreak(userId: string): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Get current state
  const currentState = await this.getUserDailyState(userId, today);
    
    // Check if completed yesterday
    const yesterdayState = await db.select().from(userDailyState)
      .where(and(eq(userDailyState.userId, userId), eq(sql`DATE(${userDailyState.stateDate})`, yesterday)))
      .limit(1);
    
    let newStreakDays = 1;
    
    if (yesterdayState.length > 0 && yesterdayState[0].ritualsCompletedToday > 0) {
      // Consecutive day
      newStreakDays = currentState.streakDays + 1;
    }
    
    // Update streak
    await db.update(userDailyState)
      .set({ streakDays: newStreakDays, lastCompletionDate: new Date(today), updatedAt: new Date() })
      .where(and(eq(userDailyState.userId, userId), eq(sql`DATE(${userDailyState.stateDate})`, today)));
    
    return newStreakDays;
  }
  
  private async updateRitualHistory(userId: string, rituals: PaidRitual[], date: string): Promise<void> {
    for (const ritual of rituals) {
      // Check if record exists
      const existing = await db.select().from(userRitualHistory)
        .where(and(eq(userRitualHistory.userId, userId), eq(userRitualHistory.ritualId, ritual.id)))
        .limit(1);

      if (existing.length > 0) {
        // Update existing record
        await db.update(userRitualHistory)
          .set({ lastAssignedDate: new Date(date) })
          .where(and(eq(userRitualHistory.userId, userId), eq(userRitualHistory.ritualId, ritual.id)));
      } else {
        // Insert new record
        await db.insert(userRitualHistory)
          .values({ userId: userId, ritualId: ritual.id, lastAssignedDate: new Date(date), completionCount: 0 });
      }
    }
  }
  
  private async awardRewards(userId: string, bytes: number): Promise<void> {
    await db.update(users)
      .set({ bytes: sql`${users.bytes} + ${bytes}`, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }
}

export const dailyRitualService = new DailyRitualService();
