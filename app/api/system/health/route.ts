import { NextRequest, NextResponse } from 'next/server';
import { dbPerformanceMonitor } from '@/lib/db/performance-monitor';
import { cache } from '@/lib/cache/cache-service';
import { validateRequest } from '@/lib/auth';
import { authRateLimit } from '@/lib/middleware/rate-limiter';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await authRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const userData = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    if (!userData.length || userData[0].tier !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Gather system health metrics
    const healthChecks = await Promise.allSettled([
      checkDatabaseHealth(),
      checkCacheHealth(),
      checkApplicationHealth(),
      getPerformanceMetrics()
    ]);

    const [dbHealth, cacheHealth, appHealth, performance] = healthChecks.map(result => 
      result.status === 'fulfilled' ? result.value : { status: 'error', error: result.reason?.message }
    ) as [any, any, any, any];

    // Determine overall system status
    const allHealthy = [dbHealth, cacheHealth, appHealth].every((check: any) => 
      check.status === 'healthy' || check.status === 'warning'
    );

    const hasCritical = [dbHealth, cacheHealth, appHealth].some((check: any) => 
      check.status === 'critical'
    );

    const overallStatus = hasCritical ? 'critical' : allHealthy ? 'healthy' : 'warning';

    return NextResponse.json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks: {
        database: dbHealth,
        cache: cacheHealth,
        application: appHealth
      },
      performance,
      version: process.env.npm_package_version || 'unknown'
    });

  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'critical',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

async function checkDatabaseHealth() {
  try {
    // Basic connectivity test
    const startTime = Date.now();
    await db.select().from(users).limit(1);
    const responseTime = Date.now() - startTime;

    // Get detailed performance stats
    const dbHealth = await dbPerformanceMonitor.healthCheck();
    const stats = await dbPerformanceMonitor.getPerformanceStats();

    return {
      status: dbHealth.status,
      responseTime,
      issues: dbHealth.issues,
      metrics: {
        queryCount: stats.totalQueries,
        slowQueries: stats.slowQueries.length,
        connections: stats.connectionStats,
        tableCount: stats.tableStats.length
      }
    };
  } catch (error) {
    return {
      status: 'critical' as const,
      error: error instanceof Error ? error.message : 'Database connection failed',
      responseTime: null
    };
  }
}

async function checkCacheHealth() {
  try {
    const startTime = Date.now();
    
    // Test cache read/write
    const testKey = 'health_check_' + Date.now();
    const testValue = { timestamp: Date.now() };
    
    await cache.set(testKey, testValue, 60);
    const retrieved = await cache.get(testKey);
    await cache.del(testKey);
    
    const responseTime = Date.now() - startTime;
    const stats = await cache.getStats();

    const isHealthy = retrieved !== null && 
                     JSON.stringify(retrieved) === JSON.stringify(testValue);

    return {
      status: isHealthy ? 'healthy' as const : 'warning' as const,
      responseTime,
      type: stats.type,
      metrics: {
        keyCount: stats.keyCount,
        memoryUsage: stats.memoryUsage,
        hitRate: stats.hitRate
      }
    };
  } catch (error) {
    return {
      status: 'warning' as const,
      error: error instanceof Error ? error.message : 'Cache test failed',
      responseTime: null
    };
  }
}

async function checkApplicationHealth() {
  try {
    const issues = [];
    
    // Check environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'AUTH_SECRET',
      'NEXTAUTH_URL'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    if (missingEnvVars.length > 0) {
      issues.push(`Missing environment variables: ${missingEnvVars.join(', ')}`);
    }

    // Check memory usage
    const memUsage = process.memoryUsage();
    const memUsageMB = memUsage.heapUsed / 1024 / 1024;
    
    if (memUsageMB > 500) {
      issues.push(`High memory usage: ${memUsageMB.toFixed(2)}MB`);
    }

    // Check uptime
    const uptimeHours = process.uptime() / 3600;
    
    // Warn if ADMIN_SECRET equals AUTH_SECRET (should be distinct)
    if (process.env.ADMIN_SECRET && process.env.AUTH_SECRET && process.env.ADMIN_SECRET === process.env.AUTH_SECRET) {
      issues.push('ADMIN_SECRET should differ from AUTH_SECRET');
    }

    const status = issues.length === 0 ? 'healthy' :
                  issues.some(issue => issue.includes('Missing')) ? 'critical' : 'warning';

    return {
      status: status as 'healthy' | 'warning' | 'critical',
      issues,
      metrics: {
        memoryUsage: {
          heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
          heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
          external: Math.round(memUsage.external / 1024 / 1024),
          rss: Math.round(memUsage.rss / 1024 / 1024)
        },
        uptime: Math.round(uptimeHours * 100) / 100,
        nodeVersion: process.version,
        platform: process.platform
      }
    };
  } catch (error) {
    return {
      status: 'critical' as const,
      error: error instanceof Error ? error.message : 'Application health check failed'
    };
  }
}

async function getPerformanceMetrics() {
  try {
    const dbStats = await dbPerformanceMonitor.getPerformanceStats();
    const cacheStats = await cache.getStats();
    const recommendations = await dbPerformanceMonitor.getRecommendations();

    return {
      database: {
        totalQueries: dbStats.totalQueries,
        slowQueries: dbStats.slowQueries.slice(0, 5), // Top 5 slow queries
        connections: dbStats.connectionStats
      },
      cache: {
        type: cacheStats.type,
        keyCount: cacheStats.keyCount,
        memoryUsage: cacheStats.memoryUsage
      },
      recommendations: recommendations.slice(0, 10) // Top 10 recommendations
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Performance metrics unavailable'
    };
  }
}
