import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { notifications } from '@/lib/db/actual-schema';
import { and, eq, lt } from 'drizzle-orm';

// GET /api/notifications/recent?limit=20&cursor=ISO_DATE&unreadOnly=1
export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(request.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10), 100);
    const cursor = url.searchParams.get('cursor');
    const unreadOnly = url.searchParams.get('unreadOnly') === '1';

    const whereParts: any[] = [eq(notifications.user_id, user.id)];
    if(cursor){
      const cDate = new Date(cursor);
      if(!isNaN(cDate.getTime())) whereParts.push(lt(notifications.created_at as any, cDate as any));
    }
    if(unreadOnly){
      whereParts.push(eq(notifications.read as any, false));
    }

    const rows = await db.select().from(notifications)
      .where(whereParts.length>1 ? and(...whereParts) : whereParts[0])
      .orderBy(notifications.created_at as any)
      .limit(limit + 1); // fetch one extra for next cursor

    const ordered = rows.sort((a,b)=> (b.created_at as any) - (a.created_at as any));
    const page = ordered.slice(0, limit);
    const nextCursor = ordered.length > limit ? ordered[limit].created_at?.toISOString() : null;
    const unreadCount = unreadOnly ? page.length : rows.filter(r=> !r.read).length;

    return NextResponse.json({
      notifications: page.map(r => ({
        id: r.id,
        type: r.type,
        title: r.title,
        message: r.message,
        actionUrl: r.action_url,
        actionText: r.action_text,
        read: r.read,
        createdAt: r.created_at
      })),
      nextCursor,
      unreadCount
    });
  } catch (error) {
    console.error('Failed to fetch recent notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
