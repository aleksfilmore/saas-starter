import { NextRequest, NextResponse } from 'next/server';
import { seedNoContactMessages } from '@/lib/db/seed-no-contact';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const success = await seedNoContactMessages();
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'No-contact messages seeded successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to seed no-contact messages'
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
