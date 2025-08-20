'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone, 
  Download,
  Users,
  TrendingUp,
  Activity,
  Star,
  AlertTriangle,
  Wifi,
  Battery,
  Zap,
  BarChart3,
  RefreshCw,
  Globe,
  Target
} from 'lucide-react';

interface MobileAppMetrics {
  overview: {
    totalDownloads: number;
    activeUsers: {
      daily: number;
      weekly: number;
      monthly: number;
    };
    averageSessionDuration: number;
    crashRate: number;
    averageRating: number;
    totalRatings: number;
  };
  platforms: {
    ios: {
      downloads: number;
      activeUsers: number;
      version: string;
      crashes: number;
      rating: number;
    };
    android: {
      downloads: number;
      activeUsers: number;
      version: string;
      crashes: number;
      rating: number;
    };
  };
  features: Array<{
    feature: string;
    usage: number;
    platform: 'both' | 'ios' | 'android';
    crashesRelated: number;
  }>;
  retention: {
    day1: number;
    day7: number;
    day30: number;
  };
  errors: Array<{
    id: string;
    message: string;
    platform: 'ios' | 'android';
    count: number;
    lastSeen: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  performance: {
    averageAppLaunchTime: number;
    averageApiResponseTime: number;
    networkErrors: number;
    memoryUsage: {
      average: number;
      peak: number;
    };
  };
}

export function MobileAppDashboard() {
  const [metrics, setMetrics] = useState<MobileAppMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('7d');

  useEffect(() => {
    fetchMobileMetrics();
  }, [timeframe]);

  const fetchMobileMetrics = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would fetch from your mobile analytics API
      // For now, we'll use simulated data that represents realistic metrics
      const mockData: MobileAppMetrics = {
        overview: {
          totalDownloads: 2547,
          activeUsers: {
            daily: 156,
            weekly: 423,
            monthly: 1205
          },
          averageSessionDuration: 8.5, // minutes
          crashRate: 0.02, // 2%
          averageRating: 4.6,
          totalRatings: 89
        },
        platforms: {
          ios: {
            downloads: 1534,
            activeUsers: 234,
            version: '1.2.0',
            crashes: 12,
            rating: 4.7
          },
          android: {
            downloads: 1013,
            activeUsers: 189,
            version: '1.2.0',
            crashes: 8,
            rating: 4.5
          }
        },
        features: [
          { feature: 'Daily Rituals', usage: 89, platform: 'both', crashesRelated: 0 },
          { feature: 'AI Therapy Chat', usage: 76, platform: 'both', crashesRelated: 2 },
          { feature: 'No-Contact Tracker', usage: 92, platform: 'both', crashesRelated: 0 },
          { feature: 'Wall of Wounds', usage: 67, platform: 'both', crashesRelated: 1 },
          { feature: 'Progress Dashboard', usage: 84, platform: 'both', crashesRelated: 0 },
          { feature: 'Crisis Support', usage: 34, platform: 'both', crashesRelated: 0 }
        ],
        retention: {
          day1: 78.5,
          day7: 45.2,
          day30: 23.8
        },
        errors: [
          {
            id: 'ERR_001',
            message: 'Network timeout in AI chat',
            platform: 'android',
            count: 15,
            lastSeen: new Date().toISOString(),
            severity: 'medium'
          },
          {
            id: 'ERR_002', 
            message: 'Memory leak in ritual animations',
            platform: 'ios',
            count: 8,
            lastSeen: new Date(Date.now() - 3600000).toISOString(),
            severity: 'high'
          }
        ],
        performance: {
          averageAppLaunchTime: 2.1, // seconds
          averageApiResponseTime: 456, // milliseconds
          networkErrors: 23,
          memoryUsage: {
            average: 145, // MB
            peak: 278 // MB
          }
        }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMetrics(mockData);
    } catch (error) {
      console.error('Failed to fetch mobile metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;
  const formatDuration = (minutes: number) => `${minutes.toFixed(1)}m`;

  if (loading || !metrics) {
    return (
      <div className="p-6">
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mobile App Analytics</h1>
          <p className="text-gray-600">iOS and Android app performance metrics</p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          <Button onClick={fetchMobileMetrics} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.overview.totalDownloads.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              iOS: {metrics.platforms.ios.downloads} • Android: {metrics.platforms.android.downloads}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.overview.activeUsers.monthly.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Daily: {metrics.overview.activeUsers.daily} • Weekly: {metrics.overview.activeUsers.weekly}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">App Store Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.overview.averageRating.toFixed(1)} ⭐
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.overview.totalRatings} reviews
            </p>
          </CardContent>
        </Card>

        <Card className={metrics.overview.crashRate > 0.05 ? 'border-red-200 bg-red-50' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crash Rate</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${metrics.overview.crashRate > 0.05 ? 'text-red-500' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metrics.overview.crashRate > 0.05 ? 'text-red-600' : ''}`}>
              {formatPercent(metrics.overview.crashRate * 100)}
            </div>
            <p className="text-xs text-muted-foreground">
              Target: &lt; 1%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="features">Feature Usage</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="errors">Errors & Crashes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
                <CardDescription>
                  Percentage of users who return after initial app install
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Day 1 Retention</span>
                      <span className="font-bold">{formatPercent(metrics.retention.day1)}</span>
                    </div>
                    <Progress value={metrics.retention.day1} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Day 7 Retention</span>
                      <span className="font-bold">{formatPercent(metrics.retention.day7)}</span>
                    </div>
                    <Progress value={metrics.retention.day7} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Day 30 Retention</span>
                      <span className="font-bold">{formatPercent(metrics.retention.day30)}</span>
                    </div>
                    <Progress value={metrics.retention.day30} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Metrics</CardTitle>
                <CardDescription>
                  User engagement and session quality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Average Session Duration</span>
                    <span className="font-bold">{formatDuration(metrics.overview.averageSessionDuration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Active Users</span>
                    <span className="font-bold">{metrics.overview.activeUsers.daily}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekly Active Users</span>
                    <span className="font-bold">{metrics.overview.activeUsers.weekly}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Active Users</span>
                    <span className="font-bold">{metrics.overview.activeUsers.monthly}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  iOS Metrics
                </CardTitle>
                <CardDescription>iPhone and iPad app performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Downloads</span>
                  <span className="font-bold">{metrics.platforms.ios.downloads.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Users</span>
                  <span className="font-bold">{metrics.platforms.ios.activeUsers}</span>
                </div>
                <div className="flex justify-between">
                  <span>App Version</span>
                  <Badge variant="outline">{metrics.platforms.ios.version}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Crashes (7d)</span>
                  <span className="font-bold text-red-600">{metrics.platforms.ios.crashes}</span>
                </div>
                <div className="flex justify-between">
                  <span>App Store Rating</span>
                  <span className="font-bold">{metrics.platforms.ios.rating} ⭐</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Android Metrics
                </CardTitle>
                <CardDescription>Google Play Store app performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Downloads</span>
                  <span className="font-bold">{metrics.platforms.android.downloads.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Users</span>
                  <span className="font-bold">{metrics.platforms.android.activeUsers}</span>
                </div>
                <div className="flex justify-between">
                  <span>App Version</span>
                  <Badge variant="outline">{metrics.platforms.android.version}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Crashes (7d)</span>
                  <span className="font-bold text-red-600">{metrics.platforms.android.crashes}</span>
                </div>
                <div className="flex justify-between">
                  <span>Play Store Rating</span>
                  <span className="font-bold">{metrics.platforms.android.rating} ⭐</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Usage Analytics</CardTitle>
              <CardDescription>
                Most popular features and their usage patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.features.map((feature, index) => (
                  <div key={feature.feature} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span className="font-medium">{feature.feature}</span>
                        {feature.crashesRelated > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {feature.crashesRelated} crashes
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {feature.usage}% usage
                        </span>
                      </div>
                    </div>
                    <Progress value={feature.usage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  App Performance
                </CardTitle>
                <CardDescription>Speed and responsiveness metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Average Launch Time</span>
                  <span className="font-bold">{metrics.performance.averageAppLaunchTime}s</span>
                </div>
                <div className="flex justify-between">
                  <span>API Response Time</span>
                  <span className="font-bold">{metrics.performance.averageApiResponseTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Network Errors (7d)</span>
                  <span className="font-bold text-yellow-600">{metrics.performance.networkErrors}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Battery className="h-5 w-5" />
                  Memory Usage
                </CardTitle>
                <CardDescription>App memory consumption patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Average Memory</span>
                  <span className="font-bold">{metrics.performance.memoryUsage.average}MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Peak Memory</span>
                  <span className="font-bold">{metrics.performance.memoryUsage.peak}MB</span>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">Memory Usage Distribution</div>
                  <Progress 
                    value={(metrics.performance.memoryUsage.average / metrics.performance.memoryUsage.peak) * 100} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Errors & Crashes</CardTitle>
              <CardDescription>
                Critical issues affecting mobile app users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metrics.errors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Critical Errors!</h3>
                  <p>Mobile app is running smoothly without major issues.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {metrics.errors.map((error) => (
                    <div key={error.id} className={`p-4 border rounded-lg ${
                      error.severity === 'high' ? 'border-red-200 bg-red-50' :
                      error.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                      'border-blue-200 bg-blue-50'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={
                            error.severity === 'high' ? 'bg-red-100 text-red-800' :
                            error.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }>
                            {error.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{error.platform.toUpperCase()}</Badge>
                          <span className="text-sm text-gray-500">#{error.id}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-600">{error.count} occurrences</div>
                          <div className="text-xs text-gray-500">
                            Last seen: {new Date(error.lastSeen).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 font-medium">{error.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
