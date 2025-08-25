import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { addPersistentPurchase, getPersistentQuota } from '@/lib/ai-therapy/quota-service';
import { rateLimit } from '../../../../lib/rate-limit';
import { auditLog } from '../../../../lib/security/audit-log';
import { db } from '@/lib/db/drizzle';
import { users, byteTransactions } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';

// Legacy in-memory logic replaced by unified quota-store

export async function POST(request: Request) {
  try {
    // Use Lucia authentication
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userTier = (user as any).tier || 'ghost';
    
    // Only free users can purchase messages
    if (userTier !== 'ghost') {
      return NextResponse.json({ 
        error: 'Premium users have unlimited access' 
      }, { status: 400 });
    }

    const { paymentMethod } = await request.json();

    if (!paymentMethod) {
      return NextResponse.json({ 
        error: 'Payment method required' 
      }, { status: 400 });
    }

    // Simulate payment processing
    // In real implementation, this would integrate with Stripe or other payment processor
    console.log(`Processing payment for user ${user.id}: $3.99 for 300 AI therapy messages`);

  // Simple rate limit (5 purchases per hour)
  const limited = await rateLimit(`ai_purchase:${user.id}`, 5, 60*60);
  if(!limited.ok) return NextResponse.json({ error:'Rate limit exceeded' }, { status:429 });

  // Persist purchase
  await addPersistentPurchase(user.id, 300, 30);
  const updated = await getPersistentQuota(user.id);
  const remaining = updated ? updated.remaining : 0;

    await auditLog(user.id, 'ai_therapy_purchase', { method:'purchase', messages:300 });
    await db.insert(byteTransactions).values({
      id: crypto.randomUUID(),
      userId: user.id,
      amount: 0,
      source: 'ai_therapy_purchase',
      description: 'Purchased 300 AI therapy messages (cash)',
      relatedId: 'ai_therapy_messages'
    } as any);
  return NextResponse.json({
      success: true,
      message: '300 AI therapy messages added to your account',
      quota: updated ? {
        total: updated.cap,
        used: updated.used,
        remaining,
        messagesAdded: 300,
        cost: 3.99
      }: null,
      paymentConfirmation: {
        amount: 3.99,
        currency: 'USD',
        description: '300 AI Therapy Messages',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Purchase AI messages error:', error);
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 }
    );
  }
}
