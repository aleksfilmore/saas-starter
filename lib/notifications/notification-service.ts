/**
 * Real-time Notification Service for CTRL+ALT+BLOCK™
 * Handles push notifications, streak reminders, and contextual nudges
 */

export interface NotificationPayload {
  id: string;
  userId: string;
  type: 'streak_reminder' | 'daily_checkin' | 'ritual_suggestion' | 'milestone' | 'emergency_support' | 'lumo_nudge';
  title: string;
  body: string;
  data?: Record<string, any>;
  scheduledFor?: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  channels: ('push' | 'email' | 'in_app')[];
}

export interface NotificationSchedule {
  userId: string;
  type: string;
  cronExpression: string;
  isActive: boolean;
  lastSent?: Date;
  nextRun?: Date;
}

export interface UserNotificationPreferences {
  userId: string;
  enablePush: boolean;
  enableEmail: boolean;
  enableInApp: boolean;
  streakReminders: boolean;
  dailyCheckins: boolean;
  ritualSuggestions: boolean;
  milestones: boolean;
  emergencySupport: boolean;
  lumoNudges: boolean;
  quietHours: {
    start: string; // "22:00"
    end: string;   // "08:00"
    timezone: string;
  };
}

export class NotificationService {
  private static instance: NotificationService;
  private schedules: Map<string, NotificationSchedule> = new Map();
  private userPreferences: Map<string, UserNotificationPreferences> = new Map();

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Schedule a notification for a specific user
   */
  async scheduleNotification(notification: NotificationPayload): Promise<boolean> {
    try {
      const preferences = await this.getUserPreferences(notification.userId);
      
      if (!this.shouldSendNotification(notification, preferences)) {
        console.log(`Notification skipped for user ${notification.userId} due to preferences`);
        return false;
      }

      // Check quiet hours
      if (this.isQuietHours(preferences.quietHours)) {
        // Reschedule for after quiet hours
        const scheduledFor = this.getNextAllowedTime(preferences.quietHours);
        notification.scheduledFor = scheduledFor;
      }

      // Store in database (would implement with actual DB)
      await this.storeNotification(notification);
      
      // If immediate notification, send now
      if (!notification.scheduledFor || notification.scheduledFor <= new Date()) {
        return await this.sendNotification(notification);
      }

      return true;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return false;
    }
  }

