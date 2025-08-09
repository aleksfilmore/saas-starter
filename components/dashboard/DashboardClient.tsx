"use client";

import { useEffect, useState, useCallback } from 'react';
import { SimplifiedHeader } from '@/components/dashboard/SimplifiedHeader';
import { SimplifiedHeroRitualCard } from '@/components/dashboard/SimplifiedHeroRitualCard';
import { DashboardTiles } from '@/components/dashboard/DashboardTiles';
import { SimplifiedCommunityFeed } from '@/components/dashboard/SimplifiedCommunityFeed';
import { NoContactCheckinModal } from '@/components/dashboard/NoContactCheckinModal';
import { MoodCheckIn } from '@/components/quick-actions/MoodCheckIn';
import { BreathingExercise } from '@/components/quick-actions/BreathingExercise';
import { LumoOnboarding } from '@/components/onboarding/LumoOnboarding';
import { DualRituals } from '@/components/dashboard/DualRituals';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/hooks/useDashboard';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { NextUnlockPanel } from '@/components/dashboard/NextUnlockPanel';
import { progressToNextLevel, getNextLevelXP } from '@/lib/gamification/leveling';
import { useDashboardSnapshotStream } from '@/hooks/useDashboardSnapshotStream';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';

// Shape of server snapshot
export interface DashboardServerSnapshot {
  user: {
    id: string;
    username: string;
    level: number;
    xp: number;
    bytes: number;
    noContactStreak: number;
    ritualStreak: number;
    longestStreak: number;
    subscriptionTier?: string | null;
  };
  level: {
    currentLevel: number;
    currentXP: number;
    progressFraction: number;
    nextLevelXP: number;
  };
  today: {
    posts: number;
    reactions: number;
    comments: number;
    rituals: number;
  };
}

interface Props {
  initialSnapshot: DashboardServerSnapshot;
}

