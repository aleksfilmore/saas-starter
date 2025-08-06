const { neon } = require('@neondatabase/serverless');

const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!databaseUrl) {
  console.error('No database URL found');
  process.exit(1);
}

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
        const userColumns = columns.filter(col => col.column_name.includes('user'));
        console.log('👤 User-related columns found:', userColumns.map(col => col.column_name));
      }
    }
    
    // Also check users table for context
    const usersTableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `;
    
    if (usersTableExists[0].exists) {
      const userColumns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
        ORDER BY ordinal_position;
      `;
      
      console.log('👥 Users table columns:');
      userColumns.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking database schema:', error);
  }
}

checkRitualsTable();
