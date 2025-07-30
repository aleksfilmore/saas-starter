// File: lib/db/queries.ts
// DISABLED - These queries require the full schema which is currently not compatible
// with the minimal authentication schema. Re-enable when full schema is properly migrated.

import { eq } from 'drizzle-orm';
import { db } from './drizzle';
import { users } from './minimal-schema';
import { validateRequest } from '@/lib/auth';

export async function getUser() {
  const { user } = await validateRequest();
  if (!user) {
    return null;
  }

  try {
    const userFromDb = await db
      .select({
        id: users.id,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (userFromDb.length === 0) {
      return null;
    }

    return {
      id: userFromDb[0].id,
      email: userFromDb[0].email,
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// All other queries are disabled until full schema migration is complete
export async function getUserNoContactPeriods() {
  return [];
}

export async function getNoContactPeriodById(periodId: string) {
  return null;
}

export async function getNoContactBreaches(periodId: string) {
  return [];
}

export async function getUserRituals() {
  return [];
}

export async function getRitualCompletions(ritualId: string, days: number = 7) {
  return [];
}

export async function getTodaysRitualCompletions() {
  return [];
}

export async function getTodaysPrescribedRitual() {
  return null;
}

export async function getUserPrescriptionHistory(days: number = 30) {
  return [];
}

export async function getUserById(userId: string) {
  try {
    const userFromDb = await db
      .select({
        id: users.id,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userFromDb.length === 0) {
      return null;
    }

    return {
      id: userFromDb[0].id,
      email: userFromDb[0].email,
      createdAt: new Date(), // Mock date until we add timestamps back
    };
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}

export async function updateUser(userId: string, updates: any) {
  // Disabled until full schema migration
  console.log('User update disabled until schema migration complete');
}
