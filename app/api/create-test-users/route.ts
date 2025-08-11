import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';
import { hashPassword } from '@/lib/crypto/password';

export const runtime = 'nodejs';

export async function POST() {
  try {
    // Test password (same for both users for easy testing)
    const testPassword = 'TestPassword123!';
    const hashedPassword = await hashPassword(testPassword);
    
    console.log('🔧 Creating test users...');
    
    // Create Ghost (free) user
    const ghostUser = await db.execute(sql`
      INSERT INTO users (
        email, 
        password_hash, 
        username, 
        tier, 
        subscription_tier, 
        ritual_tier, 
        subscription_status,
        onboarding_completed,
        bytes,
        xp,
        level
      ) VALUES (
        'ghost@test.com',
        ${hashedPassword},
        'Ghost User',
        'freemium',
        'ghost_mode',
        'ghost',
        'free',
        true,
        100,
        0,
        1
      )
      ON CONFLICT (email) 
      DO UPDATE SET 
        tier = 'freemium',
        subscription_tier = 'ghost_mode',
        ritual_tier = 'ghost',
        subscription_status = 'free',
        updated_at = NOW()
      RETURNING id, email, tier, subscription_tier, ritual_tier
    `);
    
    // Create Firewall (premium) user
    const firewallUser = await db.execute(sql`
      INSERT INTO users (
        email, 
        password_hash, 
        username, 
        tier, 
        subscription_tier, 
        ritual_tier, 
        subscription_status,
        onboarding_completed,
        bytes,
        xp,
        level
      ) VALUES (
        'firewall@test.com',
        ${hashedPassword},
        'Firewall User',
        'firewall',
        'premium',
        'firewall',
        'premium',
        true,
        500,
        150,
        3
      )
      ON CONFLICT (email) 
      DO UPDATE SET 
        tier = 'firewall',
        subscription_tier = 'premium',
        ritual_tier = 'firewall',
        subscription_status = 'premium',
        updated_at = NOW()
      RETURNING id, email, tier, subscription_tier, ritual_tier
    `);
    
    console.log('✅ Test users created successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Test users created successfully',
      users: {
        ghost: {
          email: 'ghost@test.com',
          password: testPassword,
          tier: 'ghost',
          details: ghostUser[0]
        },
        firewall: {
          email: 'firewall@test.com', 
          password: testPassword,
          tier: 'firewall',
          details: firewallUser[0]
        }
      },
      loginInstructions: {
        ghost: {
          email: 'ghost@test.com',
          password: testPassword,
          description: 'Free tier user with basic features'
        },
        firewall: {
          email: 'firewall@test.com',
          password: testPassword,
          description: 'Premium tier user with full features'
        }
      }
    });

  } catch (error) {
    console.error('❌ Error creating test users:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create test users', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get test users info
    const testUsers = await db.execute(sql`
      SELECT 
        id, 
        email, 
        username, 
        tier, 
        subscription_tier, 
        ritual_tier, 
        subscription_status,
        created_at
      FROM users 
      WHERE email IN ('ghost@test.com', 'firewall@test.com')
      ORDER BY email
    `);
    
    return NextResponse.json({
      success: true,
      testUsers,
      loginCredentials: {
        ghost: {
          email: 'ghost@test.com',
          password: 'TestPassword123!',
          description: 'Free tier user with basic features'
        },
        firewall: {
          email: 'firewall@test.com',
          password: 'TestPassword123!',
          description: 'Premium tier user with full features'
        }
      }
    });

  } catch (error) {
    console.error('❌ Error getting test users:', error);
    return NextResponse.json(
      { error: 'Failed to get test users', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
