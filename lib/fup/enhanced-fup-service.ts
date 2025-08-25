/**
 * CTRL+ALT+BLOCK™ v1.1 - Enhanced Fair Use Policy (FUP) Enforcement
 * Advanced rate limiting with persona-voice cooldowns per specification section 12
 */

import { db } from '@/lib/db';
import { eq, and, gte, desc, sql, count } from 'drizzle-orm';
import { users, ritualCompletions } from '@/lib/db/unified-schema';

export interface FUPViolation {
  type: 'ritual_spam' | 'journal_rapid_fire' | 'ai_abuse' | 'system_gaming';
  severity: 'warning' | 'minor' | 'major' | 'critical';
  cooldownMinutes: number;
  personaVoiceAffected: string[];
  reason: string;
  timestamp: Date;
}

export interface FUPStatus {
  isBlocked: boolean;
  activeViolations: FUPViolation[];
  cooldownsActive: Record<string, Date>; // persona -> cooldown end time
  warnings: string[];
  nextAllowedAction: Date | null;
  rateLimit: {
    ritualsPerHour: number;
    journalEntriesPerHour: number;
    aiSessionsPerDay: number;
    currentUsage: {
      rituals: number;
      journalEntries: number;
      aiSessions: number;
    };
  };
}

export class EnhancedFUPService {
  
  /**
   * Check FUP status for user before allowing actions
   */
  async checkFUPStatus(userId: string): Promise<FUPStatus> {
    try {
      const user = await this.getUser(userId);
      const currentUsage = await this.getCurrentUsage(userId);
      const activeViolations = await this.getActiveViolations(userId);
      const cooldowns = await this.getActiveCooldowns(userId);
      
      // Determine if user is currently blocked
      const isBlocked = this.isUserBlocked(activeViolations, cooldowns);
      
      // Calculate rate limits based on tier and violations
      const rateLimits = this.calculateRateLimits(user.tier, activeViolations);
      
      // Generate warnings
      const warnings = this.generateWarnings(currentUsage, rateLimits, activeViolations);
      
      // Calculate next allowed action time
      const nextAllowedAction = this.getNextAllowedActionTime(cooldowns);

      return {
        isBlocked,
        activeViolations,
        cooldownsActive: cooldowns,
        warnings,
        nextAllowedAction,
        rateLimit: {
          ...rateLimits,
          currentUsage
        }
      };

    } catch (error) {
      console.error('Error checking FUP status:', error);
      // Fail-safe: allow action but log error
      return this.getDefaultFUPStatus();
    }
  }

  /**
   * Enforce FUP for ritual completion
   */
  async enforceRitualFUP(userId: string, ritualId: string): Promise<{ allowed: boolean; reason?: string; cooldownMinutes?: number }> {
    const fupStatus = await this.checkFUPStatus(userId);
    
    if (fupStatus.isBlocked) {
      return {
        allowed: false,
        reason: 'Account temporarily restricted due to Fair Use Policy violations',
        cooldownMinutes: this.getMinimumCooldownMinutes(fupStatus.activeViolations)
      };
    }

    // Check ritual-specific rate limits
    const ritualLimitCheck = await this.checkRitualRateLimit(userId);
    if (!ritualLimitCheck.allowed) {
      // Record violation
      await this.recordViolation(userId, {
        type: 'ritual_spam',
        severity: 'minor',
        cooldownMinutes: 30,
        personaVoiceAffected: ['all'],
        reason: 'Excessive ritual completion attempts',
        timestamp: new Date()
      });

      return ritualLimitCheck;
    }

    return { allowed: true };
  }

  /**
   * Enforce FUP for journal entries
   */
  async enforceJournalFUP(userId: string): Promise<{ allowed: boolean; reason?: string; cooldownMinutes?: number }> {
    const fupStatus = await this.checkFUPStatus(userId);
    
    if (fupStatus.isBlocked) {
      return {
        allowed: false,
        reason: 'Journal access temporarily restricted',
        cooldownMinutes: this.getMinimumCooldownMinutes(fupStatus.activeViolations)
      };
    }

    // Check journal-specific patterns
    const journalAbuseCheck = await this.detectJournalAbuse(userId);
    if (journalAbuseCheck.isAbuse) {
      await this.recordViolation(userId, {
        type: 'journal_rapid_fire',
        severity: journalAbuseCheck.severity || 'minor',
        cooldownMinutes: journalAbuseCheck.cooldownMinutes || 15,
        personaVoiceAffected: journalAbuseCheck.affectedVoices || ['all'],
        reason: journalAbuseCheck.reason || 'Journal abuse detected',
        timestamp: new Date()
      });

      return {
        allowed: false,
        reason: journalAbuseCheck.reason || 'Journal abuse detected',
        cooldownMinutes: journalAbuseCheck.cooldownMinutes || 15
      };
    }

    return { allowed: true };
  }

