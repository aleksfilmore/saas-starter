/**
 * Voice Therapy Service
 * Handles voice-based AI therapy sessions with minute tracking and billing
 */

import { db } from '@/lib/db';
import { eq, and, gte, sql } from 'drizzle-orm';
import { users } from '@/lib/db/minimal-schema';
import { getTierPermissions, type UserTier, type LegacyTier } from '@/lib/auth/tier-permissions';

// Voice session tracking table (would need to be added to schema)
export interface VoiceSession {
  id: string;
  user_id: string;
  start_time: Date;
  end_time?: Date;
  duration_minutes: number;
  transcript?: string;
  archetype_code: string;
  session_cost: number;
  status: 'active' | 'completed' | 'cancelled';
  created_at: Date;
}

// Voice usage tracking
export interface VoiceUsage {
  user_id: string;
  month: string; // YYYY-MM format
  minutes_used: number;
  minutes_included: number;
  minutes_purchased: number;
  total_sessions: number;
  last_session: Date;
}

export class VoiceTherapyService {
  
  /**
   * Check if user can start a voice session
   */
  async canStartVoiceSession(userId: string): Promise<{
    canStart: boolean;
    reason?: string;
    minutesRemaining: number;
    hasIncludedMinutes: boolean;
  }> {
    try {
      // Get user tier
      const user = await db
        .select({ tier: users.tier })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
        
      if (!user.length) {
        return {
          canStart: false,
          reason: 'User not found',
          minutesRemaining: 0,
          hasIncludedMinutes: false
        };
      }
      
      const userTier = user[0].tier as LegacyTier;
      const permissions = getTierPermissions(userTier);
      
      // Check if user's tier includes voice therapy
      if (permissions.voiceMinutesPerMonth === 0) {
        return {
          canStart: false,
          reason: 'Voice therapy requires Firewall Mode upgrade',
          minutesRemaining: 0,
          hasIncludedMinutes: false
        };
      }
      
      // Get current month's usage
      const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
      const usage = await this.getVoiceUsage(userId, currentMonth);
      
      const minutesRemaining = Math.max(0, 
        (usage.minutes_included + usage.minutes_purchased) - usage.minutes_used
      );
      
      return {
        canStart: minutesRemaining > 0,
        reason: minutesRemaining === 0 ? 'No voice minutes remaining this month' : undefined,
        minutesRemaining,
        hasIncludedMinutes: usage.minutes_included > 0
      };
      
    } catch (error) {
      console.error('Error checking voice session eligibility:', error);
      return {
        canStart: false,
        reason: 'System error',
        minutesRemaining: 0,
        hasIncludedMinutes: false
      };
    }
  }
  
