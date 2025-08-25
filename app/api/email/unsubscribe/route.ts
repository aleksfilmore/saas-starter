import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');
    
    if (!token) {
      return NextResponse.json({ error: 'Missing unsubscribe token' }, { status: 400 });
    }

    // Decode the token
    let payload;
    try {
      payload = JSON.parse(Buffer.from(token, 'base64').toString());
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    // Check if token is expired
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 });
    }

    // Verify token type
    if (payload.type !== 'unsubscribe') {
      return NextResponse.json({ error: 'Invalid token type' }, { status: 400 });
    }

    // Update user's email preferences
    await db
      .update(users)
      .set({ emailNotifications: false })
      .where(eq(users.id, payload.userId));

    // Redirect to a confirmation page
    return NextResponse.redirect(new URL('/unsubscribe/success', request.url));

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ error: 'Missing unsubscribe token' }, { status: 400 });
    }

    // Decode the token
    let payload;
    try {
      payload = JSON.parse(Buffer.from(token, 'base64').toString());
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    // Check if token is expired
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 });
    }

    // Update user's email preferences
    await db
      .update(users)
      .set({ emailNotifications: false })
      .where(eq(users.id, payload.userId));

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from daily email reminders'
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
