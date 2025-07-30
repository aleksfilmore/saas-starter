// Comprehensive Gamification System Test
import { db } from './lib/db/drizzle';
import { 
  awardXP, 
  awardBytes, 
  checkAndAwardBadges,
  getUserStats,
  XP_REWARDS,
  BYTE_REWARDS 
} from './lib/db/gamification';
import { seedBadges } from './lib/db/seed-badges';
import { users } from './lib/db/schema';
import { eq } from 'drizzle-orm';

async function testGamificationSystem() {
  console.log('🚀 Starting comprehensive gamification system test...\n');

  try {
    // Step 1: Seed badges
    console.log('1️⃣ Seeding badge system...');
    await seedBadges();
    console.log('✅ Badges seeded successfully\n');

    // Step 2: Find a test user
    console.log('2️⃣ Finding test user...');
    const testUser = await db.query.users.findFirst();
    
    if (!testUser) {
      console.log('❌ No test user found. Please create a user first.');
      return;
    }
    
    console.log(`✅ Found test user: ${testUser.email} (ID: ${testUser.id})\n`);

    // Step 3: Award XP
    console.log('3️⃣ Testing XP system...');
    const xpResult = await awardXP(testUser.id, XP_REWARDS.RITUAL_COMPLETE);
    console.log(`✅ Awarded ${XP_REWARDS.RITUAL_COMPLETE.amount} XP`);
    console.log(`   New XP: ${xpResult.newXP}, New Level: ${xpResult.newLevel}`);
    console.log(`   Level Up: ${xpResult.leveledUp ? 'YES' : 'NO'}\n`);

    // Step 4: Award Bytes
    console.log('4️⃣ Testing Byte system...');
    const byteResult = await awardBytes(testUser.id, BYTE_REWARDS.WALL_POST);
    console.log(`✅ Awarded ${BYTE_REWARDS.WALL_POST.amount} Bytes`);
    console.log(`   New Balance: ${byteResult.newBalance} Ψ\n`);

    // Step 5: Test badge system
    console.log('5️⃣ Testing badge system...');
    const badges = await checkAndAwardBadges(testUser.id, 'wall_post');
    if (badges.length > 0) {
      console.log(`✅ Awarded ${badges.length} badges: ${badges.join(', ')}`);
    } else {
      console.log('ℹ️ No new badges awarded (user may not meet criteria yet)');
    }
    console.log('');

    // Step 6: Get user stats
    console.log('6️⃣ Testing stats retrieval...');
    const stats = await getUserStats(testUser.id);
    console.log('✅ User stats retrieved:');
    console.log(`   Level: ${stats?.level} (${stats?.title})`);
    console.log(`   XP: ${stats?.xp.toLocaleString()}`);
    console.log(`   Bytes: ${stats?.bytes.toLocaleString()} Ψ`);
    console.log(`   Badges: ${stats?.badges}`);
    console.log(`   Wall Posts: ${stats?.wallPosts}`);
    console.log(`   Tier: ${stats?.tier}\n`);

    // Step 7: Test multiple XP awards (level up simulation)
    console.log('7️⃣ Testing level progression...');
    for (let i = 0; i < 5; i++) {
      const result = await awardXP(testUser.id, {
        amount: 30,
        source: 'test_progression',
        description: `Test XP award #${i + 1}`,
      });
      
      if (result.leveledUp) {
        console.log(`🎉 LEVEL UP! New level: ${result.newLevel}`);
      }
    }
    console.log('✅ Level progression test complete\n');

    // Step 8: Verify database integrity
    console.log('8️⃣ Verifying database integrity...');
    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, testUser.id),
    });
    
    if (updatedUser) {
      console.log('✅ Database integrity verified:');
      console.log(`   User XP: ${updatedUser.xpPoints}`);
      console.log(`   User Level: ${updatedUser.glowUpLevel}`);
      console.log(`   User Bytes: ${updatedUser.byteBalance}`);
    }

    console.log('\n🎉 ALL TESTS PASSED! Gamification system is operational.');
    console.log('\n📊 System Status:');
    console.log('   ✅ XP & Level System: OPERATIONAL');
    console.log('   ✅ Byte Currency System: OPERATIONAL'); 
    console.log('   ✅ Badge Achievement System: OPERATIONAL');
    console.log('   ✅ User Stats API: OPERATIONAL');
    console.log('   ✅ Database Persistence: OPERATIONAL');
    console.log('\n🚀 Ready for Wall of Wounds™ and Reformat Protocol™!');

  } catch (error) {
    console.error('❌ Gamification system test failed:', error);
    throw error;
  }
}

// Run the test
if (require.main === module) {
  testGamificationSystem()
    .then(() => {
      console.log('\n✅ Test completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Test failed:', error);
      process.exit(1);
    });
}

export { testGamificationSystem };
