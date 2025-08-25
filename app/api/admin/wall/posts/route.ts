import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { anonymousPosts, users } from '@/lib/db/unified-schema';
import { eq, desc, sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';

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

    // Get wall posts with user information using optimized query
    const posts = await db
      .select({
        id: anonymousPosts.id,
        content: anonymousPosts.content,
        glitchCategory: anonymousPosts.glitchCategory,
        category: anonymousPosts.category,
        hearts: anonymousPosts.hearts,
        resonateCount: anonymousPosts.resonateCount,
        commentCount: anonymousPosts.commentCount,
        isActive: anonymousPosts.isActive,
        isAnonymous: anonymousPosts.isAnonymous,
        isFeatured: anonymousPosts.isFeatured,
        createdAt: anonymousPosts.createdAt,
        userId: anonymousPosts.userId,
        username: users.username,
      })
      .from(anonymousPosts)
      .leftJoin(users, eq(anonymousPosts.userId, users.id))
      .orderBy(desc(anonymousPosts.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(anonymousPosts);
    const total = totalResult[0]?.count || 0;

    return NextResponse.json({ 
      posts: posts.map(post => ({
        ...post,
        createdAt: post.createdAt?.toISOString(),
        username: post.username || 'Anonymous'
      })),
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    });
    
  } catch (error) {
    console.error('Error fetching wall posts:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch wall posts',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { content, category, glitchCategory, hearts, isAnonymous, isFeatured } = body;

    if (!content || !category || !glitchCategory) {
      return NextResponse.json({ error: 'Content, category, and glitch category are required' }, { status: 400 });
    }

    const postId = randomUUID();
    
    const newPost = {
      id: postId,
      userId: isAnonymous ? null : user.id,
      content: content.trim(),
      glitchCategory,
      category,
      hearts: hearts || 0,
      resonateCount: 0,
      sameLoopCount: 0,
      draggedMeTooCount: 0,
      stoneColdCount: 0,
      cleansedCount: 0,
      commentCount: 0,
      bytesEarned: 25,
      isActive: true,
      isAnonymous: isAnonymous || false,
      isFeatured: isFeatured || false,
      isOraclePost: false,
      glitchTitle: null,
      glitchOverlay: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.insert(anonymousPosts).values(newPost);

    return NextResponse.json({ 
      success: true, 
      post: {
        ...newPost,
        createdAt: newPost.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Error creating wall post:', error);
    return NextResponse.json({ error: 'Failed to create wall post' }, { status: 500 });
  }
}
