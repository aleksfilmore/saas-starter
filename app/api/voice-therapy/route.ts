/**
 * Voice Therapy API Routes
 * Handles voice session management, minute tracking, and real-time audio processing
 */

import { NextResponse } from 'next/server';
import { voiceTherapyService } from '@/lib/voice/voice-therapy-service';

// Check eligibility for voice therapy
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // Check session (simplified for now)
    const session = global.localSessions?.get(token);
    if (!session || Date.now() > session.expiresAt) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    
    const userId = session.userId;
    
    // Check eligibility
    const eligibility = await voiceTherapyService.canStartVoiceSession(userId);
    
    return NextResponse.json({
      success: true,
      data: eligibility
    });
    
  } catch (error) {
    console.error('Error checking voice therapy eligibility:', error);
    return NextResponse.json({ 
      error: 'Failed to check eligibility' 
    }, { status: 500 });
  }
}

// Start voice session
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { action, sessionId, durationMinutes, transcript, minutesToPurchase, paymentMethodId } = await request.json();
    
    // Check session
    const session = global.localSessions?.get(token);
    if (!session || Date.now() > session.expiresAt) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    
    const userId = session.userId;
    
    switch (action) {
      case 'start': {
        const result = await voiceTherapyService.startVoiceSession(userId);
        return NextResponse.json({
          success: result.success,
          data: result.success ? { sessionId: result.sessionId } : undefined,
          error: result.error
        });
      }
      
      case 'end': {
        if (!sessionId || typeof durationMinutes !== 'number') {
          return NextResponse.json({ 
            error: 'Session ID and duration required' 
          }, { status: 400 });
        }
        
        const result = await voiceTherapyService.endVoiceSession(
          userId, 
          sessionId, 
          durationMinutes, 
          transcript
        );
        
        return NextResponse.json({
          success: result.success,
          data: result.success ? {
            cost: result.cost,
            remainingMinutes: result.remainingMinutes
          } : undefined,
          error: result.error
        });
      }
      
      case 'purchase': {
        if (!minutesToPurchase || !paymentMethodId) {
          return NextResponse.json({ 
            error: 'Minutes to purchase and payment method required' 
          }, { status: 400 });
        }
        
        const result = await voiceTherapyService.purchaseVoiceMinutes(
          userId,
          minutesToPurchase,
          paymentMethodId
        );
        
        return NextResponse.json({
          success: result.success,
          data: result.success ? {
            cost: result.cost,
            newTotalMinutes: result.newTotalMinutes
          } : undefined,
          error: result.error
        });
      }
      
      default:
        return NextResponse.json({ 
          error: 'Invalid action' 
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Error in voice therapy API:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
