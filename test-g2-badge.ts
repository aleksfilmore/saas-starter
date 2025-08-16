import { db } from './lib/db/index.js';
import { sql } from 'drizzle-orm';
import { BadgeEvaluator } from './lib/badges/badge-evaluator.js';

async function testG2BadgeEarning() {
  console.log('🎯 Testing G2 (Ritual Rookie) badge earning with 10 rituals...');

  try {
    const userId = 'GijPWH5DAaIf97aGNZGLF';
    const badgeEvaluator = new BadgeEvaluator();
    
    // Check current ritual count
    console.log('1. Checking current ritual count...');
    const ritualCount = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM badge_events 
      WHERE user_id = ${userId} AND event_type = 'ritual_completed'
    `);
    
    console.log('Current ritual count:', ritualCount[0]?.count || 0);
    
    // Check if G2 already earned
    const hasG2 = await db.execute(sql`
      SELECT badge_id 
      FROM user_badges 
      WHERE user_id = ${userId} AND badge_id = 'G2'
    `);
    
    console.log('Has G2 badge:', hasG2.length > 0);
    
    if (hasG2.length === 0) {
      // Add a few more ritual completions if needed
      const currentCount = parseInt(ritualCount[0]?.count || '0');
      const ritualsNeeded = Math.max(0, 10 - currentCount);
      
      if (ritualsNeeded > 0) {
        console.log(`2. Adding ${ritualsNeeded} more ritual completions...`);
        
        for (let i = 0; i < ritualsNeeded; i++) {
          await badgeEvaluator.handleEvent(
            userId,
            'ritual_completed',
            {
              ritualId: `test_g2_ritual_${i}`,
              journalWordCount: 150 + (i * 10),
              timeSpent: 300 + (i * 30),
              category: 'mindfulness'
            }
          );
        }
      }
      
      // Trigger one more to evaluate G2
      console.log('3. Triggering G2 evaluation...');
      const result = await badgeEvaluator.handleEvent(
        userId,
        'ritual_completed',
        {
          ritualId: 'test_g2_final',
          journalWordCount: 200,
          timeSpent: 400,
          category: 'mindfulness'
        }
      );
      
      console.log('Badge evaluation result:', result);
    } else {
      console.log('✅ G2 badge already earned');
    }

    // Check final ritual count and G2 status
    const finalCount = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM badge_events 
      WHERE user_id = ${userId} AND event_type = 'ritual_completed'
    `);
    
    const g2Badge = await db.execute(sql`
      SELECT badge_id, earned_at 
      FROM user_badges 
      WHERE user_id = ${userId} AND badge_id = 'G2'
    `);
    
    console.log('\n📊 Final status:');
    console.log('Total rituals:', finalCount[0]?.count || 0);
    console.log('G2 badge earned:', g2Badge.length > 0 ? `Yes (${g2Badge[0]?.earned_at})` : 'No');

  } catch (error) {
    console.error('💥 Error testing G2 badge:', error);
  } finally {
    process.exit(0);
  }
}

testG2BadgeEarning();