export function DashboardClient({ initialSnapshot }: Props) {
  const { user: authUser, isAuthenticated, isLoading: authLoading, updateUser, refetchUser } = useAuth();
  const { data: dashboardData, isLoading: dashboardLoading, canAccessWallPreview, hasAIQuota, aiQuota } = useDashboard();
  // const [noContactStatus, setNoContactStatus] = useState<{ isNoContact: boolean } | null>(null); // removed (unused)
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showBreathingModal, setShowBreathingModal] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [completedRituals, setCompletedRituals] = useState<string[]>([]);
  // Live snapshot state (seeded from server render, then updated via SSE stream)
  const [snapshot, setSnapshot] = useState<DashboardServerSnapshot | null>(initialSnapshot);
  const { snapshot: liveSnapshot } = useDashboardSnapshotStream(true, 15000);

  // Merge incoming live snapshots (simple replace; could do granular diff if needed)
  useEffect(() => {
    if (liveSnapshot) {
      setSnapshot(prev => ({
        ...prev,
        ...liveSnapshot,
        user: { ...(prev?.user||{}), ...(liveSnapshot.user||{}) },
        level: { ...(prev?.level||{}), ...(liveSnapshot.level||{}) },
        today: { ...(prev?.today||{}), ...(liveSnapshot.today||{}) }
      }) as DashboardServerSnapshot);
    }
  }, [liveSnapshot]);

  // Load completed rituals from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const completed = localStorage.getItem(`completed-rituals-${today}`);
    if (completed) {
      try { setCompletedRituals(JSON.parse(completed)); } catch { /* ignore */ }
    }
  }, []);

  const fetchNoContactStatus = useCallback(async () => {
    if (!authUser) return;
    try {
      const response = await fetch('/api/no-contact/status');
      if (response.ok) {
        // intentionally ignored – status data not currently displayed
        await response.json();
      }
    } catch (error) {
      console.error('Error fetching no-contact status:', error);
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser && isAuthenticated && !authLoading) {
      fetchNoContactStatus();
    }
  }, [authUser, isAuthenticated, authLoading, fetchNoContactStatus]);

  const handleHeroRitualComplete = async (ritualId: string) => {
    await handleRitualComplete(ritualId, 'medium');
  };

  const handleReroll = async () => {
    // Placeholder reroll implementation
    console.log('Reroll requested');
  };

  const handleDualRitualComplete = async (ritualId: string, xpGained: number) => {
    try {
      let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
      if (xpGained >= 100) difficulty = 'hard';
      else if (xpGained >= 50) difficulty = 'medium';
      const response = await fetch('/api/rituals/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ritualId, difficulty })
      });
      if (response.ok) {
        const result = await response.json();
        const today = new Date().toDateString();
        const newCompleted = [...completedRituals, ritualId];
        setCompletedRituals(newCompleted);
        localStorage.setItem(`completed-rituals-${today}`, JSON.stringify(newCompleted));
        if (result.user) await updateUser(result.user);
      }
    } catch (error) {
      console.error('Error completing ritual:', error);
    }
  };

  const handleRitualComplete = async (ritualId: string, difficulty: 'easy' | 'medium' | 'hard') => {
    try {
      const response = await fetch('/api/rituals/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ritualId, difficulty })
      });
      if (response.ok) {
        const result = await response.json();
        const today = new Date().toDateString();
        const newCompleted = [...completedRituals, ritualId];
        setCompletedRituals(newCompleted);
        localStorage.setItem(`completed-rituals-${today}`, JSON.stringify(newCompleted));
        if (result.user) await updateUser(result.user);
      }
    } catch (error) {
      console.error('Error completing ritual:', error);
    }
  };

  const handleNoContactCheckin = async () => {
    try {
      const response = await fetch('/api/no-contact/checkin', { method: 'PATCH', headers: { 'Content-Type': 'application/json' } });
      if (response.ok) {
        await refetchUser();
        await fetchNoContactStatus();
        setShowCheckinModal(false);
      }
    } catch (error) {
      console.error('Error with no-contact checkin:', error);
    }
  };

  const handleBreathing = () => setShowBreathingModal(true);
  const handleCrisis = () => { window.location.href = '/crisis-support'; };

  if (authLoading || dashboardLoading || !authUser || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p>Failed to load dashboard. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  const derivedProgress = progressToNextLevel(authUser.xp || 0, authUser.level || 1);
  // const nextLevelXP = getNextLevelXP(authUser.level || 1); // removed (unused)
  const todayRitual = dashboardData?.ritual || null;
  const transformedRitual = todayRitual ? {
    id: todayRitual.id,
    title: todayRitual.name,
    description: todayRitual.description,
    category: 'daily',
    intensity: todayRitual.difficulty,
    duration: 15,
    isCompleted: completedRituals.includes(todayRitual.id)
  } : null;
  const hasShield = authUser.noContactDays >= 7;

  const handleUpgrade = async () => {
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tier: 'PREMIUM' }) });
      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      }
    } catch (e) { console.error('Upgrade failed', e); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <SimplifiedHeader
        user={{
          username: authUser.username,
          streak: authUser.streak,
            bytes: authUser.bytes,
            level: authUser.level,
            noContactDays: authUser.noContactDays,
            subscriptionTier: authUser.subscriptionTier
        }}
        hasShield={hasShield}
        onCheckin={() => setShowCheckinModal(true)}
        onBreathing={handleBreathing}
        onCrisis={handleCrisis}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {authUser.subscriptionTier === 'premium' ? (
          <div className="space-y-8">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3 items-stretch mb-2">
              <div className="flex items-center justify-center">
                <ProgressRing
                  progress={snapshot?.level?.progressFraction ?? derivedProgress}
                  centerContent={(
                    <div>
                      <div className="text-white text-xl font-bold">Lvl {snapshot?.user?.level ?? authUser.level}</div>
                      <div className="text-[10px] text-purple-200 mt-1">{Math.round((snapshot?.level?.progressFraction ?? derivedProgress) * 100)}%</div>
                    </div>
                  )}
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <NextUnlockPanel streak={snapshot?.user?.noContactStreak ?? authUser.noContactDays} level={snapshot?.user?.level ?? authUser.level} bytes={snapshot?.user?.bytes ?? authUser.bytes} subscriptionTier={(snapshot?.user?.subscriptionTier ?? authUser.subscriptionTier) as 'free' | 'premium' | undefined} />
                  <div className="grid grid-cols-2 gap-3 text-xs text-purple-200">
                    <div className="bg-purple-800/30 rounded-md p-2 flex flex-col items-center">
                      <span className="text-[10px] uppercase tracking-wide text-purple-300">Ritual Streak</span>
                      <span className="text-lg font-bold text-white">{snapshot?.user?.ritualStreak ?? authUser.streak}</span>
                    </div>
                    <div className="bg-purple-800/30 rounded-md p-2 flex flex-col items-center">
                      <span className="text-[10px] uppercase tracking-wide text-purple-300">No-Contact Streak</span>
                      <span className="text-lg font-bold text-white">{snapshot?.user?.noContactStreak ?? authUser.noContactDays}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DualRituals userSubscription="premium" onRitualComplete={handleDualRitualComplete} completedRituals={completedRituals} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <DashboardTiles
                  mode="premium"
                  user={{
                    noContactDays: authUser.noContactDays,
                    wallPosts: 0,
                    streak: authUser.streak,
                    level: authUser.level,
                    bytes: authUser.bytes,
                    subscriptionTier: authUser.subscriptionTier || 'premium'
                  }}
                  featureGates={{ noContactTracker: true, aiTherapy: hasAIQuota, wallRead: canAccessWallPreview }}
                  aiQuota={{ msgsLeft: aiQuota, totalQuota: aiQuota }}
                />
              </div>
              <div>
                <SimplifiedCommunityFeed />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-8">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-3 items-stretch">
                <div className="flex items-center justify-center">
                  <ProgressRing
                    progress={snapshot?.level?.progressFraction ?? derivedProgress}
                    centerContent={(
                      <div>
                        <div className="text-white text-xl font-bold">Lvl {snapshot?.user?.level ?? authUser.level}</div>
                        <div className="text-[10px] text-purple-200 mt-1">{Math.round((snapshot?.level?.progressFraction ?? derivedProgress) * 100)}%</div>
                      </div>
                    )}
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="flex flex-col gap-4">
                    <NextUnlockPanel streak={snapshot?.user?.noContactStreak ?? authUser.noContactDays} level={snapshot?.user?.level ?? authUser.level} bytes={snapshot?.user?.bytes ?? authUser.bytes} subscriptionTier={(snapshot?.user?.subscriptionTier ?? authUser.subscriptionTier) as 'free' | 'premium' | undefined} />
                    <div className="grid grid-cols-2 gap-3 text-xs text-purple-200">
                      <div className="bg-purple-800/30 rounded-md p-2 flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-wide text-purple-300">Ritual Streak</span>
                        <span className="text-lg font-bold text-white">{snapshot?.user?.ritualStreak ?? authUser.streak}</span>
                      </div>
                      <div className="bg-purple-800/30 rounded-md p-2 flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-wide text-purple-300">No-Contact Streak</span>
                        <span className="text-lg font-bold text-white">{snapshot?.user?.noContactStreak ?? authUser.noContactDays}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <SimplifiedHeroRitualCard ritual={transformedRitual} onComplete={handleHeroRitualComplete} onReroll={handleReroll} canReroll={false} rerollsLeft={0} />
              <DashboardTiles
                mode="free"
                user={{
                  noContactDays: authUser.noContactDays,
                  wallPosts: 0,
                  streak: authUser.streak,
                  level: authUser.level,
                  bytes: authUser.bytes,
                  subscriptionTier: authUser.subscriptionTier || 'free'
                }}
                featureGates={{ noContactTracker: true, aiTherapy: hasAIQuota, wallRead: canAccessWallPreview }}
                aiQuota={{ msgsLeft: aiQuota, totalQuota: aiQuota }}
              />
            </div>
            <div className="lg:col-span-2">
              <SimplifiedCommunityFeed />
              {authUser.subscriptionTier === 'free' && (
                <Card className="mt-6 bg-gradient-to-br from-purple-800/40 to-pink-700/30 border-purple-600/40">
                  <CardContent className="p-5 flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md bg-purple-600/30 text-purple-200">
                        <Crown className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-1">Unlock Premium Healing</h3>
                        <p className="text-xs text-purple-100/70 leading-relaxed">Dual daily rituals, extended AI therapy, deeper progress insights & community boosts.</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={handleUpgrade} className="bg-purple-600 hover:bg-purple-700 self-start">Upgrade Now</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
      {showCheckinModal && (
        <NoContactCheckinModal
          isOpen={showCheckinModal}
          onClose={() => setShowCheckinModal(false)}
          currentStreak={authUser.noContactDays}
          refetchUser={refetchUser}
          onCheckinComplete={async () => { await handleNoContactCheckin(); }}
        />
      )}
      {showMoodModal && (
        <Dialog open={showMoodModal} onOpenChange={() => setShowMoodModal(false)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>How are you feeling?</DialogTitle>
            </DialogHeader>
            <MoodCheckIn onComplete={(mood) => { console.log('Mood selected:', mood); setShowMoodModal(false); }} />
          </DialogContent>
        </Dialog>
      )}
      {showBreathingModal && (
        <Dialog open={showBreathingModal} onOpenChange={() => setShowBreathingModal(false)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Breathing Exercise</DialogTitle>
            </DialogHeader>
            <BreathingExercise onComplete={(pattern, cycles) => { console.log('Breathing exercise completed:', pattern, cycles); setShowBreathingModal(false); }} />
          </DialogContent>
        </Dialog>
      )}
      <LumoOnboarding
        isFirstTimeUser={false}
        onDismiss={() => console.log('Onboarding dismissed')}
        onStartNoContact={() => window.location.href = '/no-contact'}
        onViewRituals={() => window.location.href = '/ritual'}
      />
    </div>
  );
}
