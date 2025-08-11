import useSWR from 'swr';
import { useCallback } from 'react';
import { toast } from 'sonner';

interface TodayRitual {
  id: string;
  title: string;
  description: string;
  steps?: Array<{ title: string; description?: string; duration?: number }> | null;
  difficulty?: string;
  xpReward?: number;
  byteReward?: number;
  estimatedTime?: string | number | null;
  isCompleted?: boolean;
  completedAt?: string | null;
}

interface CompleteResponse {
  success: boolean;
  rewards?: { xp: number; bytes: number; newLevel?: number; leveledUp?: boolean };
  user?: { xp: number; bytes: number; level: number; streak?: number };
}

const fetcher = (url: string) => fetch(url).then(r => {
  if (!r.ok) throw new Error(`Failed ${url}`);
  return r.json();
});

export function useHealingHubData() {
  const { data: ritualData, isLoading: ritualLoading, error: ritualError, mutate: mutateRitual } = useSWR<{ ritual: TodayRitual }>(
    '/api/rituals/today',
    fetcher,
    { revalidateOnFocus: true, shouldRetryOnError: false }
  );

  const completeRitual = useCallback(async (ritualId: string, difficulty?: string) => {
    try {
      toast.loading('Completing ritual...', { id: ritualId });
      const res = await fetch('/api/rituals/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ritualId, difficulty })
      });
      const json: CompleteResponse = await res.json();
      if (!res.ok || !json.success) {
        // @ts-ignore
        toast.error(json?.error || 'Failed to complete ritual', { id: ritualId });
        return false;
      }
      toast.success(`Ritual complete +${json.rewards?.xp} XP`, { id: ritualId });
      mutateRitual(prev => prev ? ({ ritual: { ...prev.ritual, isCompleted: true, completedAt: new Date().toISOString() } }) : prev, false);
      mutateRitual();
      return true;
    } catch (e) {
      console.error(e);
      toast.error('Network error completing ritual');
      return false;
    }
  }, [mutateRitual]);

  let steps: TodayRitual['steps'] = ritualData?.ritual?.steps;
  if (steps && typeof steps === 'string') {
    try { steps = JSON.parse(steps as any); } catch { /* ignore */ }
  }

  return {
    ritual: ritualData?.ritual ? { ...ritualData.ritual, steps } : null,
    ritualLoading,
    ritualError,
    completeRitual,
    refreshRitual: () => mutateRitual(),
  };
}
