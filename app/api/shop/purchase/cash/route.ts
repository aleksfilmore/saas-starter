/**
 * Shop Purchase API - Cash Transactions (DEPRECATED)
 * 
 * All purchases are now bytes-only. This endpoint returns an error.
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Since we've moved to a bytes-only system, cash purchases are no longer supported
    return NextResponse.json(
      { error: 'Cash purchases are no longer supported. All products are now available through our bytes reward system.' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Cash purchase error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Deprecated webhook handler
export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { error: 'Cash payment webhooks are no longer supported' },
    { status: 400 }
  );
}
