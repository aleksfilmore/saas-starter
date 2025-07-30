// Wall of Wounds API - COMMENTS
import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { wallPostComments, anonymousPosts, users } from '@/lib/db/schema';
import { awardBytes, BYTE_REWARDS } from '@/lib/db/gamification';
import { generateId } from 'lucia';
import { eq, desc, and, sql } from 'drizzle-orm';

interface CreateCommentRequest {
  postId: string;
  content: string;
  parentCommentId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateCommentRequest = await request.json();
    const { postId, content, parentCommentId } = body;

    // Validation
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }

    if (content.length > 140) {
      return NextResponse.json({ error: 'Comment too long (max 140 chars)' }, { status: 400 });
    }

    // Check if post exists
    const post = await db.query.anonymousPosts.findFirst({
      where: eq(anonymousPosts.id, postId),
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if parent comment exists (for replies)
    if (parentCommentId) {
      const parentComment = await db.query.wallPostComments.findFirst({
        where: eq(wallPostComments.id, parentCommentId),
      });

      if (!parentComment) {
        return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 });
      }

      if (parentComment.postId !== postId) {
        return NextResponse.json({ error: 'Parent comment belongs to different post' }, { status: 400 });
      }
    }

    // Check tier access for commenting
    const userInfo = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    });

    if (!userInfo) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Firewall+ tier required for commenting
    if (userInfo.subscriptionTier === 'ghost_mode') {
      return NextResponse.json({ 
        error: 'Comments require Firewall+ tier or higher',
        requiresTier: 'firewall_mode'
      }, { status: 403 });
    }

    // Create comment
    const commentId = generateId(15);
    
    await db.insert(wallPostComments).values({
      id: commentId,
      postId,
      userId: user.id,
      content: content.trim(),
      parentCommentId: parentCommentId || null,
    });

    // Increment comment count on post
    await db.update(anonymousPosts)
      .set({
        commentCount: sql`${anonymousPosts.commentCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(anonymousPosts.id, postId));

    // Award bytes for commenting
    await awardBytes(user.id, BYTE_REWARDS.COMMENT_MADE);

    return NextResponse.json({ 
      success: true, 
      commentId,
      message: 'Comment processed and added to the void...' 
    });

  } catch (error) {
    console.error('Wall comment creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to process comment data' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = (page - 1) * limit;

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Check if post exists
    const post = await db.query.anonymousPosts.findFirst({
      where: eq(anonymousPosts.id, postId),
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Get comments for this post
    const comments = await db
      .select({
        id: wallPostComments.id,
        content: wallPostComments.content,
        parentCommentId: wallPostComments.parentCommentId,
        createdAt: wallPostComments.createdAt,
        authorId: wallPostComments.userId,
        authorEmail: users.email,
        authorLevel: users.glowUpLevel,
      })
      .from(wallPostComments)
      .leftJoin(users, eq(wallPostComments.userId, users.id))
      .where(eq(wallPostComments.postId, postId))
      .orderBy(desc(wallPostComments.createdAt))
      .offset(offset)
      .limit(limit);

    // Group comments by parent/child relationships
    const rootComments = comments.filter(c => !c.parentCommentId);
    const replyComments = comments.filter(c => c.parentCommentId);

    // Build comment tree
    const commentTree = rootComments.map(comment => ({
      ...comment,
      timeAgo: formatTimeAgo(comment.createdAt),
      replies: replyComments
        .filter(reply => reply.parentCommentId === comment.id)
        .map(reply => ({
          ...reply,
          timeAgo: formatTimeAgo(reply.createdAt),
        })),
    }));

    return NextResponse.json({
      comments: commentTree,
      pagination: {
        page,
        limit,
        hasMore: comments.length === limit,
      },
      totalComments: post.commentCount,
    });

  } catch (error) {
    console.error('Wall comments fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to load comment data' 
    }, { status: 500 });
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just_transmitted';
  if (minutes < 60) return `${minutes}m_ago`;
  if (hours < 24) return `${hours}h_ago`;
  if (days < 7) return `${days}d_ago`;
  return date.toLocaleDateString();
}
