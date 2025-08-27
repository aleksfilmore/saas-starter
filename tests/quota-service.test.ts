import { addPersistentPurchase, getPersistentQuota, incrementPersistentUsage } from '../lib/ai-therapy/quota-service';
import { db, client } from '../lib/db/drizzle';
import { users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

describe('quota service (integration)', () => {
  test('add purchases and consume usage', async () => {
    const userId = 'test-user-quota';
    const [existing] = await db.select().from(users).where(eq(users.id, userId));
    if(!existing) {
      await db.insert(users).values({ id: userId, email: 'quota@test.local', hashedPassword: 'x', tier: 'ghost' } as any);
    }

    // initial snapshot
    let q = await getPersistentQuota(userId);
    expect(q).not.toBeNull();

    // add a purchase
    await addPersistentPurchase(userId, 300, 30);
    q = await getPersistentQuota(userId);
    expect(q?.cap).toBeGreaterThanOrEqual(300);

    // consume usage
    await incrementPersistentUsage(userId, 2);
    q = await getPersistentQuota(userId);
    expect((q?.used ?? 0)).toBeGreaterThanOrEqual(2);
  }, 20000);

  afterAll(async () => {
    // Close the underlying client to avoid Jest open-handle warnings
    try { await (client as any).end?.(); } catch (e) { /* ignore */ }
  });
});
