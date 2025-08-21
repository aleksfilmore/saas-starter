// Remove dummy data and prepare clean admin environment
require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.POSTGRES_URL);

async function cleanupDummyData() {
  try {
    console.log('🧹 Cleaning up dummy data...');

    // Create new tables for admin functionality
    console.log('📝 Creating blog_posts table...');
    await sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id text PRIMARY KEY,
        slug text UNIQUE NOT NULL,
        title text NOT NULL,
        excerpt text,
        content text NOT NULL,
        author_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status text NOT NULL DEFAULT 'draft',
        featured_image text,
        meta_title text,
        meta_description text,
        tags text[],
        category text,
        reading_time integer,
        published_at timestamp with time zone,
        created_at timestamp with time zone NOT NULL DEFAULT now(),
        updated_at timestamp with time zone NOT NULL DEFAULT now()
      );
    `;

    console.log('📊 Creating api_usage table...');
    await sql`
      CREATE TABLE IF NOT EXISTS api_usage (
        id text PRIMARY KEY,
        service text NOT NULL,
        endpoint text,
        user_id text REFERENCES users(id) ON DELETE CASCADE,
        tokens_used integer,
        cost_cents integer,
        request_data text,
        response_data text,
        status text,
        error_message text,
        created_at timestamp with time zone NOT NULL DEFAULT now()
      );
    `;

    // Remove dummy analytics data if any (skip if table doesn't exist)
    console.log('🗑️ Checking for dummy analytics data...');
    try {
      await sql`DELETE FROM analytics_events WHERE event_type LIKE 'dummy_%'`;
      console.log('✅ Dummy analytics data cleaned');
    } catch (error) {
      console.log('ℹ️ No analytics_events table found (this is normal)');
    }

    // Clean up any test blog posts
    console.log('🗑️ Removing test blog posts...');
    await sql`DELETE FROM blog_posts WHERE slug LIKE 'test-%' OR title LIKE 'Test%'`;

    // Get current real data counts
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    const wallPostCount = await sql`SELECT COUNT(*) as count FROM anonymous_posts`;
    const ritualCount = await sql`SELECT COUNT(*) as count FROM ritual_library`;
    
    console.log('\n📈 Current Real Data:');
    console.log(`👥 Users: ${userCount[0].count}`);
    console.log(`💬 Wall Posts: ${wallPostCount[0].count}`);
    console.log(`🧘 Rituals: ${ritualCount[0].count}`);

    // Create indexes for better performance
    console.log('\n🚀 Creating performance indexes...');
    
    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_api_usage_service ON api_usage(service)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON api_usage(created_at)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_ritual_library_category ON ritual_library(category)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_ritual_library_is_active ON ritual_library(is_active)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_anonymous_posts_glitch_category ON anonymous_posts(glitch_category)`;
      
      console.log('✅ Indexes created successfully');
    } catch (indexError) {
      console.log('⚠️ Some indexes may already exist:', indexError.message);
    }

    console.log('\n✅ Admin environment prepared successfully!');
    console.log('\n🎯 Next Steps:');
    console.log('1. Visit /admin/dashboard to access the admin panel');
    console.log('2. Create your first blog post');
    console.log('3. Manage the ritual library');
    console.log('4. Monitor real-time analytics');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

cleanupDummyData();
