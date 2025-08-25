// Unified in-memory quota store for AI Therapy (chat) usage.
// NOTE: This is a volatile, per-instance memory store – replace with persistent DB in production.

export interface AITherapyQuota {
  used: number;              // messages used (user prompts counted; could also include AI replies if desired)
  total: number;             // purchased total (for non-premium). For premium/unlimited users this can remain 0.
  resetAt: string;           // ISO timestamp when usage resets (daily for premium, far future for ghost)
  tier: string;              // simplified tier mapping: 'ghost' | 'firewall'
  unlimited: boolean;        // premium flag (fair-use soft cap only)
  softCap?: number;          // optional soft cap for unlimited users (fair use indicator)
}

declare global {
  // eslint-disable-next-line no-var
  var __aiTherapyQuotaStore: Map<string, AITherapyQuota> | undefined;
}

function getStore(): Map<string, AITherapyQuota> {
  if (!global.__aiTherapyQuotaStore) {
    global.__aiTherapyQuotaStore = new Map();
  }
  return global.__aiTherapyQuotaStore;
}

function midnightTomorrowUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0));
}

export function ensureQuota(user: any): AITherapyQuota {
  const store = getStore();
  const id = user.id;
  let q = store.get(id);

  const rawTier = (user as any).tier || (user as any).subscriptionTier || 'ghost';
  const isPremium = rawTier === 'firewall' || rawTier === 'premium' || (user as any).subscriptionTier === 'firewall_mode';
  const tier = isPremium ? 'firewall' : 'ghost';

  if (!q) {
    q = {
      used: 0,
      total: tier === 'ghost' ? 0 : 0, // ghost purchases add to total; premium uses softCap only
      resetAt: tier === 'ghost' ? new Date(Date.UTC(2999, 0, 1)).toISOString() : midnightTomorrowUTC().toISOString(),
      tier,
      unlimited: tier !== 'ghost',
      softCap: tier !== 'ghost' ? 1000 : undefined,
    };
    store.set(id, q);
  }

  // Handle resets for premium users only
  if (q.unlimited) {
    const now = Date.now();
    if (now >= new Date(q.resetAt).getTime()) {
      q.used = 0; // reset daily usage counter
      q.resetAt = midnightTomorrowUTC().toISOString();
      store.set(id, q);
    }
  }

  // Tier downgrade/upgrade adjustments
  if (q.tier !== tier) {
    // If user upgraded to premium, mark unlimited & reset used counter boundary (keep purchases as archival; not needed now)
    if (tier === 'firewall') {
      q.unlimited = true;
      q.softCap = 1000;
      q.resetAt = midnightTomorrowUTC().toISOString();
    } else {
      // Downgrade: keep remaining purchased total (q.total - q.used cannot go negative)
      q.unlimited = false;
      q.softCap = undefined;
      q.resetAt = new Date(Date.UTC(2999, 0, 1)).toISOString();
    }
    q.tier = tier;
    store.set(id, q);
  }

  return q;
}

export function incrementUsage(user: any, count = 1): AITherapyQuota {
  const q = ensureQuota(user);
  q.used += count;
  if (!q.unlimited && q.used > q.total) {
    // hard cap enforcement occurs at route level; we still allow increment but cap logic should reject beforehand.
    q.used = q.total; // prevent runaway
  }
  getStore().set(user.id, q);
  return q;
}

export function addPurchasedMessages(user: any, amount: number): AITherapyQuota {
  const q = ensureQuota(user);
  if (q.unlimited) return q; // premium doesn't accumulate purchases
  q.total += amount;
  getStore().set(user.id, q);
  return q;
}

export function getQuota(user: any): AITherapyQuota {
  return ensureQuota(user);
}
