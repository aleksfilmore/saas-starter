// File: lib/db/queries.ts

import { eq, and, desc } from 'drizzle-orm';
import { db } from './drizzle';
import { users, noContactPeriods, noContactBreaches } from './schema';
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
