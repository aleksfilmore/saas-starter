import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { ritualLibrary } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';

// GET /api/admin/rituals - Get all rituals
export async function GET(request: NextRequest) {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.email !== 'system_admin@ctrlaltblock.com') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const rituals = await db.select().from(ritualLibrary).orderBy(ritualLibrary.created_at);
    
    return NextResponse.json({ rituals });
  } catch (error) {
    console.error('Rituals fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch rituals' }, { status: 500 });
  }
}

// POST /api/admin/rituals - Create new ritual
export async function POST(request: NextRequest) {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.email !== 'system_admin@ctrlaltblock.com') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      category,
      description,
      duration,
      difficulty,
      journal_prompt,
      lesson,
      steps,
      archetype,
      tier_requirement,
      is_premium,
      is_active,
    } = body;

    const newRitual = await db.insert(ritualLibrary).values({
      id: randomUUID(),
      title,
      category,
      description,
      duration,
      difficulty,
      journal_prompt,
      lesson,
      steps,
      archetype,
      tier_requirement,
      is_premium: is_premium || false,
      is_active: is_active !== false,
    }).returning();

    return NextResponse.json({ ritual: newRitual[0] });
  } catch (error) {
    console.error('Ritual creation error:', error);
    return NextResponse.json({ error: 'Failed to create ritual' }, { status: 500 });
  }
}
