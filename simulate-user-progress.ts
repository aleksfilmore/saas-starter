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

async function simulateUserProgress() {
  console.log('🚀 Simulating User Progress for Dashboard Testing\n');

  try {
    // Get the first user
    const users = await db.execute(sql`
      SELECT id, email FROM users ORDER BY created_at DESC LIMIT 1
    `);
    
    if (users.length === 0) {
      console.log('❌ No users found');
      return;
    }
    
    const user = users[0] as any;
    console.log(`Testing with user: ${user.email}`);
    
    // 1. Simulate some ritual completions
    console.log('\n1. Adding ritual completions...');
    
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      await db.execute(sql`
        INSERT INTO daily_ritual_completions (
          id, user_id, ritual_type, completed_at, xp_earned, bytes_earned, category
        ) VALUES (
          ${crypto.randomUUID()}, 
          ${user.id}, 
          'breathing_exercise', 
          ${date.toISOString()}, 
          10, 
          5,
          'mindfulness'
        )
        ON CONFLICT DO NOTHING
      `);
    }
    
    // 2. Update user streaks and stats
    console.log('2. Updating user stats...');
    
    await db.execute(sql`
      UPDATE users 
      SET 
        ritual_streak = 5,
        no_contact_streak = 3,
        xp = xp + 50,
        bytes = bytes + 25,
        level = CASE WHEN xp + 50 >= 100 THEN 2 ELSE level END
      WHERE id = ${user.id}
    `);
    
    // 3. Award some badges
    console.log('3. Awarding sample badges...');
    
    // Get some badge IDs
    const badges = await db.execute(sql`
      SELECT id, name FROM badges WHERE is_active = true LIMIT 3
    `);
    
    for (const badge of badges as any[]) {
      await db.execute(sql`
        INSERT INTO user_badges (id, user_id, badge_id, earned_at)
        VALUES (${crypto.randomUUID()}, ${user.id}, ${badge.id}, NOW())
        ON CONFLICT DO NOTHING
      `);
      console.log(`   Awarded: ${badge.name}`);
    }
    
    // 4. Create some wall posts
    console.log('4. Creating sample wall posts...');
    
    const samplePosts = [
      "Finally made it through day 3 without checking their social media. Small wins count! 💪",
      "That moment when you realize you deserve better treatment. Breakthrough! ✨",
      "Still struggling with the urge to text back, but each hour gets a little easier 🛡️"
    ];
    
    for (const content of samplePosts) {
      await db.execute(sql`
        INSERT INTO anonymous_posts (
          id, user_id, content, glitch_category, glitch_title, 
          resonate_count, same_loop_count, dragged_me_too_count, 
          stone_cold_count, cleansed_count, created_at
        ) VALUES (
          ${crypto.randomUUID()}, 
          ${user.id}, 
          ${content}, 
          'breakthrough', 
          'BR34KTHR0UGH_D3T3CT3D',
          ${Math.floor(Math.random() * 10)},
          ${Math.floor(Math.random() * 5)},
          ${Math.floor(Math.random() * 3)},
          ${Math.floor(Math.random() * 2)},
          ${Math.floor(Math.random() * 8)},
          NOW()
        )
        ON CONFLICT DO NOTHING
      `);
    }
    
    // 5. Verify the results
    console.log('\n5. Verifying results...');
    
    const updatedUser = await db.execute(sql`
      SELECT ritual_streak, no_contact_streak, xp, level, bytes
      FROM users WHERE id = ${user.id}
    `);
    
    const userBadgeCount = await db.execute(sql`
      SELECT COUNT(*) as count FROM user_badges WHERE user_id = ${user.id}
    `);
    
    const ritualCount = await db.execute(sql`
      SELECT COUNT(*) as count FROM daily_ritual_completions WHERE user_id = ${user.id}
    `);
    
    const wallPostCount = await db.execute(sql`
      SELECT COUNT(*) as count FROM anonymous_posts WHERE user_id = ${user.id}
    `);
    
    const stats = updatedUser[0] as any;
    console.log('Updated user stats:');
    console.log(`   Ritual Streak: ${stats.ritual_streak}`);
    console.log(`   No-Contact Days: ${stats.no_contact_streak}`);
    console.log(`   XP: ${stats.xp}`);
    console.log(`   Level: ${stats.level}`);
    console.log(`   Bytes: ${stats.bytes}`);
    console.log(`   Badges: ${(userBadgeCount[0] as any).count}`);
    console.log(`   Rituals: ${(ritualCount[0] as any).count}`);
    console.log(`   Wall Posts: ${(wallPostCount[0] as any).count}`);
    
    console.log('\n✅ User progress simulation complete!');
    console.log('🔄 Refresh the dashboard to see updated stats');

  } catch (error) {
    console.error('❌ Simulation failed:', error);
  } finally {
    await client.end();
  }
}

simulateUserProgress().then(() => process.exit(0));
