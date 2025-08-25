import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';
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
    const map = slice.map((post:any)=> ({
      id: post.id,
      content: post.content,
      glitchCategory: post.glitch_category,
      glitchTitle: post.glitch_title,
      createdAt: post.created_at,
      reactions: (post.resonate_count||0)+(post.same_loop_count||0)+(post.dragged_me_too_count||0)+(post.stone_cold_count||0)+(post.cleansed_count||0)
    }));
    const payload = { posts: map, nextCursor: hasMore ? slice[slice.length-1].created_at : null };
    const etag = 'W/"'+hash(payload)+'"';
    if(req.headers.get('if-none-match')===etag){ return new NextResponse(null,{status:304, headers:{ETag: etag}}); }
    return NextResponse.json(payload,{ headers:{ 'Cache-Control':'private, max-age=15', ETag: etag }});
  } catch(e){
    console.error('Wall endpoint error', e); return NextResponse.json({ error:'Failed' }, { status: 500 });
  }
}