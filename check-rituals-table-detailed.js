require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const databaseUrl = process.env.POSTGRES_URL;

if (!databaseUrl) {
  console.error('No POSTGRES_URL found in environment');
  process.exit(1);
}

console.log('🔗 Connecting to database...');

const sql = neon(databaseUrl);

async function checkRitualsTable() {
  console.log('🔍 Checking rituals table structure...');
  
  try {
    // Check if rituals table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'rituals'
      );
    `;
    
    console.log('📋 Rituals table exists:', tableExists[0].exists);
    
    if (tableExists[0].exists) {
      // Get column information
      const columns = await sql`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'rituals'
        ORDER BY ordinal_position;
      `;
      
      console.log('📊 Rituals table columns:');
      columns.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
      });
      
      // Check if user_id column exists specifically
      const hasUserId = columns.some(col => col.column_name === 'user_id');
      console.log('🔑 Has user_id column:', hasUserId);
      
      if (!hasUserId) {
        console.log('🔍 Looking for alternative user columns...');
        const userColumns = columns.filter(col => col.column_name.includes('user') || col.column_name.includes('User'));
        console.log('👤 User-related columns found:', userColumns.map(col => col.column_name));
      }
      
      // Try to see a few sample records
      try {
        const sampleRecords = await sql`SELECT * FROM rituals LIMIT 3`;
        console.log('📄 Sample records count:', sampleRecords.length);
        if (sampleRecords.length > 0) {
          console.log('📄 Sample record keys:', Object.keys(sampleRecords[0]));
        }
      } catch (err) {
        console.log('⚠️  Could not fetch sample records:', err.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking database schema:', error);
  }
}

checkRitualsTable();