  /**
   * Enforce FUP for AI therapy sessions
   */
  async enforceAITherapyFUP(userId: string, personaVoice: string): Promise<{ allowed: boolean; reason?: string; cooldownMinutes?: number }> {
    const fupStatus = await this.checkFUPStatus(userId);
    
    // Check persona-specific cooldowns
    const personaCooldown = fupStatus.cooldownsActive[personaVoice];
    if (personaCooldown && personaCooldown > new Date()) {
      const minutesRemaining = Math.ceil((personaCooldown.getTime() - Date.now()) / (1000 * 60));
      return {
        allowed: false,
        reason: `${personaVoice} voice is on cooldown due to recent overuse`,
        cooldownMinutes: minutesRemaining
      };
    }

    if (fupStatus.isBlocked) {
      return {
        allowed: false,
        reason: 'AI therapy access temporarily restricted',
        cooldownMinutes: this.getMinimumCooldownMinutes(fupStatus.activeViolations)
      };
    }

    // Check AI abuse patterns
    const aiAbuseCheck = await this.detectAIAbuse(userId, personaVoice);
    if (aiAbuseCheck.isAbuse) {
      await this.recordViolation(userId, {
        type: 'ai_abuse',
        severity: aiAbuseCheck.severity || 'minor',
        cooldownMinutes: aiAbuseCheck.cooldownMinutes || 30,
        personaVoiceAffected: [personaVoice],
        reason: aiAbuseCheck.reason || 'AI therapy abuse detected',
        timestamp: new Date()
      });

      return {
        allowed: false,
        reason: aiAbuseCheck.reason || 'AI therapy abuse detected',
        cooldownMinutes: aiAbuseCheck.cooldownMinutes || 30
      };
    }

    return { allowed: true };
  }

  /**
   * Detect system gaming attempts
   */
  async detectSystemGaming(userId: string, actionType: string, actionData: any): Promise<{ isGaming: boolean; severity?: 'minor' | 'major' | 'critical'; reason?: string }> {
    try {
      // Detect rapid-fire identical actions
      if (actionType === 'ritual_completion') {
        const recentCompletions = await this.getRecentRitualCompletions(userId, 10);
        const rapidFire = this.detectRapidFirePatterns(recentCompletions);
        
        if (rapidFire.detected) {
          return {
            isGaming: true,
            severity: 'major',
            reason: 'Rapid-fire ritual completion pattern detected'
          };
        }
      }

      // Detect journal gaming (copy-paste, minimal effort)
      if (actionType === 'journal_entry' && actionData.content) {
        const gamingCheck = await this.detectJournalGaming(userId, actionData.content);
        if (gamingCheck.isGaming) {
          return gamingCheck;
        }
      }

      // Detect XP farming attempts
      const xpFarmingCheck = await this.detectXPFarming(userId);
      if (xpFarmingCheck.detected) {
        return {
          isGaming: true,
          severity: 'critical',
          reason: 'Systematic XP farming behavior detected'
        };
      }

      return { isGaming: false };

    } catch (error) {
      console.error('Error detecting system gaming:', error);
      return { isGaming: false };
    }
  }

  /**
   * Check ritual completion rate limits
   */
  private async checkRitualRateLimit(userId: string): Promise<{ allowed: boolean; reason?: string; cooldownMinutes?: number }> {
    const lastHour = new Date(Date.now() - 60 * 60 * 1000);
    
    const recentCompletions = await db
      .select({ count: count() })
      .from(ritualCompletions)
      .where(
        and(
          eq(ritualCompletions.userId, userId),
          gte(ritualCompletions.completedAt, lastHour)
        )
      );

    const hourlyCount = recentCompletions[0]?.count || 0;
    
    if (hourlyCount >= 10) { // Max 10 rituals per hour
      return {
        allowed: false,
        reason: 'Ritual completion rate limit exceeded (10 per hour)',
        cooldownMinutes: 60
      };
    }

    return { allowed: true };
  }

  /**
   * Detect journal abuse patterns
   */
  private async detectJournalAbuse(userId: string): Promise<{
    isAbuse: boolean;
    severity?: 'minor' | 'major';
    cooldownMinutes?: number;
    affectedVoices?: string[];
    reason?: string;
  }> {
    // Check for rapid journal entries (more than 5 in 10 minutes)
    const last10Minutes = new Date(Date.now() - 10 * 60 * 1000);
    
    // This would need a journal entries table to track properly
    // For now, return a placeholder check
    return { isAbuse: false };
  }

  /**
   * Detect AI therapy abuse
   */
  private async detectAIAbuse(userId: string, personaVoice: string): Promise<{
    isAbuse: boolean;
    severity?: 'minor' | 'major' | 'critical';
    cooldownMinutes?: number;
    reason?: string;
  }> {
    // This would check AI session frequency and patterns
    // Placeholder implementation
    return { isAbuse: false };
  }

