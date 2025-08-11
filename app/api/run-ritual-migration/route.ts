import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Running ritual system migration...');
    
    // Read and execute the schema SQL
    const schemaSQL = readFileSync(join(process.cwd(), 'lib/db/ritual-schema.sql'), 'utf-8');
    
    // Split by semicolon and execute each statement
    const statements = schemaSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    const results = [];
    
    for (const statement of statements) {
      try {
        await db.execute(sql.raw(statement));
        results.push({ statement: statement.substring(0, 50) + '...', status: 'success' });
        console.log('✅ Executed statement');
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        results.push({ 
          statement: statement.substring(0, 50) + '...', 
          status: 'warning', 
          error: errorMsg.substring(0, 100) + '...' 
        });
        console.log(`⚠️ Statement might already exist: ${errorMsg.substring(0, 100)}...`);
      }
    }
    
    console.log('🎉 Ritual system migration completed!');
    return NextResponse.json({ 
      success: true, 
      message: 'Ritual system migration completed!', 
      results 
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Migration failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
