import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { logSchemaWarning } from '@/lib/db/schema-health-logger';

export const runtime = 'nodejs';

// Expected tables and minimal required column sets
const expectedSchema: Record<string, string[]> = {
  anonymous_posts: [
    'id','content','glitch_title','glitch_category','comment_count','created_at'
  ],
  wall_post_comments: [
    'id','post_id','user_id','content','created_at'
  ],
  wall_post_reactions: [
    'id','post_id','user_id','reaction_type','created_at'
  ],
  ritual_entries: [
    'id','user_id','ritual_code','performed_at','created_at'
  ]
};

async function tableExists(name: string) {
  try {
    await db.execute(sql`SELECT 1 FROM information_schema.tables WHERE table_name = ${name} LIMIT 1`);
    // Second query actually attempts selecting from table to ensure it exists and is accessible.
    await db.execute(sql`SELECT 1 FROM ${sql.raw(name)} LIMIT 1`);
    return true;
  } catch {
    return false;
  }
}

async function getColumns(table: string): Promise<Set<string>> {
  const rows = await db.execute<{ column_name: string }>(sql`SELECT column_name FROM information_schema.columns WHERE table_name = ${table}`);
  return new Set(rows.map(r => (r as any).column_name));
}

export async function GET() {
  const tableStatus: Record<string, { exists: boolean; missingColumns: string[] }> = {};
  for (const table of Object.keys(expectedSchema)) {
    const exists = await tableExists(table);
    if (!exists) {
      logSchemaWarning(`missing:${table}`, `Table '${table}' is missing. Some features will show zeros until restored.`);
      tableStatus[table] = { exists: false, missingColumns: expectedSchema[table] };
      continue;
    }
    const present = await getColumns(table);
    const required = expectedSchema[table];
    const missingCols = required.filter(c => !present.has(c));
    if (missingCols.length) {
      logSchemaWarning(`cols-missing:${table}`, `Table '${table}' missing columns: ${missingCols.join(', ')}`);
    }
    tableStatus[table] = { exists: true, missingColumns: missingCols };
  }
  const anyMissingTable = Object.values(tableStatus).some(s => !s.exists);
  const anyMissingCols = Object.values(tableStatus).some(s => s.missingColumns.length > 0);
  return NextResponse.json({ ok: !anyMissingTable && !anyMissingCols, tables: tableStatus });
}
