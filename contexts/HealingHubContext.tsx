"use client";

import React, { createContext, useContext, useMemo, useCallback, useState, useEffect } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface HubAPIData {
  streaks: { rituals: number; noContact: number };
  // xp removed
  badges: Array<{ id: string; name: string; icon: string; unlocked: boolean }>;
  todaysRituals: Array<{ id: string; title: string; difficulty: string; completed: boolean; duration: string; icon: string }>;
  wallPosts: Array<{ id: string; content: string; emotionTag?: string; archetype?: string; glitchCategory?: string; timeAgo: string; reactions: number; anonymous: boolean }>;
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
  xp: null;
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
    '/api/dashboard/hub', fetcher, { revalidateOnFocus: false, dedupingInterval: 15000 }
  );
  const ritualLoading = hubLoading; // unified
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

  const completeRitual = useCallback(async (ritualId: string) => {
    try {
      toast.loading('Completing ritual...', { id: ritualId });
      const res = await fetch('/api/daily-rituals/complete-ghost', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ritualId }) });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json?.error || 'Failed to complete ritual', { id: ritualId });
        return false;
      }
      toast.success(`Ritual complete +${json.data?.bytesEarned || 0} Bytes`, { id: ritualId });
      mutateHub();
      return true;
    } catch (e) {
      console.error(e);
      toast.error('Network error completing ritual');
      return false;
    } finally {
      mutateHub();
    }
  }, [mutateHub]);

  const rerollRitual = useCallback(async () => { toast.error('Reroll disabled for ghost mode'); return false; }, []);

  const checkInNoContact = useCallback(async () => {
    try {
      toast.loading('Recording no-contact check-in...', { id: 'no-contact-checkin' });
      const res = await fetch('/api/no-contact/checkin', { method: 'PATCH' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json?.error || 'Check-in failed', { id: 'no-contact-checkin' });
        return false;
      }
  toast.success(`No-contact logged`, { id: 'no-contact-checkin' });
      mutateNoContact();
      mutateHub();
      return true;
    } catch (e) {
      console.error(e);
      toast.error('Network error during check-in', { id: 'no-contact-checkin' });
      return false;
    }
  }, [mutateNoContact, mutateHub]);

  const ritual = hubData?.todaysRituals?.length ? (hubData.todaysRituals[0] as TodayRitual) : null;
  const value: HealingHubContextValue = useMemo(() => ({
    hubLoading,
    ritualLoading,
    noContactLoading,
  xp: null,
    streaks: hubData?.streaks || null,
    badges: hubData?.badges || [],
    wallPosts: hubData?.wallPosts || [],
    dailyInsight: hubData?.dailyInsight || null,
    motivationMeter: hubData?.motivationMeter || null,
  ritual,
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
  refresh: () => { mutateHub(); mutateNoContact(); }
    ,
    completedRituals: hubData?.completedRituals || 0,
    streakHistory: hubData?.streakHistory || []
  }), [hubLoading, ritualLoading, noContactLoading, hubData, ritual, noContactStatus, completeRitual, rerollRitual, rerollCooldownHoursLeft, checkInNoContact, mutateHub, mutateNoContact]);

  return <HealingHubContext.Provider value={value}>{children}</HealingHubContext.Provider>;
}

export function useHealingHub() {
  const ctx = useContext(HealingHubContext);
  if (!ctx) throw new Error('useHealingHub must be used within HealingHubProvider');
  return ctx;
}
