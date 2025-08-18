import * as Sentry from '@sentry/nextjs';

// Initialize Sentry
export function initSentry() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Performance monitoring
      profilesSampleRate: 0.1,
      
      // Error filtering
      beforeSend(event, hint) {
        // Filter out irrelevant errors
        if (event.exception) {
          const error = hint.originalException;
          
          // Skip network errors that are client-side issues
          if (error instanceof TypeError && error.message?.includes('fetch')) {
            return null;
          }
          
          // Skip canceled requests
          if (error instanceof Error && error.name === 'AbortError') {
            return null;
          }
        }
        
        return event;
      },
      
      // Additional context
      initialScope: {
        tags: {
          component: 'saas-starter'
        }
      }
    });
  }
}

// Error monitoring service
export class ErrorMonitoringService {
  static captureException(error: Error, context?: Record<string, any>) {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.withScope((scope) => {
        if (context) {
          Object.entries(context).forEach(([key, value]) => {
            scope.setTag(key, value);
          });
        }
        Sentry.captureException(error);
      });
    } else {
      // Fallback logging when Sentry is not configured
      console.error('Error captured:', error, context);
    }
  }

  static captureMessage(
    message: string, 
    level: 'info' | 'warning' | 'error' = 'info',
    context?: Record<string, any>
  ) {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.withScope((scope) => {
        if (context) {
          Object.entries(context).forEach(([key, value]) => {
            scope.setTag(key, value);
          });
        }
        Sentry.captureMessage(message, level);
      });
    } else {
      console.log(`[${level.toUpperCase()}] ${message}`, context);
    }
  }

  static setUser(user: { id: string; email?: string; username?: string }) {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.setUser(user);
    }
  }

  static addBreadcrumb(
    message: string,
    category: string = 'custom',
    level: 'info' | 'warning' | 'error' = 'info',
    data?: Record<string, any>
  ) {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.addBreadcrumb({
        message,
        category,
        level,
        data,
        timestamp: Date.now() / 1000
      });
    }
  }

  static startTransaction(name: string, description?: string) {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      return Sentry.startTransaction({
        name,
        description,
        sampled: true
      });
    }
    
    return {
      finish: () => {},
      setTag: () => {},
      setData: () => {}
    };
  }

  // Database error monitoring
  static captureDBError(error: Error, query?: string, params?: any[]) {
    this.captureException(error, {
      type: 'database_error',
      query: query?.substring(0, 200), // Truncate long queries
      paramCount: params?.length || 0
    });
  }

  // API error monitoring
  static captureAPIError(
    error: Error, 
    endpoint: string, 
    method: string,
    statusCode?: number,
    userId?: string
  ) {
    this.captureException(error, {
      type: 'api_error',
      endpoint,
      method,
      statusCode,
      userId
    });
  }

  // Performance monitoring
  static measurePerformance<T>(
    operation: string,
    fn: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> {
    const transaction = this.startTransaction(operation);
    const start = Date.now();
    
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        transaction.setTag(key, value);
      });
    }
    
    return fn()
      .then(result => {
        const duration = Date.now() - start;
        transaction.setData('duration_ms', duration);
        transaction.finish();
        
        // Log slow operations
        if (duration > 1000) {
          this.captureMessage(
            `Slow operation detected: ${operation} took ${duration}ms`,
            'warning',
            { operation, duration, ...context }
          );
        }
        
        return result;
      })
      .catch(error => {
        transaction.setTag('error', true);
        transaction.finish();
        throw error;
      });
  }

  // Feature flag monitoring
  static trackFeatureUsage(feature: string, enabled: boolean, userId?: string) {
    this.addBreadcrumb(
      `Feature ${feature} ${enabled ? 'enabled' : 'disabled'}`,
      'feature_flag',
      'info',
      { feature, enabled, userId }
    );
  }

  // Custom metrics
  static recordMetric(name: string, value: number, tags?: Record<string, string>) {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      // Sentry doesn't have direct metrics support, so we'll use events
      Sentry.addBreadcrumb({
        message: `Metric: ${name} = ${value}`,
        category: 'metric',
        level: 'info',
        data: { name, value, tags }
      });
    }
  }
}

// Convenience functions
export const captureException = ErrorMonitoringService.captureException;
export const captureMessage = ErrorMonitoringService.captureMessage;
export const setUser = ErrorMonitoringService.setUser;
export const addBreadcrumb = ErrorMonitoringService.addBreadcrumb;
export const measurePerformance = ErrorMonitoringService.measurePerformance;
