"use client";

import { useState, useEffect } from 'react';
import { User } from 'lucia';
import { useDailyTasks } from '@/hooks/useDailyTasks';
import { useAuth } from '@/contexts/AuthContext';
import { HealingHubProvider, useHealingHub } from '@/contexts/HealingHubContext';
import { DailyActionsZone } from '@/components/dashboard/DailyActionsZone';
import { LiveCommunityZone } from '@/components/dashboard/LiveCommunityZone';
import { ProgressZone } from '@/components/dashboard/ProgressZone';
import { HeroGuidance } from '@/components/dashboard/HeroGuidance';
import { InsightsZone } from '@/components/dashboard/InsightsZone';
import { RitualModal } from '@/components/dashboard/modals/RitualModal';
import { CheckInModal } from '@/components/dashboard/modals/CheckInModal';
import { AITherapyModal } from '@/components/dashboard/modals/AITherapyModal';
import { NoContactModal } from '@/components/dashboard/modals/NoContactModal';
import { UserMenu } from './UserMenu';
import { ProgressPath } from '@/components/dashboard/ProgressPath';
import { UpgradeModal } from './modals/UpgradeModal';
import { QuickWinModal } from './modals/QuickWinModal';
import { MomentumRing } from './MomentumRing';

interface Props {
  user: User;
}

