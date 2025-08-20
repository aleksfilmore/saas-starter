import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';

// Mock notifications for now - in production you'd fetch from database
const generateNotifications = (userId: string) => {
  const baseNotifications = [
    {
      id: '1',
      type: 'daily_checkin',
      title: 'Daily Check-In Reminder',
      message: 'How are you feeling today? Take a moment to reflect on your healing journey.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      read: false,
      actionUrl: '/dashboard',
      actionText: 'Check In'
    },
    {
      id: '2',
      type: 'streak_reminder',
      title: 'No-Contact Streak Update',
      message: 'Great job maintaining your boundaries! Keep up the strong work.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      read: false,
      actionUrl: '/dashboard',
      actionText: 'View Streak'
    },
    {
      id: '3',
      type: 'ritual_suggestion',
      title: 'New Healing Ritual Available',
      message: 'A personalized ritual has been crafted for your healing journey today.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      read: true,
      actionUrl: '/dashboard',
      actionText: 'Start Ritual'
    },
    {
      id: '4',
      type: 'milestone',
      title: 'Milestone Achieved! 🎉',
      message: 'You\'ve completed 7 days of consistent healing practices. Amazing progress!',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      read: true,
      actionUrl: '/dashboard/progress',
      actionText: 'View Progress'
    },
    {
      id: '5',
      type: 'lumo_nudge',
      title: 'Gentle Reminder from Lumo',
      message: 'Remember: healing isn\'t linear. Every small step counts toward your growth.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      read: true
    }
  ];

  return baseNotifications;
};

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate mock notifications
    const notifications = generateNotifications(user.id);

    return NextResponse.json({ 
      success: true,
      notifications: notifications
    });
  } catch (error) {
    console.error('Failed to fetch recent notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
