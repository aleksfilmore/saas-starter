import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('🔍 Checking user table schema and subscription tiers...');
    
    // Get table schema for users
    const schemaResult = await db.execute(sql`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);

    // Get sample user data to see current tier information
    const sampleUsers = await db.execute(sql`
      SELECT 
        id,
        email,
        subscription_tier,
        tier,
        created_at
      FROM users 
      LIMIT 5
    `);

    // Check if we have any premium users
    const premiumCount = await db.execute(sql`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN subscription_tier = 'premium' THEN 1 END) as premium_subscription,
        COUNT(CASE WHEN tier = 'premium' THEN 1 END) as premium_tier,
        COUNT(CASE WHEN tier = 'firewall' THEN 1 END) as firewall_tier
      FROM users
    `);

    return NextResponse.json({
      success: true,
      schema: schemaResult,
      sample_users: sampleUsers,
      tier_stats: premiumCount[0]
    });

  } catch (error) {
    console.error('❌ User schema check error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check user schema', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
