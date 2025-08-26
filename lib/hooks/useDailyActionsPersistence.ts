import * as React from 'react';

/**
 * Centralized local persistence for daily action completion state to prevent UI flicker
 * Persists per UTC day in localStorage under key daily_actions_YYYY-MM-DD
 */
export interface DailyActionsState {
  checkIn?: boolean;
  noContact?: boolean;
  ritual?: boolean;
  wallInteract?: boolean;
  aiChat?: boolean;
  wallPost?: boolean;
}

export function useDailyActionsPersistence() {
  const todayKey = React.useMemo(()=> 'daily_actions_'+ new Date().toISOString().slice(0,10), []);
  const [persisted, setPersisted] = React.useState<DailyActionsState>({});

  React.useEffect(()=>{
    try { const raw = localStorage.getItem(todayKey); if(raw){ setPersisted(JSON.parse(raw)||{}); } } catch{}
  },[todayKey]);

  const mark = React.useCallback((updates: DailyActionsState)=>{
    setPersisted(prev=>{ const next = { ...prev, ...updates }; try { localStorage.setItem(todayKey, JSON.stringify(next)); } catch{} return next; });
  },[todayKey]);

  return { persisted, mark };
}
