import useSWR from 'swr';

interface DashboardPayload {
  ux_stage: 'starter' | 'core' | 'power';
  ritual: {
    id: string;
    name: string;
    difficulty: number;
    xpReward: number;
    emoji: string;
    description: string;
    canReroll: boolean;
    cooldownHours: number;
  } | null;
  streak: {
    days: number;
    shieldAvailable: boolean;
    checkinNeeded: boolean;
  };
  bytes: number;
  xp: number;
  level: number;
  quota: number;
  wallPreview?: Array<{
    id: string;
    content: string;
    hearts: number;
    replies: number;
    timestamp: string;
    anonymous: boolean;
  }>;
  stats?: {
    bytesChart: Array<{ date: string; bytes: number }>;
    xpChart: Array<{ date: string; xp: number }>;
  };
  user: {
    alias: string;
    signupDate: string;
    tier: 'ghost' | 'firewall' | 'cult_leader';
    hasSubscription: boolean;
    lastActivity: string;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useDashboard = (stage?: 'starter' | 'core' | 'power') => {
  const url = stage ? `/api/dashboard?stage=${stage}` : '/api/dashboard';
  
  const { data, error, mutate, isLoading } = useSWR<DashboardPayload>(url, fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  return {
    data,
    isLoading,
    isError: error,
    mutate,
    // Helper methods
    refetch: () => mutate(),
    isStarter: data?.ux_stage === 'starter',
    isCore: data?.ux_stage === 'core',
    isPower: data?.ux_stage === 'power',
    // Feature gates based on stage
    canAccessWallPreview: data?.ux_stage === 'core' || data?.ux_stage === 'power',
    canAccessAnalytics: data?.ux_stage === 'power',
    canAccessVoiceOracle: data?.ux_stage === 'power' && data?.user?.hasSubscription,
    // User info
    userAlias: data?.user?.alias || 'Warrior',
    userLevel: data?.level || 1,
    userXP: data?.xp || 0,
    userBytes: data?.bytes || 0,
    userStreak: data?.streak?.days || 0,
    // Ritual info
    todaysRitual: data?.ritual,
    hasRitual: !!data?.ritual,
    canRerollRitual: data?.ritual?.canReroll || false,
    // AI Quota
    aiQuota: data?.quota || 0,
    hasAIQuota: (data?.quota || 0) > 0,
    // Progress calculation
    progressPercent: data?.level ? Math.floor(((data.xp % 1000) / 1000) * 100) : 0,
  };
};

export type { DashboardPayload };
