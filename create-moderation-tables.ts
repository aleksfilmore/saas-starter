import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

async function createModerationTables() {
  console.log('🚀 Creating moderation tables...');

  try {
    // Create moderation_queue table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS moderation_queue (
        id TEXT PRIMARY KEY,
        post_id TEXT NOT NULL REFERENCES anonymous_posts(id),
        user_id TEXT NOT NULL REFERENCES users(id),
        content TEXT NOT NULL,
        flag_reason TEXT NOT NULL,
        severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'edited')),
        suggested_action TEXT NOT NULL CHECK (suggested_action IN ('approve', 'flag', 'reject', 'edit')),
        detected_issues TEXT,
        moderator_id TEXT REFERENCES users(id),
        moderator_notes TEXT,
        moderated_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    // Create moderation_logs table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS moderation_logs (
        id TEXT PRIMARY KEY,
        post_id TEXT NOT NULL REFERENCES anonymous_posts(id),
        action TEXT NOT NULL CHECK (action IN ('auto_flagged', 'auto_approved', 'manual_approved', 'manual_rejected', 'edited')),
        moderator_id TEXT REFERENCES users(id),
        reason TEXT,
        previous_content TEXT,
        new_content TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    // Create indexes for better performance
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_moderation_queue_status ON moderation_queue(status);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_moderation_queue_severity ON moderation_queue(severity);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_moderation_queue_created_at ON moderation_queue(created_at);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_moderation_logs_post_id ON moderation_logs(post_id);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_moderation_logs_action ON moderation_logs(action);
    `);

    console.log('✅ Moderation tables created successfully!');

    // Test the tables exist
    const queueTest = await db.execute(sql`SELECT COUNT(*) FROM moderation_queue`);
    const logsTest = await db.execute(sql`SELECT COUNT(*) FROM moderation_logs`);
    
    console.log('✅ Tables verified:');
    console.log(`   - moderation_queue: ${queueTest[0]?.count || 0} records`);
    console.log(`   - moderation_logs: ${logsTest[0]?.count || 0} records`);

  } catch (error) {
    console.error('❌ Failed to create moderation tables:', error);
    throw error;
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  createModerationTables()
    .then(() => {
      console.log('🎉 Moderation system migration completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

export { createModerationTables };
