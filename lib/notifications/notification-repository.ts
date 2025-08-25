import { db } from '@/lib/db/drizzle';
import { analyticsEvents } from '@/lib/db/unified-schema';
import { eq, and, lte } from 'drizzle-orm';
import { randomUUID } from 'crypto';

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
    const id = randomUUID();
  // Notifications table not yet in unified schema; skip persistence (stub)
    return id;
  }

  static async markRead(userId: string, id: string) {
  // Stub until notifications table inlined
  }

  static async recent(userId: string, limit = 20) {
    try {
      // Fallback: return empty array if notifications table not available
      console.log('Notifications table not available, returning empty array');
      return [];
    } catch (error) {
      console.log('Notifications query failed, returning empty array:', error);
      return [];
    }
  }
}

export class PushSubscriptionRepository {
  static async upsert(userId: string, endpoint: string, p256dh: string, auth: string) {
    // Simple delete then insert for now (could add unique constraint on endpoint)
  // Stub until pushSubscriptions table inlined
  }

  static async remove(userId: string, endpoint: string) {
  // Stub until pushSubscriptions table inlined
  }

  static async list(userId: string) {
    try {
      // Fallback: return empty array if pushSubscriptions table not available
      console.log('PushSubscriptions table not available, returning empty array');
      return [];
    } catch (error) {
      console.log('PushSubscriptions query failed, returning empty array:', error);
      return [];
    }
  }
}

export class AnalyticsEventRepository {
  static async track(userId: string | null, eventType: string, properties: Record<string, any> = {}, dayIndex?: number) {
    await db.insert(analyticsEvents).values({
      id: randomUUID(),
      userId: userId || null,
      event: eventType,
      properties: JSON.stringify({ ...properties, dayIndex }) as any,
    });
  }
}

export class NotificationScheduleRepository {
  static async upsert(schedule: { id?: string; userId: string; type: string; cron: string; isActive?: boolean; nextRunAt?: Date; dedupeWindowSeconds?: number; backoffSeconds?: number; }) {
    // naive upsert by delete existing (userId+type) then insert
  // Stub until notificationSchedules table inlined
    const id = schedule.id || crypto.randomUUID();
  // Skipped insert (table not inlined)
    return id;
  }

  static async findDue(limit = 50) {
    const now = new Date();
  return [];
  }
}
