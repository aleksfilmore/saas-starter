import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { anonymousPosts, wallPostReactions } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { and, inArray, eq } from 'drizzle-orm';

// Lightweight preview feed for dashboard tiles
// Returns simplified shape. Intended for dashboard community pulse tile.
export async function GET(req: NextRequest) {
  try {
    const { user, session } = await validateRequest();
    if (!user || !session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 24);
    const sinceParam = searchParams.get('since');
    const sinceDate = sinceParam ? new Date(sinceParam) : null;
    const rows = await db.select().from(anonymousPosts).orderBy(anonymousPosts.createdAt).limit(200);
    const ordered = rows
      .sort((a,b)=> (b.createdAt?.getTime()||0) - (a.createdAt?.getTime()||0))
      .filter(p => !sinceDate || (p.createdAt && p.createdAt > sinceDate))
      .slice(0, limit);
    const postIds = ordered.map(p=>p.id);
    const userReactions: Record<string,string> = {};
    if (postIds.length) {
      let reactionsTableExists = true;
      try { await db.execute(sql`SELECT 1 FROM wall_post_reactions LIMIT 1`); } catch { reactionsTableExists = false; }
      if (reactionsTableExists) {
        const reactions = await db.select({ postId: wallPostReactions.postId, reactionType: wallPostReactions.reactionType })
          .from(wallPostReactions)
          .where(and(inArray(wallPostReactions.postId, postIds), eq(wallPostReactions.userId, session.userId)));
        for (const r of reactions) userReactions[r.postId] = r.reactionType;
      }
    }
    const simplify = (p: any) => {
      const reactionsCount = (p.resonateCount||0)+(p.sameLoopCount||0)+(p.draggedMeTooCount||0)+(p.stoneColdCount||0)+(p.cleansedCount||0);
      return {
        id: p.id,
        content: p.content.length > 220 ? p.content.slice(0,217)+'…' : p.content,
        timestamp: p.createdAt?.toISOString(),
        reactionsCount,
        category: p.glitchCategory || p.category || 'general',
        userReaction: userReactions[p.id] || null,
        commentCount: p.commentCount || 0,
      };
    };
  return NextResponse.json({ posts: ordered.map(simplify) });
  } catch (e) {
    console.error('Preview feed error', e);
    return NextResponse.json({ error: 'Failed to load preview' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
