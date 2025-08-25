import { NextRequest, NextResponse } from 'next/server';
import { EmailNotificationService } from '@/lib/email/notifications';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (for manual triggers)
    const [userData] = await db
      .select({ tier: users.tier })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (!userData || userData.tier !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { type = 'bulk', userId } = await request.json();

    if (type === 'single' && userId) {
      // Send to a specific user
      const success = await EmailNotificationService.sendDailyReminder(userId);
      
      return NextResponse.json({
        success,
        message: success 
          ? 'Daily reminder sent successfully' 
          : 'Failed to send daily reminder'
      });
      
    } else if (type === 'bulk') {
      // Send to all eligible users
      const result = await EmailNotificationService.sendBulkDailyReminders();
      
      return NextResponse.json({
        success: true,
        sent: result.sent,
        failed: result.failed,
        total: result.sent + result.failed,
        message: `Bulk daily reminders completed: ${result.sent} sent, ${result.failed} failed`
      });
      
    } else {
      return NextResponse.json(
        { error: 'Invalid request. Use type: "single" with userId or type: "bulk"' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Failed to trigger daily reminders:', error);
    return NextResponse.json(
      { error: 'Failed to trigger daily reminders' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const [userData] = await db
      .select({ tier: users.tier })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (!userData || userData.tier !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get stats about email notification users
    const allUsers = await db.select().from(users);
    const emailEnabledUsers = allUsers.filter(u => u.emailNotifications);

    return NextResponse.json({
      stats: {
        totalUsers: allUsers.length,
        emailEnabledUsers: emailEnabledUsers.length,
        emailDisabledUsers: allUsers.length - emailEnabledUsers.length
      }
    });

  } catch (error) {
    console.error('Failed to get email notification stats:', error);
    return NextResponse.json(
      { error: 'Failed to get stats' },
      { status: 500 }
    );
  }
}
