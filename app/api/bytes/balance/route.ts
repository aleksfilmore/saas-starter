/**
 * Byte Balance API
 * 
 * Returns the user's current Byte balance and earning statistics.
 */

import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { ByteService } from '@/lib/shop/ByteService';

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const byteService = ByteService;
    
    // Get current balance
    const balance = await byteService.getUserBalance(user.id);
    
    // Get earning statistics
    const stats = await byteService.getEarningStats(user.id);
    
    return NextResponse.json({
      balance,
      todayEarned: stats.todayEarnings,
      weekEarned: stats.weeklyEarnings,
      monthEarned: stats.allTimeEarnings, // Using allTimeEarnings for monthEarned
      totalEarned: stats.allTimeEarnings,
      streak: stats.currentStreak
    });

  } catch (error) {
    console.error('❌ Error fetching byte balance:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch balance',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
