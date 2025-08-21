import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

// PUT /api/admin/blog/[id] - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const updatedPost = await db.update(blogPosts)
      .set({
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
        updated_at: new Date(),
        published_at: status === 'published' ? new Date() : null,
      })
      .where(eq(blogPosts.id, params.id))
      .returning();

    if (updatedPost.length === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ post: updatedPost[0] });
  } catch (error) {
    console.error('Blog update error:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE /api/admin/blog/[id] - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.email !== 'system_admin@ctrlaltblock.com') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const deletedPost = await db.delete(blogPosts)
      .where(eq(blogPosts.id, params.id))
      .returning();

    if (deletedPost.length === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Blog deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
