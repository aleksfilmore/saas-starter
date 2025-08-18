// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
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
    // Filter out irrelevant client-side errors
    if (event.exception) {
      const error = hint.originalException;
      
      // Skip network errors
      if (error instanceof TypeError && error.message?.includes('fetch')) {
        return null;
      }
      
      // Skip ResizeObserver errors (common browser issue)
      if (error instanceof Error && error.message?.includes('ResizeObserver')) {
        return null;
      }
      
      // Skip Script loading errors for third-party scripts
      if (error instanceof Error && error.message?.includes('Script error')) {
        return null;
      }
    }
    
    return event;
  },
  
  integrations: [
    new Sentry.BrowserTracing({
      // Set sampling rate for performance monitoring
      routingInstrumentation: Sentry.nextRouterInstrumentation,
    }),
  ],
});
