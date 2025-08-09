import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';

// NOTE: We avoid a second context param because Next.js 15 type-generation
// was inferring an incompatible Promise-based params type for this route.
// Instead, derive the id directly from the URL path segments.
export async function PATCH(request: NextRequest) {
  try {
  const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const segments = url.pathname.split('/').filter(Boolean);
    // Expect pattern: api / notifications / :id / read
    const notifIndex = segments.lastIndexOf('notifications');
    const notificationId = notifIndex !== -1 && segments.length > notifIndex + 1
      ? segments[notifIndex + 1]
      : '';

    // In production, update the notification read status in the database
    console.log(`Marking notification ${notificationId} as read for user ${user.id}`);

  return NextResponse.json({ success: true, message: 'Notification marked as read' });

  } catch (error) {
    console.error('Failed to mark notification as read:', error);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
