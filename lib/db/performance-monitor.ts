import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

interface QueryPerformance {
  query: string;
  calls: number;
  totalTime: number;
  avgTime: number;
  maxTime: number;
}

interface DatabaseStats {
  totalQueries: number;
  slowQueries: QueryPerformance[];
  connectionStats: {
    active: number;
    idle: number;
    waiting: number;
  };
  tableStats: {
    tableName: string;
    rowCount: number;
    size: string;
    indexUsage: number;
  }[];
}

export class DatabasePerformanceMonitor {
  private queryTimes: Map<string, number[]> = new Map();
  private readonly SLOW_QUERY_THRESHOLD = 1000; // 1 second

  async getPerformanceStats(): Promise<DatabaseStats> {
    try {
      const [slowQueries, connectionStats, tableStats] = await Promise.all([
        this.getSlowQueries(),
        this.getConnectionStats(),
        this.getTableStats()
      ]);

      return {
        totalQueries: Array.from(this.queryTimes.values())
          .reduce((total, times) => total + times.length, 0),
        slowQueries,
        connectionStats,
        tableStats
      };
    } catch (error) {
      console.error('Error getting database performance stats:', error);
      throw error;
    }
  }

  private async getSlowQueries(): Promise<QueryPerformance[]> {
    try {
      // Get slow query statistics from PostgreSQL
      const result = await db.execute(sql`
        SELECT 
          query,
          calls,
          total_time,
          mean_time as avg_time,
          max_time
        FROM pg_stat_statements
        WHERE mean_time > ${this.SLOW_QUERY_THRESHOLD}
        ORDER BY mean_time DESC
        LIMIT 10
      `);

      return result.map((row: any) => ({
        query: row.query,
        calls: parseInt(row.calls),
        totalTime: parseFloat(row.total_time),
        avgTime: parseFloat(row.avg_time),
        maxTime: parseFloat(row.max_time)
      }));
    } catch (error) {
      // If pg_stat_statements is not available, return empty array
      console.warn('pg_stat_statements not available, using fallback slow query detection');
      return this.getFallbackSlowQueries();
    }
  }

  private getFallbackSlowQueries(): QueryPerformance[] {
    const slowQueries: QueryPerformance[] = [];
    
    for (const [query, times] of this.queryTimes.entries()) {
      const slowTimes = times.filter(time => time > this.SLOW_QUERY_THRESHOLD);
      if (slowTimes.length > 0) {
        slowQueries.push({
          query: query.substring(0, 100) + '...',
          calls: times.length,
          totalTime: times.reduce((sum, time) => sum + time, 0),
          avgTime: times.reduce((sum, time) => sum + time, 0) / times.length,
          maxTime: Math.max(...times)
        });
      }
    }

    return slowQueries.sort((a, b) => b.avgTime - a.avgTime).slice(0, 10);
  }

  private async getConnectionStats() {
    try {
      const result = await db.execute(sql`
        SELECT 
          state,
          COUNT(*) as count
        FROM pg_stat_activity
        WHERE datname = current_database()
        GROUP BY state
      `);

      const stats = { active: 0, idle: 0, waiting: 0 };
      
      result.forEach((row: any) => {
        switch (row.state) {
          case 'active':
            stats.active = parseInt(row.count);
            break;
          case 'idle':
            stats.idle = parseInt(row.count);
            break;
          case 'idle in transaction':
          case 'idle in transaction (aborted)':
            stats.waiting += parseInt(row.count);
            break;
        }
      });

      return stats;
    } catch (error) {
      console.warn('Could not get connection stats:', error);
      return { active: 0, idle: 0, waiting: 0 };
    }
  }

  private async getTableStats() {
    try {
      const result = await db.execute(sql`
        SELECT 
          schemaname,
          tablename,
          n_tup_ins + n_tup_upd + n_tup_del as total_operations,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
          CASE 
            WHEN seq_scan + idx_scan > 0 
            THEN ROUND((idx_scan::float / (seq_scan + idx_scan) * 100), 2)
            ELSE 0 
          END as index_usage_percent
        FROM pg_stat_user_tables
        WHERE schemaname = 'public'
        ORDER BY total_operations DESC
        LIMIT 20
      `);

      return result.map((row: any) => ({
        tableName: row.tablename,
        rowCount: parseInt(row.total_operations || 0),
        size: row.size,
        indexUsage: parseFloat(row.index_usage_percent || 0)
      }));
    } catch (error) {
      console.warn('Could not get table stats:', error);
      return [];
    }
  }

  trackQuery(query: string, executionTime: number) {
    if (!this.queryTimes.has(query)) {
      this.queryTimes.set(query, []);
    }
    
    const times = this.queryTimes.get(query)!;
    times.push(executionTime);
    
    // Keep only last 100 executions per query to prevent memory leaks
    if (times.length > 100) {
      times.shift();
    }
  }

  async getRecommendations(): Promise<string[]> {
    const recommendations: string[] = [];
    const stats = await this.getPerformanceStats();

    // Check for slow queries
    if (stats.slowQueries.length > 0) {
      recommendations.push(`Found ${stats.slowQueries.length} slow queries. Consider adding indexes or optimizing these queries.`);
    }

    // Check for tables with low index usage
    const lowIndexUsage = stats.tableStats.filter(table => 
      table.indexUsage < 80 && table.rowCount > 1000
    );
    
    if (lowIndexUsage.length > 0) {
      recommendations.push(`Tables with low index usage: ${lowIndexUsage.map(t => t.tableName).join(', ')}. Consider adding appropriate indexes.`);
    }

    // Check connection stats
    if (stats.connectionStats.waiting > 5) {
      recommendations.push(`High number of waiting connections (${stats.connectionStats.waiting}). Consider connection pooling optimization.`);
    }

    // Check for large tables without proper indexing
    const largeTables = stats.tableStats.filter(table => 
      table.size.includes('MB') || table.size.includes('GB')
    );
    
    if (largeTables.length > 0) {
      recommendations.push(`Large tables detected: ${largeTables.map(t => t.tableName).join(', ')}. Ensure proper indexing and consider partitioning if needed.`);
    }

    return recommendations;
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'warning' | 'critical'; issues: string[] }> {
    try {
      const stats = await this.getPerformanceStats();
      const issues: string[] = [];
      let status: 'healthy' | 'warning' | 'critical' = 'healthy';

      // Critical issues
      if (stats.slowQueries.some(q => q.avgTime > 5000)) {
        issues.push('Critical: Queries taking more than 5 seconds detected');
        status = 'critical';
      }

      if (stats.connectionStats.waiting > 20) {
        issues.push('Critical: Too many waiting connections');
        status = 'critical';
      }

      // Warning issues
      if (status !== 'critical') {
        if (stats.slowQueries.length > 5) {
          issues.push('Warning: Multiple slow queries detected');
          status = 'warning';
        }

        if (stats.connectionStats.active > 50) {
          issues.push('Warning: High number of active connections');
          status = 'warning';
        }
      }

      return { status, issues };
    } catch (error) {
      return {
        status: 'critical',
        issues: ['Error performing database health check']
      };
    }
  }
}

export const dbPerformanceMonitor = new DatabasePerformanceMonitor();
