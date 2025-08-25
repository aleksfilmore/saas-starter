import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { anonymousPosts } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';

const ADMIN_EMAIL = 'system_admin@ctrlaltblock.com';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { user } = await validateRequest();
    
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { postId } = await params;
    const body = await request.json();
    const { isActive, isFeatured } = body;

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Check if post exists
    const [existingPost] = await db
      .select()
      .from(anonymousPosts)
      .where(eq(anonymousPosts.id, postId))
      .limit(1);

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Update the post status
    const updateData: any = {
      updatedAt: new Date()
    };

    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }

    if (typeof isFeatured === 'boolean') {
      updateData.isFeatured = isFeatured;
    }

    await db
      .update(anonymousPosts)
      .set(updateData)
      .where(eq(anonymousPosts.id, postId));

    return NextResponse.json({ 
      success: true, 
      message: 'Post status updated successfully',
      post: { ...existingPost, ...updateData }
    });
  } catch (error) {
    console.error('Error updating wall post status:', error);
    return NextResponse.json({ error: 'Failed to update wall post status' }, { status: 500 });
  }
}
