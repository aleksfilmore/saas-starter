import { NextRequest, NextResponse } from 'next/server';
import { EmailNotificationService } from '@/lib/email/notifications';

export async function POST(request: NextRequest) {
  try {
    // Verify the request is from a trusted source (cron job)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting daily email reminders...');
    
    const result = await EmailNotificationService.sendBulkDailyReminders();
    
    console.log(`Daily emails sent: ${result.sent} successful, ${result.failed} failed`);
    
    return NextResponse.json({
      success: true,
      message: `Daily reminders sent`,
      stats: result
    });

  } catch (error) {
    console.error('Daily email cron error:', error);
    return NextResponse.json(
      { error: 'Failed to send daily emails' },
      { status: 500 }
    );
  }
}

// Allow manual triggering for testing (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check for admin authorization
    const testSecret = request.nextUrl.searchParams.get('secret');
    if (testSecret !== process.env.ADMIN_TEST_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await EmailNotificationService.sendBulkDailyReminders();
    
    return NextResponse.json({
      success: true,
      message: 'Test daily reminders sent',
      stats: result
    });

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: 'Failed to send test emails' },
      { status: 500 }
    );
  }
}
