import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { notifications } from '@/lib/db/actual-schema';
import { and, eq, inArray } from 'drizzle-orm';

export async function POST(req: NextRequest){
  const { user } = await validateRequest();
  if(!user) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  try {
    const body = await req.json().catch(()=>({}));
    const ids: string[] = Array.isArray(body.ids)? body.ids : [];
    if(ids.length === 0){
      // mark all unread for user
      await db.update(notifications).set({ read: true, read_at: new Date() }).where(and(eq(notifications.user_id, user.id), eq(notifications.read, false)) as any);
      return NextResponse.json({ success:true, updated:'all' });
    }
    await db.update(notifications).set({ read: true, read_at: new Date() }).where(and(eq(notifications.user_id, user.id), inArray(notifications.id, ids)) as any);
    return NextResponse.json({ success:true, updated: ids.length });
  } catch(e){
    console.error('mark-read error', e);
    return NextResponse.json({ error:'Failed to mark read' }, { status:500 });
  }
}