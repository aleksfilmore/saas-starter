const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

const client = postgres(process.env.POSTGRES_URL);
const db = drizzle(client);

async function awardFirewallBadges() {
  try {
    const userId = '2'; // firewall@test.com user ID
    
    // Get available firewall badges
    const firewallBadges = await db.execute(`
      SELECT id, name, tier_scope 
      FROM badges 
      WHERE tier_scope = 'firewall' 
      AND is_active = true
      LIMIT 5
    `);
    
    console.log('Available firewall badges:', firewallBadges);
    
    // Award F1 badges for different archetypes
    const badgesToAward = ['F1_supportive_guide', 'F1_strategic_analyst', 'F1_emotional_healer'];
    
    for (const badgeId of badgesToAward) {
      try {
        await db.execute(`
          INSERT INTO user_badges (id, user_id, badge_id, earned_at)
          VALUES ('${crypto.randomUUID()}', '${userId}', '${badgeId}', NOW())
          ON CONFLICT DO NOTHING
        `);
        console.log(`✅ Awarded badge: ${badgeId}`);
      } catch (e) {
        console.log(`⚠️ Badge ${badgeId} might not exist or already awarded`);
      }
    }
    
    // Set one as profile badge
    await db.execute(`
      UPDATE users SET selected_badge_id = 'F1_supportive_guide' WHERE id = '${userId}'
    `);
    
    console.log('✅ Profile badge set to F1_supportive_guide');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

awardFirewallBadges();
