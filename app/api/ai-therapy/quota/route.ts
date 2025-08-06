import { NextResponse } from 'next/server';

// Global storage reference
declare global {
  var localUsers: Map<string, any>;
  var localSessions: Map<string, any>;
}

// In-memory storage for demo purposes
const userQuotas = new Map();

interface QuotaInfo {
  used: number;
  total: number;
  resetAt: string;
  canPurchaseMore: boolean;
  purchaseCost: number;
  tier: string;
  extraMessages: number;
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // Check session
    const session = global.localSessions?.get(token);
    if (!session || Date.now() > session.expiresAt) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    
    // Get user
    const user = global.localUsers?.get(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get or create quota for user
    let quota = userQuotas.get(user.id);
    
    if (!quota) {
      // Initialize quota based on user tier
      const tierLimits = {
        freemium: { total: 5, purchaseCost: 25 },
        paid_beginner: { total: 200, purchaseCost: 15 },
        paid_advanced: { total: 999999, purchaseCost: 10 } // "Unlimited"
      };
      
      const limits = tierLimits[user.tier as keyof typeof tierLimits] || tierLimits.freemium;
      
      // Reset time is next day at midnight
      const resetAt = new Date();
      resetAt.setDate(resetAt.getDate() + 1);
      resetAt.setHours(0, 0, 0, 0);
      
      quota = {
        used: 0,
        total: limits.total,
        resetAt: resetAt.toISOString(),
        canPurchaseMore: user.tier !== 'paid_advanced',
        purchaseCost: limits.purchaseCost,
        tier: user.tier,
        extraMessages: 0
      };
      
      userQuotas.set(user.id, quota);
    }

    // Check if quota should reset
    const now = new Date();
    const resetTime = new Date(quota.resetAt);
    
    if (now >= resetTime) {
      // Reset quota
      const tierLimits = {
        freemium: { total: 5, purchaseCost: 25 },
        paid_beginner: { total: 200, purchaseCost: 15 },
        paid_advanced: { total: 999999, purchaseCost: 10 }
      };
      
      const limits = tierLimits[user.tier as keyof typeof tierLimits] || tierLimits.freemium;
      
      const newResetAt = new Date(now);
      newResetAt.setDate(newResetAt.getDate() + 1);
      newResetAt.setHours(0, 0, 0, 0);
      
      quota = {
        ...quota,
        used: 0,
        total: limits.total,
        resetAt: newResetAt.toISOString(),
        extraMessages: 0
      };
      
      userQuotas.set(user.id, quota);
    }

    return NextResponse.json({ quota });

  } catch (error) {
    console.error('Quota API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quota' },
      { status: 500 }
    );
  }
}
