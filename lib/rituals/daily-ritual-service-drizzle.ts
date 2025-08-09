/**
 * Daily Ritual Service for Paid Users (Firewall Mode)
 * Handles ritual allocation, completion tracking, and streak management
 */

import { db } from '@/lib/db';
import { eq, and, gte, sql } from 'drizzle-orm';
import { 
  dailyRitualAssignments,
  dailyRitualCompletions,
  userDailyState,
  userRitualHistory,
  users,
  type DailyRitualAssignment,
  type DailyRitualCompletion,
  type UserDailyState,
} from '@/lib/db/minimal-schema';
import { 
  PAID_RITUAL_CATEGORIES, 
  PAID_RITUALS_DATABASE, 
  getGuidedPathRituals, 
  getRandomPaidRituals,
  getPaidRitualById,
  type PaidRitual 
} from './paid-rituals-database';

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
        assignments = await this.createDailyAssignments(userId, today, userStateRecord.total_weeks_active);
      }
      
      // Get ritual details and completion state
      const ritual1 = getPaidRitualById(assignments.ritual_1_id);
      const ritual2 = getPaidRitualById(assignments.ritual_2_id);
      
      if (!ritual1 || !ritual2) {
        throw new Error('Invalid ritual IDs in assignments');
      }
      
      // Check completion status
      const completions = await this.getTodaysCompletions(userId, assignments.id);
      const ritual1Completion = completions.find(c => c.ritual_id === assignments.ritual_1_id);
      const ritual2Completion = completions.find(c => c.ritual_id === assignments.ritual_2_id);
      
      const rituals: DailyRitualCard[] = [
        {
          ritual: ritual1,
          state: ritual1Completion ? 'completed' : 'available',
          completionId: ritual1Completion?.id,
          canComplete: !userStateRecord.daily_cap_reached && !ritual1Completion
        },
        {
          ritual: ritual2,
          state: ritual2Completion ? 'completed' : 'available',
          completionId: ritual2Completion?.id,
          canComplete: !userStateRecord.daily_cap_reached && !ritual2Completion
        }
      ];
      
      const canReroll = !userStateRecord.has_rerolled_today && 
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
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const recentlyUsed = await db
        .select({ ritual_id: userRitualHistory.ritual_id })
        .from(userRitualHistory)
        .where(
          and(
            eq(userRitualHistory.user_id, userId),
            gte(userRitualHistory.last_assigned_date, thirtyDaysAgo)
          )
        );
      
      const excludeIds = recentlyUsed.map((r: {ritual_id: string}) => r.ritual_id);
      
      // Select rituals based on guided path
      let selectedRituals = getGuidedPathRituals(userWeeks, 2, excludeIds);
      
      // Fallback if not enough rituals available
      if (selectedRituals.length < 2) {
        selectedRituals = getRandomPaidRituals(2, []);
      }
      
      // Create assignment
      const newAssignment = await db
        .insert(dailyRitualAssignments)
        .values({
          user_id: userId,
          assigned_date: date,
          ritual_1_id: selectedRituals[0].id,
          ritual_2_id: selectedRituals[1].id,
          allocation_mode: 'guided',
          user_weeks_at_assignment: userWeeks
        })
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
    xpEarned: number;
    bytesEarned: number;
    streakDays: number;
    error?: string;
  }> {
    try {
      // Validation
      const wordCount = journalText.trim().split(/\s+/).length;
      const minChars = 140;
      const minDwellTime = 20;
      
      if (journalText.length < minChars) {
        return {
          success: false,
          xpEarned: 0,
          bytesEarned: 0,
          streakDays: 0,
          error: `Journal entry too short. Need at least ${minChars} characters.`
        };
      }
      
      if (dwellTimeSeconds < minDwellTime) {
        return {
          success: false,
          xpEarned: 0,
          bytesEarned: 0,
          streakDays: 0,
          error: 'Please spend more time reflecting before completing.'
        };
      }
      
      // Check if already completed
      const existingCompletion = await db
        .select()
        .from(dailyRitualCompletions)
        .where(
          and(
            eq(dailyRitualCompletions.user_id, userId),
            eq(dailyRitualCompletions.assignment_id, assignmentId),
            eq(dailyRitualCompletions.ritual_id, ritualId)
          )
        )
        .limit(1);
      
      if (existingCompletion.length > 0) {
        return {
          success: false,
          xpEarned: 0,
          bytesEarned: 0,
          streakDays: 0,
          error: 'Ritual already completed today.'
        };
      }
      
      // Check daily cap
      const userStateRecord = await this.getUserDailyState(userId);
      if (userStateRecord.daily_cap_reached) {
        return {
          success: false,
          xpEarned: 0,
          bytesEarned: 0,
          streakDays: userStateRecord.streak_days,
          error: 'Daily ritual cap reached.'
        };
      }
      
      // Get ritual details for rewards
      const ritual = getPaidRitualById(ritualId);
      if (!ritual) {
        throw new Error('Invalid ritual ID');
      }
      
      const category = PAID_RITUAL_CATEGORIES[ritual.category as keyof typeof PAID_RITUAL_CATEGORIES];
      const baseXP = category.baseXP;
      const baseBytes = category.baseBytes;
      
      // Calculate streak bonus
      const newStreakDays = await this.updateUserStreak(userId);
      let xpBonus = 0;
      if (newStreakDays >= 7) xpBonus = 5;
      else if (newStreakDays >= 3) xpBonus = 3;
      
      const totalXP = baseXP + xpBonus;
      const totalBytes = baseBytes;
      
      // Create completion record
      await db.insert(dailyRitualCompletions).values({
        user_id: userId,
        assignment_id: assignmentId,
        ritual_id: ritualId,
        journal_text: journalText,
        mood_rating: moodRating,
        dwell_time_seconds: dwellTimeSeconds,
        word_count: wordCount,
        xp_earned: totalXP,
        bytes_earned: totalBytes
      });
      
      // Update user daily state
      await this.updateUserDailyState(userId);
      
      // Award XP and Bytes to user profile
      await this.awardRewards(userId, totalXP, totalBytes);
      
      return {
        success: true,
        xpEarned: totalXP,
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
  async rerollTodaysRituals(userId: string): Promise<{
    success: boolean;
    newRituals?: DailyRitualCard[];
    error?: string;
  }> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Check if already rerolled today
      const userStateRecord = await this.getUserDailyState(userId, today);
      if (userStateRecord.has_rerolled_today) {
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
      const newAssignments = await this.createDailyAssignments(userId, today, userStateRecord.total_weeks_active);
      
      // Mark as rerolled
      await db
        .update(userDailyState)
        .set({ 
          has_rerolled_today: true,
          updated_at: new Date()
        })
        .where(
          and(
            eq(userDailyState.user_id, userId),
            eq(userDailyState.state_date, today)
          )
        );
      
      // Get new ritual cards
      const ritual1 = getPaidRitualById(newAssignments.ritual_1_id);
      const ritual2 = getPaidRitualById(newAssignments.ritual_2_id);
      
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
    const result = await db
      .select()
      .from(dailyRitualAssignments)
      .where(
        and(
          eq(dailyRitualAssignments.user_id, userId),
          eq(dailyRitualAssignments.assigned_date, date)
        )
      )
      .limit(1);
    
    return result[0] || null;
  }
  
  private async getTodaysCompletions(userId: string, assignmentId: number): Promise<DailyRitualCompletion[]> {
    return await db
      .select()
      .from(dailyRitualCompletions)
      .where(
        and(
          eq(dailyRitualCompletions.user_id, userId),
          eq(dailyRitualCompletions.assignment_id, assignmentId)
        )
      );
  }
  
  private async getUserDailyState(userId: string, date?: string): Promise<UserDailyState> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const existing = await db
      .select()
      .from(userDailyState)
      .where(
        and(
          eq(userDailyState.user_id, userId),
          eq(userDailyState.state_date, targetDate)
        )
      )
      .limit(1);
    
    if (existing.length > 0) {
      return existing[0];
    }
    
    // Create new daily state
    const newState = await db
      .insert(userDailyState)
      .values({
        user_id: userId,
        state_date: targetDate,
        rituals_completed_today: 0,
        daily_cap_reached: false,
        has_rerolled_today: false,
        streak_days: 0,
        timezone: 'UTC',
        total_weeks_active: 0
      })
      .returning();
    
    return newState[0];
  }
  
  private async updateUserDailyState(userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const todayDate = new Date(today);
    
    // Get current completions count
    const completions = await db
      .select()
      .from(dailyRitualCompletions)
      .where(
        and(
          eq(dailyRitualCompletions.user_id, userId),
          gte(dailyRitualCompletions.completed_at, todayDate)
        )
      );
    
    const completionCount = completions.length;
    const capReached = completionCount >= 2;
    
    await db
      .update(userDailyState)
      .set({
        rituals_completed_today: completionCount,
        daily_cap_reached: capReached,
        updated_at: new Date()
      })
      .where(
        and(
          eq(userDailyState.user_id, userId),
          eq(userDailyState.state_date, today)
        )
      );
  }
  
  private async updateUserStreak(userId: string): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Get current state
    const currentState = await this.getUserDailyState(userId, today);
    
    // Check if completed yesterday
    const yesterdayState = await db
      .select()
      .from(userDailyState)
      .where(
        and(
          eq(userDailyState.user_id, userId),
          eq(userDailyState.state_date, yesterday)
        )
      )
      .limit(1);
    
    let newStreakDays = 1;
    
    if (yesterdayState.length > 0 && yesterdayState[0].rituals_completed_today > 0) {
      // Consecutive day
      newStreakDays = currentState.streak_days + 1;
    }
    
    // Update streak
    await db
      .update(userDailyState)
      .set({
        streak_days: newStreakDays,
        last_completion_date: today,
        updated_at: new Date()
      })
      .where(
        and(
          eq(userDailyState.user_id, userId),
          eq(userDailyState.state_date, today)
        )
      );
    
    return newStreakDays;
  }
  
  private async updateRitualHistory(userId: string, rituals: PaidRitual[], date: string): Promise<void> {
    for (const ritual of rituals) {
      // Check if record exists
      const existing = await db
        .select()
        .from(userRitualHistory)
        .where(
          and(
            eq(userRitualHistory.user_id, userId),
            eq(userRitualHistory.ritual_id, ritual.id)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        // Update existing record
        await db
          .update(userRitualHistory)
          .set({
            last_assigned_date: date
          })
          .where(
            and(
              eq(userRitualHistory.user_id, userId),
              eq(userRitualHistory.ritual_id, ritual.id)
            )
          );
      } else {
        // Insert new record
        await db
          .insert(userRitualHistory)
          .values({
            user_id: userId,
            ritual_id: ritual.id,
            last_assigned_date: date,
            completion_count: 0
          });
      }
    }
  }
  
  private async awardRewards(userId: string, xp: number, bytes: number): Promise<void> {
    await db
      .update(users)
      .set({
        xp: sql`${users.xp} + ${xp}`,
        bytes: sql`${users.bytes} + ${bytes}`,
        updated_at: new Date()
      })
      .where(eq(users.id, userId));
  }
}

export const dailyRitualService = new DailyRitualService();
