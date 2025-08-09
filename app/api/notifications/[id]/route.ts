import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { NotificationRepository, AnalyticsEventRepository } from '@/lib/notifications/notification-repository';

// Remove context param (causing Next.js 15 param type inference issues) and parse ID from URL.
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
    const notifIndex = segments.lastIndexOf('notifications');
    const notificationId = notifIndex !== -1 && segments.length > notifIndex + 1
      ? segments[notifIndex + 1]
      : '';

  await NotificationRepository.markRead(user.id, notificationId);
  await AnalyticsEventRepository.track(user.id, 'notification_read', { notificationId });

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    const notifIndex = segments.lastIndexOf('notifications');
    const notificationId = notifIndex !== -1 && segments.length > notifIndex + 1
      ? segments[notifIndex + 1]
      : '';

  // Soft delete could be implemented; for now we just record dismissal event
  await AnalyticsEventRepository.track(user.id, 'notification_dismissed', { notificationId });

    return NextResponse.json({
      success: true,
      message: 'Notification dismissed'
    });

  } catch (error) {
    console.error('Failed to dismiss notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
