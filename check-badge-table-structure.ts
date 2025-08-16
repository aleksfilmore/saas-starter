import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('Missing POSTGRES_URL environment variable');
}

const client = postgres(connectionString);
const db = drizzle(client);

async function checkBadgeTableStructure() {
  console.log('🔍 Checking badge table structure...\n');

  try {
    // Check what columns exist in badges table
    console.log('1. Badge table columns:');
    const badgeColumns = await db.execute(sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'badges'
      ORDER BY ordinal_position
    `);
    
    console.log('Badge table columns:');
    badgeColumns.forEach((col: any) => {
      console.log(`   ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    // Check what badges currently exist
    console.log('\n2. Current badges in table:');
    const badges = await db.execute(sql`SELECT * FROM badges LIMIT 5`);
    
    if (badges.length > 0) {
      console.log('Sample badges:');
      badges.forEach((badge: any) => {
        console.log(`   ${badge.id}: ${badge.name}`);
      });
    } else {
      console.log('   No badges found');
    }

    // Check other Phase 3 tables
    console.log('\n3. Checking Phase 3 tables existence:');
    
    const tables = ['badge_collections', 'achievement_milestones', 'game_badge_conditions', 'user_badge_collections'];
    
    for (const tableName of tables) {
      try {
        const result = await db.execute(sql`SELECT COUNT(*) as count FROM ${sql.identifier(tableName)}`);
        console.log(`   ✅ ${tableName}: ${(result[0] as any).count} records`);
      } catch (error) {
        console.log(`   ❌ ${tableName}: Table does not exist`);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await client.end();
  }
}

checkBadgeTableStructure().then(() => process.exit(0));
