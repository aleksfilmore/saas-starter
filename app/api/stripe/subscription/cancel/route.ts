import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { getUserSubscription } from '@/lib/stripe/subscription';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription to find their customer ID
    const subscription = await getUserSubscription(user.id);
    
    if (!subscription.customerId) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 400 });
    }

    // Get active subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: subscription.customerId,
      status: 'active',
      limit: 1
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 400 });
    }

    const activeSubscription = subscriptions.data[0];

    // Cancel at period end (so they keep benefits until the end of the billing cycle)
    const updatedSubscription = await stripe.subscriptions.update(activeSubscription.id, {
      cancel_at_period_end: true
    });

    // Update user tier to reflect cancellation pending
    await db.update(users)
      .set({
        tier: 'freemium', // They become freemium at the end of the period
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({ 
      success: true,
      message: 'Subscription will be canceled at the end of the current billing period'
    });

  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
