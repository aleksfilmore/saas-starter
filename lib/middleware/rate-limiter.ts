import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limiting (for production, use Redis)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (req: NextRequest) => string;
}

export function createRateLimit(config: RateLimitConfig) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxRequests = 100,
    message = 'Too many requests, please try again later.',
    skipSuccessfulRequests = false,
    keyGenerator = (req) => getClientIP(req) || 'unknown'
  } = config;

  return async (req: NextRequest): Promise<NextResponse | null> => {
    const key = keyGenerator(req);
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get or create rate limit entry
    let rateLimitEntry = rateLimitMap.get(key);
    
    if (!rateLimitEntry || rateLimitEntry.lastReset < windowStart) {
      rateLimitEntry = { count: 0, lastReset: now };
      rateLimitMap.set(key, rateLimitEntry);
    }

    // Clean up old entries periodically
    if (Math.random() < 0.01) { // 1% chance to clean up
      for (const [entryKey, entry] of rateLimitMap.entries()) {
        if (entry.lastReset < windowStart) {
          rateLimitMap.delete(entryKey);
        }
      }
    }

    // Increment request count
    rateLimitEntry.count++;

    // Check if limit exceeded
    if (rateLimitEntry.count > maxRequests) {
      return NextResponse.json(
        { 
          error: message,
          retryAfter: Math.ceil((rateLimitEntry.lastReset + windowMs - now) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimitEntry.lastReset + windowMs).toISOString(),
            'Retry-After': Math.ceil((rateLimitEntry.lastReset + windowMs - now) / 1000).toString()
          }
        }
      );
    }

    // Add rate limit headers to successful responses
    const remaining = Math.max(0, maxRequests - rateLimitEntry.count);
    
    return null; // Allow request to proceed
  };
}

// Predefined rate limiters
export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later.'
});

export const apiRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 API calls per 15 minutes
  message: 'API rate limit exceeded, please try again later.'
});

export const strictRateLimit = createRateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 10, // 10 requests per 5 minutes for sensitive endpoints
  message: 'Rate limit exceeded for sensitive operation.'
});

export const paymentRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 5, // 5 payment attempts per hour
  message: 'Too many payment attempts, please try again later.'
});

function getClientIP(req: NextRequest): string | null {
  // Check various headers for client IP
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to connection info
  return null;
}

// Helper function to apply rate limiting to API routes
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  rateLimit = apiRateLimit
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const rateLimitResponse = await rateLimit(req);
    
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
    
    return handler(req);
  };
}
