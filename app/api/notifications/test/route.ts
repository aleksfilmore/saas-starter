import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { NotificationService } from '@/lib/notifications/notification-service';
import { NotificationRepository, AnalyticsEventRepository } from '@/lib/notifications/notification-repository';

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const notificationService = NotificationService.getInstance();

    // Send a test notification
    const testNotification = {
      id: `test-${user.id}-${Date.now()}`,
      userId: user.id,
      type: 'lumo_nudge' as const,
      title: 'Test Notification 🧪',
      body: 'If you can see this, your notifications are working perfectly!',
      priority: 'normal' as const,
      channels: ['push', 'in_app'] as ('push' | 'email' | 'in_app')[],
      data: {
        actionUrl: '/dashboard',
        actionText: 'Go to Dashboard'
      }
    };

    await notificationService.sendNotification(testNotification);
    await NotificationRepository.create({
      userId: user.id,
      type: testNotification.type,
      title: testNotification.title,
      body: testNotification.body,
      channels: testNotification.channels,
      metadata: testNotification.data || {},
      deliveredAt: new Date()
    });
    await AnalyticsEventRepository.track(user.id, 'notification_test_sent', { notificationId: testNotification.id });

    return NextResponse.json({
      success: true,
      message: 'Test notification sent successfully'
    });

  } catch (error) {
    console.error('Failed to send test notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
