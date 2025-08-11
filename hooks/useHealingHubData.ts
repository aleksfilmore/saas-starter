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

interface RitualResponse {
  // Ghost users get single ritual
  ritual?: TodayRitual;
  // Firewall users get multiple rituals
  rituals?: TodayRitual[];
  tier: 'ghost' | 'firewall';
  hasExistingAssignment?: boolean;
  isCompleted?: boolean;
}

const fetcher = (url: string) => fetch(url).then(r => {
  if (!r.ok) throw new Error(`Failed ${url}`);
  return r.json();
});

export function useHealingHubData() {
  const { data: ritualData, isLoading: ritualLoading, error: ritualError, mutate: mutateRitual } = useSWR<RitualResponse>(
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
      
      // Update the completed ritual in the cache
      mutateRitual(prev => {
        if (!prev) return prev;
        
        if (prev.ritual) {
          // Ghost user - single ritual
          return {
            ...prev,
            ritual: { ...prev.ritual, isCompleted: true, completedAt: new Date().toISOString() }
          };
        } else if (prev.rituals) {
          // Firewall user - multiple rituals
          return {
            ...prev,
            rituals: prev.rituals.map(r => 
              r.id === ritualId 
                ? { ...r, isCompleted: true, completedAt: new Date().toISOString() }
                : r
            )
          };
        }
        return prev;
      }, false);
      
      mutateRitual();
      return true;
    } catch (e) {
      console.error(e);
      toast.error('Network error completing ritual');
      return false;
    }
  }, [mutateRitual]);

  // Handle both single ritual (Ghost) and multiple rituals (Firewall)
  const allRituals = ritualData?.rituals || (ritualData?.ritual ? [ritualData.ritual] : []);
  const primaryRitual = ritualData?.ritual || (ritualData?.rituals?.[0]);
  
  let steps: TodayRitual['steps'] = primaryRitual?.steps;
  if (steps && typeof steps === 'string') {
    try { steps = JSON.parse(steps as any); } catch { /* ignore */ }
  }

  return {
    // For backwards compatibility, return the first/primary ritual
    ritual: primaryRitual ? { ...primaryRitual, steps } : null,
    // For Firewall users, return all rituals
    rituals: allRituals.length > 0 ? allRituals : null,
    tier: ritualData?.tier || 'ghost',
    isFirewall: ritualData?.tier === 'firewall',
    ritualLoading,
    ritualError,
    completeRitual,
    refreshRitual: () => mutateRitual(),
  };
}
