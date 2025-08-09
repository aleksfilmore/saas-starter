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

    const subscription = await request.json();

    // Validate subscription data
    if (!subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
      return NextResponse.json(
        { error: 'Invalid subscription data' },
        { status: 400 }
      );
    }

    await PushSubscriptionRepository.upsert(
      user.id,
      subscription.endpoint,
      subscription.keys.p256dh,
      subscription.keys.auth
    );

    return NextResponse.json({
      success: true,
      message: 'Push subscription saved successfully'
    });

  } catch (error) {
    console.error('Failed to save push subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
