import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    console.log('Connecting to database with URL starting with:', process.env.DATABASE_URL?.substring(0, 20) + '...');
    
    // Check ritual_library table schema
    const schemaQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'ritual_library' 
      ORDER BY ordinal_position;
    `;
    
    const schemaResult = await pool.query(schemaQuery);
    
    // Get sample data from ritual_library  
    const sampleQuery = `
      SELECT id, title, category, tier
      FROM ritual_library 
      LIMIT 3;
    `;
    
    const sampleResult = await pool.query(sampleQuery);
    
    return NextResponse.json({
      success: true,
      schema: schemaResult.rows,
      sample_data: sampleResult.rows,
      message: 'Schema information retrieved'
    });
    
  } catch (error) {
    console.error('❌ Schema check error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
