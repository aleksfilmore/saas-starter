import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { anonymousPosts } from '@/lib/db';
import { gte } from 'drizzle-orm';

export const runtime = 'nodejs';

// GET /api/dashboard/engagement?range=today|24h
export async function GET(req: NextRequest) {
  try {
    const { user, session } = await validateRequest();
    if(!user || !session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'today';
    const now = new Date();
    let since: Date;
    if(range === '24h') {
      since = new Date(now.getTime() - 24*60*60*1000);
    } else {
      since = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    }

    const rawPosts = await db.select().from(anonymousPosts)
      .where(gte(anonymousPosts.createdAt, since))
      .limit(200);

    const scored = rawPosts.map(p => ({
      id: p.id,
      content: p.content,
      createdAt: p.createdAt,
      reactions: (p.resonateCount||0)+(p.sameLoopCount||0)+(p.draggedMeTooCount||0)+(p.stoneColdCount||0)+(p.cleansedCount||0),
      commentCount: p.commentCount || 0
    }));
    const rising = scored
      .filter(p => p.reactions >= 2)
      .sort((a,b)=> b.reactions - a.reactions || (b.createdAt?.getTime()||0)-(a.createdAt?.getTime()||0))[0] || null;

    return NextResponse.json({
      range,
      since: since.toISOString(),
      risingPost: rising ? { id: rising.id, content: rising.content.slice(0,220), reactions: rising.reactions, comments: rising.commentCount } : null,
      totals: {
        posts: scored.length,
        reactions: scored.reduce((acc,p)=> acc + p.reactions, 0),
        comments: scored.reduce((acc,p)=> acc + p.commentCount, 0)
      }
    });
  } catch (e) {
    console.error('Dashboard engagement error', e);
    return NextResponse.json({ error: 'Failed to load engagement' }, { status: 500 });
  }
}
