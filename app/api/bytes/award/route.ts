import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { ByteService } from '@/lib/shop/ByteService';
import { BYTE_EARNING_ACTIVITIES } from '@/lib/shop/constants';

export async function POST(request: NextRequest) {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { activity, metadata } = await request.json();
    
    // Validate activity
    if (!activity || !(activity in BYTE_EARNING_ACTIVITIES)) {
      return NextResponse.json(
        { error: 'Invalid activity specified' },
        { status: 400 }
      );
    }
    
    // Award bytes for the activity
    const result = await ByteService.awardBytes(
      user.id,
      activity as keyof typeof BYTE_EARNING_ACTIVITIES,
      metadata
    );
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Byte award error:', error);
    return NextResponse.json(
      { error: 'Failed to award bytes' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const activity = searchParams.get('activity');
    
    if (activity && activity in BYTE_EARNING_ACTIVITIES) {
      // Check if user can earn bytes for specific activity
      const canEarn = await ByteService.canEarnBytesForActivity(
        user.id,
        activity as keyof typeof BYTE_EARNING_ACTIVITIES
      );
      
      return NextResponse.json({
        activity,
        ...canEarn
      });
    }
    
    // Get user's byte info
    const byteInfo = await ByteService.getUserByteInfo(user.id);
    
    return NextResponse.json(byteInfo);
    
  } catch (error) {
    console.error('Byte info error:', error);
    return NextResponse.json(
      { error: 'Failed to get byte information' },
      { status: 500 }
    );
  }
}
