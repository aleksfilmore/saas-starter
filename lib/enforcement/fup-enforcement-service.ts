/**
 * Fair Usage Policy (FUP) Enforcement System
 * Prevents abuse while maintaining user experience quality
 */

import { db } from '@/lib/db';
import { eq, and, gte, sql, count } from 'drizzle-orm';
import { users, dailyRitualCompletions } from '@/lib/db/minimal-schema';
import { getTierPermissions, type LegacyTier } from '@/lib/auth/tier-permissions';

// Usage tracking interfaces
export interface UsageQuota {
  daily_ritual_attempts: number;
  ai_therapy_minutes: number;
  voice_therapy_minutes: number;
  api_requests: number;
  file_uploads: number;
  wall_posts: number;
}

export interface UsageLimits {
  tier: LegacyTier;
  period: 'daily' | 'weekly' | 'monthly';
  limits: UsageQuota;
  reset_time: Date;
}

export interface FUPViolation {
  id: string;
  user_id: string;
  violation_type: 'rate_limit' | 'quota_exceeded' | 'suspicious_activity' | 'gaming_detected';
  resource: string;
  attempted_usage: number;
  allowed_usage: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  action_taken: 'warning' | 'throttle' | 'temporary_block' | 'account_review';
  expires_at: Date;
  created_at: Date;
}

export interface AntiGamingCheck {
  user_id: string;
  check_type: 'rapid_completion' | 'minimal_engagement' | 'pattern_abuse' | 'journal_quality';
  risk_score: number; // 0-100
  confidence: number; // 0-100
  details: Record<string, any>;
  action_required: boolean;
}

export class FUPEnforcementService {
  
  // Tier-based usage limits
  private readonly USAGE_LIMITS: Record<LegacyTier, UsageQuota> = {
    freemium: {
      daily_ritual_attempts: 3, // Can attempt 3 rituals per day (but only 1 assignment)
      ai_therapy_minutes: 0,
      voice_therapy_minutes: 0,
      api_requests: 100,
      file_uploads: 0,
      wall_posts: 2
    },
    paid_beginner: {
      daily_ritual_attempts: 5, // Extra attempts for learning
      ai_therapy_minutes: 60,
      voice_therapy_minutes: 30,
      api_requests: 500,
      file_uploads: 10,
      wall_posts: 10
    },
    paid_advanced: {
      daily_ritual_attempts: 10, // Power users
      ai_therapy_minutes: 120,
      voice_therapy_minutes: 60,
      api_requests: 1000,
      file_uploads: 25,
      wall_posts: 25
    }
  };
  
  // Rate limiting windows (in seconds)
  private readonly RATE_LIMITS = {
    ritual_completion: 300, // 5 minutes between completions
    ai_therapy_start: 60, // 1 minute between AI sessions
    wall_post: 30, // 30 seconds between posts
    api_general: 1 // 1 second between API calls
  };
  
  /**
   * Check if user can perform an action
   */
  async checkUsagePermission(
    userId: string,
    action: keyof UsageQuota,
    requestedAmount: number = 1
  ): Promise<{
    allowed: boolean;
    reason?: string;
    current_usage: number;
    limit: number;
    reset_time: Date;
    throttle_seconds?: number;
  }> {
    try {
      // Get user tier
      const user = await this.getUserTier(userId);
      const limits = this.USAGE_LIMITS[user.tier];
      
      // Check current usage
      const currentUsage = await this.getCurrentUsage(userId, action);
      const limit = limits[action];
      
      // Check if request would exceed limit
      if (currentUsage + requestedAmount > limit) {
        return {
          allowed: false,
          reason: `${action} quota exceeded. Current: ${currentUsage}/${limit}`,
          current_usage: currentUsage,
          limit,
          reset_time: this.getNextResetTime()
        };
      }
      
      // Check rate limiting
      const rateLimitCheck = await this.checkRateLimit(userId, action);
      if (!rateLimitCheck.allowed) {
        return {
          allowed: false,
          reason: `Rate limit exceeded for ${action}`,
          current_usage: currentUsage,
          limit,
          reset_time: this.getNextResetTime(),
          throttle_seconds: rateLimitCheck.throttle_seconds
        };
      }
      
      return {
        allowed: true,
        current_usage: currentUsage,
        limit,
        reset_time: this.getNextResetTime()
      };
      
    } catch (error) {
      console.error('Error checking usage permission:', error);
      // Fail safely - allow action but log the error
      return {
        allowed: true,
        current_usage: 0,
        limit: 999,
        reset_time: this.getNextResetTime()
      };
    }
  }
  
