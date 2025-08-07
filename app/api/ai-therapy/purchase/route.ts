import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';

// In-memory storage for demo purposes
declare global {
  var userQuotas: Map<string, any>;
}

if (!global.userQuotas) {
  global.userQuotas = new Map();
}

export async function POST(request: Request) {
  try {
    // Use Lucia authentication
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userTier = (user as any).tier || 'ghost';
    
    // Only free users can purchase messages
    if (userTier !== 'ghost') {
      return NextResponse.json({ 
        error: 'Premium users have unlimited access' 
      }, { status: 400 });
    }

    const { paymentMethod } = await request.json();

    if (!paymentMethod) {
      return NextResponse.json({ 
        error: 'Payment method required' 
      }, { status: 400 });
    }

    // Simulate payment processing
    // In real implementation, this would integrate with Stripe or other payment processor
    console.log(`Processing payment for user ${user.id}: $3.99 for 300 AI therapy messages`);

    // Get or create quota for user
    let quota = global.userQuotas?.get(user.id);
    
    if (!quota) {
      quota = {
        used: 0,
        total: 0,
        resetAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // Far future
        canPurchaseMore: true,
        purchaseCost: 3.99,
        tier: 'ghost',
        extraMessages: 0,
        remaining: 0,
        isUnlimited: false,
        messagesPerPurchase: 300
      };
    }

    // Add 300 messages to their quota
    quota.total += 300;
    quota.remaining = quota.total - quota.used;
    quota.extraMessages += 300;

    global.userQuotas.set(user.id, quota);

    return NextResponse.json({
      success: true,
      message: '300 AI therapy messages added to your account',
      quota: {
        total: quota.total,
        used: quota.used,
        remaining: quota.remaining,
        messagesAdded: 300,
        cost: 3.99
      },
      paymentConfirmation: {
        amount: 3.99,
        currency: 'USD',
        description: '300 AI Therapy Messages',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Purchase AI messages error:', error);
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 }
    );
  }
}
