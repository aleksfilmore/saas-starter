'use server';

import { nanoid } from 'nanoid';

import { eq, and, gte, lt } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { userDailyPrescriptions } from '@/lib/db/schema';
import { validateRequest } from '@/lib/auth';
import { getRandomRitual, getRitualByKey, PRESCRIBED_RITUALS } from '@/lib/prescribed-rituals';
import { revalidatePath } from 'next/cache';

function getMoodValue(mood: 'terrible' | 'rough' | 'okay' | 'good' | 'amazing'): number {
  const moodMap = {
    terrible: 1,
    rough: 2,
    okay: 3,
    good: 4,
    amazing: 5,
  };
  return moodMap[mood];
}

export async function assignTodaysPrescribedRitual() {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error('Unauthorized');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Check if user already has a ritual for today
  const existingPrescription = await db.query.userDailyPrescriptions.findFirst({
    where: and(
      eq(userDailyPrescriptions.userId, parseInt(user.id)),
      gte(userDailyPrescriptions.prescribedDate, today),
      lt(userDailyPrescriptions.prescribedDate, tomorrow)
    ),
  });

  if (existingPrescription) {
    return { 
      success: true, 
      ritual: getRitualByKey(existingPrescription.ritualKey),
      prescription: existingPrescription 
    };
  }

  // Get user's recent rituals to avoid immediate repeats
  const recentDate = new Date();
  recentDate.setDate(recentDate.getDate() - 7); // Last 7 days

  const recentPrescriptions = await db.query.userDailyPrescriptions.findMany({
    where: and(
      eq(userDailyPrescriptions.userId, parseInt(user.id)),
      gte(userDailyPrescriptions.prescribedDate, recentDate)
    ),
  });

  const recentRitualKeys = recentPrescriptions.map(p => p.ritualKey);
  
  // Get a random ritual excluding recent ones
  const selectedRitual = getRandomRitual(recentRitualKeys);

  // Create new prescription
  const [newPrescription] = await db.insert(userDailyPrescriptions).values({
    id: nanoid(),
    userId: parseInt(user.id),
    prescribedDate: today,
    ritualKey: selectedRitual.key,
    shufflesUsed: 0,
    isCompleted: false,
  }).returning();

  revalidatePath('/dashboard/rituals');
  
  return { 
    success: true, 
    ritual: selectedRitual,
    prescription: newPrescription 
  };
}

export async function shufflePrescribedRitual() {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error('Unauthorized');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get today's prescription
  const todaysPrescription = await db.query.userDailyPrescriptions.findFirst({
    where: and(
      eq(userDailyPrescriptions.userId, parseInt(user.id)),
      gte(userDailyPrescriptions.prescribedDate, today),
      lt(userDailyPrescriptions.prescribedDate, tomorrow)
    ),
  });

  if (!todaysPrescription) {
    throw new Error('No ritual assigned for today');
  }

  if (todaysPrescription.shufflesUsed >= 2) {
    throw new Error('Maximum shuffles reached for today');
  }

  if (todaysPrescription.isCompleted) {
    throw new Error('Cannot shuffle a completed ritual');
  }

  // Get excluded rituals (recent + current)
  const recentDate = new Date();
  recentDate.setDate(recentDate.getDate() - 7);

  const recentPrescriptions = await db.query.userDailyPrescriptions.findMany({
    where: and(
      eq(userDailyPrescriptions.userId, parseInt(user.id)),
      gte(userDailyPrescriptions.prescribedDate, recentDate)
    ),
  });

  const excludeKeys = recentPrescriptions.map(p => p.ritualKey);
  
  // Get new ritual
  const newRitual = getRandomRitual(excludeKeys);

  // Update prescription
  const [updatedPrescription] = await db.update(userDailyPrescriptions)
    .set({
      ritualKey: newRitual.key,
      shufflesUsed: todaysPrescription.shufflesUsed + 1,
    })
    .where(eq(userDailyPrescriptions.id, todaysPrescription.id))
    .returning();

  revalidatePath('/dashboard/rituals');
  
  return { 
    success: true, 
    ritual: newRitual,
    prescription: updatedPrescription,
    shufflesRemaining: 2 - updatedPrescription.shufflesUsed 
  };
}

export async function completePrescribedRitual(data: {
  mood?: 'terrible' | 'rough' | 'okay' | 'good' | 'amazing';
  notes?: string;
}) {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error('Unauthorized');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get today's prescription
  const todaysPrescription = await db.query.userDailyPrescriptions.findFirst({
    where: and(
      eq(userDailyPrescriptions.userId, parseInt(user.id)),
      gte(userDailyPrescriptions.prescribedDate, today),
      lt(userDailyPrescriptions.prescribedDate, tomorrow)
    ),
  });

  if (!todaysPrescription) {
    throw new Error('No ritual assigned for today');
  }

  if (todaysPrescription.isCompleted) {
    throw new Error('Ritual already completed');
  }

  // Update prescription with completion
  const [updatedPrescription] = await db.update(userDailyPrescriptions)
    .set({
      isCompleted: true,
      completedAt: new Date(),
      completionMood: data.mood ? getMoodValue(data.mood) : null,
      completionNotes: data.notes,
    })
    .where(eq(userDailyPrescriptions.id, todaysPrescription.id))
    .returning();

  revalidatePath('/dashboard/rituals');
  
  return { 
    success: true, 
    prescription: updatedPrescription 
  };
}

export async function undoRitualCompletion() {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error('Unauthorized');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get today's prescription
  const todaysPrescription = await db.query.userDailyPrescriptions.findFirst({
    where: and(
      eq(userDailyPrescriptions.userId, parseInt(user.id)),
      gte(userDailyPrescriptions.prescribedDate, today),
      lt(userDailyPrescriptions.prescribedDate, tomorrow)
    ),
  });

  if (!todaysPrescription) {
    throw new Error('No ritual assigned for today');
  }

  if (!todaysPrescription.isCompleted) {
    throw new Error('Ritual is not completed');
  }

  // Update prescription to undo completion
  const [updatedPrescription] = await db.update(userDailyPrescriptions)
    .set({
      isCompleted: false,
      completedAt: null,
      completionMood: null,
      completionNotes: null,
    })
    .where(eq(userDailyPrescriptions.id, todaysPrescription.id))
    .returning();

  revalidatePath('/dashboard/rituals');
  
  return { 
    success: true, 
    prescription: updatedPrescription 
  };
}
