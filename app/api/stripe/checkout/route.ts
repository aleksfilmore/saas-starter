import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe/subscription';
import { validateRequest } from '@/lib/auth';
import { SUBSCRIPTION_PLANS } from '@/lib/stripe/config';

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tier } = await request.json();
    
    if (!tier || !SUBSCRIPTION_PLANS[tier as keyof typeof SUBSCRIPTION_PLANS]) {
      return NextResponse.json({ error: 'Invalid subscription tier' }, { status: 400 });
    }

    const plan = SUBSCRIPTION_PLANS[tier as keyof typeof SUBSCRIPTION_PLANS];
    
    if (!plan.priceId) {
      return NextResponse.json({ error: 'Free tier does not require checkout' }, { status: 400 });
    }

    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = request.headers.get('host') || process.env.VERCEL_URL || 'localhost:3001';
    const baseUrl = `${protocol}://${host}`;

    const session = await createCheckoutSession({
      priceId: plan.priceId,
      userId: user.id,
      userEmail: user.email,
      successUrl: `${baseUrl}/dashboard?subscription=success`,
      cancelUrl: `${baseUrl}/pricing?subscription=cancelled`
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}