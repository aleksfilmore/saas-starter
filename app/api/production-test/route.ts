// Simple production test - API route
export async function GET() {
  try {
    console.log('🚨 Production test - checking environment');
    
    // Check basic environment
    const hasPostgresUrl = !!process.env.POSTGRES_URL;
    const nodeEnv = process.env.NODE_ENV;
    
    console.log('Environment check:', { hasPostgresUrl, nodeEnv });
    
    if (!hasPostgresUrl) {
      return Response.json({ 
        error: 'Missing POSTGRES_URL', 
        env: nodeEnv 
      }, { status: 500 });
    }
    
    // Try to import postgres directly without drizzle
    const postgres = require('postgres');
    
    const client = postgres(process.env.POSTGRES_URL, {
      ssl: 'require',
      max: 1,
      prepare: false,
      connect_timeout: 5,
    });
    
    console.log('Testing simple query...');
    const result = await client`SELECT 1 as test, 'production-check' as status`;
    console.log('Query result:', result[0]);
    
    await client.end();
    
    return Response.json({ 
      success: true, 
      result: result[0],
      env: nodeEnv 
    });
    
  } catch (error) {
    console.error('Production test error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack?.split('\n').slice(0, 5) : [];
    
    return Response.json({ 
      error: errorMessage,
      stack: errorStack,
      env: process.env.NODE_ENV
    }, { status: 500 });
  }
}
