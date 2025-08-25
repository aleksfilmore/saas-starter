import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { isActive } = await request.json();

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Update user status
    await db
      .update(users)
      .set({ 
        isActive,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    return NextResponse.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
    });

  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json(
      { error: 'Failed to update user status' },
      { status: 500 }
    );
  }
}
