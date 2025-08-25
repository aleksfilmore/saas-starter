import { addPersistentPurchase, getPersistentQuota, incrementPersistentUsage } from '../lib/ai-therapy/quota-service';
import { db } from '../lib/db/drizzle';
import { users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

// Pseudo-test spec: Run with ts-node or integrate into existing test runner.
(async () => {
  // Create temp user (idempotent if exists)
  const userId = 'test-user-quota';
  const [existing] = await db.select().from(users).where(eq(users.id, userId));
  if(!existing) {
    await db.insert(users).values({ id: userId, email: 'quota@test.local', hashedPassword: 'x', tier: 'ghost' } as any);
  }
  // Ensure no purchases
  let q = await getPersistentQuota(userId);
  console.log('Initial quota', q);
  await addPersistentPurchase(userId, 300, 30);
  q = await getPersistentQuota(userId);
  console.log('After purchase', q);
  await incrementPersistentUsage(userId, 2);
  q = await getPersistentQuota(userId);
  console.log('After 2 used', q);
})();
