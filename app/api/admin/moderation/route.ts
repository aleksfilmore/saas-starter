import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { moderationQueue, anonymousPosts, users } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { ContentModerationService } from '@/lib/moderation/content-moderation';

// GET /api/admin/moderation - Get pending moderation items
export async function GET(request: Request) {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (you may need to adjust this based on your admin role system)
    if (user.email !== 'admin@example.com') { // Replace with your admin check
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const url = new URL(request.url);
    const status = url.searchParams.get('status') || 'pending';
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Get moderation queue items with post and user details
    const items = await db
      .select({
        id: moderationQueue.id,
        postId: moderationQueue.postId,
        userId: moderationQueue.userId,
        content: moderationQueue.content,
        flagReason: moderationQueue.flagReason,
        severity: moderationQueue.severity,
        status: moderationQueue.status,
        suggestedAction: moderationQueue.suggestedAction,
        detectedIssues: moderationQueue.detectedIssues,
        moderatorNotes: moderationQueue.moderatorNotes,
        createdAt: moderationQueue.createdAt,
        moderatedAt: moderationQueue.moderatedAt,
        postTitle: anonymousPosts.glitchTitle,
        postCategory: anonymousPosts.category,
        postActive: anonymousPosts.isActive
      })
      .from(moderationQueue)
      .leftJoin(anonymousPosts, eq(moderationQueue.postId, anonymousPosts.id))
      .where(eq(moderationQueue.status, status))
      .orderBy(desc(moderationQueue.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalResult = await db
      .select({ count: db.$count(moderationQueue.id) })
      .from(moderationQueue)
      .where(eq(moderationQueue.status, status));

    const total = totalResult[0]?.count || 0;

    return NextResponse.json({
      items: items.map(item => ({
        ...item,
        detectedIssues: item.detectedIssues ? JSON.parse(item.detectedIssues) : []
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: total > offset + limit
      }
    });

  } catch (error) {
    console.error('Failed to fetch moderation queue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch moderation queue' },
      { status: 500 }
    );
  }
}

// POST /api/admin/moderation - Take moderation action
export async function POST(request: Request) {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (user.email !== 'admin@example.com') { // Replace with your admin check
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { queueId, action, reason, newContent } = await request.json();

    if (!queueId || !action) {
      return NextResponse.json({ error: 'Queue ID and action are required' }, { status: 400 });
    }

    switch (action) {
      case 'approve':
        await ContentModerationService.approvePost(queueId, session.userId, reason);
        break;
      case 'reject':
        await ContentModerationService.rejectPost(queueId, session.userId, reason);
        break;
      case 'edit':
        if (!newContent) {
          return NextResponse.json({ error: 'New content is required for edit action' }, { status: 400 });
        }
        await ContentModerationService.editPost(queueId, newContent, session.userId, reason);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Post ${action}d successfully` 
    });

  } catch (error) {
    console.error('Failed to process moderation action:', error);
    return NextResponse.json(
      { error: 'Failed to process moderation action' },
      { status: 500 }
    );
  }
}
