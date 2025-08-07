/**
 * Analytics and Referral System Database Migration
 * Run this script to add analytics tracking and referral system tables
 */

import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

async function runAnalyticsMigration() {
  console.log('🚀 Starting analytics and referral system migration...');

  try {
    // Create analytics_events table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        session_id TEXT,
        event TEXT NOT NULL,
        properties TEXT,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        user_agent TEXT,
        ip TEXT,
        referer TEXT
      );
    `);
    console.log('✅ Created analytics_events table');

    // Create user_sessions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        session_id TEXT NOT NULL UNIQUE,
        start_time TIMESTAMP WITH TIME ZONE NOT NULL,
        last_activity TIMESTAMP WITH TIME ZONE NOT NULL,
        end_time TIMESTAMP WITH TIME ZONE,
        device_type TEXT,
        browser TEXT,
        os TEXT
      );
    `);
    console.log('✅ Created user_sessions table');

    // Create conversion_funnels table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS conversion_funnels (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        funnel_name TEXT NOT NULL,
        stage TEXT NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        properties TEXT
      );
    `);
    console.log('✅ Created conversion_funnels table');

    // Create referrals table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS referrals (
        id TEXT PRIMARY KEY,
        referrer_id TEXT NOT NULL,
        referee_id TEXT,
        referral_code TEXT NOT NULL UNIQUE,
        status TEXT NOT NULL DEFAULT 'pending',
        reward_type TEXT,
        reward_amount INTEGER DEFAULT 0,
        clicked_at TIMESTAMP WITH TIME ZONE,
        signed_up_at TIMESTAMP WITH TIME ZONE,
        completed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ Created referrals table');

    // Create subscription_events table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS subscription_events (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        stripe_customer_id TEXT,
        stripe_subscription_id TEXT,
        event_type TEXT NOT NULL,
        plan_id TEXT,
        amount INTEGER,
        currency TEXT DEFAULT 'usd',
        status TEXT,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        metadata TEXT
      );
    `);
    console.log('✅ Created subscription_events table');

    // Create indexes for better performance
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_analytics_events_event ON analytics_events(event);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_conversion_funnels_user_id ON conversion_funnels(user_id);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_conversion_funnels_funnel_name ON conversion_funnels(funnel_name);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_subscription_events_user_id ON subscription_events(user_id);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_subscription_events_type ON subscription_events(event_type);
    `);

    console.log('✅ Created database indexes');

    // Seed some initial analytics events for testing (optional)
    const testEvents = [
      {
        id: crypto.randomUUID(),
        event: 'user_signed_up',
        properties: JSON.stringify({ source: 'organic' }),
        timestamp: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        event: 'pricing_page_viewed',
        properties: JSON.stringify({ source: 'navigation' }),
        timestamp: new Date().toISOString()
      }
    ];

    for (const event of testEvents) {
      await db.execute(sql`
        INSERT INTO analytics_events (id, event, properties, timestamp)
        VALUES (${event.id}, ${event.event}, ${event.properties}, ${event.timestamp})
        ON CONFLICT (id) DO NOTHING;
      `);
    }
    console.log('✅ Seeded test analytics events');

    console.log('🎉 Analytics and referral system migration completed successfully!');
    
    return {
      success: true,
      message: 'All analytics and referral tables created successfully',
      tables: [
        'analytics_events',
        'user_sessions', 
        'conversion_funnels',
        'referrals',
        'subscription_events'
      ]
    };

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Export for use in API routes or scripts
export { runAnalyticsMigration };

// Run migration if this file is executed directly
if (require.main === module) {
  runAnalyticsMigration()
    .then((result) => {
      console.log('Migration result:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration error:', error);
      process.exit(1);
    });
}
