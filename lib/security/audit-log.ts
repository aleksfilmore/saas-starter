import { db } from '@/lib/db/drizzle';
import { auditLogs } from '@/lib/db/unified-schema';

export async function auditLog(userId: string | null, action: string, data?: any, meta?: { ip?: string; ua?: string }) {
  try {
    await db.insert(auditLogs).values({
      id: crypto.randomUUID(),
      userId: userId || null,
      action,
      data: data ? JSON.stringify(data).slice(0,4000) : null,
      ip: meta?.ip || null,
      userAgent: meta?.ua || null,
    } as any);
  } catch (e) {
    console.log('[AUDIT:FALLBACK]', action, data);
  }
}
