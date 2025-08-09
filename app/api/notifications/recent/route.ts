import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { NotificationRepository } from '@/lib/notifications/notification-repository';

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const rows = await NotificationRepository.recent(user.id, 10);
    const normalized = rows.map(r => {
      const meta = (r as any).metadata || {};
      return {
      id: r.id,
      type: r.type,
      title: r.title,
      message: r.body,
      timestamp: r.created_at,
      read: !!r.read_at,
      actionUrl: meta.actionUrl,
      actionText: meta.actionText
    }; });
    return NextResponse.json({ notifications: normalized });

  } catch (error) {
    console.error('Failed to fetch recent notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
