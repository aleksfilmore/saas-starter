import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';
import { wallPostReactions } from '@/lib/db/unified-schema';
import crypto from 'crypto';

function hash(x:any){ return crypto.createHash('sha1').update(JSON.stringify(x)).digest('hex').slice(0,16); }

export async function GET(req: NextRequest){
  try {
    const { user } = await validateRequest();
    if(!user) return NextResponse.json({ error:'Unauthorized' }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const limit = Math.min( Number(searchParams.get('limit')||'8'), 25 );
    const cursor = searchParams.get('cursor');
    const cursorClause = cursor ? sql`AND created_at < ${cursor}` : sql``;

  const rows = await db.execute(sql`SELECT id, content, glitch_category, glitch_title, created_at, resonate_count, same_loop_count, dragged_me_too_count, stone_cold_count, cleansed_count FROM anonymous_posts WHERE is_active=true ${cursorClause} ORDER BY created_at DESC LIMIT ${limit+1}`);
    const hasMore = rows.length > limit;
    const slice = rows.slice(0, limit);
    // Fetch current user's reaction types for these posts to support persistent heart state
    let userReactions: Record<string,string> = {};
    if (slice.length) {
      const ids = slice.map(r=> r.id);
      // Parameterize ids list
      const placeholders = ids.map((_,i)=> `$${i+1}`).join(',');
      try {
        const reactionRows = await db.execute(sql`SELECT post_id, reaction_type FROM wall_post_reactions WHERE user_id = ${user.id} AND post_id IN (${sql.raw(ids.map(i=> `'${i}'`).join(','))})`);
        for (const r of reactionRows as any[]) userReactions[r.post_id] = r.reaction_type;
      } catch (e) {
        // Non-fatal if reaction table missing
        console.warn('wall reactions lookup failed', e);
      }
    }

    const map = slice.map((post:any)=> {
      const resonate = post.resonate_count || 0;
      const total = (post.resonate_count||0)+(post.same_loop_count||0)+(post.dragged_me_too_count||0)+(post.stone_cold_count||0)+(post.cleansed_count||0);
      return {
        id: post.id,
        content: post.content,
        glitchCategory: post.glitch_category,
        glitchTitle: post.glitch_title,
        createdAt: post.created_at,
        reactions: total,
        hearts: resonate,
        userReaction: userReactions[post.id] || null,
      };
    });
    const payload = { posts: map, nextCursor: hasMore ? slice[slice.length-1].created_at : null };
    const etag = 'W/"'+hash(payload)+'"';
    if(req.headers.get('if-none-match')===etag){ return new NextResponse(null,{status:304, headers:{ETag: etag}}); }
    return NextResponse.json(payload,{ headers:{ 'Cache-Control':'private, max-age=15', ETag: etag }});
  } catch(e){
    console.error('Wall endpoint error', e); return NextResponse.json({ error:'Failed' }, { status: 500 });
  }
}