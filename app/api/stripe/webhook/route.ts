import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;
    
    if (!stripe) {
      console.error('Stripe is not initialized');
      return NextResponse.json({ error: 'Stripe configuration error' }, { status: 500 });
    }
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancellation(subscription);
        break;
      }
      
      case 'customer.subscription.paused': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionPaused(subscription);
        break;
      }
      
      case 'customer.subscription.resumed': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionResumed(subscription);
        break;
      }
      
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }
      
      case 'invoice.payment_action_required': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentActionRequired(invoice);
        break;
      }
      
      case 'customer.created': {
        const customer = event.data.object as Stripe.Customer;
        await handleCustomerCreated(customer);
        break;
      }
      
      case 'payment_method.attached': {
        const paymentMethod = event.data.object as Stripe.PaymentMethod;
        await handlePaymentMethodAttached(paymentMethod);
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const userId = session.metadata?.userId;
    const productType = session.metadata?.productType;
    
    if (!userId) {
      console.error('No userId found in checkout session metadata');
      return;
    }

    if (productType === 'voice_therapy') {
      // Handle voice therapy purchase
      const sessionDuration = parseInt(session.metadata?.sessionDuration || '15');
      
      // Grant voice therapy credits/minutes to the user
      // You might want to update a voice_credits table or add minutes to user record
      console.log(`Voice therapy purchased for user ${userId}: ${sessionDuration} minutes`);
      
      // Add voice therapy credits to user account
      // This would require a voice_credits table or field in users table
      // For now, we'll just log it - you can implement the actual credit system
      
    } else if (productType === 'subscription') {
      // Handle subscription purchases (if any one-time subscription payments)
      console.log(`Subscription payment completed for user ${userId}`);
    }
  } catch (error) {
    console.error('Error handling checkout completion:', error);
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const userId = subscription.metadata.userId;
  
  if (!userId) {
    console.error('No userId found in subscription metadata');
    return;
  }

  try {
    // Determine subscription tier based on price ID
    const priceId = subscription.items.data[0]?.price.id;
    let subscriptionTier = 'ghost_mode';
    let tier = 'ghost';
    
    if (priceId === process.env.STRIPE_FIREWALL_PRICE_ID) {
      subscriptionTier = 'firewall_mode';
      tier = subscription.status === 'active' ? 'firewall' : 'ghost';
    }

    await db.update(users)
      .set({
        subscriptionTier: subscriptionTier,
        tier: tier,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    console.log(`Updated user ${userId} subscription to ${tier} (${subscriptionTier})`);
  } catch (error) {
    console.error('Error updating user subscription:', error);
  }
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  
  if (!userId) {
    console.error('No userId found in subscription metadata');
    return;
  }

  try {
    await db.update(users)
      .set({
        subscriptionTier: 'ghost_mode',
        tier: 'ghost',
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    console.log(`Cancelled subscription for user ${userId}`);
  } catch (error) {
    console.error('Error cancelling user subscription:', error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = (invoice as any).subscription as string;
  
  if (!subscriptionId) return;

  try {
    if (!stripe) {
      console.error('Stripe is not initialized');
      return;
    }
    
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await handleSubscriptionChange(subscription);
    console.log(`Payment succeeded for subscription ${subscriptionId}`);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = (invoice as any).subscription as string;
  
  console.log(`Payment failed for subscription ${subscriptionId}`);
  
  // You might want to send an email notification here
  // or update the user's subscription status to indicate payment issues
}

async function handleSubscriptionPaused(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  
  if (!userId) {
    console.error('No userId found in subscription metadata');
    return;
  }

  try {
    await db.update(users)
      .set({
        subscriptionTier: 'ghost_mode',
        tier: 'ghost',
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    console.log(`Paused subscription for user ${userId}`);
  } catch (error) {
    console.error('Error pausing user subscription:', error);
  }
}

async function handleSubscriptionResumed(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  
  if (!userId) {
    console.error('No userId found in subscription metadata');
    return;
  }

  try {
    // Determine subscription tier based on price ID
    const priceId = subscription.items.data[0]?.price.id;
    let subscriptionTier = 'ghost_mode';
    let tier = 'ghost';
    
    if (priceId === process.env.STRIPE_FIREWALL_PRICE_ID) {
      subscriptionTier = 'firewall_mode';
      tier = 'firewall';
    }

    await db.update(users)
      .set({
        subscriptionTier: subscriptionTier,
        tier: tier,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    console.log(`Resumed subscription for user ${userId}`);
  } catch (error) {
    console.error('Error resuming user subscription:', error);
  }
}

async function handlePaymentActionRequired(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = (invoice as any).subscription as string;
  
  console.log(`Payment action required for subscription ${subscriptionId}`);
  
  // Send notification to user about required payment action
  // This could trigger an email or in-app notification
}

async function handleCustomerCreated(customer: Stripe.Customer) {
  console.log(`New Stripe customer created: ${customer.id}`);
  
  // You might want to sync customer data or send welcome emails
}

async function handlePaymentMethodAttached(paymentMethod: Stripe.PaymentMethod) {
  console.log(`Payment method attached: ${paymentMethod.id} to customer: ${paymentMethod.customer}`);
  
  // You might want to update user records or send confirmation
}
