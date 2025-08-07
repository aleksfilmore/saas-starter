import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    // Validate user authentication
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userTier = (user as any).tier || 'ghost';
    
    // Only free users can purchase AI therapy messages
    if (userTier !== 'ghost') {
      return NextResponse.json({ 
        error: 'Premium users already have unlimited AI therapy access' 
      }, { status: 400 });
    }

    const { origin } = new URL(request.url);
    
    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1RtT7SJOZTvNXQXGi7jUm5Dw', // Your Stripe price ID
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/ai-therapy/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/ai-therapy?canceled=true`,
      client_reference_id: user.id,
      customer_email: (user as any).email,
      metadata: {
        user_id: user.id,
        product_type: 'ai_therapy_messages',
        message_count: '300',
      },
    });

    return NextResponse.json({
      success: true,
      checkout_url: checkoutSession.url,
      session_id: checkoutSession.id,
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
