"use client";

import { useState, useEffect } from 'react';
import { User } from 'lucia';
import { DailyActionsZone } from './DailyActionsZone';
import { LiveCommunityZone } from './LiveCommunityZone';
import { ProgressZone } from './ProgressZone';
import { InsightsZone } from './InsightsZone';
import { RitualModal } from './modals/RitualModal';
import { CheckInModal } from './modals/CheckInModal';
import { AITherapyModal } from './modals/AITherapyModal';
import { NoContactModal } from './modals/NoContactModal';
import { UserMenu } from './UserMenu';

interface Props {
  user: User;
}

interface DashboardData {
  streaks: {
    rituals: number;
    noContact: number;
  };
  xp: {
    current: number;
    level: number;
    nextLevelXP: number;
    progressFraction: number;
  };
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    unlocked: boolean;
  }>;
  todaysRituals: Array<{
    id: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    completed: boolean;
    duration: string;
    icon: string;
  }>;
  wallPosts: Array<{
    id: string;
    content: string;
    archetype: string;
    timeAgo: string;
    reactions: number;
    anonymous: boolean;
  }>;
  dailyInsight: string;
  motivationMeter: {
    level: number;
    message: string;
  };
}

export function HealingHubDashboard({ user }: Props) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedRituals, setCompletedRituals] = useState<Set<string>>(new Set());

  // Load completed rituals from localStorage on mount
  useEffect(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem(`completed-rituals-${today}`);
    if (saved) {
      setCompletedRituals(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save completed rituals to localStorage
  const saveCompletedRituals = (newCompleted: Set<string>) => {
    const today = new Date().toDateString();
    localStorage.setItem(`completed-rituals-${today}`, JSON.stringify([...newCompleted]));
    setCompletedRituals(newCompleted);
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard/hub');
        const dashboardData = await response.json();
        
        // Apply completed rituals from localStorage
        if (dashboardData.todaysRituals) {
          dashboardData.todaysRituals = dashboardData.todaysRituals.map((ritual: any) => ({
            ...ritual,
            completed: completedRituals.has(ritual.id) || ritual.completed
          }));
        }
        
        setData(dashboardData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set fallback data with completed rituals applied
        const fallbackData = {
          streaks: { rituals: 7, noContact: 12 },
          xp: { current: 450, level: 3, nextLevelXP: 600, progressFraction: 0.75 },
          badges: [
            { id: '1', name: 'First Steps', icon: '👟', unlocked: true },
            { id: '2', name: 'Week Warrior', icon: '⚔️', unlocked: true },
            { id: '3', name: 'AI Explorer', icon: '🤖', unlocked: false }
          ],
          todaysRituals: [
            { id: '1', title: 'Morning Affirmation', difficulty: 'easy' as const, completed: completedRituals.has('1'), duration: '2 min', icon: '🌅' },
            { id: '2', title: 'Boundary Setting Practice', difficulty: 'medium' as const, completed: completedRituals.has('2'), duration: '5 min', icon: '🛡️' },
            { id: '3', title: 'Evening Reflection', difficulty: 'easy' as const, completed: completedRituals.has('3'), duration: '3 min', icon: '🌙' }
          ],
          wallPosts: [
            { id: '1', content: 'Just realized I deserve better treatment. Small win but it feels huge.', archetype: 'Data Flooder', timeAgo: '2m', reactions: 8, anonymous: true },
            { id: '2', content: 'Three weeks no contact. The urge to text is still there but getting weaker.', archetype: 'Firewall Builder', timeAgo: '15m', reactions: 12, anonymous: true },
            { id: '3', content: 'Had my first boundary conversation today. Scary but proud of myself.', archetype: 'Secure Node', timeAgo: '1h', reactions: 15, anonymous: true }
          ],
          dailyInsight: 'Your consistent ritual practice is building new neural pathways. Each small action compounds.',
          motivationMeter: { level: 8, message: 'Momentum Building!' }
        };
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [completedRituals]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (data) {
        // Refresh specific data points
        // This would call specific endpoints for real-time updates
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading your healing hub...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <header className="border-b border-gray-600/30 bg-gray-800/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Healing Hub
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <UserMenu user={user} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
          
          {/* Zone 1: Daily Actions - Top Left */}
          <div className="space-y-6">
            <DailyActionsZone 
              rituals={data.todaysRituals}
              streaks={data.streaks}
              onRitualClick={(id: string) => setActiveModal(`ritual-${id}`)}
              onCheckInClick={() => setActiveModal('checkin')}
              onAITherapyClick={() => setActiveModal('ai-therapy')}
              onNoContactClick={() => setActiveModal('no-contact')}
            />
          </div>

          {/* Zone 2: Live Community - Top Right */}
          <div className="space-y-6">
            <LiveCommunityZone 
              posts={data.wallPosts}
              onPostSubmit={(content: string) => {
                // Handle new post submission
                console.log('New post:', content);
              }}
            />
          </div>

          {/* Zone 3: Progress & Gamification - Bottom Left */}
          <div className="space-y-6">
            <ProgressZone 
              xp={data.xp}
              streaks={data.streaks}
              badges={data.badges}
              motivationMeter={data.motivationMeter}
            />
          </div>

          {/* Zone 4: Insights & Encouragement - Bottom Right */}
          <div className="space-y-6">
            <InsightsZone 
              dailyInsight={data.dailyInsight}
              user={user}
            />
          </div>

        </div>
      </main>

      {/* Modals */}
      {activeModal?.startsWith('ritual-') && (
        <RitualModal 
          ritualId={activeModal.replace('ritual-', '')}
          rituals={data.todaysRituals}
          onClose={() => setActiveModal(null)}
          onComplete={(ritualId: string) => {
            // Mark ritual as completed and save to localStorage
            const newCompleted = new Set(completedRituals);
            newCompleted.add(ritualId);
            saveCompletedRituals(newCompleted);
            
            // Update data state
            setData(prev => prev ? {
              ...prev,
              todaysRituals: prev.todaysRituals.map(r => 
                r.id === ritualId ? { ...r, completed: true } : r
              )
            } : null);
            setActiveModal(null);
          }}
        />
      )}

      {activeModal === 'checkin' && (
        <CheckInModal 
          onClose={() => setActiveModal(null)}
          onComplete={() => {
            // Handle check-in completion
            setActiveModal(null);
          }}
        />
      )}

      {activeModal === 'ai-therapy' && (
        <AITherapyModal 
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'no-contact' && (
        <NoContactModal 
          onClose={() => setActiveModal(null)}
          onComplete={() => {
            setActiveModal(null);
          }}
        />
      )}
    </div>
  );
}
