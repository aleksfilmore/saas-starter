import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('Missing POSTGRES_URL environment variable');
}

const client = postgres(connectionString);
const db = drizzle(client);

async function testPhase3Badges() {
  console.log('🎮 Testing Phase 3 Game Badge System...\n');

  try {
    // 1. Check that game badges exist
    console.log('1. Checking game badges exist...');
    const { data: gameBadges, error: badgeError } = await supabase
      .from('badges')
      .select('*')
      .in('badge_id', ['X1', 'X2', 'X3', 'X4'])
      .order('badge_id');

    if (badgeError) throw badgeError;
    
    console.log(`✅ Found ${gameBadges.length} game badges:`);
    gameBadges.forEach(badge => {
      console.log(`   ${badge.badge_id}: ${badge.name} - ${badge.description}`);
    });

    // 2. Check badge collections exist
    console.log('\n2. Checking badge collections...');
    const { data: collections, error: collectionError } = await supabase
      .from('badge_collections')
      .select('*')
      .order('id');

    if (collectionError) throw collectionError;
    
    console.log(`✅ Found ${collections.length} badge collections:`);
    collections.forEach(collection => {
      console.log(`   ${collection.id}: ${collection.name} - ${collection.description}`);
      console.log(`      Required badges: ${collection.required_badge_ids}`);
      console.log(`      Reward: ${collection.reward_badge_id} + ${collection.reward_points} points`);
    });

    // 3. Check achievement milestones
    console.log('\n3. Checking achievement milestones...');
    const { data: milestones, error: milestoneError } = await supabase
      .from('achievement_milestones')
      .select('*')
      .order('milestone_type', { ascending: true });

    if (milestoneError) throw milestoneError;
    
    console.log(`✅ Found ${milestones.length} achievement milestones:`);
    const milestonesByType = milestones.reduce((acc, milestone) => {
      if (!acc[milestone.milestone_type]) acc[milestone.milestone_type] = [];
      acc[milestone.milestone_type].push(milestone);
      return acc;
    }, {} as Record<string, any[]>);

    Object.entries(milestonesByType).forEach(([type, typeMilestones]) => {
      console.log(`   ${type}: ${typeMilestones.map(m => m.milestone_value).join(', ')}`);
    });

    // 4. Check game badge conditions
    console.log('\n4. Checking game badge conditions...');
    const { data: conditions, error: conditionError } = await supabase
      .from('game_badge_conditions')
      .select('*')
      .order('badge_id');

    if (conditionError) throw conditionError;
    
    console.log(`✅ Found ${conditions.length} game badge conditions:`);
    conditions.forEach(condition => {
      console.log(`   ${condition.badge_id}: ${condition.condition_type} = ${condition.required_value}`);
      if (condition.required_badges?.length) {
        console.log(`      Required badges: ${condition.required_badges}`);
      }
    });

    // 5. Test with a real user (if any exist)
    console.log('\n5. Testing with real user data...');
    const { data: users, error: userError } = await supabase
      .from('auth.users')
      .select('id, email')
      .limit(1);

    if (userError) {
      console.log('⚠️  Could not fetch users (expected in some setups)');
    } else if (users.length > 0) {
      const userId = users[0].id;
      console.log(`Testing with user: ${users[0].email}`);

      // Check user's ritual completion stats
      const { data: rituals, error: ritualError } = await supabase
        .from('daily_rituals')
        .select('category, completed_at')
        .eq('user_id', userId)
        .not('completed_at', 'is', null);

      if (!ritualError && rituals.length > 0) {
        const categories = [...new Set(rituals.map(r => r.category))];
        console.log(`   Rituals completed: ${rituals.length} across ${categories.length} categories`);
        console.log(`   Categories: ${categories.join(', ')}`);
      } else {
        console.log('   No completed rituals found');
      }

      // Check user's current badges
      const { data: userBadges, error: userBadgeError } = await supabase
        .from('user_badges')
        .select('badge_id, earned_at')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (!userBadgeError) {
        console.log(`   Current badges: ${userBadges.length}`);
        const firewallBadges = userBadges.filter(b => b.badge_id.startsWith('F')).length;
        console.log(`   Firewall badges: ${firewallBadges}/8`);
      }
    }

    console.log('\n🎉 Phase 3 Badge System Test Complete!');
    console.log('\nNext steps:');
    console.log('- Complete a few rituals to test game badge earning');
    console.log('- Check badge collections progress');
    console.log('- Test achievement milestone tracking');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testPhase3Badges().then(() => process.exit(0));
