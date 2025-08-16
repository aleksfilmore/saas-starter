import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.POSTGRES_URL;
const client = postgres(connectionString);
const db = drizzle(client);

async function checkAuthState() {
  console.log('🔐 Checking Authentication State\n');

  try {
    // 1. Check users
    const users = await db.execute(sql`
      SELECT id, email, created_at FROM users ORDER BY created_at DESC LIMIT 5
    `);
    
    console.log(`Users: ${users.length}`);
    users.forEach((user: any, i) => {
      console.log(`  ${i + 1}. ${user.email} (${user.id})`);
    });

    // 2. Check sessions
    const sessions = await db.execute(sql`
      SELECT s.id, s.user_id, s.expires_at, u.email 
      FROM sessions s 
      JOIN users u ON s.user_id = u.id 
      ORDER BY s.expires_at DESC 
      LIMIT 5
    `);
    
    console.log(`\nSessions: ${sessions.length}`);
    sessions.forEach((session: any, i) => {
      const expired = new Date(session.expires_at) < new Date();
      console.log(`  ${i + 1}. ${session.email} - ${expired ? 'EXPIRED' : 'ACTIVE'} (expires: ${session.expires_at})`);
    });

    // 3. Create a test session for the first user
    if (users.length > 0 && sessions.length === 0) {
      console.log('\n⚠️  No active sessions found. Creating test session...');
      
      const user = users[0] as any;
      const sessionId = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now
      
      await db.execute(sql`
        INSERT INTO sessions (id, user_id, expires_at)
        VALUES (${sessionId}, ${user.id}, ${expiresAt.toISOString()})
      `);
      
      console.log(`✅ Created session for ${user.email}`);
      console.log(`   Session ID: ${sessionId}`);
      console.log(`   Expires: ${expiresAt.toISOString()}`);
      console.log('\nTo use this session, set this cookie in your browser:');
      console.log(`auth_session=${sessionId}`);
    }

    console.log('\n📊 Summary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Active Sessions: ${sessions.filter((s: any) => new Date(s.expires_at) > new Date()).length}`);
    console.log(`- Expired Sessions: ${sessions.filter((s: any) => new Date(s.expires_at) <= new Date()).length}`);

  } catch (error) {
    console.error('❌ Auth check failed:', error);
  } finally {
    await client.end();
  }
}

checkAuthState().then(() => process.exit(0));
