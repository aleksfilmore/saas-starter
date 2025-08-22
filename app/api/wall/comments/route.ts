import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { wallPostComments, anonymousPosts } from '@/lib/db';
import { eq, and, isNull, sql } from 'drizzle-orm';
import { AnalyticsService } from '@/lib/analytics/service';
import { ByteService } from '@/lib/shop/ByteService';

// Simple in-memory (per instance) throttle map as stopgap until unified service extended
const lastCommentAt: Record<string, number> = {};

// POST /api/wall/comments  { postId, content, parentCommentId? }
export async function POST(req: NextRequest) {
  try {
    const { user, session } = await validateRequest();
    if (!user || !session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { postId, content, parentCommentId } = await req.json();
    if (!postId || !content?.trim()) return NextResponse.json({ error: 'postId and content required' }, { status: 400 });
    if (content.length > 500) return NextResponse.json({ error: 'Comment too long (max 500)' }, { status: 400 });

    const now = Date.now();
    const last = lastCommentAt[session.userId] || 0;
    if (now - last < 5000) { // 5s cooldown per user
      return NextResponse.json({ error: 'Too fast. Please wait a few seconds before commenting again.' }, { status: 429 });
    }
    lastCommentAt[session.userId] = now;

    const [post] = await db.select().from(anonymousPosts).where(eq(anonymousPosts.id, postId)).limit(1);
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const id = crypto.randomUUID();
    await db.insert(wallPostComments).values({ id, postId, userId: session.userId, content: content.trim(), parentCommentId });
    // increment comment count
    await db.execute(sql`UPDATE anonymous_posts SET comment_count = comment_count + 1 WHERE id = ${postId}`);

    // 🎯 BYTE ECONOMY: Award bytes for helpful replies
    let bytesAwarded = 0;
    try {
      const byteTransaction = await ByteService.awardBytes(
        session.userId,
        'WALL_REACTION',
        {
          description: `Replied to wall post: ${content.substring(0, 50)}...`,
          commentId: id, 
          postId, 
          isReply: !!parentCommentId
        }
      );
      
      if (byteTransaction) {
        bytesAwarded = byteTransaction.bytesAwarded;
        console.log(`💰 Awarded ${bytesAwarded} Bytes for helpful reply`);
      }
    } catch (byteError) {
      console.warn('⚠️ Byte award failed (non-blocking):', byteError);
      // Continue with comment creation even if byte award fails
    }

    AnalyticsService.track({ userId: session.userId, event: 'wall_post_commented', properties: { postId, parentCommentId: parentCommentId || null } });

    return NextResponse.json({ 
      success: true, 
      comment: { 
        id, 
        postId, 
        content: content.trim(), 
        parentCommentId, 
        createdAt: new Date(), 
        userId: session.userId 
      },
      bytesAwarded // Include bytes in response
    });
  } catch (e) {
    console.error('Create comment error', e);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

// GET /api/wall/comments?postId=...&parentCommentId=optional
export async function GET(req: NextRequest) {
  try {
    const { user, session } = await validateRequest();
    if (!user || !session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');
    const parentCommentId = searchParams.get('parentCommentId');
    if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 });

    const comments = await db.select().from(wallPostComments).where(and(eq(wallPostComments.postId, postId), parentCommentId ? eq(wallPostComments.parentCommentId, parentCommentId) : isNull(wallPostComments.parentCommentId))).orderBy(wallPostComments.createdAt);
    return NextResponse.json({ comments });
  } catch (e) {
    console.error('List comments error', e);
    return NextResponse.json({ error: 'Failed to load comments' }, { status: 500 });
  }
}

// DELETE /api/wall/comments?id=...
export async function DELETE(req: NextRequest) {
  try {
    const { user, session } = await validateRequest();
    if (!user || !session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const [comment] = await db.select().from(wallPostComments).where(eq(wallPostComments.id, id)).limit(1);
    if (!comment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (comment.userId !== session.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await db.delete(wallPostComments).where(eq(wallPostComments.id, id));
  await db.execute(sql`UPDATE anonymous_posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = ${comment.postId}`);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Delete comment error', e);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}