import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    console.log('🔍 Checking ritual_library table schema...');
    
    // Get the actual schema of ritual_library table
    const schemaQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'ritual_library' 
      ORDER BY ordinal_position;
    `;
    
    const schemaResult = await pool.query(schemaQuery);
    
    // Get count of rituals
    const countQuery = `SELECT COUNT(*) as count FROM ritual_library`;
    const countResult = await pool.query(countQuery);
    
    // Get sample data to see what's actually there
    const sampleQuery = `SELECT id, title, tier FROM ritual_library LIMIT 3`;
    const sampleResult = await pool.query(sampleQuery);
    
    return NextResponse.json({
      success: true,
      schema: schemaResult.rows,
      count: countResult.rows[0].count,
      sample: sampleResult.rows,
      message: 'Schema and data retrieved successfully'
    });
    
  } catch (error) {
    console.error('❌ Schema check error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
