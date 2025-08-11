"use client";

import React, { createContext, useContext, useMemo, useCallback, useState, useEffect } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface HubAPIData {
  streaks: { rituals: number; noContact: number };
  xp: { current: number; level: number; nextLevelXP: number; progressFraction: number };
  badges: Array<{ id: string; name: string; icon: string; unlocked: boolean }>;
  todaysRituals: Array<{ id: string; title: string; difficulty: string; completed: boolean; duration: string; icon: string }>;
  wallPosts: Array<{ id: string; content: string; archetype: string; timeAgo: string; reactions: number; anonymous: boolean }>;
  dailyInsight: string;
  motivationMeter: { level: number; message: string };
  completedRituals?: number;
  streakHistory?: Array<{ date: string; completed: boolean }>;
}

interface TodayRitual {
  id: string;
  title: string;
  description?: string;
  steps?: Array<{ title: string; description?: string; duration?: number }> | null;
  difficulty?: string;
  xpReward?: number;
  estimatedTime?: string | number | null;
  isCompleted?: boolean;
  completedAt?: string | null;
}

interface NoContactStatus {
  status: string;
  canCheckIn: boolean;
  hoursUntilNext?: number;
  currentStreak: number;
  lastCheckinAt: string | null;
  nextCheckinAvailable?: string;
  loading: boolean;
}

interface HealingHubContextValue {
  hubLoading: boolean;
  ritualLoading: boolean;
  noContactLoading: boolean;
  xp: HubAPIData['xp'] | null;
  streaks: HubAPIData['streaks'] | null;
  badges: HubAPIData['badges'];
  wallPosts: HubAPIData['wallPosts'];
  dailyInsight: string | null;
  motivationMeter: HubAPIData['motivationMeter'] | null;
  ritual: TodayRitual | null;
  noContact: NoContactStatus | null;
  latestBadgeEmoji: string | null;
  completeRitual: (ritualId: string, difficulty?: string) => Promise<boolean>;
  rerollRitual: () => Promise<boolean>;
  rerollCooldownHoursLeft?: number | null;
  checkInNoContact: () => Promise<boolean>;
  refresh: () => void;
  completedRituals: number;
  streakHistory: Array<{ date: string; completed: boolean }>;
}

const fetcher = (url: string) => fetch(url).then(r => { if (!r.ok) throw new Error(url); return r.json(); });

const HealingHubContext = createContext<HealingHubContextValue | undefined>(undefined);

