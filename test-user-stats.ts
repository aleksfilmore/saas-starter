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

async function testUserStats() {
  console.log('🔍 Testing User Stats for Dashboard\n');

  try {
    // 1. Check users and their stats
    console.log('1. Checking user stats...');
    const users = await db.execute(sql`
      SELECT 
        id, 
        email, 
        ritual_streak, 
        no_contact_streak, 
        xp, 
        level, 
        bytes,
        tier,
        archetype,
        created_at
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 3
    `);
    
    if (users.length > 0) {
      console.log('User stats:');
      users.forEach((user: any, index) => {
        console.log(`   User ${index + 1} (${user.email}):`);
        console.log(`      Ritual Streak: ${user.ritual_streak || 0}`);
        console.log(`      No-Contact Days: ${user.no_contact_streak || 0}`);
        console.log(`      XP: ${user.xp || 0}`);
        console.log(`      Level: ${user.level || 1}`);
        console.log(`      Bytes: ${user.bytes || 100}`);
        console.log(`      Tier: ${user.tier || 'freemium'}`);
        console.log(`      Archetype: ${user.archetype || 'none'}`);
      });
    } else {
      console.log('⚠️  No users found');
    }

    // 2. Check badges
    console.log('\n2. Checking badges...');
    const badgeCount = await db.execute(sql`
      SELECT COUNT(*) as total FROM badges WHERE is_active = true
    `);
    console.log(`Total active badges: ${(badgeCount[0] as any).total}`);

    // 3. Check user badges
    if (users.length > 0) {
      const userId = users[0].id;
      const userBadges = await db.execute(sql`
        SELECT ub.badge_id, b.name 
        FROM user_badges ub
        JOIN badges b ON ub.badge_id = b.id
        WHERE ub.user_id = ${userId}
      `);
      
      console.log(`\n3. User badges for ${users[0].email}:`);
      if (userBadges.length > 0) {
        userBadges.forEach((badge: any) => {
          console.log(`   ${badge.badge_id}: ${badge.name}`);
        });
      } else {
        console.log('   No badges earned yet');
      }
    }

    // 4. Check wall posts
    console.log('\n4. Checking wall posts...');
    const wallPostCount = await db.execute(sql`
      SELECT COUNT(*) as total FROM anonymous_posts
    `);
    console.log(`Total wall posts: ${(wallPostCount[0] as any).total}`);

    // 5. Test a mock API call structure
    console.log('\n5. Testing API response structure...');
    
    if (users.length > 0) {
      const user = users[0];
      const mockApiResponse = {
        streaks: {
          rituals: user.ritual_streak || 0,
          noContact: user.no_contact_streak || 0
        },
        xp: {
          current: user.xp || 0,
          level: user.level || 1,
          nextLevelXP: (user.level || 1) * 100,
          progressFraction: Math.min(1, ((user.xp || 0) % 100) / 100)
        },
        user: {
          id: user.id,
          email: user.email,
          tier: user.tier,
          archetype: user.archetype
        }
      };
      
      console.log('Mock API response:');
      console.log(JSON.stringify(mockApiResponse, null, 2));
    }

    console.log('\n✅ User stats test complete!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await client.end();
  }
}

testUserStats().then(() => process.exit(0));
