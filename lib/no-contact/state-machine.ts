/**
 * No-Contact State Machine Service
 * CTRL+ALT+BLOCK™ Specification Section 7
 */

export type NoContactState = 'IDLE' | 'CHECKED_IN' | 'SHIELDED' | 'EXPIRED' | 'RESET';

export interface NoContactStatus {
  state: NoContactState;
  streak_count: number;
  shield_duration_hours: number;
  shield_expires_at?: Date;
  last_checkin_at?: Date;
  next_auto_shield?: Date;
  tier: 'ghost' | 'firewall';
}

export interface StateTransition {
  from: NoContactState;
  to: NoContactState;
  trigger: 'daily_checkin' | 'time_passed_24h' | 'time_passed_48h' | 'weekly_auto_shield' | 'manual_reset';
  timestamp: Date;
}

export class NoContactStateMachine {
  private status: NoContactStatus;

  constructor(initialStatus?: Partial<NoContactStatus>) {
    this.status = {
      state: 'IDLE',
      streak_count: 0,
      shield_duration_hours: 24,
      tier: 'ghost',
      ...initialStatus
    };
  }

  /**
   * Daily check-in action
   * IDLE → CHECKED_IN → SHIELDED
   */
  async dailyCheckin(): Promise<StateTransition> {
    const now = new Date();
    const transition: StateTransition = {
      from: this.status.state,
      to: 'CHECKED_IN',
      trigger: 'daily_checkin',
      timestamp: now
    };

    if (this.status.state === 'IDLE' || this.status.state === 'EXPIRED') {
      // First check-in or after expired state
      this.status.state = 'CHECKED_IN';
      this.status.streak_count += 1;
      this.status.last_checkin_at = now;
      
      // Immediately transition to SHIELDED
      await this.activateShield();
      transition.to = 'SHIELDED';
    } else if (this.status.state === 'SHIELDED' && this.canCheckinToday()) {
      // Valid check-in during shield period
      this.status.streak_count += 1;
      this.status.last_checkin_at = now;
      
      // Extend shield
      await this.activateShield();
    } else {
      throw new Error(`Cannot check in from state: ${this.status.state}`);
    }

    return transition;
  }

  /**
   * Activate shield based on tier
   */
  private async activateShield(): Promise<void> {
    const now = new Date();
    const duration = this.status.tier === 'firewall' ? 48 : 24;
    
    this.status.state = 'SHIELDED';
    this.status.shield_duration_hours = duration;
    this.status.shield_expires_at = new Date(now.getTime() + duration * 60 * 60 * 1000);
  }

  /**
   * Process time-based state transitions
   */
  async processTimeTransitions(): Promise<StateTransition | null> {
    const now = new Date();

    if (this.status.state === 'SHIELDED' && this.status.shield_expires_at) {
      if (now >= this.status.shield_expires_at) {
        // Shield expired
        const transition: StateTransition = {
          from: 'SHIELDED',
          to: 'EXPIRED',
          trigger: this.status.shield_duration_hours === 24 ? 'time_passed_24h' : 'time_passed_48h',
          timestamp: now
        };

        this.status.state = 'EXPIRED';
        this.status.shield_expires_at = undefined;
        
        return transition;
      }
    }

    return null;
  }

  /**
   * Weekly auto-shield for paid users (Sundays 00:00 local)
   */
  async processWeeklyAutoShield(localTimezone: string = 'UTC'): Promise<StateTransition | null> {
    if (this.status.tier !== 'firewall') {
      return null; // Only for paid users
    }

    const now = new Date();
    const sunday = this.getNextSunday(now, localTimezone);

    if (this.shouldTriggerAutoShield(now, sunday)) {
      const transition: StateTransition = {
        from: this.status.state,
        to: 'SHIELDED',
        trigger: 'weekly_auto_shield',
        timestamp: now
      };

      await this.activateShield();
      this.status.next_auto_shield = this.getNextSunday(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), localTimezone);
      
      return transition;
    }

