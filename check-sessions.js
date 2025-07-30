import { db } from './lib/db/drizzle.js';

async function checkSessions() {
  try {
    console.log('Checking sessions and users tables...');
    
    // Check all sessions
    const allSessions = await db.execute('SELECT * FROM sessions LIMIT 5');
    console.log('Sessions:', allSessions);
    
    // Check all users  
    const allUsers = await db.execute('SELECT id, email FROM users LIMIT 5');
    console.log('Users:', allUsers);
    
  } catch (error) {
    console.error('Database error:', error);
  }
}

checkSessions();
