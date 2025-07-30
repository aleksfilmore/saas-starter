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
    
    // Test basic connection with timeout
    console.log('Testing database connection...');
    
    const { client } = await import('@/lib/db/drizzle');
    
    // Simple connection test with timeout
    const connectionTest = await Promise.race([
      client`SELECT 1 as test`,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout after 5 seconds')), 5000)
      )
    ]);
    
    console.log('✅ Database connection successful:', connectionTest);
    
    // Test schema import
    const { users } = await import('@/lib/db/schema');
    console.log('✅ Schema import successful');
    
    // Test simple query
    const { db } = await import('@/lib/db/drizzle');
    const userCount = await db.select().from(users).limit(1);
    console.log('✅ Database query successful, found', userCount.length, 'users');
    
    return NextResponse.json({
      status: 'success',
      database: 'connected',
      envVars: {
        postgres: !!postgresUrl,
        nodeEnv: process.env.NODE_ENV || 'not set'
      },
      connectionTest: 'passed',
      userSample: userCount.length
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
