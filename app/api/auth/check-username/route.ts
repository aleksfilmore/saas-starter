import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/unified-schema'; // Use main schema, not minimal-schema
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    console.log('=== USERNAME CHECK API DEBUG ===');
    console.log('Received username:', username);

    if (!username || typeof username !== 'string') {
      console.log('Invalid username provided');
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    console.log('Checking database for existing username...');
    
    // Check if username already exists - only select the username column to avoid schema issues
    const existingUser = await db.select({ username: users.username }).from(users).where(eq(users.username, username)).limit(1);
    
    console.log('Database query result:', existingUser);
    console.log('Existing user count:', existingUser.length);
    
    const available = existingUser.length === 0;
    console.log('Username available:', available);

    return NextResponse.json({ available });
  } catch (error) {
    console.error('Username check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
