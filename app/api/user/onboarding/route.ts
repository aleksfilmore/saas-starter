import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { updateUser } from '@/lib/db/queries';
import { generateId } from 'lucia';

export async function POST(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { codename, avatar, subscriptionTier } = await req.json();

    if (!codename || !avatar) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update user with onboarding data
    await updateUser(user.id, {
      username: codename,
      avatar: avatar,
      subscriptionTier: subscriptionTier || 'anonymous',
      hasCompletedOnboarding: true,
      bytes: 100, // Starting bonus
      byteBalance: 100, // Starting bonus
      onboardedAt: new Date(),
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Onboarding completed successfully' 
    });

  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}
