// Debug badge evaluator issues
import { db } from '@/lib/db/drizzle';
import { processBadgeEvent } from '@/lib/badges/badge-evaluator';
import { sql } from 'drizzle-orm';

async function debugBadgeEvaluator() {
  console.log('🔍 Debugging Badge Evaluator...\n');
  
  try {
    // Test 1: Check if badge evaluator can be imported
    console.log('1. Testing badge evaluator import...');
    console.log('   ✓ Badge evaluator imported successfully');
    
    // Test 2: Check database connectivity
    console.log('\n2. Testing database connectivity...');
    const dbTest = await db.execute(sql`SELECT 1 as test`);
    console.log('   ✓ Database connection working');
    
    // Test 3: Check badge table structure
    console.log('\n3. Checking badge table structure...');
    const badges = await db.execute(sql`
      SELECT id, name, tier_scope, archetype_scope 
      FROM badges 
      LIMIT 3
    `);
    console.log('   ✓ Badge table accessible:', badges.map((b: any) => b.id));
    
    // Test 4: Try processing a simple event
    console.log('\n4. Testing simple badge event processing...');
    
    const testUserId = 'GijPWH5DAaIf97aGNZGLF';
    
    try {
      const result = await processBadgeEvent(testUserId, 'check_in_completed', {
        timestamp: new Date().toISOString(),
        streakCount: 1,
        shieldUsed: false
      });
      
      console.log('   ✓ Badge event processed successfully');
      console.log('   → Result:', result);
      
    } catch (evalError) {
      console.error('   ❌ Badge evaluation failed:', evalError);
      console.error('   → Error details:', (evalError as Error).message);
    }
    
    // Test 5: Check user table structure
    console.log('\n5. Checking user table structure...');
    const userCheck = await db.execute(sql`
      SELECT id, email, subscription_tier 
      FROM users 
      WHERE id = ${testUserId}
      LIMIT 1
    `);
    
    if (userCheck.length > 0) {
      console.log('   ✓ Test user found:', userCheck[0]);
    } else {
      console.log('   ⚠️ Test user not found');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
    console.error('Error stack:', (error as Error).stack);
  }
}

debugBadgeEvaluator();
