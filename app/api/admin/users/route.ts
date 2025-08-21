import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, userSessions, anonymousPosts, ritualCompletions } from '@/lib/db/schema';
import { eq, count, desc, sql, inArray } from 'drizzle-orm';

const ADMIN_EMAIL = 'system_admin@ctrlaltblock.com';

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get users with optimized query
    const usersData = await db
      .select({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        username: users.username,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt,
        isActive: users.isActive,
        subscriptionStatus: users.subscriptionStatus,
        role: users.role,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    // Get aggregated stats for these users in batches to improve performance
    const userIds = usersData.map(u => u.id);
    
    // Get post counts for users
    const postCounts = userIds.length > 0 ? await db
      .select({
        userId: anonymousPosts.userId,
        postCount: count(anonymousPosts.id),
      })
      .from(anonymousPosts)
      .where(inArray(anonymousPosts.userId, userIds))
      .groupBy(anonymousPosts.userId) : [];

    // Get ritual completion counts for users
    const ritualCounts = userIds.length > 0 ? await db
      .select({
        userId: ritualCompletions.userId,
        ritualCount: count(ritualCompletions.id),
      })
      .from(ritualCompletions)
      .where(inArray(ritualCompletions.userId, userIds))
      .groupBy(ritualCompletions.userId) : [];

    // Combine the data efficiently
    const enrichedUsers = usersData.map(user => {
      const postCount = postCounts.find(p => p.userId === user.id)?.postCount || 0;
      const ritualCount = ritualCounts.find(r => r.userId === user.id)?.ritualCount || 0;
      
      return {
        ...user,
        postCount,
        ritualCompletions: ritualCount,
        subscriptionStatus: user.subscriptionStatus || 'free',
        role: user.role || 'user',
        createdAt: user.createdAt?.toISOString(),
        lastLoginAt: user.lastLoginAt?.toISOString(),
      };
    });

    // Get total count for pagination
    const totalResult = await db
      .select({ count: count(users.id) })
      .from(users);
    const total = totalResult[0]?.count || 0;

    return NextResponse.json({
      users: enrichedUsers,
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch users',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
