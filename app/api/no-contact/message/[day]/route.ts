import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ day: string }> }
) {
  try {
    const { day } = await params;
    const dayNumber = parseInt(day);
    
    if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 90) {
      return NextResponse.json({
        success: false,
        error: 'Invalid day number. Must be between 1 and 90.'
      }, { status: 400 });
    }

    const result = await db.execute(sql`
      SELECT day, body, is_milestone, bytes_reward
      FROM no_contact_messages 
      WHERE day = ${dayNumber}
      LIMIT 1
    `);
    
    if (result.length > 0) {
      return NextResponse.json({
        success: true,
        message: result[0]
      });
    } else {
      // Fallback message if not found
      return NextResponse.json({
        success: true,
        message: {
          day: dayNumber,
          body: `Day ${dayNumber}: You're doing amazing—keep going!`,
          is_milestone: false,
          bytes_reward: 10
        }
      });
    }
  } catch (error) {
    console.error('Error fetching no-contact message:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch message'
    }, { status: 500 });
  }
}