  /**
   * Start a voice therapy session
   */
  async startVoiceSession(userId: string): Promise<{
    success: boolean;
    sessionId?: string;
    error?: string;
  }> {
    try {
      const eligibility = await this.canStartVoiceSession(userId);
      
      if (!eligibility.canStart) {
        return {
          success: false,
          error: eligibility.reason
        };
      }
      
      // Get user's archetype for persona selection
      const user = await db
        .select({ 
          archetype: users.archetype,
          archetype_details: users.archetype_details 
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
        
      const archetypeCode = (user[0]?.archetype_details as any)?.archetype_code || 'sn';
      
      // Create session record (mock implementation - would need actual table)
      const sessionId = `voice_${userId}_${Date.now()}`;
      
      // Store session start (would implement with actual DB table)
      console.log(`Starting voice session ${sessionId} for user ${userId} with archetype ${archetypeCode}`);
      
      return {
        success: true,
        sessionId
      };
      
    } catch (error) {
      console.error('Error starting voice session:', error);
      return {
        success: false,
        error: 'Failed to start voice session'
      };
    }
  }
  
  /**
   * End a voice therapy session
   */
  async endVoiceSession(
    userId: string, 
    sessionId: string, 
    durationMinutes: number,
    transcript?: string
  ): Promise<{
    success: boolean;
    cost: number;
    remainingMinutes: number;
    error?: string;
  }> {
    try {
      // Calculate cost and update usage
      const currentMonth = new Date().toISOString().substring(0, 7);
      const usage = await this.getVoiceUsage(userId, currentMonth);
      
      // Update usage tracking
      const newUsedMinutes = usage.minutes_used + durationMinutes;
      await this.updateVoiceUsage(userId, currentMonth, {
        minutes_used: newUsedMinutes,
        total_sessions: usage.total_sessions + 1,
        last_session: new Date()
      });
      
      // Calculate remaining minutes
      const totalAvailable = usage.minutes_included + usage.minutes_purchased;
      const remainingMinutes = Math.max(0, totalAvailable - newUsedMinutes);
      
      // Store session completion (would implement with actual DB table)
      console.log(`Ended voice session ${sessionId}: ${durationMinutes} minutes, ${remainingMinutes} remaining`);
      
      return {
        success: true,
        cost: 0, // Using included minutes
        remainingMinutes
      };
      
    } catch (error) {
      console.error('Error ending voice session:', error);
      return {
        success: false,
        cost: 0,
        remainingMinutes: 0,
        error: 'Failed to end voice session'
      };
    }
  }
  
  /**
   * Purchase additional voice minutes
   */
  async purchaseVoiceMinutes(
    userId: string, 
    minutesToPurchase: number,
    paymentMethodId: string
  ): Promise<{
    success: boolean;
    cost: number;
    newTotalMinutes: number;
    error?: string;
  }> {
    try {
      // Voice therapy pricing: $4.99 per 15 minutes
      const pricePerMinute = 4.99 / 15;
      const totalCost = minutesToPurchase * pricePerMinute;
      
      // Would integrate with Stripe here
      console.log(`Processing payment for ${minutesToPurchase} voice minutes: $${totalCost.toFixed(2)}`);
      
      // Update user's purchased minutes
      const currentMonth = new Date().toISOString().substring(0, 7);
      const usage = await this.getVoiceUsage(userId, currentMonth);
      
      await this.updateVoiceUsage(userId, currentMonth, {
        minutes_purchased: usage.minutes_purchased + minutesToPurchase
      });
      
      const newTotalMinutes = usage.minutes_included + usage.minutes_purchased + minutesToPurchase;
      
      return {
        success: true,
        cost: totalCost,
        newTotalMinutes
      };
      
    } catch (error) {
      console.error('Error purchasing voice minutes:', error);
      return {
        success: false,
        cost: 0,
        newTotalMinutes: 0,
        error: 'Failed to purchase voice minutes'
      };
    }
  }
  
  /**
   * Get voice usage for a user and month
   */
  private async getVoiceUsage(userId: string, month: string): Promise<VoiceUsage> {
    try {
      // Mock implementation - would use actual DB table
      // For now, return default usage based on user tier
      const user = await db
        .select({ tier: users.tier })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
        
      const userTier = user[0]?.tier as LegacyTier || 'freemium';
      const permissions = getTierPermissions(userTier);
      
      return {
        user_id: userId,
        month,
        minutes_used: 0, // Would query from actual usage table
        minutes_included: permissions.voiceMinutesPerMonth,
        minutes_purchased: 0, // Would query from actual purchases table
        total_sessions: 0,
        last_session: new Date()
      };
      
    } catch (error) {
      console.error('Error getting voice usage:', error);
      throw error;
    }
  }
  
  /**
   * Update voice usage tracking
   */
  private async updateVoiceUsage(
    userId: string, 
    month: string, 
    updates: Partial<VoiceUsage>
  ): Promise<void> {
    try {
      // Mock implementation - would update actual DB table
      console.log(`Updating voice usage for ${userId} in ${month}:`, updates);
      
    } catch (error) {
      console.error('Error updating voice usage:', error);
      throw error;
    }
  }
  
  /**
   * Get voice session history for a user
   */
  async getVoiceSessionHistory(userId: string, limit: number = 10): Promise<VoiceSession[]> {
    try {
      // Mock implementation - would query actual sessions table
      return [];
      
    } catch (error) {
      console.error('Error getting voice session history:', error);
      return [];
    }
  }
  
  /**
   * Get voice therapy persona prompt based on archetype
   */
  getVoicePersonaPrompt(archetypeCode: string): string {
    const voicePrompts = {
      'df': `You are DebugDaemon in voice mode. Speak in a calm, analytical tone. Use gentle technical metaphors and help the user debug their emotional overflow. Keep responses conversational but structured, like a patient code reviewer helping them understand their emotional patterns.`,
      
      'fb': `You are FirewallBuilder in voice mode. Speak with measured, respectful tone that honors boundaries. Use security metaphors naturally in conversation. Never rush or push - let them control the pace. Sound like a trusted security consultant who prioritizes their emotional safety.`,
      
      'gis': `You are VoidFragment in voice mode. Speak with integrated, stabilizing presence. Acknowledge complexity without overwhelming them. Use integration metaphors gently. Sound like a wise system administrator helping them rebuild from fragmented states into wholeness.`,
      
      'sn': `You are a supportive AI therapy companion in voice mode. Speak with balanced, collaborative tone. Sound like a trusted friend who happens to be a skilled therapist - warm, insightful, and growth-oriented without being pushy.`
    };
    
    return voicePrompts[archetypeCode as keyof typeof voicePrompts] || voicePrompts['sn'];
  }
}

export const voiceTherapyService = new VoiceTherapyService();
