// Debug API to create a test user and check database state
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== Create Test User API Called ===');
    
    const { db } = await import('@/lib/db/drizzle');
    const { users } = await import('@/lib/db/schema');
    const bcrypt = await import('bcryptjs');
    
    // Check if any users exist
    const existingUsers = await db.select({
      id: users.id,
      email: users.email
    }).from(users).limit(5);
    
    console.log('Existing users:', existingUsers);
    
    // Create a test user if none exist
    if (existingUsers.length === 0) {
      console.log('No users found, creating test user...');
      
      const testEmail = 'test@example.com';
      const testPassword = 'password123';
      const hashedPassword = await bcrypt.hash(testPassword, 12);
      
      // Generate a simple ID
      const userId = 'user_' + Date.now().toString(36);
      
      await db.insert(users).values({
        id: userId,
        email: testEmail,
        hashedPassword: hashedPassword
      });
      
      console.log('✅ Test user created:', { id: userId, email: testEmail });
      
      return NextResponse.json({
        status: 'success',
        message: 'Test user created',
        user: {
          email: testEmail,
          password: testPassword
        },
        existingUsers: existingUsers.length
      });
      
    } else {
      console.log('Users already exist');
      return NextResponse.json({
        status: 'success',
        message: 'Users already exist',
        existingUsers: existingUsers.map(u => ({ id: u.id, email: u.email })),
        testCredentials: {
          email: 'test@example.com',
          password: 'password123'
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
