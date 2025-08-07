import { NextRequest, NextResponse } from 'next/server';
import { createCustomerPortalSession, getUserSubscription } from '@/lib/stripe/subscription';
import { validateRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription to find their customer ID
    const subscription = await getUserSubscription(user.id);
    
    if (!subscription.customerId) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = request.headers.get('host') || 'localhost:3001';
    const returnUrl = `${protocol}://${host}/dashboard`;

    const session = await createCustomerPortalSession(subscription.customerId, returnUrl);

    return NextResponse.json(session);
  } catch (error) {
    console.error('Customer portal error:', error);
    return NextResponse.json(
      { error: 'Failed to create customer portal session' },
      { status: 500 }
    );
  }
}
