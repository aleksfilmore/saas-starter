import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe/config';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

// In-memory storage for demo purposes (in production, use database)
declare global {
  var userQuotas: Map<string, any>;
}

if (!global.userQuotas) {
  global.userQuotas = new Map();
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.warn('Stripe not configured, ignoring webhook');
      return NextResponse.json({ received: true });
    }

    const stripe = getStripe();
    const sig = request.headers.get('stripe-signature');

    if (!sig) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log('Payment successful:', session.id);
        
        // Extract user ID from metadata
        const userId = session.client_reference_id || session.metadata?.user_id;
        
        if (userId) {
          // Add 300 AI therapy messages to user's quota
          const currentQuota = global.userQuotas.get(userId) || 0;
          global.userQuotas.set(userId, currentQuota + 300);
          
          console.log(`Added 300 AI therapy messages to user ${userId}`);
          
          // In production, you would update the database here
          try {
            // For paid sessions, we track them differently than quota usage
            // This could be stored in therapyHistory or a separate field
            const currentHistory = JSON.parse((await db.select({ therapyHistory: users.therapyHistory }).from(users).where(eq(users.id, userId)).limit(1))[0]?.therapyHistory || '[]');
            const newSession = {
              date: new Date().toISOString(),
              type: 'purchased',
              messages: 300,
              amount: 3.99,
              sessionId: session.id
            };
            currentHistory.push(newSession);
            
            await db.update(users)
              .set({ 
                therapyHistory: JSON.stringify(currentHistory),
                updatedAt: new Date()
              })
              .where(eq(users.id, userId));
            
            console.log(`Database updated for user ${userId}`);
          } catch (dbError) {
            console.error('Database update failed:', dbError);
            // For now, continue with in-memory storage as fallback
          }
        }
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent succeeded:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        console.log('Payment failed');
        break;

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
