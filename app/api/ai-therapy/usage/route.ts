import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { getPersistentQuota } from '@/lib/ai-therapy/quota-service';
import { db } from '@/lib/db/drizzle';
import { aiTherapyMessagePurchases, users } from '@/lib/db/unified-schema';
import { and, eq, gte } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const q = await getPersistentQuota(user.id);
    if(!q) return NextResponse.json({ error:'Quota unavailable' }, { status:500 });
    const url = new URL(request.url);
    const includeHistory = url.searchParams.get('history') === '1';
    let history: any[] | undefined;
    if(includeHistory){
      // For premium users, show last 7 days usage from users.aiQuotaUsed snapshots not stored -> approximate using audit logs not yet integrated.
      // For ghost: aggregate per day consumed = delta of messagesUsed; simple approach: group purchases usage since 7 days ago.
      const sevenDaysAgo = new Date(Date.now() - 7*24*3600*1000);
      if(q.tier === 'ghost'){
        const rows = await db.select().from(aiTherapyMessagePurchases).where(and(eq(aiTherapyMessagePurchases.userId, user.id), gte(aiTherapyMessagePurchases.createdAt, sevenDaysAgo)));
        // Flatten into daily buckets
        const map: Record<string, number> = {};
        for(const r of rows){
          const day = r.createdAt?.toISOString?.().slice(0,10) || new Date(r.createdAt as any).toISOString().slice(0,10);
          map[day] = (map[day]||0) + (r.messagesUsed || 0);
        }
        history = Object.entries(map).sort(([a],[b])=> a.localeCompare(b)).map(([day, used])=> ({ day, used }));
      } else {
        // Premium: we only have current usage; approximate daily history placeholder until dedicated tracking table exists
        history = [{ day: new Date().toISOString().slice(0,10), used: q.used }];
      }
    }
    return NextResponse.json({
      used: q.used,
      remaining: q.remaining,
      cap: q.cap,
      renewsAt: q.renewsAt,
      unlimited: q.unlimited,
      tier: q.tier,
      softCap: q.softCap,
      history
    });
  } catch (e) {
    console.error('AI therapy usage error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
