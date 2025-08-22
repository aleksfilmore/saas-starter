import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Since we've moved to a bytes-only system, cash payments are no longer supported
    return NextResponse.json(
      { error: 'Cash payments are no longer supported. All products are now available through our bytes reward system.' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Payment link creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Since we've moved to a bytes-only system, payment links are no longer supported
    return NextResponse.json(
      { error: 'Payment links are no longer supported. All products are now available through our bytes reward system.' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Payment link fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
