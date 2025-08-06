import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ user: null, session: null });
    }

    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        username: user.username || null
      },
      session: {
        id: session.id
      }
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ user: null, session: null });
  }
}
