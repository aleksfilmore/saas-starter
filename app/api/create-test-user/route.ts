import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, sessions } from '@/lib/db/unified-schema';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    console.log('🚀 Creating test user...');
    
    // Create test user
    const testUser = {
      id: nanoid(),
      email: 'test@example.com',
      hashedPassword: await bcrypt.hash('password123', 12), // Simple password for testing
      tier: 'freemium',
      archetype: 'Explorer',
      xp: 250,
      bytes: 150,
      level: 3,
      ritual_streak: 5,
      no_contact_streak: 12,
      is_verified: true,
      subscription_status: 'free',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    // Insert test user
    await db.insert(users).values(testUser);
    
    // Create session for automatic login
    const sessionId = nanoid();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
    
    await db.insert(sessions).values({
      id: sessionId,
      userId: testUser.id,
      expiresAt
    });
    
    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/'
    });
    
    console.log('✅ Test user created and logged in!');
    
    return NextResponse.json({
      success: true,
      message: 'Test user created and logged in!',
      user: {
        id: testUser.id,
        email: testUser.email,
        tier: testUser.tier,
        level: testUser.level
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { error: 'Failed to create test user' },
      { status: 500 }
    );
  }
}
