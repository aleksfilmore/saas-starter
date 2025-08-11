import { useCallback, useEffect, useState } from 'react';

export type DailyTaskKey =
  | 'ritual'
  | 'checkIn'
  | 'aiTherapy'
  | 'community'
  | 'noContact'
  | 'quickWin';

export interface DailyTasksState {
  date: string; // YYYY-MM-DD
  ritual: boolean;
  checkIn: boolean;
  aiTherapy: boolean;
  community: boolean; // like or post depending on tier
  noContact: boolean;
  quickWin: boolean;
}

const DEFAULT_STATE = (): DailyTasksState => ({
  date: new Date().toISOString().slice(0, 10),
  ritual: false,
  checkIn: false,
  aiTherapy: false,
  community: false,
  noContact: false,
  quickWin: false
});

const STORAGE_KEY_PREFIX = 'daily-tasks-';

function storageKey(date: string) {
  return `${STORAGE_KEY_PREFIX}${date}`;
}

export function useDailyTasks() {
  const today = new Date().toISOString().slice(0, 10);
  const [tasks, setTasks] = useState<DailyTasksState>(DEFAULT_STATE());
  const [loaded, setLoaded] = useState(false);

  // Load on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(today));
      if (raw) {
        const parsed = JSON.parse(raw) as DailyTasksState;
        if (parsed.date === today) {
          setTasks(parsed);
          setLoaded(true);
          return;
        }
      }
    } catch (e) {
      // ignore
    }
    setTasks(DEFAULT_STATE());
    setLoaded(true);
  }, [today]);

  const persist = useCallback((next: DailyTasksState) => {
    setTasks(next);
    try {
      localStorage.setItem(storageKey(today), JSON.stringify(next));
    } catch (e) {
      // ignore storage errors
    }
  }, [today]);

  const markTask = useCallback((key: DailyTaskKey) => {
    setTasks(prev => {
      if (prev[key]) return prev; // already completed
      const next = { ...prev, [key]: true };
      persist(next);
      return next;
    });
  }, [persist]);

  const reset = useCallback(() => {
    const fresh = DEFAULT_STATE();
    persist(fresh);
  }, [persist]);

  const completedCount = (['ritual','checkIn','aiTherapy','community','noContact','quickWin'] as DailyTaskKey[])
    .reduce((acc, k) => acc + (tasks[k] ? 1 : 0), 0);
  const total = 6;
  const progressFraction = completedCount / total;

  return { tasks, markTask, reset, loaded, completedCount, total, progressFraction };
}
