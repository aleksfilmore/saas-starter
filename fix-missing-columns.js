const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

const sql = postgres(process.env.POSTGRES_URL || process.env.DATABASE_URL);

async function fixMissingColumns() {
  try {
    console.log('🔧 Checking and fixing missing database columns...');
    
    // Check if is_active column exists
    const checkColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `;
    
    console.log('Current users table columns:');
    checkColumns.forEach(col => console.log(`- ${col.column_name}`));
    
    const hasIsActive = checkColumns.some(col => col.column_name === 'is_active');
    
    if (!hasIsActive) {
      console.log('\n🔧 Adding missing is_active column...');
      await sql`
        ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true
      `;
      console.log('✅ Added is_active column');
    } else {
      console.log('✅ is_active column already exists');
    }
    
    // Check if other commonly missing columns exist
    const commonColumns = ['email_verified', 'created_at', 'updated_at'];
    
    for (const colName of commonColumns) {
      const hasColumn = checkColumns.some(col => col.column_name === colName);
      if (!hasColumn) {
        console.log(`🔧 Adding missing ${colName} column...`);
        
        if (colName === 'email_verified') {
          await sql`
            ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false
          `;
        } else if (colName === 'created_at') {
          await sql`
            ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT NOW()
          `;
        } else if (colName === 'updated_at') {
          await sql`
            ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT NOW()
          `;
        }
        console.log(`✅ Added ${colName} column`);
      }
    }
    
    console.log('\n🎉 Database schema fixes completed!');
    
  } catch (error) {
    console.error('❌ Error fixing database:', error);
  } finally {
    await sql.end();
  }
}

fixMissingColumns();
