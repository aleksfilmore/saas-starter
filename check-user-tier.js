import { db, users } from './lib/db/index.js';
import { eq } from 'drizzle-orm';

async function checkFirewallUser() {
  try {
    const user = await db.select().from(users).where(eq(users.email, 'firewall@test.com')).limit(1);
    if (user.length > 0) {
      console.log('Firewall user data:', JSON.stringify(user[0], null, 2));
    } else {
      console.log('Firewall user not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkFirewallUser();
