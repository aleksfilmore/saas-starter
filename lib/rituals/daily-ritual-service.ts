/**
 * Daily Ritual Service for Paid Users (Firewall Mode)
 * Handles ritual allocation, completion tracking, and streak management
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { client } from '@/lib/db';
import { 
  PAID_RITUAL_CATEGORIES, 
  PAID_RITUALS_DATABASE, 
  getGuidedPathRituals, 
  getRandomPaidRituals,
  getPaidRitualById,
  type PaidRitual 
} from './paid-rituals-database';

export interface DailyRitualAssignment {
  id: number;
  user_id: string;
  assigned_date: string;
  ritual_1_id: string;
  ritual_2_id: string;
  allocation_mode: 'guided' | 'random';
  user_weeks_at_assignment: number;
  has_rerolled: boolean;
  reroll_used_at?: string;
  created_at: string;
}

export interface RitualCompletion {
  id: number;
  user_id: string;
  assignment_id: number;
  ritual_id: string;
  journal_text: string;
  mood_rating: number;
  dwell_time_seconds: number;
  word_count: number;
  xp_earned: number;
  bytes_earned: number;
  completed_at: string;
}

export interface UserDailyState {
  user_id: string;
  current_date: string;
  rituals_completed_today: number;
  daily_cap_reached: boolean;
  has_rerolled_today: boolean;
  streak_days: number;
  last_completion_date?: string;
  timezone: string;
  total_weeks_active: number;
}

export interface DailyRitualCard {
  ritual: PaidRitual;
  state: 'available' | 'in-progress' | 'completed' | 'locked';
  completionId?: number;
  canComplete: boolean;
}

export class DailyRitualService {
  private supabase = client;

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
      const userState = await this.getUserDailyState(userId, today);
      
      // Get today's assignments
      let assignments = await this.getTodaysAssignments(userId, today);
      
      // If no assignments exist, create them
      if (!assignments) {
        assignments = await this.createDailyAssignments(userId, today, userState.total_weeks_active);
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
          canComplete: !userState.daily_cap_reached && !ritual1Completion
        },
        {
          ritual: ritual2,
          state: ritual2Completion ? 'completed' : 'available',
          completionId: ritual2Completion?.id,
          canComplete: !userState.daily_cap_reached && !ritual2Completion
        }
      ];
      
      const canReroll = !userState.has_rerolled_today && 
                       !ritual1Completion && 
                       !ritual2Completion;
      
      return {
        assignments,
        rituals,
        userState,
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
      // Get allocation mode from config
      const { data: config } = await this.supabase
        .from('daily_ritual_config')
        .select('config_value')
        .eq('config_key', 'allocation_mode')
        .single();
      
      const allocationMode = config?.config_value || 'guided';
      
      // Get recently used rituals for no-repeat enforcement
      const { data: recentlyUsed } = await this.supabase
        .from('user_ritual_history')
        .select('ritual_id')
        .eq('user_id', userId)
        .gte('last_assigned_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      
      const excludeIds = recentlyUsed?.map(r => r.ritual_id) || [];
      
      // Select rituals based on allocation mode
      let selectedRituals: PaidRitual[];
      if (allocationMode === 'guided') {
        selectedRituals = getGuidedPathRituals(userWeeks, 2, excludeIds);
      } else {
        selectedRituals = getRandomPaidRituals(2, excludeIds);
      }
      
      // Fallback if not enough rituals available
      if (selectedRituals.length < 2) {
        selectedRituals = getRandomPaidRituals(2, []);
      }
      
      // Create assignment
      const { data: assignment, error } = await this.supabase
        .from('daily_ritual_assignments')
        .insert({
          user_id: userId,
          assigned_date: date,
          ritual_1_id: selectedRituals[0].id,
          ritual_2_id: selectedRituals[1].id,
          allocation_mode: allocationMode,
          user_weeks_at_assignment: userWeeks
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update ritual history
      await this.updateRitualHistory(userId, selectedRituals, date);
      
      // Log analytics event
      await this.logAnalyticsEvent(userId, 'daily_assigned', {
        date,
        rituals: selectedRituals.map(r => r.id),
        mode: allocationMode,
        user_weeks: userWeeks
      });
      
      return assignment;
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
      const { data: existingCompletion } = await this.supabase
        .from('daily_ritual_completions')
        .select('id')
        .eq('user_id', userId)
        .eq('assignment_id', assignmentId)
        .eq('ritual_id', ritualId)
        .single();
      
      if (existingCompletion) {
        return {
          success: false,
          xpEarned: 0,
          bytesEarned: 0,
          streakDays: 0,
          error: 'Ritual already completed today.'
        };
      }
      
      // Check daily cap
      const userState = await this.getUserDailyState(userId);
      if (userState.daily_cap_reached) {
        return {
          success: false,
          xpEarned: 0,
          bytesEarned: 0,
          streakDays: userState.streak_days,
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
      const { error: completionError } = await this.supabase
        .from('daily_ritual_completions')
        .insert({
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
      
      if (completionError) throw completionError;
      
      // Update user daily state
      await this.updateUserDailyState(userId);
      
      // Award XP and Bytes to user profile
      await this.awardRewards(userId, totalXP, totalBytes);
      
      // Log analytics event
      await this.logAnalyticsEvent(userId, 'ritual_complete', {
        ritual_id: ritualId,
        word_count: wordCount,
        dwell_ms: dwellTimeSeconds * 1000,
        rewarded: true,
        xp: totalXP,
        bytes: totalBytes,
        streak_days: newStreakDays
      });
      
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
      const userState = await this.getUserDailyState(userId, today);
      if (userState.has_rerolled_today) {
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
      
      // Log analytics event for reroll
      await this.logAnalyticsEvent(userId, 'daily_reroll', {
        date: today,
        prev: [currentAssignments.ritual_1_id, currentAssignments.ritual_2_id],
        user_weeks: userState.total_weeks_active
      });
      
      // Delete current assignments
      await this.supabase
        .from('daily_ritual_assignments')
        .delete()
        .eq('id', currentAssignments.id);
      
      // Create new assignments
      const newAssignments = await this.createDailyAssignments(userId, today, userState.total_weeks_active);
      
      // Mark as rerolled
      await this.supabase
        .from('user_daily_state')
        .update({ 
          has_rerolled_today: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('current_date', today);
      
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
      
      // Log completion of reroll
      await this.logAnalyticsEvent(userId, 'daily_reroll', {
        date: today,
        prev: [currentAssignments.ritual_1_id, currentAssignments.ritual_2_id],
        next: [newAssignments.ritual_1_id, newAssignments.ritual_2_id],
        user_weeks: userState.total_weeks_active
      });
      
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
    const { data } = await this.supabase
      .from('daily_ritual_assignments')
      .select('*')
      .eq('user_id', userId)
      .eq('assigned_date', date)
      .single();
    
    return data;
  }
  
  private async getTodaysCompletions(userId: string, assignmentId: number): Promise<RitualCompletion[]> {
    const { data } = await this.supabase
      .from('daily_ritual_completions')
      .select('*')
      .eq('user_id', userId)
      .eq('assignment_id', assignmentId);
    
    return data || [];
  }
  
  private async getUserDailyState(userId: string, date?: string): Promise<UserDailyState> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const { data } = await this.supabase
      .from('user_daily_state')
      .select('*')
      .eq('user_id', userId)
      .eq('current_date', targetDate)
      .single();
    
    if (data) {
      return data;
    }
    
    // Create new daily state
    const newState = {
      user_id: userId,
      current_date: targetDate,
      rituals_completed_today: 0,
      daily_cap_reached: false,
      has_rerolled_today: false,
      streak_days: 0,
      timezone: 'UTC',
      total_weeks_active: 0
    };
    
    const { data: created } = await this.supabase
      .from('user_daily_state')
      .insert(newState)
      .select()
      .single();
    
    return created || newState;
  }
  
  private async updateUserDailyState(userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    // Get current completions count
    const { data: completions } = await this.supabase
      .from('daily_ritual_completions')
      .select('id')
      .eq('user_id', userId)
      .gte('completed_at', today);
    
    const completionCount = completions?.length || 0;
    const capReached = completionCount >= 2;
    
    await this.supabase
      .from('user_daily_state')
      .update({
        rituals_completed_today: completionCount,
        daily_cap_reached: capReached,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('current_date', today);
  }
  
  private async updateUserStreak(userId: string): Promise<number> {
    const { data } = await this.supabase
      .rpc('update_user_streak', { user_uuid: userId });
    
    return data || 0;
  }
  
  private async updateRitualHistory(userId: string, rituals: PaidRitual[], date: string): Promise<void> {
    const updates = rituals.map(ritual => ({
      user_id: userId,
      ritual_id: ritual.id,
      last_assigned_date: date
    }));
    
    await this.supabase
      .from('user_ritual_history')
      .upsert(updates);
  }
  
  private async awardRewards(userId: string, xp: number, bytes: number): Promise<void> {
    // Update user profile with XP and Bytes
    const { error } = await this.supabase
      .from('profiles')
      .update({
        current_xp: this.supabase.raw(`current_xp + ${xp}`),
        current_bytes: this.supabase.raw(`current_bytes + ${bytes}`)
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error awarding rewards:', error);
    }
  }
  
  private async logAnalyticsEvent(userId: string, eventType: string, eventData: any): Promise<void> {
    await this.supabase
      .from('daily_ritual_events')
      .insert({
        user_id: userId,
        event_type: eventType,
        event_data: eventData
      });
  }
}

export const dailyRitualService = new DailyRitualService();
