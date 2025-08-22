'use client';

import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { User } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Flame, Heart, Shield, Zap, MessageCircle, Mic, Clock, Star } from 'lucide-react';

interface UnifiedDashboardProps {
  user: User;
}

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    tier: 'ghost' | 'firewall' | 'premium';
    bytes: number;
    streak: number;
    totalRituals: number;
    totalCheckIns: number;
    totalNoContacts: number;
  };
  todayActions: {
    checkIn: boolean;
    noContact: boolean;
    ritual: boolean;
  };
  recentActions: Array<{
    id: string;
    type: 'checkin' | 'nocontact' | 'ritual';
    completedAt: string;
    bytes: number;
  }>;
}

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export function UnifiedDashboard({ user }: UnifiedDashboardProps) {
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState<string>('');

  const { data: dashboardData, error, isLoading } = useSWR<DashboardData>(
    '/api/dashboard',
    fetcher
  );

  // Use the subscription tier from the user prop
  const isGhostMode = user.tier === 'ghost' || user.subscriptionTier === 'ghost_mode';

  const handlePremiumFeature = (featureName: string) => {
    if (isGhostMode) {
      setPaywallFeature(featureName);
      setShowPaywall(true);
      return false;
    }
    return true;
  };

  const handleAITherapy = () => {
    if (!handlePremiumFeature('AI Therapy')) return;
    // Navigate to AI therapy
    window.location.href = '/ai-therapy';
  };

  const handleWallPost = () => {
    if (!handlePremiumFeature('Wall Posts')) return;
    // Navigate to wall
    window.location.href = '/wall';
  };

  const handleCompleteAction = async (actionType: 'checkin' | 'nocontact' | 'ritual') => {
    try {
      const response = await fetch(`/api/dashboard/${actionType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to complete action');

      const result = await response.json();
      toast.success(`${actionType} completed! +${result.bytes} bytes earned`);
      
      // Refresh data
      mutate('/api/dashboard');
    } catch (error) {
      toast.error(`Failed to complete ${actionType}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.username || user.email}</h1>
          <p className="text-muted-foreground">
            {isGhostMode ? 'Ghost Mode - Limited Access' : 'Firewall Mode - Full Access'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={isGhostMode ? 'secondary' : 'default'} className="text-lg px-4 py-2">
            <Zap className="w-4 h-4 mr-2" />
            {user.bytes || 0} bytes
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Flame className="w-4 h-4 mr-2" />
            {user.streak || 0} day streak
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="wall">Wall</TabsTrigger>
          <TabsTrigger value="shop">Shop</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Today's Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Actions</CardTitle>
              <CardDescription>Complete your daily actions to earn bytes and maintain your streak</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Daily Check-in */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-500" />
                      <span className="font-medium">Daily Check-in</span>
                    </div>
                    {dashboardData.todayActions.checkIn ? (
                      <Badge variant="default">+2 bytes</Badge>
                    ) : (
                      <Badge variant="outline">2 bytes</Badge>
                    )}
                  </div>
                  {dashboardData.todayActions.checkIn ? (
                    <p className="text-sm text-green-600">Completed today!</p>
                  ) : (
                    <Button 
                      onClick={() => handleCompleteAction('checkin')}
                      className="w-full mt-2"
                    >
                      Complete Check-in
                    </Button>
                  )}
                </div>

                {/* No Contact */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">No Contact</span>
                    </div>
                    {dashboardData.todayActions.noContact ? (
                      <Badge variant="default">+3 bytes</Badge>
                    ) : (
                      <Badge variant="outline">3 bytes</Badge>
                    )}
                  </div>
                  {dashboardData.todayActions.noContact ? (
                    <p className="text-sm text-green-600">Completed today!</p>
                  ) : (
                    <Button 
                      onClick={() => handleCompleteAction('nocontact')}
                      className="w-full mt-2"
                    >
                      Log No Contact
                    </Button>
                  )}
                </div>

                {/* Daily Ritual */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="font-medium">Daily Ritual</span>
                    </div>
                    {dashboardData.todayActions.ritual ? (
                      <Badge variant="default">+5 bytes</Badge>
                    ) : (
                      <Badge variant="outline">5 bytes</Badge>
                    )}
                  </div>
                  {dashboardData.todayActions.ritual ? (
                    <p className="text-sm text-green-600">Completed today!</p>
                  ) : (
                    <Button 
                      onClick={() => handleCompleteAction('ritual')}
                      className="w-full mt-2"
                    >
                      Complete Ritual
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Therapy Section */}
          <Card>
            <CardHeader>
              <CardTitle>AI Therapy</CardTitle>
              <CardDescription>Get personalized therapy support with our AI therapist</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={handleAITherapy}
                  className="flex items-center gap-2"
                  disabled={isGhostMode}
                  variant={isGhostMode ? 'outline' : 'default'}
                >
                  <MessageCircle className="w-4 h-4" />
                  AI Chat Therapy
                  {isGhostMode && <Badge variant="secondary" className="ml-2">Premium</Badge>}
                </Button>
                <Button 
                  onClick={handleAITherapy}
                  className="flex items-center gap-2"
                  disabled={isGhostMode}
                  variant={isGhostMode ? 'outline' : 'default'}
                >
                  <Mic className="w-4 h-4" />
                  AI Voice Therapy
                  {isGhostMode && <Badge variant="secondary" className="ml-2">Premium</Badge>}
                </Button>
              </div>
              {isGhostMode && (
                <p className="text-sm text-muted-foreground mt-2">
                  Upgrade to Firewall Mode to access AI therapy features
                </p>
              )}
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Check-ins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.user.totalCheckIns || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">No Contact Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.user.totalNoContacts || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Rituals Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.user.totalRituals || 0}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent completed actions</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData.recentActions.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.recentActions.map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {action.type === 'checkin' && <Heart className="w-4 h-4 text-pink-500" />}
                        {action.type === 'nocontact' && <Shield className="w-4 h-4 text-blue-500" />}
                        {action.type === 'ritual' && <Flame className="w-4 h-4 text-orange-500" />}
                        <div>
                          <p className="font-medium capitalize">{action.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(action.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">+{action.bytes} bytes</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No recent activities. Complete your first action to get started!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wall" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Wall</CardTitle>
              <CardDescription>Share your progress with the community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Button 
                  onClick={handleWallPost}
                  disabled={isGhostMode}
                  variant={isGhostMode ? 'outline' : 'default'}
                  className="mb-4"
                >
                  Create Wall Post
                  {isGhostMode && <Badge variant="secondary" className="ml-2">Premium</Badge>}
                </Button>
                {isGhostMode && (
                  <p className="text-sm text-muted-foreground">
                    Upgrade to Firewall Mode to post on the community wall
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shop" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Byte Shop</CardTitle>
              <CardDescription>Spend your earned bytes on rewards and upgrades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Shop features coming soon!</p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Clock className="w-4 h-4" />
                  <span>In development</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Paywall Modal */}
      <Dialog open={showPaywall} onOpenChange={setShowPaywall}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to Access {paywallFeature}</DialogTitle>
            <DialogDescription>
              This feature is available with Firewall Mode. Upgrade now to unlock all premium features.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Firewall Mode Benefits:</h3>
              <ul className="text-sm space-y-1">
                <li>• AI Chat & Voice Therapy</li>
                <li>• Community Wall Access</li>
                <li>• Advanced Analytics</li>
                <li>• Priority Support</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => window.location.href = '/pricing'}
                className="flex-1"
              >
                <Star className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowPaywall(false)}
                className="flex-1"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
