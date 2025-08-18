// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,
  
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
  
  environment: process.env.NODE_ENV,
  
  beforeSend(event, hint) {
    // Filter out irrelevant server-side errors
    if (event.exception) {
      const error = hint.originalException;
      
      // Skip expected errors
      if (error instanceof Error) {
        // Skip authentication errors (these are business logic, not bugs)
        if (error.message?.includes('Unauthorized') || 
            error.message?.includes('Invalid credentials')) {
          return null;
        }
        
        // Skip rate limiting errors (expected behavior)
        if (error.message?.includes('Rate limit exceeded')) {
          return null;
        }
        
        // Skip validation errors (user input issues)
        if (error.message?.includes('validation') || 
            error.message?.includes('Invalid input')) {
          return null;
        }
      }
    }
    
    return event;
  },
});
