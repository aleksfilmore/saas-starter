const postgres = require('postgres');
require('dotenv').config();

async function inspectDatabase() {
  const client = postgres(process.env.POSTGRES_URL);
  
  try {
    console.log('📋 Current tables in database:');
    const tables = await client`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    
    tables.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });

    console.log('\n🔍 Checking specific tables we need:');
    
    const checkTables = ['daily_check_ins', 'anonymous_posts', 'anonymous_post_hearts', 'ai_letters'];
    
    for (const tableName of checkTables) {
      const exists = await client`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = ${tableName}
        );
      `;
      console.log(`  - ${tableName}: ${exists[0].exists ? '✅ EXISTS' : '❌ MISSING'}`);
    }

    console.log('\n📊 Checking no_contact_periods columns:');
    const columns = await client`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'no_contact_periods';
    `;
    
    columns.forEach(col => {
      console.log(`  - ${col.column_name}`);
    });
    
  } catch (error) {
    console.error('❌ Database inspection failed:', error);
  } finally {
    await client.end();
  }
}

inspectDatabase();
