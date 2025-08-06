'use client';

import React, { useState, useEffect } from 'react';
import { GlowUpConsole } from '@/components/dashboard/GlowUpConsole';
import { AdaptiveDashboard } from '@/components/dashboard/AdaptiveDashboard';
import AuthWrapper from '@/components/AuthWrapper';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface UserStats {
  level: number;
  xp: number;
  nextLevelXP: number;
  progressToNext: number;
  bytes: number;
  streak: number;
  longestStreak: number;
  phase: string;
  ritualsCompleted: number;
  wallPosts: number;
  badgesEarned: number;
  codename: string;
  avatar: string;
  heartState?: string;
  urgencyLevel?: 'immediate' | 'high' | 'moderate' | 'stable';
  primaryFocus?: string;
  stateDescription?: string;
}

export default function GlowUpConsolePage() {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [viewMode, setViewMode] = useState<'glow-up' | 'adaptive'>('glow-up');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const userEmail = localStorage.getItem('user-email') || 'admin@ctrlaltblock.com';
      
      const response = await fetch('/api/dashboard', {
        headers: {
          'x-user-email': userEmail
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Transform dashboard data to UserStats format
        const stats: UserStats = {
          level: data.user.level || 1,
          xp: data.user.xp || 0,
          nextLevelXP: data.user.nextLevelXP || 1000,
          progressToNext: data.user.progressToNext || 0,
          bytes: data.user.bytes || 0,
          streak: data.user.streak || 0,
          longestStreak: data.user.longestStreak || 0,
          phase: data.user.uxStage || 'kernel_wounded',
          ritualsCompleted: data.stats?.ritualsCompleted || 0,
          wallPosts: data.user.wallPosts || 0,
          badgesEarned: 0, // Calculate from achievements if available
          codename: data.user.username || 'AGENT_UNKNOWN',
          avatar: data.user.avatar || '🔥',
          // Heart state data if available from onboarding
          heartState: data.user.heartState || 'EARLY_PROCESSING',
          urgencyLevel: data.user.urgencyLevel || 'moderate',
          primaryFocus: data.user.primaryFocus || 'healing',
          stateDescription: data.user.stateDescription || 'Beginning the healing journey'
        };
        
        setUserStats(stats);
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (section: string) => {
    const routes: Record<string, string> = {
      'today-ritual': '/daily-rituals',
      'wall': '/wall',
      'ai-tools': '/ai-therapy',
      'ai-therapy': '/ai-therapy',
      'streak-shield': '/no-contact',
      'rituals': '/daily-rituals',
      'badges': '/achievements',
      'progress': '/progress',
      'settings': '/settings'
    };
    
    const route = routes[section];
    if (route) {
      window.location.href = route;
    } else {
      console.warn(`No route defined for section: ${section}`);
    }
  };

  if (loading) {
    return (
      <AuthWrapper>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading GLOW-UP CONSOLE...</p>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  if (!userStats) {
    return (
      <AuthWrapper>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400">Failed to load console data</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-cyan-600 hover:bg-cyan-700"
            >
              Retry
            </Button>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="border-b border-gray-800 p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                  GLOW-UP CONSOLE
                </h1>
                <p className="text-gray-400 text-sm">REFORMAT PROTOCOL™ v2.1.0</p>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <div className="bg-gray-800 rounded-lg p-1 flex">
                <button
                  onClick={() => setViewMode('glow-up')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === 'glow-up'
                      ? 'bg-cyan-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Glow-Up
                </button>
                <button
                  onClick={() => setViewMode('adaptive')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === 'adaptive'
                      ? 'bg-cyan-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Adaptive
                </button>
              </div>
              
              <Link href="/settings">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Console Content */}
        <div className="max-w-6xl mx-auto">
          {viewMode === 'glow-up' ? (
            <GlowUpConsole userStats={userStats} onNavigate={handleNavigate} />
          ) : (
            <AdaptiveDashboard userStats={userStats} onNavigate={handleNavigate} />
          )}
        </div>
      </div>
    </AuthWrapper>
  );
}
