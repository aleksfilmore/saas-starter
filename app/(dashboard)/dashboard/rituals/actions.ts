'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/drizzle';
import { dailyRituals, ritualCompletions } from '@/lib/db/schema';
import { validateRequest } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

export async function createRitual(formData: FormData) {
  const { user } = await validateRequest();
  if (!user) {
    redirect('/sign-in');
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const targetFrequency = formData.get('targetFrequency') as string || 'daily';

  if (!title || !category) {
    throw new Error('Title and category are required');
  }

  const ritualId = crypto.randomUUID();
  
  await db.insert(dailyRituals).values({
    id: ritualId,
    userId: parseInt(user.id),
    title,
    description: description || null,
    category,
    targetFrequency,
    isActive: true,
  });

  revalidatePath('/dashboard/rituals');
  redirect('/dashboard/rituals');
}

export async function completeRitual(formData: FormData) {
  const { user } = await validateRequest();
  if (!user) {
    redirect('/sign-in');
  }

  const ritualId = formData.get('ritualId') as string;
  const notes = formData.get('notes') as string;
  const mood = formData.get('mood') as string;

  if (!ritualId) {
    throw new Error('Ritual ID is required');
  }

  // Verify the ritual belongs to the user
  const ritual = await db.query.dailyRituals.findFirst({
    where: and(
      eq(dailyRituals.id, ritualId),
      eq(dailyRituals.userId, parseInt(user.id))
    ),
  });

  if (!ritual) {
    throw new Error('Ritual not found');
  }

  // Check if already completed today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const existingCompletion = await db.query.ritualCompletions.findFirst({
    where: and(
      eq(ritualCompletions.ritualId, ritualId),
      // Note: In a real implementation, you'd want proper date filtering here
    ),
  });

  // For now, we'll allow multiple completions per day
  const completionId = crypto.randomUUID();
  
  await db.insert(ritualCompletions).values({
    id: completionId,
    ritualId,
    completedAt: new Date(),
    notes: notes || null,
    mood: mood ? parseInt(mood) : null,
  });

  revalidatePath('/dashboard/rituals');
}

export async function deleteRitual(ritualId: string) {
  const { user } = await validateRequest();
  if (!user) {
    redirect('/sign-in');
  }

  // Verify the ritual belongs to the user
  const ritual = await db.query.dailyRituals.findFirst({
    where: and(
      eq(dailyRituals.id, ritualId),
      eq(dailyRituals.userId, parseInt(user.id))
    ),
  });

  if (!ritual) {
    throw new Error('Ritual not found');
  }

  // Soft delete by setting isActive to false
  await db
    .update(dailyRituals)
    .set({ isActive: false })
    .where(eq(dailyRituals.id, ritualId));

  revalidatePath('/dashboard/rituals');
}

export async function updateRitual(formData: FormData) {
  const { user } = await validateRequest();
  if (!user) {
    redirect('/sign-in');
  }

  const ritualId = formData.get('ritualId') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const targetFrequency = formData.get('targetFrequency') as string;

  if (!ritualId || !title || !category) {
    throw new Error('Ritual ID, title, and category are required');
  }

  // Verify the ritual belongs to the user
  const ritual = await db.query.dailyRituals.findFirst({
    where: and(
      eq(dailyRituals.id, ritualId),
      eq(dailyRituals.userId, parseInt(user.id))
    ),
  });

  if (!ritual) {
    throw new Error('Ritual not found');
  }

  await db
    .update(dailyRituals)
    .set({
      title,
      description: description || null,
      category,
      targetFrequency: targetFrequency || 'daily',
    })
    .where(eq(dailyRituals.id, ritualId));

  revalidatePath('/dashboard/rituals');
}
