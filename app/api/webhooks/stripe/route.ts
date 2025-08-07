import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

// In-memory storage for demo purposes (in production, use database)
declare global {
  var userQuotas: Map<string, any>;
}

if (!global.userQuotas) {
  global.userQuotas = new Map();
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.metadata?.product_type === 'ai_therapy_messages') {
          const userId = session.metadata.user_id;
          const messageCount = parseInt(session.metadata.message_count || '300');
          
          console.log(`Processing AI therapy purchase for user ${userId}: ${messageCount} messages`);
          
          // Update user's AI therapy quota
          let quota = global.userQuotas?.get(userId);
          
          if (!quota) {
            quota = {
              used: 0,
              total: 0,
              resetAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              canPurchaseMore: true,
              purchaseCost: 3.99,
              tier: 'ghost',
              extraMessages: 0,
              remaining: 0,
              isUnlimited: false,
              messagesPerPurchase: 300
            };
          }

          // Add purchased messages to quota
          quota.total += messageCount;
          quota.remaining = quota.total - quota.used;
          quota.extraMessages += messageCount;
          
          global.userQuotas.set(userId, quota);
          
          console.log(`✅ Added ${messageCount} AI therapy messages to user ${userId}`);
          
          // In production, also record this in the database
          // await recordAITherapyPurchase(userId, messageCount, session.amount_total, session.id);
        }
        break;
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment succeeded: ${paymentIntent.id}`);
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
