const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

const client = postgres(process.env.POSTGRES_URL);
const db = drizzle(client);

async function syncFirewallUserStats() {
  try {
    const userId = '2'; // firewall@test.com user ID
    
    // Update user stats to match what should be shown
    await db.execute(`
      UPDATE users 
      SET 
        ritual_streak = 0,
        no_contact_streak = 2,
        xp = 0,
        bytes = 0,
        level = 1
      WHERE id = '${userId}'
    `);
    
    console.log('✅ Updated user stats to sync with dashboard');
    
    // Check current stats
    const result = await db.execute(`
      SELECT ritual_streak, no_contact_streak, xp, bytes, level, tier, selected_badge_id
      FROM users WHERE id = '${userId}'
    `);
    
    console.log('Current firewall user stats:', result[0]);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

syncFirewallUserStats();
