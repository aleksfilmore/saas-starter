const { db } = require('./lib/db/drizzle');
const { users } = require('./lib/db/schema');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const result = await db.select().from(users).limit(1);
    console.log('✅ Database connection successful');
    console.log('Number of users in database:', result.length);
    
    if (result.length > 0) {
      console.log('Sample user ID type:', typeof result[0].id);
      console.log('Sample user structure:', {
        id: result[0].id,
        email: result[0].email,
        hasPasswordHash: !!result[0].hashedPassword
      });
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();
