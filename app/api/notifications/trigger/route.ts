import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/lib/notifications/notification-service';
import { validateRequest } from '@/lib/auth';

// Trigger contextual notifications based on user behavior
export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { trigger, context } = body;

    if (!trigger) {
      return NextResponse.json({ 
        error: 'Missing trigger type' 
      }, { status: 400 });
    }

    let success = false;

    switch (trigger) {
      case 'streak_reminder':
        await notificationService.setupStreakReminder(user.id, context?.preferredTime);
        success = true;
        break;

      case 'daily_checkin':
        await notificationService.setupDailyCheckinReminder(user.id, context?.preferredTime);
        success = true;
        break;

      case 'lumo_nudge':
        success = await notificationService.sendLumoNudge(user.id, context?.nudgeType || 'low_activity');
        break;

      case 'milestone':
        success = await notificationService.sendMilestoneNotification(user.id, context?.milestone);
        break;

      case 'emergency_support':
        success = await notificationService.sendEmergencySupport(user.id, context?.supportType || 'high_distress');
        break;

      default:
        return NextResponse.json({ 
          error: `Unknown trigger type: ${trigger}` 
        }, { status: 400 });
    }

    return NextResponse.json({
      success,
      trigger,
      message: success ? 'Notification triggered successfully' : 'Failed to trigger notification'
    });

  } catch (error) {
    console.error('Notification trigger error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
