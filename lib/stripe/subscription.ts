import { getStripe, SUBSCRIPTION_PLANS } from './config';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export interface CreateCheckoutSessionParams {
  priceId: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession({
  priceId,
  userId,
  userEmail,
  successUrl,
  cancelUrl
}: CreateCheckoutSessionParams) {
  try {
    const stripe = getStripe();
    
    // Create or retrieve Stripe customer
    let customer = await stripe.customers.list({
      email: userEmail,
      limit: 1
    });

    let customerId: string;
    
    if (customer.data.length === 0) {
      // Create new customer
      const newCustomer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          userId: userId
        }
      });
      customerId = newCustomer.id;
    } else {
      customerId = customer.data[0].id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId,
      },
      subscription_data: {
        metadata: {
          userId: userId,
        },
      },
    });

    return { sessionId: session.id, url: session.url };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
}

export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  try {
    const stripe = getStripe();
    
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw new Error('Failed to create customer portal session');
  }
}

export async function getUserSubscription(userId: string) {
  try {
    // Get user from database
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    if (user.length === 0) {
      throw new Error('User not found');
    }

    const userData = user[0];
    
    // If user has no tier set or is freemium, they're on free plan
    if (!userData.tier || userData.tier === 'freemium') {
      return {
        tier: 'FREE',
        status: 'active',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        plan: SUBSCRIPTION_PLANS.FREE
      };
    }

    // If user is marked as premium, check Stripe
    if (userData.tier === 'premium') {
      try {
        const stripe = getStripe();
        
        // Get customer from Stripe
        const customers = await stripe.customers.list({
          email: userData.email,
          limit: 1
        });

        if (customers.data.length === 0) {
          // User marked as paid but no Stripe customer found - fallback to free
          return {
            tier: 'FREE',
            status: 'inactive',
            currentPeriodEnd: null,
            cancelAtPeriodEnd: false,
            plan: SUBSCRIPTION_PLANS.FREE
          };
        }

        const customer = customers.data[0];
        
        // Get active subscriptions
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          status: 'active',
          limit: 1
        });

        if (subscriptions.data.length === 0) {
          return {
            tier: 'FREE',
            status: 'inactive',
            currentPeriodEnd: null,
            cancelAtPeriodEnd: false,
            plan: SUBSCRIPTION_PLANS.FREE
          };
        }

        const subscription = subscriptions.data[0];
        const priceId = subscription.items.data[0]?.price.id;
        
        // Determine tier based on price ID
        let tier: keyof typeof SUBSCRIPTION_PLANS = 'FREE';
        if (priceId === SUBSCRIPTION_PLANS.PREMIUM.priceId) {
          tier = 'PREMIUM';
        }

        // Cast to any to access Stripe properties
        const subscriptionData = subscription as any;

        return {
          tier,
          status: subscription.status,
          currentPeriodEnd: subscriptionData.current_period_end ? new Date(subscriptionData.current_period_end * 1000) : null,
          cancelAtPeriodEnd: subscriptionData.cancel_at_period_end ?? false,
          plan: SUBSCRIPTION_PLANS[tier],
          subscriptionId: subscription.id,
          customerId: customer.id
        };
      } catch (stripeError) {
        console.error('Stripe API error:', stripeError);
        // If Stripe fails, fallback to free tier
        return {
          tier: 'FREE',
          status: 'error',
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
          plan: SUBSCRIPTION_PLANS.FREE
        };
      }
    }

    // Default fallback
    return {
      tier: 'FREE',
      status: 'active',
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      plan: SUBSCRIPTION_PLANS.FREE
    };
  } catch (error) {
    console.error('Error getting user subscription:', error);
    throw new Error('Failed to get user subscription');
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const stripe = getStripe();
    
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    // Cast to any to access Stripe properties
    const subscriptionData = subscription as any;

    return {
      cancelAtPeriodEnd: subscriptionData.cancel_at_period_end ?? false,
      currentPeriodEnd: new Date((subscriptionData.current_period_end || 0) * 1000)
    };
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
}

export async function reactivateSubscription(subscriptionId: string) {
  try {
    const stripe = getStripe();
    
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });

    // Cast to any to access Stripe properties
    const subscriptionData = subscription as any;

    return {
      cancelAtPeriodEnd: subscriptionData.cancel_at_period_end ?? false,
      currentPeriodEnd: new Date((subscriptionData.current_period_end || 0) * 1000)
    };
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    throw new Error('Failed to reactivate subscription');
  }
}
