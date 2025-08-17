import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { validateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's current notification preferences
    const [userData] = await db
      .select({
        emailNotifications: users.emailNotifications,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    // Default preferences with current email setting
    const preferences = {
      enablePush: true,
      enableEmail: userData?.emailNotifications ?? true,
      enableInApp: true,
      streakReminders: true,
      dailyCheckins: true,
      ritualSuggestions: true,
      milestones: true,
      emergencySupport: true,
      lumoNudges: true,
      streakReminderTime: "20:00",
      dailyCheckinTime: "09:00",
      quietHours: {
        start: "22:00",
        end: "08:00",
        timezone: "UTC"
      }
    };

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error('Failed to fetch notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { preferences } = await request.json();

    // Update email notification preference in database
    await db
      .update(users)
      .set({ 
        emailNotifications: preferences.enableEmail 
      })
      .where(eq(users.id, user.id));

    // In a full implementation, you would also store other preferences
    // For now, we're focusing on email notifications

    return NextResponse.json({ 
      success: true,
      message: 'Notification preferences updated successfully' 
    });
  } catch (error) {
    console.error('Failed to update notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}