  /**
   * Record usage and check for violations
   */
  async recordUsage(
    userId: string,
    action: keyof UsageQuota,
    amount: number = 1,
    metadata?: Record<string, any>
  ): Promise<{
    recorded: boolean;
    violation?: FUPViolation;
    anti_gaming_alerts?: AntiGamingCheck[];
  }> {
    try {
      // Record the usage (would implement with actual usage tracking table)
      console.log(`Recording usage: ${userId} - ${action} - ${amount}`, metadata);
      
      // Check for violations
      const violation = await this.detectViolation(userId, action, amount);
      
      // Run anti-gaming checks
      const antiGamingAlerts = await this.runAntiGamingChecks(userId, action, metadata);
      
      return {
        recorded: true,
        violation: violation || undefined,
        anti_gaming_alerts: antiGamingAlerts.length > 0 ? antiGamingAlerts : undefined
      };
      
    } catch (error) {
      console.error('Error recording usage:', error);
      return { recorded: false };
    }
  }
  
  /**
   * Get user's current usage for a specific action
   */
  private async getCurrentUsage(userId: string, action: keyof UsageQuota): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    
    switch (action) {
      case 'daily_ritual_attempts':
        const ritualAttempts = await db
          .select({ count: count(dailyRitualCompletions.id) })
          .from(dailyRitualCompletions)
          .where(
            and(
              eq(dailyRitualCompletions.user_id, userId),
              sql`DATE(${dailyRitualCompletions.completed_at}) = ${today}`
            )
          );
        return ritualAttempts[0]?.count || 0;
        
      case 'ai_therapy_minutes':
        // Would query AI therapy usage table
        return 0; // Mock implementation
        
      case 'voice_therapy_minutes':
        // Would query voice therapy usage table
        return 0; // Mock implementation
        
      case 'api_requests':
        // Would query API usage tracking table
        return 0; // Mock implementation
        
      case 'wall_posts':
        // Would query wall posts table
        return 0; // Mock implementation
        
      default:
        return 0;
    }
  }
  
  /**
   * Check rate limiting for an action
   */
  private async checkRateLimit(
    userId: string,
    action: keyof UsageQuota
  ): Promise<{
    allowed: boolean;
    throttle_seconds?: number;
  }> {
    try {
      // Map action to rate limit key
      const rateLimitKey = this.getRateLimitKey(action);
      if (!rateLimitKey) return { allowed: true };
      
      const windowSeconds = this.RATE_LIMITS[rateLimitKey];
      
      // Check last action time (would implement with Redis or cache)
      // For now, mock implementation
      const lastActionTime = await this.getLastActionTime(userId, rateLimitKey);
      
      if (lastActionTime) {
        const timeSinceLastAction = (Date.now() - lastActionTime.getTime()) / 1000;
        
        if (timeSinceLastAction < windowSeconds) {
          return {
            allowed: false,
            throttle_seconds: Math.ceil(windowSeconds - timeSinceLastAction)
          };
        }
      }
      
      // Update last action time
      await this.updateLastActionTime(userId, rateLimitKey);
      
      return { allowed: true };
      
    } catch (error) {
      console.error('Error checking rate limit:', error);
      return { allowed: true }; // Fail safely
    }
  }
  
  /**
   * Detect policy violations
   */
  private async detectViolation(
    userId: string,
    action: keyof UsageQuota,
    amount: number
  ): Promise<FUPViolation | null> {
    try {
      const user = await this.getUserTier(userId);
      const limits = this.USAGE_LIMITS[user.tier];
      const currentUsage = await this.getCurrentUsage(userId, action);
      
      if (currentUsage + amount > limits[action]) {
        const violation: FUPViolation = {
          id: `violation_${userId}_${Date.now()}`,
          user_id: userId,
          violation_type: 'quota_exceeded',
          resource: action,
          attempted_usage: currentUsage + amount,
          allowed_usage: limits[action],
          severity: this.calculateViolationSeverity(currentUsage + amount, limits[action]),
          action_taken: this.determineEnforcementAction(action, currentUsage + amount, limits[action]),
          expires_at: this.getViolationExpiry('quota_exceeded'),
          created_at: new Date()
        };
        
        await this.recordViolation(violation);
        return violation;
      }
      
      return null;
      
    } catch (error) {
      console.error('Error detecting violation:', error);
      return null;
    }
  }
  
  /**
   * Run anti-gaming detection checks
   */
  private async runAntiGamingChecks(
    userId: string,
    action: keyof UsageQuota,
    metadata?: Record<string, any>
  ): Promise<AntiGamingCheck[]> {
    const checks: AntiGamingCheck[] = [];
    
    try {
      // Check for rapid completion patterns
      if (action === 'daily_ritual_attempts') {
        const rapidCompletionCheck = await this.checkRapidCompletion(userId);
        if (rapidCompletionCheck.risk_score > 70) {
          checks.push(rapidCompletionCheck);
        }
        
        // Check journal quality if metadata available
        if (metadata?.journalText) {
          const qualityCheck = await this.checkJournalQuality(userId, metadata.journalText);
          if (qualityCheck.risk_score > 60) {
            checks.push(qualityCheck);
          }
        }
      }
      
      // Check for minimal engagement patterns
      const engagementCheck = await this.checkMinimalEngagement(userId, action);
      if (engagementCheck.risk_score > 50) {
        checks.push(engagementCheck);
      }
      
      return checks;
      
    } catch (error) {
      console.error('Error running anti-gaming checks:', error);
      return [];
    }
  }
  
  /**
   * Check for rapid completion patterns
   */
  private async checkRapidCompletion(userId: string): Promise<AntiGamingCheck> {
    try {
      // Get recent completions
      const last2Hours = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const recentCompletions = await db
        .select({
          completed_at: dailyRitualCompletions.completed_at,
          dwell_time_seconds: dailyRitualCompletions.dwell_time_seconds
        })
        .from(dailyRitualCompletions)
        .where(
          and(
            eq(dailyRitualCompletions.user_id, userId),
            gte(dailyRitualCompletions.completed_at, last2Hours)
          )
        )
        .orderBy(dailyRitualCompletions.completed_at);
      
      let riskScore = 0;
      const details: Record<string, any> = {
        completions_count: recentCompletions.length,
        avg_dwell_time: 0,
        time_between_completions: []
      };
      
      // Check completion frequency
      if (recentCompletions.length > 3) {
        riskScore += 30; // High frequency completion
      }
      
      // Check dwell times
      const dwellTimes = recentCompletions
        .map(c => c.dwell_time_seconds)
        .filter(t => t !== null) as number[];
      
      if (dwellTimes.length > 0) {
        const avgDwellTime = dwellTimes.reduce((a, b) => a + b, 0) / dwellTimes.length;
        details.avg_dwell_time = avgDwellTime;
        
        if (avgDwellTime < 30) { // Less than 30 seconds average
          riskScore += 40;
        }
      }
      
      // Check time between completions
      for (let i = 1; i < recentCompletions.length; i++) {
        const timeBetween = (new Date(recentCompletions[i].completed_at).getTime() - 
                            new Date(recentCompletions[i-1].completed_at).getTime()) / 1000;
        details.time_between_completions.push(timeBetween);
        
        if (timeBetween < 60) { // Less than 1 minute between completions
          riskScore += 20;
        }
      }
      
      return {
        user_id: userId,
        check_type: 'rapid_completion',
        risk_score: Math.min(riskScore, 100),
        confidence: recentCompletions.length > 2 ? 85 : 60,
        details,
        action_required: riskScore > 70
      };
      
    } catch (error) {
      console.error('Error checking rapid completion:', error);
      return {
        user_id: userId,
        check_type: 'rapid_completion',
        risk_score: 0,
        confidence: 0,
        details: { error: 'Check failed' },
        action_required: false
      };
    }
  }
  
  /**
   * Check journal quality for gaming patterns
   */
  private async checkJournalQuality(userId: string, journalText: string): Promise<AntiGamingCheck> {
    let riskScore = 0;
    const details: Record<string, any> = {
      character_count: journalText.length,
      word_count: journalText.trim().split(/\s+/).length,
      unique_char_ratio: 0,
      repetition_score: 0,
      meaningful_content_score: 0
    };
    
    // Calculate unique character ratio
    const uniqueChars = new Set(journalText.toLowerCase().replace(/\s/g, '')).size;
    const totalChars = journalText.replace(/\s/g, '').length;
    const uniqueCharRatio = totalChars > 0 ? uniqueChars / totalChars : 0;
    details.unique_char_ratio = uniqueCharRatio;
    
    // Check for low variety (copy-paste or keyboard mashing)
    if (uniqueCharRatio < 0.3) {
      riskScore += 50;
    }
    
    // Check for excessive repetition
    const words = journalText.toLowerCase().split(/\s+/);
    const wordCounts = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostRepeatedCount = Math.max(...Object.values(wordCounts));
    const repetitionScore = mostRepeatedCount / words.length;
    details.repetition_score = repetitionScore;
    
    if (repetitionScore > 0.3) { // More than 30% same word
      riskScore += 40;
    }
    
    // Check for common gaming patterns
    const gamingPatterns = [
      /^(.)\1{10,}/, // Single character repeated
      /^(..)\1{5,}/, // Two characters repeated
      /^[a-z]{1,3}$/i, // Very short entries
      /test|testing|hello|abc|123|lorem|ipsum/i // Common test patterns
    ];
    
    const hasGamingPattern = gamingPatterns.some(pattern => pattern.test(journalText));
    if (hasGamingPattern) {
      riskScore += 60;
    }
    
    return {
      user_id: userId,
      check_type: 'journal_quality',
      risk_score: Math.min(riskScore, 100),
      confidence: journalText.length > 50 ? 90 : 60,
      details,
      action_required: riskScore > 60
    };
  }
  
  /**
   * Check for minimal engagement patterns
   */
  private async checkMinimalEngagement(userId: string, action: keyof UsageQuota): Promise<AntiGamingCheck> {
    // Simplified engagement check
    // In production, this would analyze multiple engagement metrics
    
    return {
      user_id: userId,
      check_type: 'minimal_engagement',
      risk_score: 0, // Mock implementation
      confidence: 50,
      details: { action, timestamp: new Date() },
      action_required: false
    };
  }
  
  // Helper methods
  private async getUserTier(userId: string): Promise<{ tier: LegacyTier }> {
    const user = await db
      .select({ tier: users.tier })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
      
    return { tier: (user[0]?.tier as LegacyTier) || 'freemium' };
  }
  
  private getRateLimitKey(action: keyof UsageQuota): keyof typeof this.RATE_LIMITS | null {
    switch (action) {
      case 'daily_ritual_attempts': return 'ritual_completion';
      case 'ai_therapy_minutes': return 'ai_therapy_start';
      case 'wall_posts': return 'wall_post';
      default: return 'api_general';
    }
  }
  
  private async getLastActionTime(userId: string, action: string): Promise<Date | null> {
    // Mock implementation - would use Redis or cache
    return null;
  }
  
  private async updateLastActionTime(userId: string, action: string): Promise<void> {
    // Mock implementation - would update Redis or cache
    console.log(`Updated last action time: ${userId} - ${action}`);
  }
  
  private getNextResetTime(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }
  
  private calculateViolationSeverity(attempted: number, allowed: number): FUPViolation['severity'] {
    const ratio = attempted / allowed;
    if (ratio > 3) return 'critical';
    if (ratio > 2) return 'high';
    if (ratio > 1.5) return 'medium';
    return 'low';
  }
  
  private determineEnforcementAction(
    action: string,
    attempted: number,
    allowed: number
  ): FUPViolation['action_taken'] {
    const severity = this.calculateViolationSeverity(attempted, allowed);
    
    switch (severity) {
      case 'critical': return 'account_review';
      case 'high': return 'temporary_block';
      case 'medium': return 'throttle';
      default: return 'warning';
    }
  }
  
  private getViolationExpiry(type: FUPViolation['violation_type']): Date {
    const now = new Date();
    switch (type) {
      case 'quota_exceeded': return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
      case 'rate_limit': return new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
      case 'suspicious_activity': return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
      default: return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  }
  
  private async recordViolation(violation: FUPViolation): Promise<void> {
    // Mock implementation - would store in violations table
    console.log('FUP Violation recorded:', violation);
  }
}

export const fupEnforcementService = new FUPEnforcementService();
