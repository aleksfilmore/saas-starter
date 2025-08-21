'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { EmailNotificationAdmin } from '@/components/admin/EmailNotificationAdmin';
import { ModerationDashboard } from '@/components/admin/ModerationDashboard';
import { WebAnalyticsDashboard } from '@/components/admin/MobileAppDashboard';
import { RealTimeAnalytics } from '@/components/admin/RealTimeAnalytics';
import { BlogManagement } from '@/components/admin/BlogManagement';
import { RitualLibraryManagement } from '@/components/admin/RitualLibraryManagement';
import { WallPostManagement } from '@/components/admin/WallPostManagement';
import { UserManagement } from '@/components/admin/UserManagement';
import { BadgeManagement } from '@/components/admin/BadgeManagement';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Settings, 
  Database,
  BarChart3,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  LogOut,
  Crown
} from 'lucide-react';

interface SystemStatus {
  database: 'healthy' | 'warning' | 'error';
  auth: 'healthy' | 'warning' | 'error';
  stripe: 'healthy' | 'warning' | 'error';
  analytics: 'healthy' | 'warning' | 'error';
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  pendingPosts: number;
  totalRevenue: number;
  activeSubscriptions: number;
  pendingModeration: number;
  flaggedToday: number;
  activePosts: number;
}

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: 'healthy',
    auth: 'healthy', 
    stripe: 'healthy',
    analytics: 'healthy'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Initialize with minimal real stats (no dummy data)
      let realStats: AdminStats = {
        totalUsers: 0,
        activeUsers: 0,
        totalPosts: 0,
        pendingPosts: 0,
        totalRevenue: 0,
        activeSubscriptions: 0,
        pendingModeration: 0,
        flaggedToday: 0,
        activePosts: 0
      };

      // Fetch real analytics data from our APIs
      const [revenueResponse, retentionResponse] = await Promise.all([
        fetch('/api/analytics/revenue'),
        fetch('/api/analytics/retention')
      ]);

      // Use real revenue data if available
      if (revenueResponse.ok) {
        const revenueData = await revenueResponse.json();
        realStats.totalRevenue = (revenueData.totalRevenue / 100) || 0; // Convert from cents
        realStats.activeSubscriptions = revenueData.totalSubscriptions || 0;
      }

      // Try to get additional user data from database
      try {
        const userStatsResponse = await fetch('/api/admin/user-stats');
        if (userStatsResponse.ok) {
          const userStatsData = await userStatsResponse.json();
          realStats.totalUsers = userStatsData.totalUsers || 0;
          realStats.activeUsers = userStatsData.activeUsers || 0;
        }
      } catch (error) {
        console.log('User stats API not available');
      }

      // Try to get moderation stats (keep wall posts data as requested)
      try {
        const moderationStatsResponse = await fetch('/api/admin/moderation/stats');
        if (moderationStatsResponse.ok) {
          const moderationData = await moderationStatsResponse.json();
          realStats.pendingModeration = moderationData.stats.pendingModeration || 0;
          realStats.flaggedToday = moderationData.stats.flaggedToday || 0;
          realStats.totalPosts = moderationData.stats.totalPosts || 0;
          realStats.activePosts = moderationData.stats.activePosts || 0;
          realStats.pendingPosts = moderationData.stats.pendingModeration || 0;
        }
      } catch (error) {
        console.log('Moderation stats API not available');
      }

      // Update system status based on API availability
      setSystemStatus(prev => ({
        ...prev,
        analytics: revenueResponse.ok ? 'healthy' : 'warning',
        database: 'healthy', // Database is working since we can access admin panel
        auth: 'healthy', // Auth is working since admin is logged in
        stripe: revenueResponse.ok ? 'healthy' : 'warning'
      }));
      
      setStats(realStats);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      
      // On error, use zeros instead of dummy data
      const errorStats: AdminStats = {
        totalUsers: 0,
        activeUsers: 0,
        totalPosts: 0,
        pendingPosts: 0,
        totalRevenue: 0,
        activeSubscriptions: 0,
        pendingModeration: 0,
        flaggedToday: 0,
        activePosts: 0
      };
      setStats(errorStats);
      
      // Update system status to show error
      setSystemStatus(prev => ({
        ...prev,
        analytics: 'error',
        stripe: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        {/* Header */}
        <div className="border-b border-purple-500/20 bg-black/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-white">CTRL</span>
                  <span className="text-gray-400">+</span>
                  <span className="text-2xl font-bold text-white">ALT</span>
                  <span className="text-gray-400">+</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent brand-glitch" data-text="BLOCK">BLOCK</span>
                  <span className="ml-3 text-lg text-purple-400">Admin</span>
                </div>
                <div className="ml-6">
                  <h1 className="text-xl font-bold text-white">
                    Control Panel
                  </h1>
                  <p className="text-gray-400">
                    System management and analytics
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Admin info */}
                <div className="flex items-center gap-2 px-3 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg">
                  <Crown className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-gray-300">
                    {user?.email || 'Admin'}
                  </span>
                  <Badge className="bg-purple-600 text-white text-xs">
                    System Admin
                  </Badge>
                </div>
                
                <Button onClick={fetchAdminData} variant="outline" className="border-purple-500/40 text-purple-400 hover:bg-purple-900/30">
                  Refresh Data
                </Button>
                
                <Button 
                  onClick={() => logout()}
                  variant="outline"
                  className="border-red-500/40 text-red-400 hover:bg-red-900/30"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-8 bg-gray-800/50 border border-purple-500/20">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300">Platform Control</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300">Analytics</TabsTrigger>
              <TabsTrigger value="blog" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300">Blog</TabsTrigger>
              <TabsTrigger value="rituals" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300">Rituals</TabsTrigger>
              <TabsTrigger value="wall" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300">Wall Posts</TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300">Users</TabsTrigger>
              <TabsTrigger value="moderation" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300">Moderation</TabsTrigger>
              <TabsTrigger value="system" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300">System</TabsTrigger>
            </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <Card className="bg-gray-800/50 border-purple-500/20 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                    <p className="text-xs text-gray-400">
                      {stats.activeUsers} active this month
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-purple-500/20 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Wall Posts</CardTitle>
                    <BarChart3 className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.totalPosts}</div>
                    <p className="text-xs text-gray-400">
                      {stats.activePosts} active
                    </p>
                  </CardContent>
                </Card>

                <Card className={`${stats.pendingModeration > 0 ? 'border-yellow-400/40 bg-yellow-900/20' : 'bg-gray-800/50 border-purple-500/20'} text-white`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Pending Review</CardTitle>
                    <AlertTriangle className={`h-4 w-4 ${stats.pendingModeration > 0 ? 'text-yellow-400' : 'text-purple-400'}`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${stats.pendingModeration > 0 ? 'text-yellow-400' : 'text-white'}`}>
                      {stats.pendingModeration}
                    </div>
                    <p className="text-xs text-gray-400">
                      {stats.flaggedToday} flagged today
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-purple-500/20 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Revenue</CardTitle>
                    <Database className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      ${stats.totalRevenue.toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-400">
                      This month
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-purple-500/20 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Subscriptions</CardTitle>
                    <UserCheck className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.activeSubscriptions}</div>
                    <p className="text-xs text-gray-400">
                      Active paying users
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* System Status */}
            <Card className="bg-gray-800/50 border-purple-500/20 text-white">
              <CardHeader>
                <CardTitle className="text-white">System Status</CardTitle>
                <CardDescription className="text-gray-400">
                  Current health of all system components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center justify-between p-3 border border-purple-500/20 rounded-lg bg-gray-900/30">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(systemStatus.database)}
                      <span className="font-medium text-gray-300">Database</span>
                    </div>
                    <Badge 
                      variant={systemStatus.database === 'healthy' ? 'default' : 'destructive'}
                      className={`${getStatusColor(systemStatus.database)} bg-gray-800 border-purple-500/20`}
                    >
                      {systemStatus.database}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-purple-500/20 rounded-lg bg-gray-900/30">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(systemStatus.auth)}
                      <span className="font-medium text-gray-300">Authentication</span>
                    </div>
                    <Badge 
                      variant={systemStatus.auth === 'healthy' ? 'default' : 'destructive'}
                      className={`${getStatusColor(systemStatus.auth)} bg-gray-800 border-purple-500/20`}
                    >
                      {systemStatus.auth}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-purple-500/20 rounded-lg bg-gray-900/30">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(systemStatus.stripe)}
                      <span className="font-medium text-gray-300">Stripe</span>
                    </div>
                    <Badge 
                      variant={systemStatus.stripe === 'healthy' ? 'default' : 'destructive'}
                      className={`${getStatusColor(systemStatus.stripe)} bg-gray-800 border-purple-500/20`}
                    >
                      {systemStatus.stripe}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-purple-500/20 rounded-lg bg-gray-900/30">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(systemStatus.analytics)}
                      <span className="font-medium text-gray-300">Analytics</span>
                    </div>
                    <Badge 
                      variant={systemStatus.analytics === 'healthy' ? 'default' : 'destructive'}
                      className={`${getStatusColor(systemStatus.analytics)} bg-gray-800 border-purple-500/20`}
                    >
                      {systemStatus.analytics}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <RealTimeAnalytics />
          </TabsContent>

          <TabsContent value="blog" className="space-y-6">
            <BlogManagement />
          </TabsContent>

          <TabsContent value="rituals" className="space-y-6">
            <RitualLibraryManagement />
          </TabsContent>

          <TabsContent value="wall" className="space-y-6">
            <WallPostManagement />
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <ModerationDashboard />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <BadgeManagement />
            <EmailNotificationAdmin />
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </AdminGuard>
  );
}
