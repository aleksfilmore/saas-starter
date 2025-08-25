import { db } from '@/lib/db/drizzle';
import { aiTherapyMessagePurchases, users } from '@/lib/db/unified-schema';
import { and, eq, gt } from 'drizzle-orm';

export interface PersistentQuotaSnapshot {
  tier: 'ghost' | 'firewall';
  unlimited: boolean;
  softCap?: number;          // daily soft cap for premium fairness
  used: number;              // total messages used today (premium) or across purchases (ghost)
  remaining: number;         // remaining (ghost) or remaining until softCap (premium)
  cap: number | null;        // total purchased (ghost) or softCap (premium)
  renewsAt: string | null;   // daily reset (premium) or null (ghost purchases)
  purchases?: Array<{ id: string; granted: number; used: number; expiresAt: string }>; // debug/details
}

// For premium users we track aiQuotaUsed + aiQuotaResetAt fields on users table
// For ghost users we sum active purchase buckets (not expired) in ai_therapy_message_purchases

export async function getPersistentQuota(userId: string): Promise<PersistentQuotaSnapshot | null> {
  const [u] = await db.select().from(users).where(eq(users.id, userId));
  if (!u) return null;
  const rawTier = (u as any).tier || (u as any).subscriptionTier || 'ghost';
  const isPremium = rawTier === 'firewall' || rawTier === 'premium' || (u as any).subscriptionTier === 'firewall_mode';
  if (isPremium) {
    const softCap = 1000; // configurable
    // reset if past resetAt
    const now = new Date();
    if (u.aiQuotaResetAt && now >= new Date(u.aiQuotaResetAt)) {
      // reset counter
      await db.update(users).set({ aiQuotaUsed: 0, aiQuotaResetAt: nextMidnightUTC() }).where(eq(users.id, userId));
      u.aiQuotaUsed = 0;
      u.aiQuotaResetAt = nextMidnightUTC();
    }
    const remaining = Math.max(0, softCap - (u.aiQuotaUsed || 0));
    return {
      tier: 'firewall',
      unlimited: true,
      softCap,
      used: u.aiQuotaUsed || 0,
      remaining,
      cap: softCap,
      renewsAt: u.aiQuotaResetAt ? new Date(u.aiQuotaResetAt).toISOString() : nextMidnightUTC().toISOString(),
    };
  }
  // Ghost user => aggregate purchases
  const now = new Date();
  const purchases = await db.select().from(aiTherapyMessagePurchases).where(and(
    eq(aiTherapyMessagePurchases.userId, userId),
    gt(aiTherapyMessagePurchases.expiresAt, now)
  ));
  const granted = purchases.reduce((s,p)=> s + p.messagesGranted,0);
  const used = purchases.reduce((s,p)=> s + p.messagesUsed,0);
  const remaining = Math.max(0, granted - used);
  return {
    tier: 'ghost',
    unlimited: false,
    used,
    remaining,
    cap: granted,
    renewsAt: null,
    purchases: purchases.map(p=>({ id: p.id, granted: p.messagesGranted, used: p.messagesUsed, expiresAt: p.expiresAt?.toISOString?.() || String(p.expiresAt) }))
  };
}

export async function incrementPersistentUsage(userId: string, count = 1): Promise<PersistentQuotaSnapshot | null> {
  const snapshot = await getPersistentQuota(userId);
  if (!snapshot) return null;
  if (snapshot.unlimited) {
    // premium => increment aiQuotaUsed
    const [u] = await db.select({ aiQuotaUsed: users.aiQuotaUsed }).from(users).where(eq(users.id, userId));
    const newUsed = (u?.aiQuotaUsed || 0) + count;
    await db.update(users).set({ aiQuotaUsed: newUsed, aiQuotaResetAt: nextMidnightUTC() }).where(eq(users.id, userId));
    return getPersistentQuota(userId);
  }
  // ghost => consume from earliest expiring purchase first (simple greedy)
  if (!snapshot.purchases?.length) return snapshot; // nothing to consume
  let remainingToConsume = count;
  for (const bucket of snapshot.purchases.sort((a,b)=> a.expiresAt.localeCompare(b.expiresAt))) {
    if (remainingToConsume <= 0) break;
    const [purchase] = await db.select().from(aiTherapyMessagePurchases).where(eq(aiTherapyMessagePurchases.id, bucket.id));
    if (!purchase) continue;
    const bucketRemaining = purchase.messagesGranted - purchase.messagesUsed;
    if (bucketRemaining <= 0) continue;
    const consume = Math.min(bucketRemaining, remainingToConsume);
    await db.update(aiTherapyMessagePurchases).set({ messagesUsed: purchase.messagesUsed + consume }).where(eq(aiTherapyMessagePurchases.id, purchase.id));
    remainingToConsume -= consume;
  }
  return getPersistentQuota(userId);
}

export async function addPersistentPurchase(userId: string, messages: number, validityDays = 30) {
  const expires = new Date();
  expires.setUTCDate(expires.getUTCDate() + validityDays);
  await db.insert(aiTherapyMessagePurchases).values({
    id: crypto.randomUUID(),
    userId,
    messagesGranted: messages,
    messagesUsed: 0,
    expiresAt: expires,
  } as any);
}

function nextMidnightUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0));
}
