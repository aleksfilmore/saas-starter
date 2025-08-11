import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function POST() {
  try {
    // Create the no_contact_messages table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS no_contact_messages (
        day INTEGER PRIMARY KEY CHECK (day >= 1 AND day <= 90),
        body TEXT NOT NULL,
        is_milestone BOOLEAN DEFAULT false,
        bytes_reward INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `);
    
    // Insert a few sample messages for testing
    const sampleMessages = [
      {
        day: 1,
        body: "System booted. You've survived 24 hrs without doom-scrolling their IG stories. Celebrate with water—and absolutely no \"just checking in\" texts.",
        is_milestone: false,
        bytes_reward: 10
      },
      {
        day: 5,
        body: "Delete one blurry picture of them today. Pixel purge.",
        is_milestone: false,
        bytes_reward: 15
      },
      {
        day: 7,
        body: "🛡️ 7-DAY STREAK UNLOCKED! One whole week of radio silence. Your ex just lost premium access to your chaos.",
        is_milestone: true,
        bytes_reward: 50
      }
    ];
    
    for (const message of sampleMessages) {
      await db.execute(sql`
        INSERT INTO no_contact_messages (day, body, is_milestone, bytes_reward)
        VALUES (${message.day}, ${message.body}, ${message.is_milestone}, ${message.bytes_reward})
        ON CONFLICT (day) DO UPDATE SET
          body = EXCLUDED.body,
          is_milestone = EXCLUDED.is_milestone,
          bytes_reward = EXCLUDED.bytes_reward
      `);
    }
    
    return NextResponse.json({
      success: true,
      message: 'No-contact messages table created and seeded'
    });
  } catch (error) {
    console.error('Error setting up no-contact messages:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
