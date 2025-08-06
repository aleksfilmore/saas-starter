import { NextResponse } from 'next/server';

// Global storage reference
declare global {
  var localUsers: Map<string, any>;
  var localSessions: Map<string, any>;
}

// In-memory storage for demo purposes
const userQuotas = new Map();

export async function POST(request: Request) {
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

    const { packageType } = await request.json();

    // Define purchase packages
    const packages = {
      extra_20: {
        messages: 20,
        cost: 50, // Bytes cost
        name: '20 Extra Messages'
      },
      extra_50: {
        messages: 50,
        cost: 100,
        name: '50 Extra Messages'
      },
      voice_3min: {
        messages: 0,
        cost: 300,
        name: '3-minute Voice Preview',
        isVoice: true
      }
    };

    const package = packages[packageType as keyof typeof packages];
    if (!package) {
      return NextResponse.json({ error: 'Invalid package type' }, { status: 400 });
    }

    // Check if user has enough Bytes
    if ((user.bytes || 0) < package.cost) {
      return NextResponse.json({ 
        error: 'Insufficient Bytes',
        required: package.cost,
        current: user.bytes || 0
      }, { status: 400 });
    }

    // Deduct Bytes
    user.bytes = (user.bytes || 0) - package.cost;

    if (package.isVoice) {
      // Handle voice package purchase
      // This would integrate with voice API in a real implementation
      return NextResponse.json({
        success: true,
        message: 'Voice preview purchased successfully',
        voiceSessionId: crypto.randomUUID(),
        duration: 180 // 3 minutes in seconds
      });
    } else {
      // Handle message package purchase
      let quota = userQuotas.get(user.id);
      
      if (!quota) {
        // Initialize quota if doesn't exist
        const tierLimits = {
          freemium: { total: 5, purchaseCost: 25 },
          paid_beginner: { total: 200, purchaseCost: 15 },
          paid_advanced: { total: 999999, purchaseCost: 10 }
        };
        
        const limits = tierLimits[user.tier as keyof typeof tierLimits] || tierLimits.freemium;
        
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
      }

      // Add extra messages to quota
      quota.extraMessages = (quota.extraMessages || 0) + package.messages;
      quota.total = quota.total + package.messages;
      
      userQuotas.set(user.id, quota);

      return NextResponse.json({
        success: true,
        message: `Successfully purchased ${package.name}`,
        messagesAdded: package.messages,
        newQuota: quota
      });
    }

  } catch (error) {
    console.error('Purchase API error:', error);
    return NextResponse.json(
      { error: 'Purchase failed' },
      { status: 500 }
    );
  }
}
