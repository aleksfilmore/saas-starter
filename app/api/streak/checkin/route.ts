/**
 * No-Contact Streak Check-in API
 * CTRL+ALT+BLOCK™ Specification Section 7 & 12
 */

import { NextRequest, NextResponse } from 'next/server';
import { createNoContactStateMachine } from '@/lib/no-contact/state-machine';

export async function POST(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email');
    
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email required' },
        { status: 401 }
      );
    }

    // In production, fetch user data from database
    // For now, using mock data
    const userData = {
      streak_no_contact: 5,
      streak_last_checkin_at: '2025-08-08T10:00:00Z',
      tier: 'firewall' as const,
      shield_expires_at: undefined,
      next_auto_shield: undefined
    };

    const stateMachine = createNoContactStateMachine(userData);
    
    // Process any pending time-based transitions
    await stateMachine.processTimeTransitions();
    
    // Attempt daily check-in
    const transition = await stateMachine.dailyCheckin();
    const newStatus = stateMachine.getStatus();
    
    // Log streak check-in event (per spec section 16)
    console.log('Streak checked in:', {
      event: 'streak_checked_in',
      streak: newStatus.streak_count,
      tier: newStatus.tier,
      shield_duration: newStatus.shield_duration_hours,
      timestamp: new Date().toISOString()
    });

    // In production, save updated status to database:
    // - streak_no_contact = newStatus.streak_count
    // - streak_last_checkin_at = newStatus.last_checkin_at
    // - shield_expires_at = newStatus.shield_expires_at
    // - next_auto_shield = newStatus.next_auto_shield

    return NextResponse.json({
      success: true,
      streak: newStatus.streak_count,
      shield: {
        active: newStatus.state === 'SHIELDED',
        duration_hours: newStatus.shield_duration_hours,
        expires_at: newStatus.shield_expires_at,
        time_remaining: stateMachine.getShieldTimeRemaining()
      },
      state: newStatus.state,
      tier: newStatus.tier,
      risk_level: stateMachine.getStreakRiskLevel(),
      transition: {
        from: transition.from,
        to: transition.to,
        trigger: transition.trigger
      }
    });

  } catch (error) {
    console.error('Streak check-in error:', error);
    
    // Handle specific state machine errors
    if (error instanceof Error && error.message.includes('Cannot check in')) {
      return NextResponse.json(
        { 
          error: 'Check-in not allowed at this time',
          details: error.message
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email');
    
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email required' },
        { status: 401 }
      );
    }

    // In production, fetch user data from database
    const userData = {
      streak_no_contact: 5,
      streak_last_checkin_at: '2025-08-08T10:00:00Z',
      tier: 'firewall' as const,
      shield_expires_at: new Date(Date.now() + 36 * 60 * 60 * 1000), // 36 hours from now
      next_auto_shield: undefined
    };

    const stateMachine = createNoContactStateMachine(userData);
    
    // Process any pending transitions
    const timeTransition = await stateMachine.processTimeTransitions();
    const autoShieldTransition = await stateMachine.processWeeklyAutoShield();
    
    const status = stateMachine.getStatus();

    return NextResponse.json({
      streak: status.streak_count,
      state: status.state,
      shield: {
        active: status.state === 'SHIELDED',
        duration_hours: status.shield_duration_hours,
        expires_at: status.shield_expires_at,
        time_remaining: stateMachine.getShieldTimeRemaining()
      },
      tier: status.tier,
      risk_level: stateMachine.getStreakRiskLevel(),
      last_checkin: status.last_checkin_at,
      next_auto_shield: status.next_auto_shield,
      can_checkin_today: status.state === 'IDLE' || status.state === 'EXPIRED',
      transitions: {
        time_transition: timeTransition,
        auto_shield_transition: autoShieldTransition
      }
    });

  } catch (error) {
    console.error('Streak status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
