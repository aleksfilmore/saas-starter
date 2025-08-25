import useSWR from 'swr';
import { useCallback } from 'react';
import { toast } from 'sonner';

interface TodayRitual {
  id: string;
  title: string;
  description: string;
  steps?: Array<{ title: string; description?: string; duration?: number }> | null;
  difficulty?: string;
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
  // Legacy /api/rituals/today removed; ghost ritual now embedded in hub payload (todaysRituals[0])
  const { data: hubData, isLoading: hubLoading, error: hubError, mutate: mutateHub } = useSWR<any>(
    '/api/dashboard/hub', fetcher, { revalidateOnFocus: true, shouldRetryOnError: false }
  );

  const completeRitual = useCallback(async (ritualId: string) => {
    try {
      toast.loading('Completing ritual...', { id: ritualId });
      const res = await fetch('/api/daily-rituals/complete-ghost', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ritualId }) });
      const json = await res.json();
      if (!res.ok || !json.success) { toast.error(json?.error || 'Failed to complete ritual', { id: ritualId }); return false; }
      toast.success(`Ritual complete +${json.data?.bytesEarned || 0} Bytes`, { id: ritualId });
      mutateHub();
      return true;
    } catch (e) {
      console.error(e);
      toast.error('Network error completing ritual');
      return false;
    }
  }, [mutateHub]);

  const ghostRitual = hubData?.todaysRituals?.length ? hubData.todaysRituals[0] : null;
  return { ritual: ghostRitual, ritualLoading: hubLoading, ritualError: hubError, completeRitual, refreshRitual: () => mutateHub() };
}
