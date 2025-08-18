"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  DollarSign, 
  MessageSquare, 
  Heart,
  Zap,
  Clock,
  RefreshCw,
  Download,
  Filter,
  BarChart3,
  PieChart
} from 'lucide-react';

interface AnalyticsMetrics {
  userMetrics: {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    newUsersThisWeek: number;
    retentionRate: number;
    churnRate: number;
  };
  engagementMetrics: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionDuration: number;
    wallPostsCreated: number;
    wallReactionsGiven: number;
    ritualsCompleted: number;
  };
  conversionMetrics: {
    signupToSubscription: number;
    freeToPayingConversion: number;
    subscriptionRetention: number;
    monthlyRecurringRevenue: number;
    averageRevenuePerUser: number;
  };
  contentMetrics: {
    mostPopularCategories: Array<{ category: string; count: number }>;
    topPerformingPosts: Array<{ id: string; reactions: number; content: string }>;
    userContentCreation: number;
  };
}

type TimeFrame = '24h' | '7d' | '30d';

export function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<TimeFrame>('30d');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, [timeframe]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/analytics/dashboard?timeframe=${timeframe}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const data = await response.json();
      setMetrics(data.metrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMetrics();
    setRefreshing(false);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTimeframeLabel = (tf: TimeFrame): string => {
    switch (tf) {
      case '24h': return 'Last 24 Hours';
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
    }
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin text-purple-500" />
          <span className="text-gray-300">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-400 mb-2">Failed to load analytics</div>
          <Button onClick={fetchMetrics} variant="outline" size="sm">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400">Track user engagement and platform performance</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Timeframe Selector */}
          <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
            {(['24h', '7d', '30d'] as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  timeframe === tf
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {getTimeframeLabel(tf)}
              </button>
            ))}
          </div>
          
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="bg-gray-800/60 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total Users</p>
                <p className="text-2xl font-bold text-white">
                  {formatNumber(metrics.userMetrics.totalUsers)}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <span className="text-xs text-green-400">
                    +{metrics.userMetrics.newUsersThisWeek} this week
                  </span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card className="bg-gray-800/60 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Active Users</p>
                <p className="text-2xl font-bold text-white">
                  {formatNumber(metrics.engagementMetrics.dailyActiveUsers)}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <Activity className="h-3 w-3 text-green-400" />
                  <span className="text-xs text-gray-400">Daily active</span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card className="bg-gray-800/60 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Conversion Rate</p>
                <p className="text-2xl font-bold text-white">
                  {metrics.conversionMetrics.freeToPayingConversion.toFixed(1)}%
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-purple-400" />
                  <span className="text-xs text-gray-400">Free to paid</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        {/* Engagement Score */}
        <Card className="bg-gray-800/60 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Engagement</p>
                <p className="text-2xl font-bold text-white">
                  {formatNumber(metrics.engagementMetrics.wallPostsCreated + metrics.engagementMetrics.wallReactionsGiven)}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <Heart className="h-3 w-3 text-pink-400" />
                  <span className="text-xs text-gray-400">Total interactions</span>
                </div>
              </div>
              <Heart className="h-8 w-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Chart */}
        <Card className="bg-gray-800/60 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>User Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Daily Active Users</span>
                <span className="text-lg font-semibold text-white">
                  {formatNumber(metrics.engagementMetrics.dailyActiveUsers)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Weekly Active Users</span>
                <span className="text-lg font-semibold text-white">
                  {formatNumber(metrics.engagementMetrics.weeklyActiveUsers)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Monthly Active Users</span>
                <span className="text-lg font-semibold text-white">
                  {formatNumber(metrics.engagementMetrics.monthlyActiveUsers)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Rituals Completed</span>
                <span className="text-lg font-semibold text-white">
                  {formatNumber(metrics.engagementMetrics.ritualsCompleted)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Performance */}
        <Card className="bg-gray-800/60 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Content Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Posts Created</span>
                <span className="text-lg font-semibold text-white">
                  {formatNumber(metrics.engagementMetrics.wallPostsCreated)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Reactions Given</span>
                <span className="text-lg font-semibold text-white">
                  {formatNumber(metrics.engagementMetrics.wallReactionsGiven)}
                </span>
              </div>
              
              {/* Popular Categories */}
              <div className="mt-4">
                <p className="text-sm text-gray-300 mb-2">Popular Categories</p>
                <div className="space-y-2">
                  {metrics.contentMetrics.mostPopularCategories.slice(0, 3).map((category, index) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 capitalize">
                        {category.category}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Posts */}
      <Card className="bg-gray-800/60 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Top Performing Posts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.contentMetrics.topPerformingPosts.map((post, index) => (
              <div key={post.id} className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 line-clamp-2">{post.content}</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3 text-pink-400" />
                      <span className="text-xs text-gray-400">{post.reactions} reactions</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {metrics.contentMetrics.topPerformingPosts.length === 0 && (
              <p className="text-center text-gray-400 py-8">No posts data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
