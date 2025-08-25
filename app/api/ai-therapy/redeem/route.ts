import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { users, byteTransactions } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';
import { addPersistentPurchase, getPersistentQuota } from '@/lib/ai-therapy/quota-service';
import { rateLimit } from '../../../../lib/rate-limit';
import { auditLog } from '../../../../lib/security/audit-log';

export async function POST(request: Request) {
  try {
    const { user } = await validateRequest();
    if(!user) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
    const { bytes = 600 } = await request.json().catch(()=>({}));
    const required = 600; // fixed: 600 bytes => 300 messages
    if (bytes !== required) return NextResponse.json({ error:`Exactly ${required} bytes required` }, { status:400 });
  // Rate limit (10 redeems per day)
  const limited = await rateLimit(`ai_redeem:${user.id}`, 10, 24*60*60);
  if(!limited.ok) return NextResponse.json({ error:'Rate limit exceeded' }, { status:429 });

  // reload user row
    const [row] = await db.select().from(users).where(eq(users.id, user.id));
    if(!row) return NextResponse.json({ error:'User not found' }, { status:404 });
    if ((row.bytes||0) < required) return NextResponse.json({ error:'Not enough bytes' }, { status:400 });
    // deduct bytes
    const before = row.bytes || 0;
    const after = before - required;
    await db.update(users).set({ bytes: after }).where(eq(users.id, user.id));
    await db.insert(byteTransactions).values({
      id: crypto.randomUUID(),
      userId: user.id,
      amount: -required,
      source: 'ai_therapy_redeem',
      description: 'Redeem bytes for 300 AI therapy messages',
      relatedId: 'ai_therapy_messages'
    } as any);
    // grant messages
    await addPersistentPurchase(user.id, 300, 30);
    const quota = await getPersistentQuota(user.id);
  await auditLog(user.id, 'ai_therapy_redeem', { bytesSpent: required, granted:300 });
  return NextResponse.json({ success:true, granted:300, bytesSpent: required, quota });
  } catch(e){
    console.error('AI therapy redeem error', e);
    return NextResponse.json({ error:'Redeem failed' }, { status:500 });
  }
}