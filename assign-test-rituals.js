const { db } = require('./lib/db/drizzle.ts');
const { sql } = require('drizzle-orm');

async function assignTestRituals() {
  try {
    console.log('🎯 Assigning test rituals...');
    
    // For premium user (ID 2)
    const premiumRitual = await db.execute(sql`
      SELECT id, title FROM ritual_library 
      WHERE is_active = true 
      ORDER BY RANDOM() 
      LIMIT 1
    `);
    
    if (premiumRitual.length > 0) {
      // Clear existing rituals for premium user
      await db.execute(sql`
        UPDATE user_rituals 
        SET is_current = false 
        WHERE user_id = 2
      `);
      
      // Assign new ritual
      await db.execute(sql`
        INSERT INTO user_rituals (user_id, ritual_id, is_current, delivered_at)
        VALUES (2, ${premiumRitual[0].id}, true, NOW())
      `);
      
      console.log(`✅ Assigned "${premiumRitual[0].title}" to premium user`);
    }
    
    // For free user (ID 1)
    const freeRitual = await db.execute(sql`
      SELECT id, title FROM ritual_library 
      WHERE is_active = true 
        AND id != ${premiumRitual[0]?.id || 'xxx'}
      ORDER BY RANDOM() 
      LIMIT 1
    `);
    
    if (freeRitual.length > 0) {
      // Clear existing rituals for free user
      await db.execute(sql`
        UPDATE user_rituals 
        SET is_current = false 
        WHERE user_id = 1
      `);
      
      // Assign new ritual
      await db.execute(sql`
        INSERT INTO user_rituals (user_id, ritual_id, is_current, delivered_at)
        VALUES (1, ${freeRitual[0].id}, true, NOW())
      `);
      
      console.log(`✅ Assigned "${freeRitual[0].title}" to free user`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

assignTestRituals();
