'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Activity, 
  Shield, 
  TrendingUp, 
  Eye, 
  UserX, 
  Trophy,
  Star,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface AdminDashboardData {
  systemHealth: {
    totalUsers: number;
    activeNoContactPeriods: number;
    completedRituals: number;
    wallPosts: number;
    systemUptime: string;
  };
  userOverview: {
    newUsersToday: number;
    newUsersThisWeek: number;
    usersByTier: {
      anonymous: number;
      verified: number;
      premium: number;
    };
    topUsers: Array<{
      codename: string;
      xpPoints: number;
      tier: string;
      lastActive: string;
    }>;
  };
  contentModeration: {
    flaggedPosts: number;
    reportedContent: number;
    bannedUsers: number;
  };
}

export function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const dashboardData = await response.json();
      setData(dashboardData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-red-500" />
        <span className="ml-2 text-gray-600">Loading Protocol Data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Error Loading Dashboard
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <Button onClick={fetchDashboardData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.systemHealth.totalUsers}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Active in the protocol
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No-Contact Periods</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.systemHealth.activeNoContactPeriods}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rituals Completed</CardTitle>
            <Trophy className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.systemHealth.completedRituals}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Total healing rituals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wall Activity</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.systemHealth.wallPosts}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Wall of Wounds posts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Admin Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="content">Content Moderation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  User Growth
                </CardTitle>
                <CardDescription>
                  New agent registrations in the protocol
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Today</span>
                  <Badge variant="secondary">{data.userOverview.newUsersToday}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">This Week</span>
                  <Badge variant="secondary">{data.userOverview.newUsersThisWeek}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* User Tiers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Agent Classification
                </CardTitle>
                <CardDescription>
                  Distribution by tier level
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Anonymous</span>
                  <Badge variant="outline">{data.userOverview.usersByTier.anonymous}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Verified</span>
                  <Badge variant="default">{data.userOverview.usersByTier.verified}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Premium</span>
                  <Badge variant="destructive">{data.userOverview.usersByTier.premium}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-gold-500" />
                Top Protocol Agents
              </CardTitle>
              <CardDescription>
                Highest XP and most active users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.userOverview.topUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {user.codename}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Last active: {user.lastActive}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={user.tier === 'premium' ? 'destructive' : 'secondary'}>
                        {user.tier}
                      </Badge>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {user.xpPoints} XP
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
                <Eye className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.contentModeration.flaggedPosts}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Requires review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reported Content</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.contentModeration.reportedContent}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  User reports pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Banned Agents</CardTitle>
                <UserX className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.contentModeration.bannedUsers}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Protocol violations
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Moderation Actions</CardTitle>
              <CardDescription>
                Latest content moderation and user management activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                <p>Moderation queue coming soon</p>
                <p className="text-sm">Content filtering and user management tools will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
              <CardDescription>
                Detailed metrics and insights about protocol usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                <p>Analytics dashboard coming soon</p>
                <p className="text-sm">User behavior, ritual completion rates, and engagement metrics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Protocol System Status
          </CardTitle>
          <CardDescription>
            Core system health and operational status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">System Uptime</span>
            <Badge variant="default" className="bg-green-100 text-green-800">
              {data.systemHealth.systemUptime}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
