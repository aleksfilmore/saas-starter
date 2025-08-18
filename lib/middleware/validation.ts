import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError, ZodSchema } from 'zod';

export interface ValidationConfig {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
  skipValidation?: boolean;
}

export function createValidator(config: ValidationConfig) {
  return async (req: NextRequest): Promise<{ 
    error?: NextResponse; 
    data?: { body?: any; query?: any; params?: any } 
  }> => {
    if (config.skipValidation) {
      return { data: {} };
    }

    try {
      const result: any = {};

      // Validate body
      if (config.body && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
        try {
          const body = await req.json();
          result.body = config.body.parse(body);
        } catch (e) {
          if (e instanceof SyntaxError) {
            return {
              error: NextResponse.json(
                { error: 'Invalid JSON in request body' },
                { status: 400 }
              )
            };
          }
          throw e;
        }
      }

      // Validate query parameters
      if (config.query) {
        const url = new URL(req.url);
        const queryParams: Record<string, string> = {};
        url.searchParams.forEach((value, key) => {
          queryParams[key] = value;
        });
        result.query = config.query.parse(queryParams);
      }

      // Validate URL parameters (you'd pass these in from the route handler)
      if (config.params) {
        // This would need to be passed from the route handler
        // result.params = config.params.parse(params);
      }

      return { data: result };
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          error: NextResponse.json(
            {
              error: 'Validation failed',
              details: error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
                code: err.code
              }))
            },
            { status: 400 }
          )
        };
      }

      return {
        error: NextResponse.json(
          { error: 'Validation error' },
          { status: 400 }
        )
      };
    }
  };
}

// Common validation schemas
export const schemas = {
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  uuid: z.string().uuid('Invalid UUID format'),
  positiveInt: z.number().positive('Must be a positive number'),
  
  // Auth schemas
  signIn: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
  }),
  
  signUp: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    name: z.string().min(2, 'Name must be at least 2 characters').optional()
  }),

  // Payment schemas
  createPayment: z.object({
    amount: z.number().positive('Amount must be positive'),
    currency: z.string().length(3, 'Currency must be 3 characters'),
    priceId: z.string().min(1, 'Price ID is required')
  }),

  // Wall post schemas
  createPost: z.object({
    content: z.string().min(1, 'Content is required').max(1000, 'Content too long'),
    category: z.enum(['confession', 'victory', 'struggle', 'advice', 'rant']),
    anonymous: z.boolean().default(true)
  }),

  reactToPost: z.object({
    postId: z.string().uuid('Invalid post ID'),
    reactionType: z.enum(['resonate', 'same_loop', 'dragged_me_too', 'stone_cold', 'cleansed'])
  }),

  // Notification schemas
  updateNotificationSettings: z.object({
    emailNotifications: z.boolean(),
    pushNotifications: z.boolean(),
    dailyReminders: z.boolean(),
    weeklyDigest: z.boolean()
  }),

  // Query parameter schemas
  paginationQuery: z.object({
    page: z.string().transform(val => parseInt(val, 10)).pipe(z.number().min(1)).default('1'),
    limit: z.string().transform(val => parseInt(val, 10)).pipe(z.number().min(1).max(100)).default('20')
  }),

  // Analytics schemas
  trackEvent: z.object({
    event: z.string().min(1, 'Event name is required'),
    properties: z.record(z.any()).optional(),
    userId: z.string().optional()
  })
};

// Helper function to combine validation with other middleware
export function withValidation<T = any>(
  config: ValidationConfig,
  handler: (req: NextRequest, data: T) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const validator = createValidator(config);
    const { error, data } = await validator(req);
    
    if (error) {
      return error;
    }
    
    return handler(req, data as T);
  };
}

// Sanitization helpers
export const sanitize = {
  html: (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove basic HTML tags
      .trim();
  },
  
  sql: (input: string): string => {
    return input
      .replace(/['";]/g, '') // Remove SQL injection characters
      .trim();
  },
  
  xss: (input: string): string => {
    return input
      .replace(/[<>'"&]/g, (match) => {
        const replacements: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return replacements[match] || match;
      });
  }
};
