import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/minimal-schema';
import { count, gte, and, eq } from 'drizzle-orm';

const ADMIN_EMAIL = 'system_admin@ctrlaltblock.com';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const { user } = await validateRequest();
    
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Get total users count
    const totalUsersResult = await db
      .select({ count: count() })
      .from(users);
    
    const totalUsers = totalUsersResult[0]?.count || 0;

    // Get active users (logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsersResult = await db
      .select({ count: count() })
      .from(users)
      .where(
        gte(users.lastActiveAt, thirtyDaysAgo)
      );
    
    const activeUsers = activeUsersResult[0]?.count || 0;

    // Get premium users count
    const premiumUsersResult = await db
      .select({ count: count() })
      .from(users)
      .where(
        eq(users.subscriptionTier, 'premium')
      );
    
    const premiumUsers = premiumUsersResult[0]?.count || 0;

    // Get verified users count
    const verifiedUsersResult = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.isVerified, true));
    
    const verifiedUsers = verifiedUsersResult[0]?.count || 0;

    return NextResponse.json({
      totalUsers,
      activeUsers,
      premiumUsers,
      verifiedUsers,
      metrics: {
        activationRate: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
        premiumConversionRate: totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 100) : 0,
        verificationRate: totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0
      }
    });

  } catch (error) {
    console.error('Admin user stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user statistics' },
      { status: 500 }
    );
  }
}
