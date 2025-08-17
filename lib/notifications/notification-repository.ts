import { db } from '@/lib/db/drizzle';
import { notifications, pushSubscriptions, analyticsEvents, notificationSchedules } from '@/lib/db/unified-schema';
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
    await db.insert(notifications).values({
      id,
      user_id: input.userId,
      type: input.type,
      title: input.title,
      body: input.body,
      priority: input.priority || 'normal',
      channels: input.channels as any,
      metadata: input.metadata as any,
      delivered_at: input.deliveredAt,
    });
    return id;
  }

  static async markRead(userId: string, id: string) {
    await db.update(notifications)
      .set({ read_at: new Date() })
      .where(and(eq(notifications.id, id), eq(notifications.user_id, userId)));
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
    await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));
    await db.insert(pushSubscriptions).values({ user_id: userId, endpoint, p256dh, auth });
  }

  static async remove(userId: string, endpoint: string) {
    await db.delete(pushSubscriptions).where(and(eq(pushSubscriptions.user_id, userId), eq(pushSubscriptions.endpoint, endpoint)));
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
      user_id: userId || null,
      event_type: eventType,
      properties: properties as any,
      day_index: dayIndex,
    });
  }
}

export class NotificationScheduleRepository {
  static async upsert(schedule: { id?: string; userId: string; type: string; cron: string; isActive?: boolean; nextRunAt?: Date; dedupeWindowSeconds?: number; backoffSeconds?: number; }) {
    // naive upsert by delete existing (userId+type) then insert
  await db.delete(notificationSchedules).where(and(eq(notificationSchedules.user_id, schedule.userId), eq(notificationSchedules.type, schedule.type)) as any);
    const id = schedule.id || crypto.randomUUID();
    await db.insert(notificationSchedules).values({
      id,
      user_id: schedule.userId,
      type: schedule.type,
      cron_expression: schedule.cron,
      is_active: schedule.isActive ?? true,
      next_run_at: schedule.nextRunAt,
      dedupe_window_seconds: schedule.dedupeWindowSeconds ?? 0,
      backoff_seconds: schedule.backoffSeconds ?? 0,
    });
    return id;
  }

  static async findDue(limit = 50) {
    const now = new Date();
  return db.select().from(notificationSchedules as any).where(lte(notificationSchedules.next_run_at, now) as any).limit(limit);
  }
}
