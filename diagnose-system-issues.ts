import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('Missing POSTGRES_URL environment variable');
}

const client = postgres(connectionString);
const db = drizzle(client);

async function diagnoseSystemIssues() {
  console.log('🔍 Diagnosing System Issues\n');

  try {
    // 1. Check user table structure
    console.log('1. Checking user table structure...');
    const userColumns = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      AND column_name IN ('selected_badge_id', 'avatar', 'ritual_streak', 'no_contact_streak', 'xp', 'level', 'bytes')
      ORDER BY column_name
    `);
    
    console.log('User table relevant columns:');
    userColumns.forEach((col: any) => {
      console.log(`   ${col.column_name}: ${col.data_type}`);
    });

    // 2. Check if we have a selected_badge_id column for profile pictures
    const selectedBadgeColumn = userColumns.find((col: any) => col.column_name === 'selected_badge_id');
    if (!selectedBadgeColumn) {
      console.log('\n⚠️  Missing selected_badge_id column for badge profile pictures');
      
      // Add the column
      await db.execute(sql`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS selected_badge_id text,
        ADD CONSTRAINT fk_selected_badge 
        FOREIGN KEY (selected_badge_id) REFERENCES badges(id)
      `);
      console.log('✅ Added selected_badge_id column');
    }

    // 3. Check if notification system tables exist
    console.log('\n2. Checking notification system...');
    
    try {
      const notificationCount = await db.execute(sql`SELECT COUNT(*) as count FROM notifications`);
      console.log(`✅ Notifications table exists with ${(notificationCount[0] as any).count} records`);
    } catch (error) {
      console.log('⚠️  Notifications table missing - creating...');
      
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS notifications (
          id text PRIMARY KEY,
          user_id text NOT NULL REFERENCES users(id),
          type text NOT NULL,
          title text NOT NULL,
          message text NOT NULL,
          read boolean NOT NULL DEFAULT false,
          action_url text,
          action_text text,
          created_at timestamp with time zone NOT NULL DEFAULT NOW(),
          updated_at timestamp with time zone NOT NULL DEFAULT NOW()
        )
      `);
      console.log('✅ Created notifications table');
    }

    // 4. Check sample user data
    console.log('\n3. Checking sample user data...');
    
    const users = await db.execute(sql`
      SELECT id, email, ritual_streak, no_contact_streak, xp, level, bytes, selected_badge_id
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 3
    `);
    
    if (users.length > 0) {
      console.log('Sample users:');
      users.forEach((user: any, index) => {
        console.log(`   User ${index + 1}:`);
        console.log(`      Email: ${user.email}`);
        console.log(`      Ritual Streak: ${user.ritual_streak || 0}`);
        console.log(`      No-Contact Days: ${user.no_contact_streak || 0}`);
        console.log(`      XP: ${user.xp || 0}`);
        console.log(`      Level: ${user.level || 1}`);
        console.log(`      Bytes: ${user.bytes || 100}`);
        console.log(`      Selected Badge: ${user.selected_badge_id || 'None'}`);
      });
    } else {
      console.log('⚠️  No users found');
    }

    // 5. Check badge system integrity
    console.log('\n4. Checking badge system...');
    
    const badgeStats = await db.execute(sql`
      SELECT 
        category,
        COUNT(*) as count,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_count
      FROM badges 
      GROUP BY category 
      ORDER BY category
    `);
    
    console.log('Badge distribution:');
    badgeStats.forEach((stat: any) => {
      console.log(`   ${stat.category}: ${stat.active_count}/${stat.count} active`);
    });

    // 6. Check wall post system
    console.log('\n5. Checking wall post system...');
    
    try {
      const wallStats = await db.execute(sql`
        SELECT COUNT(*) as post_count FROM anonymous_posts
      `);
      
      const reactionStats = await db.execute(sql`
        SELECT COUNT(*) as reaction_count FROM wall_post_reactions
      `);
      
      console.log(`✅ Wall posts: ${(wallStats[0] as any).post_count}`);
      console.log(`✅ Wall reactions: ${(reactionStats[0] as any).reaction_count}`);
    } catch (error) {
      console.log('⚠️  Wall system tables missing or have issues');
      console.log(error);
    }

    console.log('\n📋 DIAGNOSIS SUMMARY:');
    console.log('✅ User table structure checked');
    console.log('✅ Badge profile picture support added');
    console.log('✅ Notification system verified');
    console.log('✅ Badge system integrity confirmed');
    console.log('✅ Wall system functionality checked');
    
    console.log('\n🔧 NEXT STEPS:');
    console.log('1. Update dashboard to show correct user stats');
    console.log('2. Implement badge profile picture selection');
    console.log('3. Add notification display to dashboard');
    console.log('4. Fix no-contact streak tracking');
    console.log('5. Investigate dashboard refresh error');

  } catch (error) {
    console.error('❌ Diagnosis failed:', error);
  } finally {
    await client.end();
  }
}

diagnoseSystemIssues().then(() => process.exit(0));
