'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/drizzle';
import { noContactPeriods, noContactBreaches } from '@/lib/db/schema';
import { validateRequest } from '@/lib/auth';
import { parseUserId } from '@/lib/utils';
import { eq, and } from 'drizzle-orm';

export async function createNoContactPeriod(formData: FormData) {
  const { user } = await validateRequest();
  if (!user) {
    redirect('/sign-in');
  }

  const contactName = formData.get('contactName') as string;
  const targetDays = parseInt(formData.get('targetDays') as string);

  if (!contactName || !targetDays || targetDays < 1) {
    throw new Error('Invalid contact name or target days');
  }

  const periodId = crypto.randomUUID();
  
  await db.insert(noContactPeriods).values({
    id: periodId,
    userId: parseUserId(user),
    contactName,
    startDate: new Date(),
    targetDays,
    isActive: true,
  });

  revalidatePath('/dashboard/tracker');
  redirect('/dashboard/tracker');
}

export async function endNoContactPeriod(periodId: string) {
  const { user } = await validateRequest();
  if (!user) {
    redirect('/sign-in');
  }

  await db
    .update(noContactPeriods)
    .set({ isActive: false })
    .where(
      and(
        eq(noContactPeriods.id, periodId),
        eq(noContactPeriods.userId, parseUserId(user))
      )
    );

  revalidatePath('/dashboard/tracker');
}

export async function recordBreach(formData: FormData) {
  const { user } = await validateRequest();
  if (!user) {
    redirect('/sign-in');
  }

  const periodId = formData.get('periodId') as string;
  const breachType = formData.get('breachType') as string;
  const notes = formData.get('notes') as string;

  if (!periodId || !breachType) {
    throw new Error('Invalid period ID or breach type');
  }

  // Verify the period belongs to the user
  const period = await db.query.noContactPeriods.findFirst({
    where: and(
      eq(noContactPeriods.id, periodId),
      eq(noContactPeriods.userId, parseUserId(user))
    ),
  });

  if (!period) {
    throw new Error('Period not found');
  }

  const breachId = crypto.randomUUID();
  
  await db.insert(noContactBreaches).values({
    id: breachId,
    periodId,
    breachDate: new Date(),
    breachType,
    notes: notes || null,
  });

  revalidatePath('/dashboard/tracker');
}

export async function deleteBreach(breachId: string) {
  const { user } = await validateRequest();
  if (!user) {
    redirect('/sign-in');
  }

  // Verify the breach belongs to a period owned by the user
  const breach = await db.query.noContactBreaches.findFirst({
    where: eq(noContactBreaches.id, breachId),
  });

  if (!breach) {
    throw new Error('Breach not found');
  }

  const period = await db.query.noContactPeriods.findFirst({
    where: and(
      eq(noContactPeriods.id, breach.periodId),
      eq(noContactPeriods.userId, parseUserId(user))
    ),
  });

  if (!period) {
    throw new Error('Unauthorized');
  }

  await db.delete(noContactBreaches).where(eq(noContactBreaches.id, breachId));

  revalidatePath('/dashboard/tracker');
}
