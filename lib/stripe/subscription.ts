import { getStripe, SUBSCRIPTION_PLANS } from './config';
import { db } from '@/lib/db';
import { users } from '@/lib/db/unified-schema';
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
    const customer = await stripe.customers.list({
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
    
    // Check multiple tier fields for backward compatibility
    const userTier = userData.tier || userData.subscriptionTier;
    const isFirewall = userTier === 'firewall' || userTier === 'premium' || userData.subscriptionTier === 'premium';
    
    // If user has no tier set or is freemium/ghost, they're on free plan
    if (!userTier || userTier === 'freemium' || userTier === 'ghost') {
      return {
        tier: 'FREE',
        status: 'active',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        plan: SUBSCRIPTION_PLANS.FREE
      };
    }

    // If user is marked as firewall/premium, check Stripe
    if (isFirewall) {
      try {
        const stripe = getStripe();
        
        // Get customer from Stripe
        const customers = await stripe.customers.list({
          email: userData.email,
          limit: 1
        });

        if (customers.data.length === 0) {
          // User marked as paid but no Stripe customer found
          console.warn(`Premium user ${userId} (${userData.email}) has no Stripe customer record`);
          return {
            tier: 'PREMIUM',
            status: 'active',
            currentPeriodEnd: null,
            cancelAtPeriodEnd: false,
            plan: SUBSCRIPTION_PLANS.PREMIUM,
            customerId: undefined // No portal access without customer ID
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
          // Check for past_due or trialing subscriptions too
          const allSubscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            limit: 1
          });

          if (allSubscriptions.data.length === 0) {
            // No subscriptions but customer exists - treat as premium without active subscription
            return {
              tier: 'PREMIUM',
              status: 'inactive',
              currentPeriodEnd: null,
              cancelAtPeriodEnd: false,
              plan: SUBSCRIPTION_PLANS.PREMIUM,
              customerId: customer.id // Portal access available
            };
          }

          const subscription = allSubscriptions.data[0];
          const subscriptionAny = subscription as any;
          return {
            tier: 'PREMIUM',
            status: subscription.status,
            currentPeriodEnd: subscriptionAny.current_period_end ? new Date(subscriptionAny.current_period_end * 1000) : null,
            cancelAtPeriodEnd: subscriptionAny.cancel_at_period_end ?? false,
            plan: SUBSCRIPTION_PLANS.PREMIUM,
            subscriptionId: subscription.id,
            customerId: customer.id
          };
        }

        const subscription = subscriptions.data[0];
        const subscriptionAny = subscription as any;
        const priceId = subscription.items.data[0]?.price.id;
        
        // Determine tier based on price ID or default to PREMIUM for firewall users
        let tier: keyof typeof SUBSCRIPTION_PLANS = 'PREMIUM';
        if (priceId === SUBSCRIPTION_PLANS.PREMIUM.priceId) {
          tier = 'PREMIUM';
        }

        return {
          tier,
          status: subscription.status,
          currentPeriodEnd: subscriptionAny.current_period_end ? new Date(subscriptionAny.current_period_end * 1000) : null,
          cancelAtPeriodEnd: subscriptionAny.cancel_at_period_end ?? false,
          plan: SUBSCRIPTION_PLANS[tier],
          subscriptionId: subscription.id,
          customerId: customer.id
        };
      } catch (stripeError) {
        console.error('Stripe API error for user', userId, ':', stripeError);
        // If Stripe fails but user is marked as firewall, show them as premium with error status
        // This handles cases like wrong API keys, network issues, etc.
        return {
          tier: 'PREMIUM',
          status: 'active', // Assume active if database says firewall
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
          plan: SUBSCRIPTION_PLANS.PREMIUM,
          customerId: undefined // No portal access when Stripe is unavailable
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
