import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db/drizzle';
import { users, subscriptionEvents, type NewSubscriptionEvent } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { validateRequest } from '@/lib/auth';
import { paymentRateLimit } from '@/lib/middleware/rate-limiter';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  // Apply rate limiting for payment endpoints
  const rateLimitResponse = await paymentRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, subscriptionId, planId, paymentMethodId } = body;

    // Get current user data
    const userData = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    if (!userData.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentUser = userData[0];
    
    switch (action) {
      case 'pause':
        return await pauseSubscription(user.id, subscriptionId);
      case 'resume':
        return await resumeSubscription(user.id, subscriptionId);
      case 'cancel':
        return await cancelSubscription(user.id, subscriptionId);
      case 'upgrade':
        return await upgradeSubscription(user.id, subscriptionId, planId);
      case 'downgrade':
        return await downgradeSubscription(user.id, subscriptionId, planId);
      case 'update_payment':
        return await updatePaymentMethod(user.id, subscriptionId, paymentMethodId);
      case 'retry_payment':
        return await retryFailedPayment(user.id, subscriptionId);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Subscription management error:', error);
    return NextResponse.json({ 
      error: 'Failed to manage subscription' 
    }, { status: 500 });
  }
}

async function pauseSubscription(userId: string, subscriptionId: string) {
  try {
    // Pause subscription in Stripe
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: {
        behavior: 'keep_as_draft',
      },
    });

    // Update user status to paused (using status field)
    await db
      .update(users)
      .set({ 
        status: 'paused',
        tier: 'freemium' // Temporarily downgrade access
      })
      .where(eq(users.id, userId));

    // Log the event
    await logSubscriptionEvent(userId, subscriptionId, 'paused', {
      stripeStatus: subscription.status,
      pausedAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      subscription,
      message: 'Subscription paused successfully' 
    });
  } catch (error) {
    console.error('Error pausing subscription:', error);
    return NextResponse.json({ 
      error: 'Failed to pause subscription' 
    }, { status: 500 });
  }
}

async function resumeSubscription(userId: string, subscriptionId: string) {
  try {
    // Resume subscription in Stripe
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: '',
    });

    // Update user status to active
    await db
      .update(users)
      .set({ 
        status: 'active',
        tier: 'paid' // Restore paid access
      })
      .where(eq(users.id, userId));

    // Log the event
    await logSubscriptionEvent(userId, subscriptionId, 'resumed', {
      stripeStatus: subscription.status,
      resumedAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      subscription,
      message: 'Subscription resumed successfully' 
    });
  } catch (error) {
    console.error('Error resuming subscription:', error);
    return NextResponse.json({ 
      error: 'Failed to resume subscription' 
    }, { status: 500 });
  }
}

async function cancelSubscription(userId: string, subscriptionId: string) {
  try {
    // Cancel subscription in Stripe (at period end)
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    // Update user status to cancelled but keep access until period end
    await db
      .update(users)
      .set({ 
        status: 'cancelled'
        // Keep tier as 'paid' until period actually ends
      })
      .where(eq(users.id, userId));

    // Log the event
    await logSubscriptionEvent(userId, subscriptionId, 'cancelled', {
      stripeStatus: subscription.status,
      cancelledAt: new Date().toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    });

    return NextResponse.json({ 
      success: true, 
      subscription,
      message: 'Subscription will be cancelled at the end of the billing period' 
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json({ 
      error: 'Failed to cancel subscription' 
    }, { status: 500 });
  }
}

async function upgradeSubscription(userId: string, subscriptionId: string, planId: string) {
  try {
    // Update subscription plan in Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: planId,
      }],
      proration_behavior: 'create_prorations',
    });

    // Log the event
    await logSubscriptionEvent(userId, subscriptionId, 'upgraded', {
      oldPlan: subscription.items.data[0].price.id,
      newPlan: planId,
      stripeStatus: updatedSubscription.status,
      upgradedAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      subscription: updatedSubscription,
      message: 'Subscription upgraded successfully' 
    });
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    return NextResponse.json({ 
      error: 'Failed to upgrade subscription' 
    }, { status: 500 });
  }
}

