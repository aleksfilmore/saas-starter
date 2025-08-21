import { db } from '@/lib/db';
import { apiUsage } from '@/lib/db/schema';
import { randomUUID } from 'crypto';

interface ApiUsageData {
  userId?: string;
  service: 'openai' | 'stripe' | 'resend' | 'other';
  endpoint?: string;
  tokensUsed?: number;
  costCents?: number;
  requestData?: Record<string, any>;
  responseData?: Record<string, any>;
  success: boolean;
  errorMessage?: string;
}

export class ApiUsageTracker {
  static async track(data: ApiUsageData) {
    try {
      await db.insert(apiUsage).values({
        id: randomUUID(),
        user_id: data.userId || null,
        service: data.service,
        endpoint: data.endpoint || null,
        tokens_used: data.tokensUsed || null,
        cost_cents: data.costCents || null,
        request_data: data.requestData ? JSON.stringify(data.requestData) : null,
        response_data: data.responseData ? JSON.stringify(data.responseData) : null,
        status: data.success ? 'success' : 'error',
        error_message: data.errorMessage || null,
      });
    } catch (error) {
      console.error('Failed to track API usage:', error);
    }
  }

  // Track OpenAI API calls
  static async trackOpenAI(
    userId: string, 
    endpoint: string, 
    tokensUsed: number, 
    costCents: number, 
    success: boolean,
    errorMessage?: string
  ) {
    await this.track({
      userId,
      service: 'openai',
      endpoint,
      tokensUsed,
      costCents,
      success,
      errorMessage
    });
  }

  // Track Stripe API calls
  static async trackStripe(
    userId: string,
    endpoint: string,
    success: boolean,
    amount?: number,
    errorMessage?: string
  ) {
    await this.track({
      userId,
      service: 'stripe',
      endpoint,
      costCents: amount || 0, // Amount in cents
      success,
      errorMessage
    });
  }

  // Track Resend email API calls
  static async trackResend(
    userId: string,
    endpoint: string,
    success: boolean,
    emailsSent?: number,
    errorMessage?: string
  ) {
    await this.track({
      userId,
      service: 'resend',
      endpoint,
      tokensUsed: emailsSent || 0,
      costCents: Math.round((emailsSent || 0) * 0.1), // Estimate cost per email in cents
      success,
      errorMessage
    });
  }

  // Get usage statistics
  static async getUsageStats(
    service?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    try {
      // This would build dynamic queries based on filters
      // For now, return basic stats structure
      return {
        totalRequests: 0,
        totalCost: 0,
        totalTokens: 0,
        successRate: 0,
        errorCount: 0
      };
    } catch (error) {
      console.error('Failed to get usage stats:', error);
      return null;
    }
  }
}
