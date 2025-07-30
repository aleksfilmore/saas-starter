import { db } from './lib/db/drizzle.js';
import { users } from './lib/db/schema.js';

async function checkUsers() {
  try {
    const allUsers = await db.select().from(users);
    console.log('All users in database:');
    console.log(allUsers);
    
    if (allUsers.length > 0) {
      const firstUser = allUsers[0];
      console.log('\nFirst user details:');
      console.log('ID:', firstUser.id, 'Type:', typeof firstUser.id);
      console.log('Email:', firstUser.email);
      
      // Test our parseUserId function
      const { parseUserId } = await import('./lib/utils.js');
      
      // Mock a user object like Lucia would return
      const mockLuciaUser = {
        id: firstUser.id.toString(), // Lucia stores IDs as strings
        email: firstUser.email
      };
      
      console.log('\nTesting parseUserId with mock Lucia user:');
      console.log('Mock user ID:', mockLuciaUser.id, 'Type:', typeof mockLuciaUser.id);
      
      try {
        const parsed = parseUserId(mockLuciaUser);
        console.log('Successfully parsed:', parsed, 'Type:', typeof parsed);
      } catch (error) {
        console.error('Parse error:', error.message);
      }
    } else {
      console.log('No users found in database');
    }
  } catch (error) {
    console.error('Database error:', error);
  }
}

checkUsers();
