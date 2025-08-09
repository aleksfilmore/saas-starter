/**
 * Apply Daily Ritual Database Schema
 * Run this script to set up the daily ritual tables
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function applySchema() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    
    console.log('Reading schema file...');
    const schemaPath = path.join(__dirname, 'lib', 'rituals', 'daily-rituals-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Applying daily ritual schema...');
    await client.query(schema);
    
    console.log('✅ Daily ritual schema applied successfully!');
    
    // Test the tables were created
    console.log('Verifying table creation...');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%ritual%'
      ORDER BY table_name;
    `);
    
    console.log('Created ritual tables:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ Error applying schema:', error);
    throw error;
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  applySchema()
    .then(() => {
      console.log('🎉 Schema application completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Schema application failed:', error);
      process.exit(1);
    });
}

module.exports = { applySchema };
