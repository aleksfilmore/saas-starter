import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';

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
    // Use Lucia authentication
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create quota for user
    let quota = userQuotas.get(user.id);
    
    if (!quota) {
      // Initialize quota based on user tier
      const tierLimits = {
        ghost: { total: 0, purchaseCost: 3.99 }, // Free users start with 0, pay $3.99 for 300 messages
        firewall: { total: 999999, purchaseCost: 0 }, // Premium unlimited (fair-usage)
        cult_leader: { total: 999999, purchaseCost: 0 } // Premium unlimited (fair-usage)
      };
      
      const userTier = (user as any).tier || 'ghost'; // Default to ghost for free users
      const limits = tierLimits[userTier as keyof typeof tierLimits] || tierLimits.ghost;
      
      // For free users, no automatic reset - they buy 300 messages when needed
      // For premium users, daily reset for fair-usage tracking
      const resetAt = new Date();
      if (userTier !== 'ghost') {
        resetAt.setDate(resetAt.getDate() + 1);
        resetAt.setHours(0, 0, 0, 0);
      } else {
        // Free users don't have automatic resets
        resetAt.setFullYear(resetAt.getFullYear() + 1); // Far future date
      }
      
      quota = {
        used: 0,
        total: limits.total,
        resetAt: resetAt.toISOString(),
        canPurchaseMore: userTier === 'ghost', // Only free users can purchase more
        purchaseCost: limits.purchaseCost,
        tier: userTier,
        extraMessages: 0,
        remaining: limits.total,
        isUnlimited: userTier !== 'ghost',
        messagesPerPurchase: userTier === 'ghost' ? 300 : 0
      };
      
      userQuotas.set(user.id, quota);
    }

    // Check if quota should reset
    const now = new Date();
    const resetTime = new Date(quota.resetAt);
    
    if (now >= resetTime) {
      // Reset quota only for premium users (fair-usage tracking)
      const tierLimits = {
        ghost: { total: 0, purchaseCost: 3.99 }, // Free users pay per 300 messages
        firewall: { total: 999999, purchaseCost: 0 }, // Premium unlimited
        cult_leader: { total: 999999, purchaseCost: 0 } // Premium unlimited
      };
      
      const userTier = (user as any).tier || 'ghost';
      const limits = tierLimits[userTier as keyof typeof tierLimits] || tierLimits.ghost;
      
      if (userTier !== 'ghost') {
        // Only reset for premium users (daily fair-usage tracking)
        const newResetAt = new Date(now);
        newResetAt.setDate(newResetAt.getDate() + 1);
        newResetAt.setHours(0, 0, 0, 0);
        
        quota = {
          ...quota,
          used: 0, // Reset usage for premium users
          total: limits.total,
          resetAt: newResetAt.toISOString(),
          extraMessages: 0,
          remaining: 999999,
          isUnlimited: true
        };
        
        userQuotas.set(user.id, quota);
      }
      // Free users don't get automatic resets - they purchase messages as needed
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
