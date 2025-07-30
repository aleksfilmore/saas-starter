// Wall of Wounds API - READ/FEED
import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { anonymousPosts, users, wallPostReactions } from '@/lib/db/schema';
import { desc, eq, and, gte, count, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const filter = searchParams.get('filter') || 'recent'; // recent, viral, oracle
    const category = searchParams.get('category'); // optional filter by glitch category
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let orderBy = desc(anonymousPosts.createdAt);

    // Category filter
    if (category) {
      whereConditions.push(eq(anonymousPosts.glitchCategory, category));
    }

    // Filter logic
    switch (filter) {
      case 'viral':
        // Posts with 10+ total reactions
        whereConditions.push(
          sql`(${anonymousPosts.resonateCount} + ${anonymousPosts.sameLoopCount} + ${anonymousPosts.draggedMeTooCount} + ${anonymousPosts.stoneColdCount} + ${anonymousPosts.cleansedCount}) >= 10`
        );
        orderBy = desc(sql`(${anonymousPosts.resonateCount} + ${anonymousPosts.sameLoopCount} + ${anonymousPosts.draggedMeTooCount} + ${anonymousPosts.stoneColdCount} + ${anonymousPosts.cleansedCount})`);
        break;
        
      case 'oracle':
        // Featured oracle posts
        whereConditions.push(eq(anonymousPosts.isOraclePost, true));
        orderBy = desc(anonymousPosts.createdAt);
        break;
        
      case 'pulse':
        // Daily pulse - top posts from last 24 hours
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        whereConditions.push(gte(anonymousPosts.createdAt, oneDayAgo));
        orderBy = desc(sql`(${anonymousPosts.resonateCount} + ${anonymousPosts.sameLoopCount} + ${anonymousPosts.draggedMeTooCount})`);
        break;
        
      default: // 'recent'
        orderBy = desc(anonymousPosts.createdAt);
    }

    // Build the query
    const posts = await db
      .select({
        id: anonymousPosts.id,
        content: anonymousPosts.content,
        glitchCategory: anonymousPosts.glitchCategory,
        glitchTitle: anonymousPosts.glitchTitle,
        isAnonymous: anonymousPosts.isAnonymous,
        createdAt: anonymousPosts.createdAt,
        resonateCount: anonymousPosts.resonateCount,
        sameLoopCount: anonymousPosts.sameLoopCount,
        draggedMeTooCount: anonymousPosts.draggedMeTooCount,
        stoneColdCount: anonymousPosts.stoneColdCount,
        cleansedCount: anonymousPosts.cleansedCount,
        commentCount: anonymousPosts.commentCount,
        isOraclePost: anonymousPosts.isOraclePost,
        isFeatured: anonymousPosts.isFeatured,
        // Only show author info if not anonymous
        authorId: sql`CASE WHEN ${anonymousPosts.isAnonymous} = false THEN ${anonymousPosts.userId} ELSE NULL END`,
        authorEmail: sql`CASE WHEN ${anonymousPosts.isAnonymous} = false THEN ${users.email} ELSE NULL END`,
        authorLevel: sql`CASE WHEN ${anonymousPosts.isAnonymous} = false THEN ${users.glowUpLevel} ELSE NULL END`,
      })
      .from(anonymousPosts)
      .leftJoin(users, eq(anonymousPosts.userId, users.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(orderBy)
      .offset(offset)
      .limit(limit);

    // Get user's reactions to these posts (if any)
    const postIds = posts.map(p => p.id);
    const userReactions = postIds.length > 0 ? await db
      .select({
        postId: wallPostReactions.postId,
        reactionType: wallPostReactions.reactionType,
      })
      .from(wallPostReactions)
      .where(
        and(
          eq(wallPostReactions.userId, user.id),
          sql`${wallPostReactions.postId} IN (${postIds.map(id => `'${id}'`).join(',')})`
        )
      ) : [];

    // Map user reactions for easy lookup
    const userReactionMap = userReactions.reduce((acc, reaction) => {
      acc[reaction.postId] = reaction.reactionType;
      return acc;
    }, {} as Record<string, string>);

    // Enhance posts with user reaction data
    const enhancedPosts = posts.map(post => ({
      ...post,
      userReaction: userReactionMap[post.id] || null,
      totalReactions: (post.resonateCount || 0) + (post.sameLoopCount || 0) + 
                     (post.draggedMeTooCount || 0) + (post.stoneColdCount || 0) + 
                     (post.cleansedCount || 0),
      // Format timestamps
      timeAgo: formatTimeAgo(post.createdAt),
      // Glitch the display based on category
      displayTitle: post.glitchTitle || generateGlitchTitle(post.glitchCategory),
    }));

    return NextResponse.json({
      posts: enhancedPosts,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit,
      },
      filter,
      category,
    });

  } catch (error) {
    console.error('Wall feed error:', error);
    return NextResponse.json({ 
      error: 'Failed to load emotional data from the void' 
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

function generateGlitchTitle(category: string): string {
  const titles = {
    system_error: '5Y5T3M_3RR0R_D3T3CT3D',
    loop_detected: 'L00P_1NF1N1T3_D3T3CT3D', 
    memory_leak: 'M3M0RY_L34K_1D3NT1F13D',
    buffer_overflow: 'BUFF3R_0V3RFL0W_W4RN1NG',
    syntax_error: '5YNT4X_3RR0R_L1N3_0',
    null_pointer: 'NULL_P01NT3R_3XC3PT10N',
    stack_overflow: '5T4CK_0V3RFL0W_3XC3PT10N',
    access_denied: '4CC355_D3N13D_3RR0R_403'
  };
  
  return titles[category as keyof typeof titles] || 'UNK0WN_3RR0R';
}
