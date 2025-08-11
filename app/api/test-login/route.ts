import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Get any existing user
    const existingUsers = await db
      .select()
      .from(users)
      .limit(5);

    return NextResponse.json({
      success: true,
      users: existingUsers.map(u => ({
        id: u.id,
        email: u.email,
        tier: u.tier,
        created_at: u.created_at
      }))
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
