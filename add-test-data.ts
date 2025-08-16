import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.POSTGRES_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

async function addTestData() {
  console.log('🎯 Adding Test Data for Dashboard\n');

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
    console.log(`Adding test data for: ${user.email}`);
    
    // 1. Update user stats
    console.log('\n1. Updating user stats...');
    await db.execute(sql`
      UPDATE users 
      SET 
        ritual_streak = 5,
        no_contact_streak = 12,
        xp = 250,
        bytes = 175,
        level = 3
      WHERE id = ${user.id}
    `);
    console.log('✅ User stats updated');
    
    // 2. Award some badges
    console.log('\n2. Awarding badges...');
    
    // Get Ghost badges
    const badges = await db.execute(sql`
      SELECT id, name FROM badges 
      WHERE id IN ('G0', 'G1', 'F1', 'F2', 'F3') 
      AND is_active = true
    `);
    
    for (const badge of badges as any[]) {
      await db.execute(sql`
        INSERT INTO user_badges (id, user_id, badge_id, earned_at)
        VALUES (${crypto.randomUUID()}, ${user.id}, ${badge.id}, NOW())
        ON CONFLICT DO NOTHING
      `);
      console.log(`   ✅ Awarded: ${badge.name}`);
    }
    
    // 3. Set a badge as profile picture
    if (badges.length > 0) {
      const selectedBadge = badges[0] as any;
      
      // First add column if not exists
      try {
        await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS selected_badge_id text`);
      } catch (e) {
        // Column might already exist
      }
      
      // Then update user
      await db.execute(sql`
        UPDATE users SET selected_badge_id = ${selectedBadge.id} WHERE id = ${user.id}
      `);
      console.log(`   ✅ Set profile badge: ${selectedBadge.name}`);
    }
    
    // 4. Verify results
    console.log('\n3. Verification...');
    const updatedUser = await db.execute(sql`
      SELECT ritual_streak, no_contact_streak, xp, level, bytes, selected_badge_id
      FROM users WHERE id = ${user.id}
    `);
    
    const userBadges = await db.execute(sql`
      SELECT COUNT(*) as count FROM user_badges WHERE user_id = ${user.id}
    `);
    
    const stats = updatedUser[0] as any;
    console.log('Updated stats:');
    console.log(`   Ritual Streak: ${stats.ritual_streak}`);
    console.log(`   No-Contact Days: ${stats.no_contact_streak}`);
    console.log(`   XP: ${stats.xp}`);
    console.log(`   Level: ${stats.level}`);
    console.log(`   Bytes: ${stats.bytes}`);
    console.log(`   Profile Badge: ${stats.selected_badge_id}`);
    console.log(`   Total Badges: ${(userBadges[0] as any).count}`);
    
    console.log('\n✅ Test data added successfully!');
    console.log('🔄 Try refreshing the dashboard now');

  } catch (error) {
    console.error('❌ Failed to add test data:', error);
  } finally {
    await client.end();
  }
}

addTestData().then(() => process.exit(0));
