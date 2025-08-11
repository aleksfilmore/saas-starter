import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    console.log('🔍 Checking ritual_library schema...');
    
    // Get the actual column names from ritual_library
    const schemaQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'ritual_library' 
      ORDER BY ordinal_position;
    `;
    
    const result = await pool.query(schemaQuery);
    
    return NextResponse.json({
      success: true,
      schema: result.rows,
      column_names: result.rows.map(row => row.column_name),
      message: 'Schema retrieved successfully'
    });
    
  } catch (error) {
    console.error('❌ Schema check error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
