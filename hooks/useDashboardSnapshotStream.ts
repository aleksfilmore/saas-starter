"use client";
import { useEffect, useRef, useState } from 'react';

// Narrow snapshot structure to what dashboard uses. Optional fields allow forward-compatible additions.
export interface DashboardSnapshot {
  user?: {
    id?: string;
    username?: string;
    level?: number;
    xp?: number;
    bytes?: number;
    noContactStreak?: number;
    ritualStreak?: number;
    longestStreak?: number;
    subscriptionTier?: string | null;
  };
  level?: {
    currentLevel?: number;
    currentXP?: number;
    progressFraction?: number;
    nextLevelXP?: number;
  };
  today?: {
    posts?: number;
    reactions?: number;
    comments?: number;
    rituals?: number;
  };
}

interface StreamState {
  snapshot: DashboardSnapshot | null;
  error: string | null;
  isConnected: boolean;
  attempts: number; // reconnect attempts
}

/**
 * Subscribes to dashboard snapshot SSE with safe reconnect + debounce.
 */
export function useDashboardSnapshotStream(enabled: boolean, intervalMs: number = 15000, debounceMs: number = 300) {
  const [state, setState] = useState<StreamState>({ snapshot: null, error: null, isConnected: false, attempts: 0 });
  const evtRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const latestPayloadRef = useRef<DashboardSnapshot | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const openStream = (attempt: number) => {
      // Clear existing
      if (evtRef.current) {
        evtRef.current.close();
      }
      const es = new EventSource(`/api/dashboard/snapshot-stream?interval=${intervalMs}`);
      evtRef.current = es;
      setState(s => ({ ...s, isConnected: false, attempts: attempt }));

      es.addEventListener('open', () => {
        setState(s => ({ ...s, isConnected: true, error: null }));
      });

      es.addEventListener('snapshot', (e: MessageEvent) => {
        try {
          const data: DashboardSnapshot = JSON.parse(e.data);
          latestPayloadRef.current = data;
          // Debounce rapid bursts from server
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = setTimeout(() => {
              setState(s => ({ ...s, snapshot: latestPayloadRef.current }));
            }, debounceMs);
        } catch {
          // ignore parse errors
        }
      });

      es.addEventListener('error', () => {
        setState(s => ({ ...s, isConnected: false, error: 'stream error' }));
        es.close();
        // Reconnect with exponential backoff capped at 30s
        const nextAttempt = attempt + 1;
        const backoff = Math.min(30000, 1000 * Math.pow(2, nextAttempt));
        if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = setTimeout(() => openStream(nextAttempt), backoff);
      });
    };

    openStream(0);

    return () => {
      if (evtRef.current) evtRef.current.close();
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [enabled, intervalMs, debounceMs]);

  return { snapshot: state.snapshot, error: state.error, isConnected: state.isConnected, attempts: state.attempts };
}