export function HealingHubDashboard({ user }: Props) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [lastActionAt, setLastActionAt] = useState<number>(Date.now());
  const [showNudge, setShowNudge] = useState(false);
  const [showLegacyActions, setShowLegacyActions] = useState(false);
  const { tasks, markTask, progressFraction } = useDailyTasks();

  // Track task changes for inactivity
  useEffect(() => {
    setLastActionAt(Date.now());
    setShowNudge(false);
  }, [tasks]);

  // Inactivity nudge after 12 minutes of no progress & not all tasks done
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastActionAt > 12 * 60 * 1000 && progressFraction < 1) {
        setShowNudge(true);
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [lastActionAt, progressFraction]);
  const { user: authUser } = useAuth();
  const { hubLoading, badges, wallPosts, dailyInsight, ritual, completeRitual } = useHealingHub();
  const showSkeleton = hubLoading;
  const ringColorStops = ['#a855f7','#ec4899'];

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
  {/* Header */}
      <header className="border-b border-gray-600/30 bg-gray-800/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <svg width="48" height="48" viewBox="0 0 48 48" className="rotate-[-90deg]">
                  <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.15)" strokeWidth="6" fill="none" />
                  <circle
                    cx="24" cy="24" r="20"
                    stroke="url(#grad-progress)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 20}
                    strokeDashoffset={2 * Math.PI * 20 * (1 - progressFraction)}
                    className="transition-all duration-500 ease-out"
                  />
                  <defs>
                    <linearGradient id="grad-progress" x1="0%" y1="0%" x2="100%" y2="0%">
                      {ringColorStops.map((c,i)=> (
                        <stop key={i} offset={`${(i/(ringColorStops.length-1))*100}%`} stopColor={c} />
                      ))}
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-purple-200">{Math.round(progressFraction*100)}%</span>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                  Hello
                </h1>
                <p className="text-[11px] text-gray-300 mt-0.5">Momentum matters—one small action at a time.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <UserMenu user={user} />
            </div>
          </div>
        </div>
      </header>

      {showNudge && (
        <div className="mx-auto max-w-2xl mt-4 px-4">
          <div className="relative overflow-hidden rounded-lg border border-purple-600/40 bg-purple-900/30 p-3 text-xs text-purple-100 flex items-center justify-between">
            <span>Still here? A 2‑minute action now keeps your momentum alive. Pick one item below.</span>
            <button onClick={() => setShowNudge(false)} className="text-purple-300 hover:text-pink-300 ml-4">×</button>
          </div>
        </div>
      )}
      {/* Main Dashboard Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Sticky Quick Action Bar (mobile) */}
        <div className="xl:hidden sticky top-16 z-30 -mx-4 px-4 py-3 bg-gray-900/95 backdrop-blur border-b border-gray-700 flex items-center gap-3 overflow-x-auto">
          <QuickButton label="Check-In" onClick={()=>setActiveModal('checkin')} />
          <QuickButton label="Ritual" onClick={()=> ritual && setActiveModal(`ritual-${ritual.id}`)} />
          <QuickButton label="AI Therapy" premium onClick={()=> setActiveModal('ai-therapy')} />
          <QuickButton label="No Contact" onClick={()=> setActiveModal('no-contact')} />
          <QuickButton label="Quick Win" onClick={()=> setActiveModal('quick-win')} />
          <QuickButton label="Community" onClick={()=> document.getElementById('community-section')?.scrollIntoView({ behavior:'smooth'})} />
        </div>
        <div className="grid gap-6 xl:grid-cols-12 auto-rows-min">
          {/* Sidebar (desktop) */}
          <div className="hidden xl:flex xl:col-span-3 flex-col gap-6">
            <MomentumRing />
            {showSkeleton ? <ZoneSkeleton title="Badges" lines={3} /> : <ProgressZone badges={badges || []} />}
          </div>
          {/* Hero Guidance spanning center/right */}
          <div className="xl:col-span-9 xl:col-start-4 order-1 xl:order-none">
            <HeroGuidance
              dailyInsight={dailyInsight}
              onActionSelect={(key)=>{
                if (key === 'checkIn') setActiveModal('checkin');
                else if (key === 'ritual') { if (ritual) setActiveModal(`ritual-${ritual.id}`); }
                else if (key === 'aiTherapy') setActiveModal('ai-therapy');
                else if (key === 'noContact') setActiveModal('no-contact');
                else if (key === 'quickWin') setActiveModal('quick-win');
              }}
            />
          </div>
          {/* Progress Path */}
          <div className="xl:col-span-5 space-y-6 order-2">
            {!showSkeleton && (
              <ProgressPath
                onOpen={(m: string) => setActiveModal(m)}
                onUpgrade={() => setActiveModal('upgrade')}
              />
            )}
            {/* Collapsible detailed actions */}
            <div className="border border-gray-700/70 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setShowLegacyActions(v => !v)}
                className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium tracking-wide bg-gray-800/60 hover:bg-gray-800 text-purple-200"
              >
                <span>Detailed Daily Actions</span>
                <span className="text-gray-400">{showLegacyActions ? '−' : '+'}</span>
              </button>
              {showLegacyActions && (
                <div className="p-4">
                  {showSkeleton ? <ZoneSkeleton title="Daily Actions" lines={4} /> : (
                    <DailyActionsZone
                      rituals={ritual ? [{
                        id: ritual.id,
                        title: ritual.title,
                        difficulty: (ritual.difficulty as any) || 'easy',
                        completed: ritual.isCompleted || false,
                        duration: typeof ritual.estimatedTime === 'number' ? `${ritual.estimatedTime} min` : (ritual.estimatedTime || '—'),
                        icon: '🌀'
                      }] : []}
                      streaks={{ rituals: 0, noContact: 0 }}
                      onRitualClick={(id: string) => setActiveModal(`ritual-${id}`)}
                      onCheckInClick={() => setActiveModal('checkin')}
                      onAITherapyClick={() => setActiveModal('ai-therapy')}
                      onNoContactClick={() => setActiveModal('no-contact')}
                    />
                  )}
                </div>
              )}
            </div>
            {/* Mobile-only badges + ring (since sidebar hidden) */}
            <div className="xl:hidden space-y-6">
              <MomentumRing />
              {showSkeleton ? <ZoneSkeleton title="Badges" lines={3} /> : <ProgressZone badges={badges || []} />}
            </div>
            {/* Daily tasks inline summary (mobile) */}
            <div className="sm:hidden bg-gray-800/60 border border-gray-700 rounded-lg p-4">
              <p className="text-xs uppercase tracking-wide text-purple-300 mb-2">Daily Tasks</p>
              <div className="space-y-2 text-xs text-gray-300">
                <DailyTaskLine label="Ritual" done={tasks.ritual} />
                <DailyTaskLine label="Check-In" done={tasks.checkIn} />
                <DailyTaskLine label="AI Therapy" done={tasks.aiTherapy} />
                <DailyTaskLine label={authUser?.subscriptionTier === 'premium' ? 'Community Post' : 'Engage (Like)'} done={tasks.community} />
                <DailyTaskLine label="No-Contact Check" done={tasks.noContact} />
              </div>
            </div>
          </div>
          {/* Insights Section */}
            <div className="xl:col-span-5 space-y-6 order-4">
              {showSkeleton ? <ZoneSkeleton title="Insights" lines={5} /> : (
                <InsightsZone dailyInsight={dailyInsight || 'Loading insight...'} user={user} />
              )}
            </div>
          {/* Community Section */}
          <div id="community-section" className="xl:col-span-4 space-y-6 order-3 xl:order-none">
            {showSkeleton ? <ZoneSkeleton title="Community" lines={6} /> : (
              <LiveCommunityZone
                posts={wallPosts}
                canPost={authUser?.subscriptionTier === 'premium'}
                onEngage={() => markTask('community')}
                onPostSubmit={(content: string) => {
                  if (authUser?.subscriptionTier !== 'premium') {
                    markTask('community');
                    return Promise.resolve();
                  }
                  console.log('New post:', content);
                  markTask('community');
                  return Promise.resolve();
                }}
              />
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
  {activeModal?.startsWith('ritual-') && ritual && (
        <RitualModal 
          ritualId={ritual.id}
          rituals={[{ id: ritual.id, title: ritual.title, difficulty: (ritual.difficulty as any) || 'easy', completed: ritual.isCompleted || false, duration: typeof ritual.estimatedTime === 'number' ? `${ritual.estimatedTime} min` : (ritual.estimatedTime || '—'), icon: '🌀', steps: ritual.steps as any }]}
          onClose={() => setActiveModal(null)}
          onComplete={async (ritualId: string) => {
            const success = await completeRitual(ritualId, ritual.difficulty as any);
            if (success) {
              markTask('ritual');
              setActiveModal(null);
            }
            return success;
          }}
        />
      )}

      {activeModal === 'checkin' && (
    <CheckInModal 
          onClose={() => setActiveModal(null)}
          onComplete={() => {
            // Handle check-in completion
      markTask('checkIn');
            setActiveModal(null);
          }}
        />
      )}

      {activeModal === 'ai-therapy' && (
        <AITherapyModal 
          onClose={() => setActiveModal(null)}
          onFirstUserMessage={() => markTask('aiTherapy')}
        />
      )}

      {activeModal === 'no-contact' && (
        <NoContactModal 
          onClose={() => setActiveModal(null)}
          onComplete={() => {
            markTask('noContact');
            setActiveModal(null);
          }}
        />
      )}
      {activeModal === 'upgrade' && (
        <UpgradeModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'quick-win' && (
        <QuickWinModal
          onClose={() => setActiveModal(null)}
          onComplete={() => markTask('quickWin')}
        />
      )}
      {ritual && (ritual as any).tierMismatch && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md bg-yellow-500/20 border border-yellow-600/40 text-xs text-yellow-200 backdrop-blur-sm">
          Ritual tier mismatch detected. We will adjust future assignments automatically.
        </div>
      )}
    </div>
  );
}

