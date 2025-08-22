import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const notificationId = resolvedParams.id;

    // In a real implementation, you would delete the notification from the database
    // For now, we'll just return success
    console.log(`Deleting notification ${notificationId} for user ${user.id}`);

    return NextResponse.json({ 
      success: true,
      message: 'Notification deleted' 
    });
  } catch (error) {
    console.error('Failed to delete notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}
