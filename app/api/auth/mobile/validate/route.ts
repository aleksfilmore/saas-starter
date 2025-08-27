import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { user: null, session: null },
        { status: 401 }
      );
    }

    const sessionId = authHeader.substring(7);
    const result = await validateRequest();
    if (!result.session) {
      return NextResponse.json({ user: null, session: null }, { status: 401 });
    }
    return NextResponse.json({ user: result.user, session: result.session });

  } catch (error: any) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { user: null, session: null },
      { status: 500 }
    );
  }
}
