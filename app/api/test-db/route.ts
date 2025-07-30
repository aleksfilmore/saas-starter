// Quick API test for debugging authentication issues
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  console.log('=== Database Test API Called ===');
  
  try {
    // Test environment variables first
    const postgresUrl = process.env.POSTGRES_URL;
    console.log('Environment check:');
    console.log('- POSTGRES_URL exists:', !!postgresUrl);
    console.log('- NODE_ENV:', process.env.NODE_ENV || 'not set');
    
    if (!postgresUrl) {
      console.log('❌ POSTGRES_URL is missing');
      return NextResponse.json({
        status: 'error',
        error: 'POSTGRES_URL environment variable is missing',
        envVars: { postgres: false, nodeEnv: process.env.NODE_ENV || 'not set' }
      }, { status: 500 });
    }
    
    console.log('✅ Environment variables OK');
    
    // Import postgres directly to avoid schema issues
    const postgres = (await import('postgres')).default;
    const sql = postgres(postgresUrl, {
      ssl: 'require',
      max: 1,
      prepare: false,
    });
    
    // Test basic connection
    console.log('Testing database connection...');
    const connectionTest = await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful');
    
    // Check users table structure
    console.log('Checking users table structure...');
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `;
    
    console.log('Current columns:', columns.map(c => c.column_name));
    
    // Check if username column exists
    const hasUsername = columns.some(col => col.column_name === 'username');
    console.log('Has username column:', hasUsername);
    
    // Add username column if missing
    if (!hasUsername) {
      console.log('Adding username column...');
      await sql`ALTER TABLE users ADD COLUMN username text UNIQUE`;
      console.log('✅ Username column added');
    }
    
    // Test user count
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    console.log('✅ User count:', userCount[0].count);
    
    await sql.end();
    
    return NextResponse.json({
      status: 'success',
      database: 'connected',
      envVars: {
        postgres: !!postgresUrl,
        nodeEnv: process.env.NODE_ENV || 'not set'
      },
      connectionTest: 'passed',
      userCount: userCount[0].count,
      hasUsername: hasUsername,
      columns: columns.map(c => c.column_name)
    });
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      envVars: {
        postgres: !!process.env.POSTGRES_URL,
        nodeEnv: process.env.NODE_ENV || 'not set'
      }
    }, { status: 500 });
  }
}
