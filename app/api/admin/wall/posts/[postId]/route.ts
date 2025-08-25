import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { anonymousPosts } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';

const ADMIN_EMAIL = 'system_admin@ctrlaltblock.com';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { user } = await validateRequest();
    
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { postId } = await params;

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

    // Delete the post
    await db.delete(anonymousPosts).where(eq(anonymousPosts.id, postId));

    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting wall post:', error);
    return NextResponse.json({ error: 'Failed to delete wall post' }, { status: 500 });
  }
}
