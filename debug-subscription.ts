import { db } from './lib/db';
import { users } from './lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUserSubscription } from './lib/stripe/subscription';

async function debugSubscription() {
  try {
    console.log('🔍 Checking database for firewall users...');
    
    // Get all users
    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      tier: users.tier,
      subscriptionTier: users.subscriptionTier
    }).from(users);
    
    console.log('📊 User tier summary:');
    const tierCounts = allUsers.reduce((acc: any, user) => {
      const tier = user.tier || 'null';
      acc[tier] = (acc[tier] || 0) + 1;
      return acc;
    }, {});
    
    console.table(tierCounts);
    
    // Find firewall users
    const firewallUsers = allUsers.filter(user => 
      user.tier === 'firewall' || 
      user.tier === 'premium' ||
      user.subscriptionTier === 'firewall_mode' ||
      user.subscriptionTier === 'premium'
    );
    
    console.log(`\n🔥 Found ${firewallUsers.length} potential firewall users:`);
    
    for (const user of firewallUsers) {
      console.log(`\n👤 User ${user.email}:`);
      console.log(`   Database tier: ${user.tier}`);
      console.log(`   Subscription tier: ${user.subscriptionTier}`);
      
      try {
        const subscription = await getUserSubscription(user.id);
        console.log(`   Stripe tier: ${subscription.tier}`);
        console.log(`   Status: ${subscription.status}`);
        console.log(`   Customer ID: ${subscription.customerId || 'MISSING'}`);
        console.log(`   Has portal access: ${!!subscription.customerId}`);
      } catch (error) {
        console.log(`   ❌ Error getting subscription: ${error}`);
      }
    }
    
    console.log('\n✅ Debug complete!');
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    process.exit(0);
  }
}

debugSubscription();
