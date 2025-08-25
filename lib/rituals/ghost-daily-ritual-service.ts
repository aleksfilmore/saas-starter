/** Ghost Daily Ritual Service
 * Provides deterministic retrieval without DB writes.
 */
import { computeLocalDateISO, selectGhostDailyRitual } from './ghost-daily-rituals';

export interface GetGhostRitualOptions {
  userId: string;
  // Minutes east of UTC (matching existing convention: store offsetMinutes maybe; positive for ahead of UTC)
  tzOffsetMinutes?: number; // default 0 (UTC)
  now?: Date; // test override
}

export function getTodayGhostRitual(opts: GetGhostRitualOptions) {
  const { userId, tzOffsetMinutes = 0, now = new Date() } = opts;
  const localDateISO = computeLocalDateISO(now, tzOffsetMinutes);
  const ritual = selectGhostDailyRitual(userId, localDateISO);
  return { date: localDateISO, ritual };
}
