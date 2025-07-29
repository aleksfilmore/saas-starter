// File: lib/db/queries.ts

import { eq, and, desc, gte, lt } from 'drizzle-orm';
import { db } from './drizzle';
import { users, noContactPeriods, noContactBreaches, dailyRituals, ritualCompletions, userDailyPrescriptions } from './schema';
import { validateRequest } from '@/lib/auth';

export async function getUser() {
  const { user } = await validateRequest();
  if (!user) {
    return null;
  }

  const userFromDb = await db.query.users.findFirst({
    where: eq(users.id, parseInt(user.id)),
  });

  if (!userFromDb) {
    return null;
  }

  // This is the new, more explicit fix.
  // We are manually constructing a new plain object, property by property.
  // This is the most reliable way to strip all complex prototypes and ensure
  // the object is "plain" enough to be passed from Server to Client Components,
  // which will resolve the error.
  const plainUser = {
    id: userFromDb.id.toString(),
    email: userFromDb.email,
    // We explicitly exclude the hashedPassword here.
  };

  return plainUser;
}

// No Contact Tracker Queries
export async function getUserNoContactPeriods() {
  const { user } = await validateRequest();
  if (!user) {
    return [];
  }

  const periods = await db.query.noContactPeriods.findMany({
    where: eq(noContactPeriods.userId, parseInt(user.id)),
    orderBy: [desc(noContactPeriods.createdAt)],
  });

  return periods.map(period => ({
    id: period.id,
    contactName: period.contactName,
    startDate: period.startDate,
    targetDays: period.targetDays,
    isActive: period.isActive,
    createdAt: period.createdAt,
  }));
}

export async function getNoContactPeriodById(periodId: string) {
  const { user } = await validateRequest();
  if (!user) {
    return null;
  }

  const period = await db.query.noContactPeriods.findFirst({
    where: and(
      eq(noContactPeriods.id, periodId),
      eq(noContactPeriods.userId, parseInt(user.id))
    ),
  });

  if (!period) {
    return null;
  }

  return {
    id: period.id,
    contactName: period.contactName,
    startDate: period.startDate,
    targetDays: period.targetDays,
    isActive: period.isActive,
    createdAt: period.createdAt,
  };
}

export async function getNoContactBreaches(periodId: string) {
  const { user } = await validateRequest();
  if (!user) {
    return [];
  }

  // Verify the period belongs to the user
  const period = await getNoContactPeriodById(periodId);
  if (!period) {
    return [];
  }

  const breaches = await db.query.noContactBreaches.findMany({
    where: eq(noContactBreaches.periodId, periodId),
    orderBy: [desc(noContactBreaches.breachDate)],
  });

  return breaches.map(breach => ({
    id: breach.id,
    breachDate: breach.breachDate,
    breachType: breach.breachType,
    notes: breach.notes,
    createdAt: breach.createdAt,
  }));
}

// Daily Rituals Queries
export async function getUserRituals() {
  const { user } = await validateRequest();
  if (!user) {
    return [];
  }

  const rituals = await db.query.dailyRituals.findMany({
    where: and(
      eq(dailyRituals.userId, parseInt(user.id)),
      eq(dailyRituals.isActive, true)
    ),
    orderBy: [desc(dailyRituals.createdAt)],
  });

  return rituals.map(ritual => ({
    id: ritual.id,
    title: ritual.title,
    description: ritual.description,
    category: ritual.category,
    targetFrequency: ritual.targetFrequency,
    isActive: ritual.isActive,
    createdAt: ritual.createdAt,
  }));
}

export async function getRitualCompletions(ritualId: string, days: number = 7) {
  const { user } = await validateRequest();
  if (!user) {
    return [];
  }

  // Verify the ritual belongs to the user
  const ritual = await db.query.dailyRituals.findFirst({
    where: and(
      eq(dailyRituals.id, ritualId),
      eq(dailyRituals.userId, parseInt(user.id))
    ),
  });

  if (!ritual) {
    return [];
  }

  const completions = await db.query.ritualCompletions.findMany({
    where: eq(ritualCompletions.ritualId, ritualId),
    orderBy: [desc(ritualCompletions.completedAt)],
  });

  return completions.map(completion => ({
    id: completion.id,
    completedAt: completion.completedAt,
    notes: completion.notes,
    mood: completion.mood,
    createdAt: completion.createdAt,
  }));
}

export async function getTodaysRitualCompletions() {
  const { user } = await validateRequest();
  if (!user) {
    return [];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get all user's rituals with today's completions
  const userRituals = await getUserRituals();
  
  const completionsPromises = userRituals.map(async (ritual) => {
    const completions = await db.query.ritualCompletions.findMany({
      where: and(
        eq(ritualCompletions.ritualId, ritual.id),
        // Note: This would need proper date filtering in a real implementation
      ),
    });
    
    const todaysCompletion = completions.find(c => {
      const completionDate = new Date(c.completedAt);
      return completionDate >= today && completionDate < tomorrow;
    });

    return {
      ritual,
      completed: !!todaysCompletion,
      completion: todaysCompletion || null,
    };
  });

  return Promise.all(completionsPromises);
}

// Prescribed Rituals Queries
export async function getTodaysPrescribedRitual() {
  const { user } = await validateRequest();
  if (!user) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaysPrescription = await db.query.userDailyPrescriptions.findFirst({
    where: and(
      eq(userDailyPrescriptions.userId, parseInt(user.id)),
      gte(userDailyPrescriptions.prescribedDate, today),
      lt(userDailyPrescriptions.prescribedDate, tomorrow)
    ),
  });

  return todaysPrescription ? {
    id: todaysPrescription.id,
    ritualKey: todaysPrescription.ritualKey,
    shufflesUsed: todaysPrescription.shufflesUsed,
    isCompleted: todaysPrescription.isCompleted,
    completedAt: todaysPrescription.completedAt,
    mood: todaysPrescription.completionMood,
    notes: todaysPrescription.completionNotes,
    prescribedDate: todaysPrescription.prescribedDate,
  } : null;
}

export async function getUserPrescriptionHistory(days: number = 30) {
  const { user } = await validateRequest();
  if (!user) {
    return [];
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const prescriptions = await db.query.userDailyPrescriptions.findMany({
    where: and(
      eq(userDailyPrescriptions.userId, parseInt(user.id)),
      gte(userDailyPrescriptions.prescribedDate, cutoffDate)
    ),
    orderBy: [desc(userDailyPrescriptions.prescribedDate)],
  });

  return prescriptions.map(prescription => ({
    id: prescription.id,
    ritualKey: prescription.ritualKey,
    shufflesUsed: prescription.shufflesUsed,
    isCompleted: prescription.isCompleted,
    completedAt: prescription.completedAt,
    mood: prescription.completionMood,
    notes: prescription.completionNotes,
    prescribedDate: prescription.prescribedDate,
  }));
}
