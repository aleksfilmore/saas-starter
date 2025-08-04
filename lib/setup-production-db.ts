import { db } from './db/drizzle';
import { sql } from 'drizzle-orm';

export async function setupProductionDatabase() {
  try {
    console.log('🚀 Setting up production database...');
    
    // Check connection
    await db.execute(sql`SELECT 1`);
    console.log('✅ Database connection successful');
    
    // Verify critical tables exist
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📊 Existing tables:', tables.map((r: any) => r.table_name));
    
    // Check user count
    const userCount = await db.execute(sql`SELECT COUNT(*) as count FROM users`);
    console.log(`👥 Total users: ${userCount[0]?.count || 0}`);
    
    return { success: true, tables: tables };
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
}
