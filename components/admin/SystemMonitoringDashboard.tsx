'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  AlertCircle, 
  CheckCircle, 
  Activity, 
  Database, 
  HardDrive, 
  Server,
  RefreshCw,
  Clock,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface HealthStatus {
  status: 'healthy' | 'warning' | 'critical';
  timestamp: string;
  checks: {
    database: DatabaseHealth;
    cache: CacheHealth;
    application: ApplicationHealth;
  };
  performance: PerformanceMetrics;
  version: string;
}

interface DatabaseHealth {
  status: 'healthy' | 'warning' | 'critical';
  responseTime: number;
  issues: string[];
  metrics: {
    queryCount: number;
    slowQueries: number;
    connections: {
      active: number;
      idle: number;
      waiting: number;
    };
    tableCount: number;
  };
}

interface CacheHealth {
  status: 'healthy' | 'warning' | 'critical';
  responseTime: number;
  type: 'redis' | 'memory';
  metrics: {
    keyCount: number;
    memoryUsage: string;
    hitRate?: number;
  };
}

interface ApplicationHealth {
  status: 'healthy' | 'warning' | 'critical';
  issues: string[];
  metrics: {
    memoryUsage: {
      heapUsed: number;
      heapTotal: number;
      external: number;
      rss: number;
    };
    uptime: number;
    nodeVersion: string;
    platform: string;
  };
}

interface PerformanceMetrics {
  database: {
    totalQueries: number;
    slowQueries: Array<{
      query: string;
      calls: number;
      avgTime: number;
      maxTime: number;
    }>;
    connections: {
      active: number;
      idle: number;
      waiting: number;
    };
  };
  cache: {
    type: string;
    keyCount: number;
    memoryUsage: string;
  };
  recommendations: string[];
}

export default function SystemMonitoringDashboard() {
  const [healthData, setHealthData] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/system/health');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setHealthData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchHealthData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusIcon = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
    }
  };

  if (loading && !healthData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">System Monitoring</h1>
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading system status...</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">System Monitoring</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load system health data: {error}
          </AlertDescription>
        </Alert>
        <Button onClick={fetchHealthData} className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4" />
          <span>Retry</span>
        </Button>
      </div>
    );
  }

  if (!healthData) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Monitoring</h1>
          <p className="text-gray-600">
            Last updated: {new Date(healthData.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className="h-4 w-4 mr-2" />
            Auto Refresh
          </Button>
          <Button onClick={fetchHealthData} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {getStatusIcon(healthData.status)}
            <span>Overall System Status</span>
            <Badge variant={healthData.status === 'healthy' ? 'default' : 
                           healthData.status === 'warning' ? 'secondary' : 'destructive'}>
              {healthData.status.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Version: {healthData.version}</span>
            <span>•</span>
            <span>Uptime: {healthData.checks.application.metrics.uptime}h</span>
            <span>•</span>
            <span>Platform: {healthData.checks.application.metrics.platform}</span>
          </div>
        </CardContent>
      </Card>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Database Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Database</span>
              {getStatusIcon(healthData.checks.database.status)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Response Time</span>
                <span>{healthData.checks.database.responseTime}ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Active Connections</span>
                <span>{healthData.checks.database.metrics.connections.active}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Slow Queries</span>
                <span>{healthData.checks.database.metrics.slowQueries}</span>
              </div>
            </div>
            {healthData.checks.database.issues.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {healthData.checks.database.issues[0]}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Cache Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5" />
              <span>Cache ({healthData.checks.cache.type})</span>
              {getStatusIcon(healthData.checks.cache.status)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Response Time</span>
                <span>{healthData.checks.cache.responseTime}ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Keys</span>
                <span>{healthData.checks.cache.metrics.keyCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Memory Usage</span>
                <span>{healthData.checks.cache.metrics.memoryUsage}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5" />
              <span>Application</span>
              {getStatusIcon(healthData.checks.application.status)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Heap Used</span>
                <span>{healthData.checks.application.metrics.memoryUsage.heapUsed}MB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Heap Total</span>
                <span>{healthData.checks.application.metrics.memoryUsage.heapTotal}MB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Node Version</span>
                <span>{healthData.checks.application.metrics.nodeVersion}</span>
              </div>
            </div>
            {healthData.checks.application.issues.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {healthData.checks.application.issues[0]}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="database">Database Details</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Database Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Database Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Queries</span>
                    <span>{healthData.performance.database.totalQueries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Slow Queries</span>
                    <span>{healthData.performance.database.slowQueries.length}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Connection Pool</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Active</span>
                      <span>{healthData.performance.database.connections.active}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Idle</span>
                      <span>{healthData.performance.database.connections.idle}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Waiting</span>
                      <span>{healthData.performance.database.connections.waiting}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Memory Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Memory Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Heap Used</span>
                      <span>{healthData.checks.application.metrics.memoryUsage.heapUsed}MB</span>
                    </div>
                    <Progress 
                      value={(healthData.checks.application.metrics.memoryUsage.heapUsed / healthData.checks.application.metrics.memoryUsage.heapTotal) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>External</span>
                      <span>{healthData.checks.application.metrics.memoryUsage.external}MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>RSS</span>
                      <span>{healthData.checks.application.metrics.memoryUsage.rss}MB</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Performance Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {healthData.performance.recommendations.length > 0 ? (
                <div className="space-y-2">
                  {healthData.performance.recommendations.map((recommendation, index) => (
                    <Alert key={index}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{recommendation}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No performance issues detected. System is running optimally.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Slow Queries</CardTitle>
            </CardHeader>
            <CardContent>
              {healthData.performance.database.slowQueries.length > 0 ? (
                <div className="space-y-4">
                  {healthData.performance.database.slowQueries.map((query, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1 mr-4">
                          {query.query}
                        </code>
                        <Badge variant="secondary">{query.avgTime.toFixed(2)}ms avg</Badge>
                      </div>
                      <div className="flex space-x-4 text-sm text-gray-600">
                        <span>Calls: {query.calls}</span>
                        <span>Max: {query.maxTime.toFixed(2)}ms</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No slow queries detected.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
