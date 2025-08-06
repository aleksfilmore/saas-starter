const postgres = require('postgres');

async function checkRitualsSchema() {
  const sql = postgres(process.env.DATABASE_URL);

  try {
    console.log('🔍 Checking rituals table schema...');
    
    // Check if table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'rituals'
      );
    `;
    
    console.log('Table exists:', tableCheck[0].exists);
    
    if (tableCheck[0].exists) {
      // Get column information
      const columns = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'rituals'
        ORDER BY ordinal_position;
      `;
      
      console.log('📋 Rituals table columns:');
      columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
      
      // Try to count rituals
      try {
        const count = await sql`SELECT COUNT(*) FROM rituals`;
        console.log('📊 Total rituals:', count[0].count);
      } catch (countError) {
        console.log('❌ Error counting rituals:', countError.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking schema:', error.message);
  } finally {
    await sql.end();
  }
}

checkRitualsSchema();
