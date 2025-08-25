// Central progress definitions for badge unlock tracking & hint generation.
// Non-breaking: server will attach progress for locked badges using these definitions.

export interface BadgeProgressComputation {
  id: string; // badge id
  metric: string; // internal metric key
  target: number; // target number to unlock
  // compute returns current progress number from a stats object
  compute: (stats: UserAggregateStats) => number;
  hint: (current: number, target: number) => string; // dynamic hint text
  hiddenUntilProgress?: boolean; // if true, hide name/hint until progress >0
  requiresUpgrade?: boolean; // show upgrade overlay if user ghost
}

// Shape for aggregated stats we will fetch once per request.
export interface UserAggregateStats {
  totalRituals: number;
  totalCheckIns: number;
  totalNoContacts: number;
  ritualStreak?: number; // current streak
  maxRitualStreak?: number; // historical max
  ritualSwaps?: number; // total swaps performed
  bytesBalance: number;
}

// Helper hint generator patterns
const percent = (c:number,t:number)=> Math.min(100, Math.round(c/t*100));

export const badgeProgressDefinitions: Record<string, BadgeProgressComputation> = {
  // Swap milestones
  F_SWAP_1: {
    id: 'F_SWAP_1', metric: 'ritualSwaps', target: 1,
    compute: s => s.ritualSwaps || 0,
  hint: (c,t)=> c>=t? 'Unlocked' : c===0? 'Perform your first ritual swap' : `${t-c} swap to go`,
  requiresUpgrade: true,
  },
  F_SWAP_10: {
    id: 'F_SWAP_10', metric: 'ritualSwaps', target: 10,
    compute: s => s.ritualSwaps || 0,
    hint: (c,t)=> c>=t? 'Unlocked' : `${c}/${t} ritual swaps (${percent(c,t)}%)`,
  requiresUpgrade: true,
  },
  // Streak milestones
  F_STREAK_7: {
    id: 'F_STREAK_7', metric: 'maxRitualStreak', target: 7,
    compute: s => Math.max(s.ritualStreak||0, s.maxRitualStreak||0),
  hint: (c,t)=> c>=t? 'Unlocked' : `${t-c} more days in a row`,
  requiresUpgrade: true,
  },
  F_STREAK_30: {
    id: 'F_STREAK_30', metric: 'maxRitualStreak', target: 30,
    compute: s => Math.max(s.ritualStreak||0, s.maxRitualStreak||0),
    hint: (c,t)=> c>=t? 'Unlocked' : `${c}/${t} day streak (${percent(c,t)}%)`,
  requiresUpgrade: true,
  },
  // Bytes accumulation
  F_BYTES_10K: {
    id: 'F_BYTES_10K', metric: 'bytesBalance', target: 10000,
    compute: s => s.bytesBalance,
    hint: (c,t)=> c>=t? 'Unlocked' : `${((c/1000)|0)}k / ${(t/1000)|0}k bytes`,
  requiresUpgrade: true,
  },
  F_BYTES_50K: {
    id: 'F_BYTES_50K', metric: 'bytesBalance', target: 50000,
    compute: s => s.bytesBalance,
    hint: (c,t)=> c>=t? 'Unlocked' : `${(c/1000).toFixed(1)}k / ${(t/1000)|0}k bytes`,
  requiresUpgrade: true,
  },
};

export interface ComputedProgress {
  current: number; target: number; percent: number; hint: string;
}

export function computeProgressForBadge(id: string, stats: UserAggregateStats): ComputedProgress | null {
  const def = badgeProgressDefinitions[id];
  if(!def) return null;
  const current = def.compute(stats);
  return { current, target: def.target, percent: Math.min(100, Math.round(current/def.target*100)), hint: def.hint(current, def.target) };
}