  /**
   * Detect journal content gaming
   */
  private async detectJournalGaming(userId: string, content: string): Promise<{
    isGaming: boolean;
    severity?: 'minor' | 'major';
    reason?: string;
  }> {
    // Check for minimal effort patterns
    const words = content.trim().split(/\s+/);
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    
    // Too many repeated words
    if (words.length > 20 && uniqueWords.size < words.length * 0.3) {
      return {
        isGaming: true,
        severity: 'minor',
        reason: 'Journal content appears to have excessive repetition'
      };
    }

    // Too short for effort
    if (content.length < 50) {
      return {
        isGaming: true,
        severity: 'minor',
        reason: 'Journal entry too brief to demonstrate meaningful reflection'
      };
    }

    return { isGaming: false };
  }

  /**
   * Helper methods
   */
  private async getUser(userId: string) {
    const user = await db
      .select({ tier: users.tier })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    return user[0] || { tier: 'ghost' };
  }

  private async getCurrentUsage(userId: string) {
    // Placeholder - would track actual usage
    return {
      rituals: 0,
      journalEntries: 0,
      aiSessions: 0
    };
  }

  private async getActiveViolations(userId: string): Promise<FUPViolation[]> {
    // Placeholder - would fetch from violations table
    return [];
  }

  private async getActiveCooldowns(userId: string): Promise<Record<string, Date>> {
    // Placeholder - would fetch active cooldowns
    return {};
  }

  private isUserBlocked(violations: FUPViolation[], cooldowns: Record<string, Date>): boolean {
    return violations.some(v => v.severity === 'critical') || 
           Object.values(cooldowns).some(cooldown => cooldown > new Date());
  }

  private calculateRateLimits(tier: string, violations: FUPViolation[]) {
    const baseLimits = {
      ritualsPerHour: tier === 'firewall' ? 15 : 10,
      journalEntriesPerHour: tier === 'firewall' ? 20 : 10,
      aiSessionsPerDay: tier === 'firewall' ? 50 : 20
    };

    // Reduce limits based on violations
    const violationPenalty = violations.length * 0.2;
    return {
      ritualsPerHour: Math.max(1, Math.floor(baseLimits.ritualsPerHour * (1 - violationPenalty))),
      journalEntriesPerHour: Math.max(1, Math.floor(baseLimits.journalEntriesPerHour * (1 - violationPenalty))),
      aiSessionsPerDay: Math.max(1, Math.floor(baseLimits.aiSessionsPerDay * (1 - violationPenalty)))
    };
  }

  private generateWarnings(usage: any, limits: any, violations: FUPViolation[]): string[] {
    const warnings: string[] = [];
    
    if (usage.rituals > limits.ritualsPerHour * 0.8) {
      warnings.push('Approaching ritual completion rate limit');
    }
    
    if (violations.length > 0) {
      warnings.push(`${violations.length} active Fair Use Policy violation(s)`);
    }
    
    return warnings;
  }

  private getNextAllowedActionTime(cooldowns: Record<string, Date>): Date | null {
    const futureCooldowns = Object.values(cooldowns).filter(d => d > new Date());
    if (futureCooldowns.length === 0) return null;
    
    return futureCooldowns.reduce((earliest, current) => 
      current < earliest ? current : earliest
    );
  }

  private getMinimumCooldownMinutes(violations: FUPViolation[]): number {
    if (violations.length === 0) return 0;
    return Math.min(...violations.map(v => v.cooldownMinutes));
  }

  private getDefaultFUPStatus(): FUPStatus {
    return {
      isBlocked: false,
      activeViolations: [],
      cooldownsActive: {},
      warnings: [],
      nextAllowedAction: null,
      rateLimit: {
        ritualsPerHour: 10,
        journalEntriesPerHour: 10,
        aiSessionsPerDay: 20,
        currentUsage: {
          rituals: 0,
          journalEntries: 0,
          aiSessions: 0
        }
      }
    };
  }

  private async recordViolation(userId: string, violation: FUPViolation): Promise<void> {
    // Would record to violations table
    console.log('FUP Violation recorded:', { userId, violation });
  }

  private async getRecentRitualCompletions(userId: string, limit: number) {
    return await db
      .select()
      .from(ritualCompletions)
      .where(eq(ritualCompletions.userId, userId))
      .orderBy(desc(ritualCompletions.completedAt))
      .limit(limit);
  }

  private detectRapidFirePatterns(completions: any[]): { detected: boolean; reason?: string } {
    if (completions.length < 3) return { detected: false };
    
    // Check if multiple completions within 5 minutes
    const rapidCompletions = completions.filter((completion, index) => {
      if (index === 0) return false;
      const prevCompletion = completions[index - 1];
      const timeDiff = Math.abs(new Date(completion.completedAt).getTime() - new Date(prevCompletion.completedAt).getTime());
      return timeDiff < 5 * 60 * 1000; // 5 minutes
    });

    if (rapidCompletions.length >= 2) {
      return {
        detected: true,
        reason: 'Multiple ritual completions within 5-minute windows detected'
      };
    }

    return { detected: false };
  }

  private async detectXPFarming(userId: string): Promise<{ detected: boolean; reason?: string }> {
    // Placeholder for XP farming detection
    return { detected: false };
  }
}

export const enhancedFUPService = new EnhancedFUPService();
