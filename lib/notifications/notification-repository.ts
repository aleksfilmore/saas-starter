// Simplified notification repository during schema migration
// TODO: Re-enable full functionality when all tables are added to actual-schema

export interface CreateNotificationInput {
  userId: string;
  type: string;
  title: string;
  body: string;
  priority?: string;
  channels: string[];
  metadata?: Record<string, any>;
  deliveredAt?: Date;
}

export class NotificationRepository {
  static async create(input: CreateNotificationInput) {
    // TODO: Re-enable when notifications table is added to actual-schema
    console.log('Notification created (disabled during migration):', input.title);
    return 'temp-id';
  }

  static async markRead(userId: string, id: string) {
    // TODO: Re-enable when notifications table is added to actual-schema
    console.log('Notification marked read (disabled during migration):', id);
  }

  static async recent(userId: string, limit = 20) {
    // TODO: Re-enable when notifications table is added to actual-schema
    return [];
  }
}

export class PushSubscriptionRepository {
  static async upsert(userId: string, endpoint: string, p256dh: string, auth: string) {
    // TODO: Re-enable when pushSubscriptions table is added to actual-schema
    console.log('Push subscription upserted (disabled during migration)');
  }

  static async remove(userId: string, endpoint: string) {
    // TODO: Re-enable when pushSubscriptions table is added to actual-schema
    console.log('Push subscription removed (disabled during migration)');
  }

  static async list(userId: string) {
    // TODO: Re-enable when pushSubscriptions table is added to actual-schema
    return [];
  }
}

export class AnalyticsEventRepository {
  static async track(userId: string | null, eventType: string, properties: Record<string, any> = {}, dayIndex?: number) {
    // TODO: Re-enable when analyticsEvents table is added to actual-schema
    console.log('Analytics event tracked (disabled during migration):', eventType);
  }
}

export class NotificationScheduleRepository {
  static async upsert(schedule: { id?: string; userId: string; type: string; cron: string; isActive?: boolean; nextRunAt?: Date; dedupeWindowSeconds?: number; backoffSeconds?: number; }) {
    // TODO: Re-enable when notificationSchedules table is added to actual-schema
    console.log('Notification schedule upserted (disabled during migration)');
    return 'temp-id';
  }

  static async findDue(limit = 50) {
    // TODO: Re-enable when notificationSchedules table is added to actual-schema
    return [];
  }
}