// Small helper component (kept in same file to avoid extra import churn)
function DailyTaskLine({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-300">{label}</span>
      <span className={`text-xs font-medium ${done ? 'text-green-400' : 'text-gray-500'}`}>{done ? 'Done' : 'Pending'}</span>
    </div>
  );
}

function ZoneSkeleton({ title, lines = 4 }: { title: string; lines?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-40 bg-gray-700/50 rounded" />
      <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 space-y-3">
        <div className="h-4 w-24 bg-gray-700 rounded" />
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-3 w-full bg-gray-700/70 rounded" />
        ))}
      </div>
    </div>
  );
}

export function HealingHubDashboardWithProvider(props: Props) {
  return (
    <HealingHubProvider>
      <HealingHubDashboard {...props} />
    </HealingHubProvider>
  );
}

// (Removed legacy StreakHistoryGraph placeholder; replaced with real <StreakHistory /> component)

function QuickButton({ label, onClick, premium }: { label: string; onClick: () => void; premium?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="relative px-3 py-2 rounded-md text-[11px] font-medium tracking-wide bg-gray-800/70 hover:bg-gray-700/70 active:bg-gray-600/70 border border-gray-600/60 hover:border-purple-500/50 text-gray-200 hover:text-white transition group"
    >
      {premium && (
        <span className="absolute -top-1 -right-1 text-[9px] px-1 py-0.5 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-500/40">★</span>
      )}
      <span className="relative z-10">{label}</span>
      <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-30 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.4),transparent_60%)] transition" />
    </button>
  );
}
