import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { getUserSubscription } from '@/lib/stripe/subscription';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  // Only allow in development or for specific debug requests
  if (process.env.NODE_ENV === 'production') {
    const debugKey = request.nextUrl.searchParams.get('debug_key');
    if (debugKey !== process.env.DEBUG_KEY) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user data from database
    const userData = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    
    if (userData.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const dbUser = userData[0];

    // Get subscription data
    const subscription = await getUserSubscription(user.id);

    // Prepare debug info
    const debugInfo = {
      userId: user.id,
      userEmail: dbUser.email,
      dbTier: dbUser.tier,
      dbSubscriptionTier: dbUser.subscriptionTier,
      subscription: {
        tier: subscription.tier,
        status: subscription.status,
        hasCustomerId: !!subscription.customerId,
        customerId: subscription.customerId ? 'PRESENT' : 'MISSING',
        subscriptionId: subscription.subscriptionId ? 'PRESENT' : 'MISSING',
        plan: subscription.plan.name
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
        hasFirewallPriceId: !!process.env.STRIPE_FIREWALL_PRICE_ID
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error('Debug subscription error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get debug info',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
