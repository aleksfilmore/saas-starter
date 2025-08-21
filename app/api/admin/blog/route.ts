import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/admin/blog - Get all blog posts
export async function GET(request: NextRequest) {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (you might want to add an admin role check)
    if (user.email !== 'system_admin@ctrlaltblock.com') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const posts = await db.select().from(blogPosts).orderBy(blogPosts.created_at);
    
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Blog fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// POST /api/admin/blog - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.email !== 'system_admin@ctrlaltblock.com') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      status,
      featured_image,
      meta_title,
      meta_description,
      tags,
      category,
      reading_time,
    } = body;

    // Generate unique slug if needed
    let finalSlug = slug;
    const existingPost = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    if (existingPost.length > 0) {
      finalSlug = `${slug}-${Date.now()}`;
    }

    const newPost = await db.insert(blogPosts).values({
      id: randomUUID(),
      title,
      slug: finalSlug,
      excerpt,
      content,
      author_id: user.id,
      status: status || 'draft',
      featured_image,
      meta_title,
      meta_description,
      tags,
      category,
      reading_time,
      published_at: status === 'published' ? new Date() : null,
    }).returning();

    return NextResponse.json({ post: newPost[0] });
  } catch (error) {
    console.error('Blog creation error:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