    return null;
  }

  /**
   * Manual reset (admin/support function)
   */
  async reset(): Promise<StateTransition> {
    const transition: StateTransition = {
      from: this.status.state,
      to: 'RESET',
      trigger: 'manual_reset',
      timestamp: new Date()
    };

    this.status.state = 'IDLE';
    this.status.streak_count = 0;
    this.status.shield_expires_at = undefined;
    this.status.last_checkin_at = undefined;

    return transition;
  }

  /**
   * Get current status
   */
  getStatus(): NoContactStatus {
    return { ...this.status };
  }

  /**
   * Check if user can check in today
   */
  private canCheckinToday(): boolean {
    if (!this.status.last_checkin_at) return true;

    const now = new Date();
    const lastCheckin = new Date(this.status.last_checkin_at);
    const daysDiff = Math.floor((now.getTime() - lastCheckin.getTime()) / (24 * 60 * 60 * 1000));
    
    return daysDiff >= 1;
  }

  /**
   * Get next Sunday at 00:00 in local timezone
   */
  private getNextSunday(from: Date, timezone: string): Date {
    const date = new Date(from);
    const daysUntilSunday = (7 - date.getDay()) % 7;
    
    date.setDate(date.getDate() + daysUntilSunday);
    date.setHours(0, 0, 0, 0);
    
    return date;
  }

  /**
   * Check if auto-shield should trigger
   */
  private shouldTriggerAutoShield(now: Date, nextSunday: Date): boolean {
    if (!this.status.next_auto_shield) {
      // First time setup - check if it's Sunday
      return now.getDay() === 0 && now.getHours() === 0;
    }

    return now >= this.status.next_auto_shield;
  }

  /**
   * Calculate shield time remaining
   */
  getShieldTimeRemaining(): { hours: number; minutes: number } | null {
    if (this.status.state !== 'SHIELDED' || !this.status.shield_expires_at) {
      return null;
    }

    const now = new Date();
    const remaining = this.status.shield_expires_at.getTime() - now.getTime();
    
    if (remaining <= 0) {
      return { hours: 0, minutes: 0 };
    }

    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

    return { hours, minutes };
  }

  /**
   * Get streak risk level for analytics
   */
  getStreakRiskLevel(): 'low' | 'medium' | 'high' {
    if (this.status.state === 'EXPIRED') return 'high';
    if (this.status.state === 'SHIELDED') return 'low';
    
    const timeRemaining = this.getShieldTimeRemaining();
    if (!timeRemaining) return 'medium';
    
    if (timeRemaining.hours < 2) return 'high';
    if (timeRemaining.hours < 6) return 'medium';
    return 'low';
  }
}

/**
 * Factory function to create state machine from database data
 */
export function createNoContactStateMachine(userData: {
  streak_no_contact?: number;
  streak_last_checkin_at?: string | Date;
  tier?: 'ghost' | 'firewall';
  shield_expires_at?: string | Date;
  next_auto_shield?: string | Date;
}): NoContactStateMachine {
  const status: Partial<NoContactStatus> = {
    streak_count: userData.streak_no_contact || 0,
    tier: userData.tier || 'ghost',
    last_checkin_at: userData.streak_last_checkin_at ? new Date(userData.streak_last_checkin_at) : undefined,
    shield_expires_at: userData.shield_expires_at ? new Date(userData.shield_expires_at) : undefined,
    next_auto_shield: userData.next_auto_shield ? new Date(userData.next_auto_shield) : undefined
  };

  // Determine current state based on data
  if (status.shield_expires_at && new Date() < status.shield_expires_at) {
    status.state = 'SHIELDED';
  } else if (status.shield_expires_at && new Date() >= status.shield_expires_at) {
    status.state = 'EXPIRED';
  } else {
    status.state = 'IDLE';
  }

  return new NoContactStateMachine(status);
}
