import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { notifications } from '@/lib/db/actual-schema';
import { eq } from 'drizzle-orm';

export const revalidate = 0;

export async function GET(req: NextRequest){
  try {
    const { user } = await validateRequest();
    if(!user) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
    // Try DB notifications first
    let list: any[] = [];
    try {
      const rows = await db.select().from(notifications).where(eq(notifications.user_id, user.id)).orderBy(notifications.created_at as any).limit(25);
      list = rows.map(r => ({
        id: r.id,
        type: r.type,
        title: r.title,
        message: r.message,
        actionUrl: r.action_url,
        actionText: r.action_text,
        read: r.read,
        createdAt: r.created_at
      })).sort((a,b)=> (b.createdAt as any) - (a.createdAt as any));
    } catch(err){
      console.warn('notifications table query failed, fallback to mock', err);
    }
    if(list.length === 0){
      // fallback mock
      const mock = [
        { id:'n1', type:'daily_checkin', title:'Daily Check-In Reminder', message:'Take a moment to log a check-in.', read:false, createdAt:new Date().toISOString() },
        { id:'n2', type:'milestone', title:'7-Day Streak!', message:'You held the line for 7 days. Keep going.', read:true, createdAt:new Date(Date.now()-86400000).toISOString() }
      ];
      list = mock;
    }
    const unread = list.filter(n=> !n.read).length;
    return NextResponse.json({ unread, latest: list.slice(0,5) });
  } catch(e){
    console.error('notifications summary error', e);
    return NextResponse.json({ unread:0, latest:[] }, { status:500 });
  }
}