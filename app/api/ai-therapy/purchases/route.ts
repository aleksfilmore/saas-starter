import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { aiTherapyMessagePurchases, users } from '@/lib/db/unified-schema';
import { eq, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(){
  try {
    const { user } = await validateRequest();
    if(!user) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
    // Optional admin override (?userId=) only for admins to view other users' purchase history
    const searchParams = new URLSearchParams((globalThis as any).location?.search || '');
    const targetUserId = searchParams.get('userId');
    if(targetUserId && targetUserId !== user.id){
      const [me] = await db.select({ isAdmin: users.isAdmin }).from(users).where(eq(users.id, user.id));
      if(!me?.isAdmin) return NextResponse.json({ error:'Forbidden' }, { status:403 });
    }
    const effectiveUserId = (targetUserId && targetUserId.length>0) ? targetUserId : user.id;
    const rows = await db.select().from(aiTherapyMessagePurchases).where(eq(aiTherapyMessagePurchases.userId, effectiveUserId)).orderBy(desc(aiTherapyMessagePurchases.createdAt));
    return NextResponse.json({ purchases: rows.map(r=> ({ id: r.id, granted: r.messagesGranted, used: r.messagesUsed, expiresAt: r.expiresAt, createdAt: r.createdAt })) });
  } catch(e){
    console.error('Purchase history error', e);
    return NextResponse.json({ error:'Failed' }, { status:500 });
  }
}
