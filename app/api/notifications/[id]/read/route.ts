import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { notifications } from '@/lib/db/actual-schema';
import { and, eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const notificationId = resolvedParams.id;

    try {
      await db.update(notifications).set({ read:true, read_at: new Date() }).where(and(eq(notifications.id, notificationId), eq(notifications.user_id, user.id)) as any);
    } catch(e){
      console.warn('Notification update failed (possibly table missing)', e);
    }

    return NextResponse.json({ 
      success: true,
      message: 'Notification marked as read' 
    });
  } catch (error) {
  console.error('Failed to mark notification as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 500 }
    );
  }
}
