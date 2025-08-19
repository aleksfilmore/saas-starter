import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { moderationQueue, moderationLogs, anonymousPosts } from '@/lib/db/schema';
import { eq, gte, count } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (adjust this based on your admin system)
    if (user.email !== 'admin@example.com') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get moderation statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      pendingCount,
      todayFlagged,
      totalPosts,
      activePosts
    ] = await Promise.all([
      // Pending moderation items
      db.select({ count: count() })
        .from(moderationQueue)
        .where(eq(moderationQueue.status, 'pending')),
      
      // Posts flagged today
      db.select({ count: count() })
        .from(moderationQueue)
        .where(gte(moderationQueue.createdAt, today)),
      
      // Total posts
      db.select({ count: count() })
        .from(anonymousPosts),
      
      // Active posts
      db.select({ count: count() })
        .from(anonymousPosts)
        .where(eq(anonymousPosts.isActive, true))
    ]);

    // Get recent moderation activity
    const recentActivity = await db
      .select({
        id: moderationLogs.id,
        action: moderationLogs.action,
        reason: moderationLogs.reason,
        createdAt: moderationLogs.createdAt
      })
      .from(moderationLogs)
      .orderBy(moderationLogs.createdAt)
      .limit(10);

    return NextResponse.json({
      stats: {
        pendingModeration: pendingCount[0]?.count || 0,
        flaggedToday: todayFlagged[0]?.count || 0,
        totalPosts: totalPosts[0]?.count || 0,
        activePosts: activePosts[0]?.count || 0,
        inactivePosts: (totalPosts[0]?.count || 0) - (activePosts[0]?.count || 0)
      },
      recentActivity
    });

  } catch (error) {
    console.error('Failed to fetch moderation stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch moderation statistics' },
      { status: 500 }
    );
  }
}
