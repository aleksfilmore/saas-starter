import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subscriptionStatus } = body; // 'free' or 'premium'

    console.log(`🔧 Updating user ${user.id} tier to: ${subscriptionStatus}`);

    // Update user tier based on subscription status
    if (subscriptionStatus === 'premium') {
      await db.execute(sql`
        UPDATE users 
        SET 
          tier = 'firewall',
          ritual_tier = 'firewall',
          subscription_tier = 'premium',
          subscription_status = 'premium',
          updated_at = NOW()
        WHERE id = ${user.id}
      `);
    } else {
      await db.execute(sql`
        UPDATE users 
        SET 
          tier = 'freemium',
          ritual_tier = 'ghost',
          subscription_tier = 'ghost_mode',
          subscription_status = 'free',
          updated_at = NOW()
        WHERE id = ${user.id}
      `);
    }

    // Get updated user info
    const updatedUser = await db.execute(sql`
      SELECT 
        id, 
        email, 
        tier, 
        ritual_tier, 
        subscription_tier, 
        subscription_status
      FROM users 
      WHERE id = ${user.id}
    `);

    return NextResponse.json({
      success: true,
      message: `User tier updated to ${subscriptionStatus}`,
      user: updatedUser[0]
    });

  } catch (error) {
    console.error('❌ Error updating user tier:', error);
    return NextResponse.json(
      { error: 'Failed to update user tier', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user tier information
    const userInfo = await db.execute(sql`
      SELECT 
        id, 
        email, 
        tier, 
        ritual_tier, 
        subscription_tier, 
        subscription_status
      FROM users 
      WHERE id = ${user.id}
    `);

    return NextResponse.json({
      success: true,
      user: userInfo[0]
    });

  } catch (error) {
    console.error('❌ Error getting user tier:', error);
    return NextResponse.json(
      { error: 'Failed to get user tier', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