async function downgradeSubscription(userId: string, subscriptionId: string, planId: string) {
  try {
    // Schedule downgrade at period end to avoid refunds
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: planId,
      }],
      proration_behavior: 'none', // Don't prorate downgrades
      billing_cycle_anchor: 'unchanged',
    });

    // Log the event
    await logSubscriptionEvent(userId, subscriptionId, 'downgraded', {
      oldPlan: subscription.items.data[0].price.id,
      newPlan: planId,
      stripeStatus: updatedSubscription.status,
      downgradedAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      subscription: updatedSubscription,
      message: 'Subscription downgraded successfully' 
    });
  } catch (error) {
    console.error('Error downgrading subscription:', error);
    return NextResponse.json({ 
      error: 'Failed to downgrade subscription' 
    }, { status: 500 });
  }
}

async function updatePaymentMethod(userId: string, subscriptionId: string, paymentMethodId: string) {
  try {
    // Update default payment method in Stripe
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      default_payment_method: paymentMethodId,
    });

    // Log the event
    await logSubscriptionEvent(userId, subscriptionId, 'payment_method_updated', {
      paymentMethodId,
      stripeStatus: subscription.status,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      subscription,
      message: 'Payment method updated successfully' 
    });
  } catch (error) {
    console.error('Error updating payment method:', error);
    return NextResponse.json({ 
      error: 'Failed to update payment method' 
    }, { status: 500 });
  }
}

async function retryFailedPayment(userId: string, subscriptionId: string) {
  try {
    // Get the latest invoice for this subscription
    const invoices = await stripe.invoices.list({
      subscription: subscriptionId,
      status: 'open',
      limit: 1,
    });

    if (!invoices.data.length) {
      return NextResponse.json({ 
        error: 'No failed payments found' 
      }, { status: 404 });
    }

    const invoice = invoices.data[0];
    
    if (!invoice.id) {
      return NextResponse.json({ 
        error: 'Invalid invoice found' 
      }, { status: 400 });
    }
    
    // Retry the payment
    const paidInvoice = await stripe.invoices.pay(invoice.id);

    if (paidInvoice.status === 'paid') {
      // Update user status back to active
      await db
        .update(users)
        .set({ 
          status: 'active',
          tier: 'paid'
        })
        .where(eq(users.id, userId));

      // Log the event
      await logSubscriptionEvent(userId, subscriptionId, 'payment_retry_succeeded', {
        invoiceId: invoice.id,
        amount: invoice.amount_paid,
        retriedAt: new Date().toISOString()
      });

      return NextResponse.json({ 
        success: true, 
        invoice: paidInvoice,
        message: 'Payment retry successful' 
      });
    } else {
      // Log the failed retry
      await logSubscriptionEvent(userId, subscriptionId, 'payment_retry_failed', {
        invoiceId: invoice.id,
        retriedAt: new Date().toISOString()
      });

      return NextResponse.json({ 
        error: 'Payment retry failed' 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error retrying payment:', error);
    return NextResponse.json({ 
      error: 'Failed to retry payment' 
    }, { status: 500 });
  }
}

async function logSubscriptionEvent(
  userId: string, 
  subscriptionId: string, 
  eventType: string, 
  metadata: Record<string, any>
) {
  try {
    const eventData: NewSubscriptionEvent = {
      id: crypto.randomUUID(),
      userId,
      stripeSubscriptionId: subscriptionId,
      eventType,
      metadata: JSON.stringify(metadata),
    };

    await db.insert(subscriptionEvents).values(eventData);
  } catch (error) {
    console.error('Error logging subscription event:', error);
    // Don't throw here - logging failure shouldn't break the main operation
  }
}
