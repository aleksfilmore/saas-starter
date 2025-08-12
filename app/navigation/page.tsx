'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MainNavigation } from '@/components/navigation/MainNavigation';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Compass } from 'lucide-react';
import Link from 'next/link';

interface UserStats {
  level: number;
  xp: number;
  streak: number;
  bytes: number;
  username: string;
}

export default function NavigationPage() {
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserStats = useCallback(async () => {
    if (!user) return;
    
    try {
      const statsData = {
        level: user.level || 1,
        xp: user.xp || 0,
        streak: user.streak || 0,
        bytes: user.bytes || 0,
        username: user.email?.split('@')[0] || 'Warrior'
      };
      setUserStats(statsData);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    } else if (!isLoading) {
      setLoading(false);
    }
  }, [user, isLoading, fetchUserStats]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200">Loading navigation...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Please log in to access navigation.</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-purple-300 hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white">
                    <Compass className="inline h-8 w-8 mr-3 text-purple-400" />
                    Navigation Center
                  </h1>
                  <p className="text-purple-300 mt-2">
                    Explore all healing tools and features available to you
                  </p>
                </div>
              </div>
            </div>

            {/* Platform Status */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3"></div>
                  Platform Status: ONLINE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Total Features</p>
                    <p className="text-white font-semibold">15+ Tools</p>
                  </div>
                  <div>
                    <p className="text-gray-400">AI Systems</p>
                    <p className="text-green-400 font-semibold">Active</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Community</p>
                    <p className="text-blue-400 font-semibold">Live</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Analytics</p>
                    <p className="text-purple-400 font-semibold">Real-time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Navigation */}
          <MainNavigation currentPath={pathname ?? undefined} userStats={userStats ?? undefined} />

        </div>
      </div>

      <SiteFooter />
    </>
  );
}