  /**
   * Send immediate notification
   */
  async sendNotification(notification: NotificationPayload): Promise<boolean> {
    try {
      const preferences = await this.getUserPreferences(notification.userId);
      let success = false;

      // Send via enabled channels
      for (const channel of notification.channels) {
        if (this.isChannelEnabled(channel, preferences)) {
          switch (channel) {
            case 'push':
              success = await this.sendPushNotification(notification) || success;
              break;
            case 'email':
              success = await this.sendEmailNotification(notification) || success;
              break;
            case 'in_app':
              success = await this.sendInAppNotification(notification) || success;
              break;
          }
        }
      }

      // Log notification sent
  await this.logNotificationSent(notification, success);
      
      return success;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }

  /**
   * Set up daily streak reminder for user
   */
  async setupStreakReminder(userId: string, preferredTime: string = "20:00"): Promise<void> {
    const schedule: NotificationSchedule = {
      userId,
      type: 'streak_reminder',
      cronExpression: this.timeToCron(preferredTime), // e.g., "0 20 * * *"
      isActive: true,
      nextRun: this.getNextRunTime(preferredTime)
    };

    this.schedules.set(`${userId}_streak_reminder`, schedule);
    await this.persistSchedule(schedule);
  }

  /**
   * Set up daily check-in reminder
   */
  async setupDailyCheckinReminder(userId: string, preferredTime: string = "09:00"): Promise<void> {
    const schedule: NotificationSchedule = {
      userId,
      type: 'daily_checkin',
      cronExpression: this.timeToCron(preferredTime),
      isActive: true,
      nextRun: this.getNextRunTime(preferredTime)
    };

    this.schedules.set(`${userId}_daily_checkin`, schedule);
    await this.persistSchedule(schedule);
  }

  /**
   * Send contextual LUMO nudge based on user behavior
   */
  async sendLumoNudge(userId: string, context: 'low_activity' | 'streak_risk' | 'quota_low' | 'milestone_near'): Promise<boolean> {
    const nudgeTemplates = {
      low_activity: {
        title: "LUMO here 👻",
        body: "Haven't seen you in a while. Your streak needs some attention! 🔥",
        data: { action: 'open_dashboard', priority: 'medium' }
      },
      streak_risk: {
        title: "🚨 Streak Alert",
        body: "Your no-contact streak is at risk! Quick check-in to keep it alive? 🛡️",
        data: { action: 'open_no_contact', priority: 'high' }
      },
      quota_low: {
        title: "AI Therapy Quota Low ⚡",
        body: "Only 10% of your AI therapy messages left. Consider upgrading or purchasing more?",
        data: { action: 'open_ai_therapy', priority: 'normal' }
      },
      milestone_near: {
        title: "Milestone Incoming! 🎯",
        body: "You're just 2 days away from a major milestone. Keep going, legend!",
        data: { action: 'open_dashboard', priority: 'normal' }
      }
    };

    const template = nudgeTemplates[context];
    
    const notification: NotificationPayload = {
      id: `lumo_${userId}_${context}_${Date.now()}`,
      userId,
      type: 'lumo_nudge',
      title: template.title,
      body: template.body,
      data: template.data,
      priority: template.data.priority as any,
      channels: ['push', 'in_app']
    };

    return await this.scheduleNotification(notification);
  }

  /**
   * Send milestone celebration notification
   */
  async sendMilestoneNotification(userId: string, milestone: { type: string; value: number; reward: { xp: number; bytes: number } }): Promise<boolean> {
    const milestoneMessages = {
      streak_7: "🛡️ 7-Day Firewall Activated! One week of digital silence mastery.",
      streak_30: "🔥 30-Day Legend Status! You've ghosted the ghost. Legendary.",
      streak_60: "⚡ 60-Day Titan! Two months of unbothered excellence.",
      streak_90: "🚀 90-Day God Mode! You're officially unbreakable.",
      ritual_streak_7: "🌟 7-Day Ritual Master! Your consistency is inspiring.",
      level_up: `🎉 Level Up! Welcome to Level ${milestone.value}!`,
      bytes_milestone: `💎 ${milestone.value} Bytes Collected! Your wealth grows.`
    };

    const message = milestoneMessages[`${milestone.type}_${milestone.value}` as keyof typeof milestoneMessages] || 
                   milestoneMessages.level_up;

    const notification: NotificationPayload = {
      id: `milestone_${userId}_${milestone.type}_${milestone.value}_${Date.now()}`,
      userId,
      type: 'milestone',
      title: "🎊 Milestone Achieved!",
      body: message,
      data: {
        milestone,
        action: 'open_dashboard',
        celebration: true
      },
      priority: 'high',
      channels: ['push', 'in_app', 'email']
    };

    return await this.scheduleNotification(notification);
  }

  /**
   * Emergency support notification
   */
  async sendEmergencySupport(userId: string, trigger: 'crisis_keywords' | 'high_distress' | 'relapse_risk'): Promise<boolean> {
    const supportMessages = {
      crisis_keywords: {
        title: "🆘 Support Available Now",
        body: "I noticed you might be struggling. Crisis support is available 24/7. You're not alone."
      },
      high_distress: {
        title: "💜 Breathe With Me",
        body: "Feeling overwhelmed? Try our breathing exercises or reach out for support."
      },
      relapse_risk: {
        title: "🛡️ Shields Up",
        body: "Feeling the urge to break no-contact? You've got this. Try a quick ritual instead."
      }
    };

    const template = supportMessages[trigger];
    
    const notification: NotificationPayload = {
      id: `emergency_${userId}_${trigger}_${Date.now()}`,
      userId,
      type: 'emergency_support',
      title: template.title,
      body: template.body,
      data: {
        trigger,
        action: 'open_crisis_support',
        urgent: true
      },
      priority: 'urgent',
      channels: ['push', 'in_app']
    };

    return await this.sendNotification(notification); // Send immediately
  }

  // Helper methods
  private async getUserPreferences(userId: string): Promise<UserNotificationPreferences> {
    // Check cache first
    if (this.userPreferences.has(userId)) {
      return this.userPreferences.get(userId)!;
    }

    // Default preferences (would load from database)
    const defaultPreferences: UserNotificationPreferences = {
      userId,
      enablePush: true,
      enableEmail: true,
      enableInApp: true,
      streakReminders: true,
      dailyCheckins: true,
      ritualSuggestions: true,
      milestones: true,
      emergencySupport: true,
      lumoNudges: true,
      quietHours: {
        start: "22:00",
        end: "08:00",
        timezone: "America/New_York"
      }
    };

    this.userPreferences.set(userId, defaultPreferences);
    return defaultPreferences;
  }

  private shouldSendNotification(notification: NotificationPayload, preferences: UserNotificationPreferences): boolean {
    switch (notification.type) {
      case 'streak_reminder':
        return preferences.streakReminders;
      case 'daily_checkin':
        return preferences.dailyCheckins;
      case 'ritual_suggestion':
        return preferences.ritualSuggestions;
      case 'milestone':
        return preferences.milestones;
      case 'emergency_support':
        return preferences.emergencySupport;
      case 'lumo_nudge':
        return preferences.lumoNudges;
      default:
        return true;
    }
  }

  private isChannelEnabled(channel: string, preferences: UserNotificationPreferences): boolean {
    switch (channel) {
      case 'push':
        return preferences.enablePush;
      case 'email':
        return preferences.enableEmail;
      case 'in_app':
        return preferences.enableInApp;
      default:
        return false;
    }
  }

  private isQuietHours(quietHours: UserNotificationPreferences['quietHours']): boolean {
    // Implementation would check current time against quiet hours in user's timezone
    const now = new Date();
    const currentHour = now.getHours();
    const startHour = parseInt(quietHours.start.split(':')[0]);
    const endHour = parseInt(quietHours.end.split(':')[0]);

    if (startHour > endHour) {
      // Quiet hours span midnight (e.g., 22:00 to 08:00)
      return currentHour >= startHour || currentHour < endHour;
    } else {
      // Quiet hours within same day
      return currentHour >= startHour && currentHour < endHour;
    }
  }

  private getNextAllowedTime(quietHours: UserNotificationPreferences['quietHours']): Date {
    const now = new Date();
    const endHour = parseInt(quietHours.end.split(':')[0]);
    const endMinute = parseInt(quietHours.end.split(':')[1] || '0');
    
    const nextAllowed = new Date(now);
    nextAllowed.setHours(endHour, endMinute, 0, 0);
    
    if (nextAllowed <= now) {
      // If end time has passed today, schedule for tomorrow
      nextAllowed.setDate(nextAllowed.getDate() + 1);
    }
    
    return nextAllowed;
  }

  private timeToCron(time: string): string {
    const [hour, minute = '0'] = time.split(':');
    return `${minute} ${hour} * * *`;
  }

  private getNextRunTime(time: string): Date {
    const [hour, minute = '0'] = time.split(':');
    const nextRun = new Date();
    nextRun.setHours(parseInt(hour), parseInt(minute), 0, 0);
    
    if (nextRun <= new Date()) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    return nextRun;
  }

  // Channel-specific implementations
  private async sendPushNotification(notification: NotificationPayload): Promise<boolean> {
    try {
      // Implementation would use Web Push API or service like FCM
      console.log('📱 Push notification sent:', notification.title);
      
      // Mock implementation - would integrate with actual push service
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'Notification' in window) {
        // Check if Notification constructor is available (some mobile browsers don't support it)
        if (typeof Notification === 'undefined') {
          console.log('📱 Notification API not available on this device');
          return false;
        }
        
        // Request permission if needed
        if (Notification.permission === 'default') {
          await Notification.requestPermission();
        }
        
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.body,
            icon: '/icons/lumo-icon-192.png',
            badge: '/icons/lumo-badge-72.png',
            tag: notification.type,
            data: notification.data,
            requireInteraction: notification.priority === 'urgent'
          });
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Push notification error:', error);
      return false;
    }
  }

  private async sendEmailNotification(notification: NotificationPayload): Promise<boolean> {
    try {
      // Implementation would integrate with email service (SendGrid, etc.)
      console.log('📧 Email notification sent:', notification.title);
      
      // Mock implementation
      return true;
    } catch (error) {
      console.error('Email notification error:', error);
      return false;
    }
  }

  private async sendInAppNotification(notification: NotificationPayload): Promise<boolean> {
    try {
      // Store in in-app notification system
      console.log('🔔 In-app notification queued:', notification.title);
      
      // Would store in database for in-app notification center
      return true;
    } catch (error) {
      console.error('In-app notification error:', error);
      return false;
    }
  }

  // Persistence methods (would implement with actual database)
  private async storeNotification(notification: NotificationPayload): Promise<void> {
    try {
      const { NotificationRepository } = await import('./notification-repository');
      await NotificationRepository.create({
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        body: notification.body,
        priority: notification.priority,
        channels: notification.channels,
        metadata: notification.data || {},
        deliveredAt: notification.scheduledFor ? undefined : new Date()
      });
    } catch (e) {
      console.warn('Fallback store (repository unavailable):', e);
    }
  }

  private async persistSchedule(schedule: NotificationSchedule): Promise<void> {
    console.log('📅 Persisting schedule:', schedule);
  }

  private async logNotificationSent(notification: NotificationPayload, success: boolean): Promise<void> {
    console.log(`📊 Notification ${notification.id} - Success: ${success}`);
    try {
      const { AnalyticsEventRepository } = await import('./notification-repository');
      await AnalyticsEventRepository.track(notification.userId, 'notification_sent', {
        type: notification.type,
        success,
        channels: notification.channels,
        priority: notification.priority
      });
    } catch (e) {
      // swallow to not block flow
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();
