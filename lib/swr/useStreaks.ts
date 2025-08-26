import useSWR from 'swr';

interface StreaksResponse {
  ritual: number;
  noContact: number;
  overall: number;
}

const fetcher = (url: string) => fetch(url, { cache: 'no-store' }).then(r => r.json());

export function useStreaks() {
  const { data, error, isLoading, mutate } = useSWR<StreaksResponse>('/api/streaks', fetcher, {
    refreshInterval: 5 * 60 * 1000, // every 5 minutes
    dedupingInterval: 60 * 1000
  });

  return {
    ritualStreak: data?.ritual ?? 0,
    noContactStreak: data?.noContact ?? 0,
    overallStreak: data?.overall ?? data?.ritual ?? 0,
    loading: isLoading,
    error,
    mutate
  };
}
