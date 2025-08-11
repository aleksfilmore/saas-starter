import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Development-only endpoint for testing subscription management
export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await request.json();
    
    switch (action) {
      case 'upgrade_to_firewall':
        await db.update(users)
          .set({
            tier: 'firewall',
            subscriptionTier: 'firewall_mode',
            updatedAt: new Date()
          })
          .where(eq(users.id, user.id));
        
        return NextResponse.json({ 
          success: true, 
          message: 'User upgraded to Firewall mode',
          tier: 'firewall'
        });
        
      case 'downgrade_to_ghost':
        await db.update(users)
          .set({
            tier: 'ghost',
            subscriptionTier: 'ghost_mode',
            updatedAt: new Date()
          })
          .where(eq(users.id, user.id));
        
        return NextResponse.json({ 
          success: true, 
          message: 'User downgraded to Ghost mode',
          tier: 'ghost'
        });
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Dev subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}
