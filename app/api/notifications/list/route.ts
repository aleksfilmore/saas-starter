import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { notifications } from '@/lib/db/actual-schema';
import { and, eq, lt } from 'drizzle-orm';

export async function GET(request: NextRequest){
  const { user } = await validateRequest();
  if(!user) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  try {
    const url = new URL(request.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '25',10), 100);
    const cursor = url.searchParams.get('cursor');
    const unread = url.searchParams.get('unread') === '1';

    const where: any[] = [eq(notifications.user_id, user.id)];
    if(cursor){ const d=new Date(cursor); if(!isNaN(d.getTime())) where.push(lt(notifications.created_at as any, d as any)); }
    if(unread){ where.push(eq(notifications.read as any, false)); }

    const rows = await db.select().from(notifications)
      .where(where.length>1? and(...where): where[0])
      .orderBy(notifications.created_at as any)
      .limit(limit+1);
    const ordered = rows.sort((a,b)=> (b.created_at as any) - (a.created_at as any));
    const slice = ordered.slice(0, limit);
    const nextCursor = ordered.length>limit ? ordered[limit].created_at?.toISOString(): null;
    return NextResponse.json({
      items: slice.map(r=> ({ id:r.id, type:r.type, title:r.title, message:r.message, read:r.read, createdAt:r.created_at, actionUrl:r.action_url, actionText:r.action_text })),
      nextCursor
    });
  } catch(e){
    console.error('notifications list error', e);
    return NextResponse.json({ error:'Failed' }, { status:500 });
  }
}