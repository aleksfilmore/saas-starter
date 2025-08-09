import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { PushSubscriptionRepository } from '@/lib/notifications/notification-repository';

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { endpoint } = await request.json();

  await PushSubscriptionRepository.remove(user.id, endpoint);

    return NextResponse.json({
      success: true,
      message: 'Push subscription removed successfully'
    });

  } catch (error) {
    console.error('Failed to remove push subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
