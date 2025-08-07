'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  BarChart3,
  PieChart,
  Target,
  Clock,
  Award,
  Zap
} from 'lucide-react';

interface AnalyticsMetrics {
  revenue: {
    totalRevenue: number;
    monthlyRecurringRevenue: number;
    annualRecurringRevenue: number;
    averageRevenuePerUser: number;
    totalSubscriptions: number;
  };
  retention: {
    day1: number;
    day7: number;
    day30: number;
    day90: number;
  };
  conversion: {
    funnel: string;
    metrics: Array<{
      stage: string;
      count: number;
      conversionRate: number;
      dropOffRate: number;
    }>;
  };
  features: Array<{
    feature: string;
    count: number;
  }>;
}

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30');
  const [selectedFunnel, setSelectedFunnel] = useState('SIGN_UP');

  useEffect(() => {
    fetchMetrics();
  }, [timeframe, selectedFunnel]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/metrics?days=${timeframe}&funnel=${selectedFunnel}`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100); // Convert from cents
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Analytics and business metrics</p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          
          <Button onClick={fetchMetrics} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.revenue.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.revenue.totalSubscriptions} subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.revenue.monthlyRecurringRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              ARR: {formatCurrency(metrics.revenue.annualRecurringRevenue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Revenue Per User</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.revenue.averageRevenuePerUser)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per customer lifetime
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">30-Day Retention</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercent(metrics.retention.day30)}
            </div>
            <p className="text-xs text-muted-foreground">
              Users active after 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="conversion" className="space-y-4">
        <TabsList>
          <TabsTrigger value="conversion">Conversion Funnels</TabsTrigger>
          <TabsTrigger value="retention">User Retention</TabsTrigger>
          <TabsTrigger value="features">Feature Usage</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="conversion" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Conversion Funnel: {selectedFunnel}</CardTitle>
                  <CardDescription>
                    User progression through {selectedFunnel.toLowerCase()} steps
                  </CardDescription>
                </div>
                <select
                  value={selectedFunnel}
                  onChange={(e) => setSelectedFunnel(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="SIGN_UP">Sign Up Flow</option>
                  <option value="SUBSCRIPTION">Subscription Flow</option>
                  <option value="AI_THERAPY">AI Therapy Flow</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.conversion.metrics.map((stage, index) => (
                  <div key={stage.stage} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize">
                        {stage.stage.replace(/_/g, ' ').toLowerCase()}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                          {stage.count} users
                        </span>
                        <Badge variant={stage.conversionRate > 50 ? "default" : "secondary"}>
                          {formatPercent(stage.conversionRate)}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={stage.conversionRate} className="h-2" />
                    {stage.dropOffRate > 0 && (
                      <p className="text-xs text-red-600">
                        {formatPercent(stage.dropOffRate)} drop-off rate
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Retention Cohorts</CardTitle>
              <CardDescription>
                Percentage of users who return after initial signup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatPercent(metrics.retention.day1)}
                  </div>
                  <p className="text-sm text-gray-600">Day 1 Retention</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPercent(metrics.retention.day7)}
                  </div>
                  <p className="text-sm text-gray-600">Day 7 Retention</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatPercent(metrics.retention.day30)}
                  </div>
                  <p className="text-sm text-gray-600">Day 30 Retention</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {formatPercent(metrics.retention.day90)}
                  </div>
                  <p className="text-sm text-gray-600">Day 90 Retention</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Features by Usage</CardTitle>
              <CardDescription>
                Most popular features in the last {timeframe} days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.features.slice(0, 10).map((feature, index) => (
                  <div key={feature.feature} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="font-medium capitalize">
                        {feature.feature.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {feature.count} uses
                      </span>
                      <div className="w-20 h-2 bg-gray-200 rounded">
                        <div 
                          className="h-full bg-blue-500 rounded"
                          style={{
                            width: `${(feature.count / (metrics.features[0]?.count || 1)) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Metrics</CardTitle>
                <CardDescription>Financial performance overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Revenue</span>
                  <span className="font-bold">
                    {formatCurrency(metrics.revenue.totalRevenue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Recurring Revenue</span>
                  <span className="font-bold">
                    {formatCurrency(metrics.revenue.monthlyRecurringRevenue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Recurring Revenue</span>
                  <span className="font-bold">
                    {formatCurrency(metrics.revenue.annualRecurringRevenue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Average Revenue Per User</span>
                  <span className="font-bold">
                    {formatCurrency(metrics.revenue.averageRevenuePerUser)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Indicators</CardTitle>
                <CardDescription>Key business health metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Subscriptions</span>
                  <Badge variant="default">
                    {metrics.revenue.totalSubscriptions}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>30-Day Retention Rate</span>
                  <Badge variant={metrics.retention.day30 > 20 ? "default" : "destructive"}>
                    {formatPercent(metrics.retention.day30)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Feature Adoption</span>
                  <Badge variant="secondary">
                    {metrics.features.length} active features
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
