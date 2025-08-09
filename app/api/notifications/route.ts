import { NextRequest, NextResponse } from 'next/server';
import { notificationService, type NotificationPayload } from '@/lib/notifications/notification-service';
import { validateRequest } from '@/lib/auth';

// Send immediate notification
export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, title, body: notificationBody, data, priority = 'normal', channels = ['push', 'in_app'] } = body;

    if (!type || !title || !notificationBody) {
      return NextResponse.json({ 
        error: 'Missing required fields: type, title, body' 
      }, { status: 400 });
    }

    const notification: NotificationPayload = {
      id: `manual_${user.id}_${Date.now()}`,
      userId: user.id,
      type,
      title,
      body: notificationBody,
      data,
      priority,
      channels
    };

    const success = await notificationService.scheduleNotification(notification);

    return NextResponse.json({
      success,
      notificationId: notification.id,
      message: success ? 'Notification sent successfully' : 'Failed to send notification'
    });

  } catch (error) {
    console.error('Notification API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get user notification preferences
export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock implementation - would fetch from database
    const preferences = {
      userId: user.id,
      enablePush: true,
      enableEmail: true,
      enableInApp: true,
      streakReminders: true,
      dailyCheckins: true,
      ritualSuggestions: true,
      milestones: true,
      emergencySupport: true,
      lumoNudges: true,
      quietHours: {
        start: "22:00",
        end: "08:00",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    return NextResponse.json({ preferences });

  } catch (error) {
    console.error('Get preferences error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update user notification preferences
export async function PATCH(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updates = body.preferences;

    if (!updates) {
      return NextResponse.json({ 
        error: 'Missing preferences object' 
      }, { status: 400 });
    }

    // Mock implementation - would update in database
    console.log(`Updating notification preferences for user ${user.id}:`, updates);

    // Set up/update scheduled notifications based on new preferences
    if (updates.streakReminders && updates.streakReminderTime) {
      await notificationService.setupStreakReminder(user.id, updates.streakReminderTime);
    }

    if (updates.dailyCheckins && updates.dailyCheckinTime) {
      await notificationService.setupDailyCheckinReminder(user.id, updates.dailyCheckinTime);
    }

    return NextResponse.json({
      success: true,
      message: 'Notification preferences updated successfully'
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
