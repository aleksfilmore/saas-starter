import { db } from '@/lib/db/drizzle';
import { notifications, pushSubscriptions, analyticsEvents } from '@/lib/db/minimal-schema';
import { eq, and } from 'drizzle-orm';
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
    return db.query.notifications.findMany({
      where: (fields, { eq }) => eq(fields.user_id, userId),
      limit,
      orderBy: (fields, { desc }) => desc(fields.created_at)
    });
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
    return db.query.pushSubscriptions.findMany({ where: (f, { eq }) => eq(f.user_id, userId) });
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
