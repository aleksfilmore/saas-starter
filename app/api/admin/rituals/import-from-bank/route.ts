import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { ritualLibrary } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { FREE_RITUALS, PREMIUM_RITUALS, ALL_RITUALS } from '@/lib/ritual-bank';
import { randomUUID } from 'crypto';

const ADMIN_EMAIL = 'system_admin@ctrlaltblock.com';

export async function POST() {
  try {
    const { user } = await validateRequest();
    
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    if (!ALL_RITUALS || ALL_RITUALS.length === 0) {
      return NextResponse.json({ error: 'No rituals found in ritual bank' }, { status: 400 });
    }

    let importedCount = 0;
    let skippedCount = 0;
    let freeImported = 0;
    let premiumImported = 0;

    for (const ritual of ALL_RITUALS) {
      try {
        // Check if ritual already exists by title or id
        const existing = await db
          .select()
          .from(ritualLibrary)
          .where(eq(ritualLibrary.title, ritual.title))
          .limit(1);

        if (existing.length === 0) {
          // Import the ritual with proper validation
          await db.insert(ritualLibrary).values({
            id: randomUUID(),
            title: ritual.title,
            description: ritual.description,
            duration: ritual.duration,
            category: ritual.category,
            difficulty: ritual.difficulty,
            steps: [ritual.description], // Convert description to steps array
            is_premium: ritual.isPremium || false,
            is_active: true,
            created_at: new Date()
          });
          importedCount++;
          
          // Track free vs premium
          if (ritual.isPremium) {
            premiumImported++;
          } else {
            freeImported++;
          }
        } else {
          skippedCount++;
        }
      } catch (ritualError) {
        console.error(`Error importing ritual ${ritual.title}:`, ritualError);
        skippedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      imported: importedCount,
      skipped: skippedCount,
      total: ALL_RITUALS.length,
      breakdown: {
        free: freeImported,
        premium: premiumImported,
        totalFreeRituals: FREE_RITUALS.length,
        totalPremiumRituals: PREMIUM_RITUALS.length
      },
      message: `Successfully imported ${importedCount} rituals (${freeImported} free, ${premiumImported} premium), skipped ${skippedCount} existing rituals`
    });

  } catch (error) {
    console.error('Error importing rituals from bank:', error);
    return NextResponse.json(
      { 
        error: 'Failed to import rituals from bank',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
