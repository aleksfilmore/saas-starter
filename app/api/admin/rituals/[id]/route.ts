import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { ritualLibrary } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

// PUT /api/admin/rituals/[id] - Update ritual
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.email !== 'system_admin@ctrlaltblock.com') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const resolvedParams = await params;
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

    const updatedRitual = await db.update(ritualLibrary)
      .set({
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
      })
      .where(eq(ritualLibrary.id, resolvedParams.id))
      .returning();

    if (updatedRitual.length === 0) {
      return NextResponse.json({ error: 'Ritual not found' }, { status: 404 });
    }

    return NextResponse.json({ ritual: updatedRitual[0] });
  } catch (error) {
    console.error('Ritual update error:', error);
    return NextResponse.json({ error: 'Failed to update ritual' }, { status: 500 });
  }
}

// DELETE /api/admin/rituals/[id] - Delete ritual
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.email !== 'system_admin@ctrlaltblock.com') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const resolvedParams = await params;
    const deletedRitual = await db.delete(ritualLibrary)
      .where(eq(ritualLibrary.id, resolvedParams.id))
      .returning();

    if (deletedRitual.length === 0) {
      return NextResponse.json({ error: 'Ritual not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ritual deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete ritual' }, { status: 500 });
  }
}
