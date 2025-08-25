import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { ritualLibrary } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

// PATCH /api/admin/rituals/[id]/toggle - Toggle ritual active status
export async function PATCH(
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
    const { is_active } = body;

    const updatedRitual = await db.update(ritualLibrary)
      .set({ is_active })
      .where(eq(ritualLibrary.id, resolvedParams.id))
      .returning();

    if (updatedRitual.length === 0) {
      return NextResponse.json({ error: 'Ritual not found' }, { status: 404 });
    }

    return NextResponse.json({ ritual: updatedRitual[0] });
  } catch (error) {
    console.error('Ritual toggle error:', error);
    return NextResponse.json({ error: 'Failed to toggle ritual status' }, { status: 500 });
  }
}
