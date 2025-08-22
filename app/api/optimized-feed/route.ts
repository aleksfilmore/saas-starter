import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { anonymousPosts, users } from '@/lib/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';

// Get optimized feed for user
export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Get optimized feed - prioritize:
    // 1. Recent entries from users with similar progress
    // 2. High-engagement entries
    // 3. Entries from users in similar stage of journey
    
    const userProgress = (user as any).xp || 0;
    const userLevel = (user as any).level || 1;

    // Build optimized query
    const feedEntries = await db
      .select({
        entry: anonymousPosts,
        author: {
          id: users.id,
          username: users.username,
          avatar: users.avatar,
          level: users.level,
          xp: users.xp
        }
      })
      .from(anonymousPosts)
      .innerJoin(users, eq(anonymousPosts.userId, users.id))
      .where(
        and(
          eq(anonymousPosts.isActive, true),
          // Prioritize users within 2 levels of current user
          sql`ABS(${users.level} - ${userLevel}) <= 2`
        )
      )
      .orderBy(
        // Boost recent entries from similar-level users
        sql`
          CASE 
            WHEN ABS(${users.level} - ${userLevel}) <= 1 
            THEN ${anonymousPosts.createdAt} + INTERVAL '24 hours'
            ELSE ${anonymousPosts.createdAt}
          END DESC
        `,
        desc(anonymousPosts.createdAt)
      )
      .limit(limit)
      .offset(offset);

    // Enrich with engagement metrics if needed
    const enrichedEntries = feedEntries.map(item => ({
      ...item.entry,
      author: item.author,
      isOptimized: true,
      relevanceScore: Math.abs((item.author.level || 1) - userLevel) <= 1 ? 'high' : 'medium'
    }));

    return NextResponse.json({
      success: true,
      data: {
        entries: enrichedEntries,
        pagination: {
          limit,
          offset,
          hasMore: enrichedEntries.length === limit
        },
        optimization: {
          userLevel,
          userProgress,
          algorithm: 'level_proximity_v1'
        }
      }
    });

  } catch (error) {
    console.error('Optimized feed error:', error);
    
    // Fallback to regular feed
    try {
      const basicEntries = await db
        .select({
          entry: anonymousPosts,
          author: {
            id: users.id,
            username: users.username,
            avatar: users.avatar,
            level: users.level
          }
        })
        .from(anonymousPosts)
        .innerJoin(users, eq(anonymousPosts.userId, users.id))
        .where(
          and(
            eq(anonymousPosts.isActive, true)
          )
        )
        .orderBy(desc(anonymousPosts.createdAt))
        .limit(20);

      return NextResponse.json({
        success: true,
        data: {
          entries: basicEntries.map(item => ({
            ...item.entry,
            author: item.author,
            isOptimized: false,
            fallback: true
          })),
          fallback: true
        }
      });
    } catch (fallbackError) {
      console.error('Fallback feed error:', fallbackError);
      return NextResponse.json(
        { error: 'Failed to load feed' },
        { status: 500 }
      );
    }
  }
}
