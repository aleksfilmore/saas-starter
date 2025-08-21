/**
 * Byte Balance API
 * 
 * Returns the user's current Byte balance and earning statistics.
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { ByteService } from '@/lib/shop/ByteService';

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const byteService = new ByteService(user.id);
    
    // Get current balance
    const balance = await byteService.getUserBalance();
    
    // Get earning statistics
    const stats = await byteService.getEarningStats();
    
    return NextResponse.json({
      balance,
      todayEarned: stats.todayEarned,
      weekEarned: stats.weekEarned,
      monthEarned: stats.monthEarned,
      totalEarned: stats.totalEarned,
      streak: stats.currentStreak,
      lastActivity: stats.lastActivity
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