export function HealingHubProvider({ children }: { children: React.ReactNode }) {
  const { updateUser } = useAuth();

  const { data: hubData, isLoading: hubLoading, mutate: mutateHub } = useSWR<HubAPIData>(
    '/api/dashboard/hub', fetcher, { revalidateOnFocus: false, dedupingInterval: 30000 }
  );
  const { data: ritualWrapper, isLoading: ritualLoading, mutate: mutateRitual } = useSWR<{ ritual: TodayRitual }>(
    '/api/rituals/today', fetcher, { revalidateOnFocus: false, dedupingInterval: 15000 }
  );
  const { data: noContactStatus, isLoading: noContactLoading, mutate: mutateNoContact } = useSWR<any>(
    '/api/no-contact/status', fetcher, { revalidateOnFocus: true }
  );
  const [rerollCooldownHoursLeft, setRerollCooldownHoursLeft] = useState<number | null>(null);
  useEffect(() => {
    if (rerollCooldownHoursLeft == null) return;
    if (rerollCooldownHoursLeft <= 0) { setRerollCooldownHoursLeft(null); return; }
    const id = setInterval(() => {
      setRerollCooldownHoursLeft(prev => prev == null ? null : +(Math.max(0, prev - 0.0833).toFixed(2)));
    }, 5 * 60 * 1000); // every 5 minutes subtract ~0.0833h
    return () => clearInterval(id);
  }, [rerollCooldownHoursLeft]);

  const completeRitual = useCallback(async (ritualId: string, difficulty?: string) => {
    try {
      toast.loading('Completing ritual...', { id: ritualId });
      const res = await fetch('/api/rituals/complete', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ritualId, difficulty })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json?.error || 'Failed to complete ritual', { id: ritualId });
        return false;
      }
      toast.success(`Ritual complete +${json.rewards?.xp || 0} XP`, { id: ritualId });
      mutateRitual(prev => prev ? { ritual: { ...prev.ritual, isCompleted: true, completedAt: new Date().toISOString() } } : prev, false);
      mutateHub();
      updateUser({ xp: json.user?.xp, level: json.user?.level });
      return true;
    } catch (e) {
      console.error(e);
      toast.error('Network error completing ritual');
      return false;
    } finally {
      mutateRitual();
    }
  }, [mutateRitual, mutateHub, updateUser]);

  const rerollRitual = useCallback(async () => {
    try {
      const res = await fetch('/api/rituals/today', { method: 'POST' });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 429 && json.hoursLeft) {
          setRerollCooldownHoursLeft(json.hoursLeft);
          toast.error(`Reroll cooldown: ${json.hoursLeft}h left`);
        } else {
          toast.error(json.error || 'Reroll failed');
        }
        return false;
      }
      toast.success('New ritual assigned');
      mutateRitual();
      setRerollCooldownHoursLeft(null);
      return true;
    } catch (e) {
      console.error(e);
      toast.error('Network error rerolling ritual');
      return false;
    }
  }, [mutateRitual]);

  const checkInNoContact = useCallback(async () => {
    try {
      toast.loading('Recording no-contact check-in...', { id: 'no-contact-checkin' });
      const res = await fetch('/api/no-contact/checkin', { method: 'PATCH' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json?.error || 'Check-in failed', { id: 'no-contact-checkin' });
        return false;
      }
      toast.success(`No-contact +${json.xpEarned} XP`, { id: 'no-contact-checkin' });
      mutateNoContact();
      mutateHub();
      return true;
    } catch (e) {
      console.error(e);
      toast.error('Network error during check-in', { id: 'no-contact-checkin' });
      return false;
    }
  }, [mutateNoContact, mutateHub]);

  const value: HealingHubContextValue = useMemo(() => ({
    hubLoading,
    ritualLoading,
    noContactLoading,
    xp: hubData?.xp || null,
    streaks: hubData?.streaks || null,
    badges: hubData?.badges || [],
    wallPosts: hubData?.wallPosts || [],
    dailyInsight: hubData?.dailyInsight || null,
    motivationMeter: hubData?.motivationMeter || null,
    ritual: ritualWrapper?.ritual ? { ...ritualWrapper.ritual, steps: ritualWrapper.ritual.steps } : null,
    noContact: noContactStatus ? {
      status: noContactStatus.status,
      canCheckIn: !!noContactStatus.canCheckIn,
      hoursUntilNext: noContactStatus.hoursUntilNext,
      currentStreak: noContactStatus.currentStreak || 0,
      lastCheckinAt: noContactStatus.lastCheckinAt || null,
      nextCheckinAvailable: noContactStatus.nextCheckinAvailable,
      loading: noContactLoading
    } : null,
  latestBadgeEmoji: (hubData?.badges || []).filter(b => b.unlocked).slice(-1)[0]?.icon || null,
    completeRitual,
  rerollRitual,
  rerollCooldownHoursLeft,
    checkInNoContact,
    refresh: () => { mutateHub(); mutateRitual(); mutateNoContact(); }
    ,
    completedRituals: hubData?.completedRituals || 0,
    streakHistory: hubData?.streakHistory || []
  }), [hubLoading, ritualLoading, noContactLoading, hubData, ritualWrapper, noContactStatus, completeRitual, rerollRitual, rerollCooldownHoursLeft, checkInNoContact, mutateHub, mutateRitual, mutateNoContact]);

  return <HealingHubContext.Provider value={value}>{children}</HealingHubContext.Provider>;
}

export function useHealingHub() {
  const ctx = useContext(HealingHubContext);
  if (!ctx) throw new Error('useHealingHub must be used within HealingHubProvider');
  return ctx;
}
