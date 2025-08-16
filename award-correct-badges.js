const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

const client = postgres(process.env.POSTGRES_URL);
const db = drizzle(client);

async function awardCorrectBadges() {
  try {
    const userId = '2'; // firewall@test.com user ID
    
    // Award the existing firewall badges
    const badgesToAward = ['F1_DF', 'F1_FB', 'F1_GS'];
    
    for (const badgeId of badgesToAward) {
      await db.execute(`
        INSERT INTO user_badges (id, user_id, badge_id, earned_at)
        VALUES ('${crypto.randomUUID()}', '${userId}', '${badgeId}', NOW())
      `);
      console.log(`✅ Awarded badge: ${badgeId}`);
    }
    
    // Set one as profile badge
    await db.execute(`
      UPDATE users SET selected_badge_id = 'F1_DF' WHERE id = '${userId}'
    `);
    
    console.log('✅ Profile badge set to F1_DF');
    
    // Check user badges
    const userBadges = await db.execute(`
      SELECT ub.badge_id, b.name, b.tier_scope
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = '${userId}'
    `);
    
    console.log('User badges:', userBadges);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

awardCorrectBadges();
