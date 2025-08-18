import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
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

    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = request.headers.get('host') || process.env.VERCEL_URL || 'localhost:3001';
    const baseUrl = `${protocol}://${host}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', // One-time payment
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Voice AI Therapy Session',
              description: '15 minutes of voice AI therapy with real-time conversation',
              images: [`${baseUrl}/voice-therapy-icon.png`],
            },
            unit_amount: 999, // $9.99 in cents
          },
          quantity: 1,
        },
      ],
      customer_email: user.email,
      metadata: {
        userId: user.id,
        productType: 'voice_therapy',
        sessionDuration: '15', // minutes
      },
      success_url: `${baseUrl}/dashboard?voice_therapy=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/dashboard?voice_therapy=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Voice therapy checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
