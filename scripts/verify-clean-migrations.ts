import 'dotenv/config';
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/*
 * verify-clean-migrations.ts
 * Purpose: After pointing POSTGRES_URL at a brand-new empty database, run:
 *   npm run db:migrate
 *   npm run db:verify:clean
 * This script will:
 *  1. Read the local Drizzle migration journal (meta/_journal.json).
 *  2. Check the target database's drizzle.__drizzle_migrations table for applied tags.
 *  3. Assert all expected migrations (0000..0009) are present (and no unexpected gaps).
 *  4. Validate presence of critical tables & required columns for the unified schema.
 *  5. Emit a concise PASS/FAIL summary with actionable guidance.
 *
 * Exit codes:
 *   0 = All checks passed.
 *   1 = One or more blocking issues detected.
 */

type TableSpec = { required: string[]; optional?: string[] };

const criticalSchema: Record<string, TableSpec> = {
  users: { required: ['id','email','username','xp','bytes','level','streak','longest_streak','no_contact_days','created_at'] },
  anonymous_posts: { required: ['id','user_id','content','comment_count','created_at'] },
  wall_post_comments: { required: ['id','post_id','user_id','content','created_at'] },
  wall_post_reactions: { required: ['id','post_id','user_id','reaction_type','created_at'] },
  ritual_entries: { required: ['id','user_id','ritual_code','performed_at','created_at'] },
  daily_rituals: { required: ['id','user_id','title','created_at'] },
  user_daily_prescriptions: { required: ['id','user_id','prescribed_date','ritual_key'] },
  ai_letters: { required: ['id','user_id','letter_type','created_at'] },
  daily_check_ins: { required: ['id','user_id','period_id','check_in_date','mood','created_at'] },
  admin_audit_log: { required: ['id','admin_user_id','action','created_at'] },
  badges: { required: ['id','name','category','xp_reward'] },
  user_badges: { required: ['id','user_id','badge_id','earned_at'] },
  rituals: { required: ['id','user_id','title','created_at'] },
  weekly_summaries: { required: ['id','user_id','week_start','created_at'] },
};

async function main() {
  const url = process.env.POSTGRES_URL;
  if (!url) {
    console.error('[VERIFY] POSTGRES_URL not set. Aborting.');
    process.exit(1);
  }

  const journalPath = path.join(process.cwd(), 'lib', 'db', 'migrations', 'meta', '_journal.json');
  const journalRaw = fs.readFileSync(journalPath, 'utf8');
  const journal = JSON.parse(journalRaw);
  // Drizzle v2 migration journal stores entries with tag + hash, but the database table only stores hash (id, hash, created_at)
  const migrationsDir = path.join(process.cwd(), 'lib', 'db', 'migrations');
  const expectedEntries: { tag: string; hash: string | undefined }[] = journal.entries.map((e: any) => {
    const tag: string = e.tag;
    const filePath = path.join(migrationsDir, `${tag}.sql`);
    let hash: string | undefined = undefined;
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      hash = crypto.createHash('sha256').update(content).digest('hex');
    }
    return { tag, hash };
  });
  const expectedHashes = expectedEntries.map(e => e.hash).filter((h): h is string => !!h);
  // Flag any missing files
  for (const e of expectedEntries) {
    if (!e.hash) {
      console.warn(`[VERIFY] Migration file missing for tag ${e.tag}`);
    }
  }

  const sql = postgres(url, { ssl: { rejectUnauthorized: false }, max: 1 });
  const issues: string[] = [];

  // 1. Fetch applied migrations
  let applied: { hash: string }[] = [];
  try {
  applied = await sql`select hash from drizzle.__drizzle_migrations order by created_at asc`;
  } catch (e) {
    issues.push(`Could not read drizzle.__drizzle_migrations table: ${(e as Error).message}`);
  }
  const appliedHashes = new Set(applied.map(r => r.hash));
  const missingMigrations = expectedHashes.filter(h => !appliedHashes.has(h));
  if (missingMigrations.length) {
  // Map missing hashes back to tags for readability
  const hashToTag: Record<string,string> = {};
  for (const e of expectedEntries) if (e.hash) hashToTag[e.hash] = e.tag;
  issues.push(`Missing migrations not applied (by tag): ${missingMigrations.map(h => hashToTag[h] || h).join(', ')}`);
  }

  // 2. Verify critical tables and columns
  interface ColRow { table_name: string; column_name: string }
  let columns: ColRow[] = [];
  try {
    columns = await sql<ColRow[]>`select table_name, column_name from information_schema.columns where table_schema='public'` as any;
  } catch (e) {
    issues.push(`Failed to list information_schema.columns: ${(e as Error).message}`);
  }
  const byTable = new Map<string, Set<string>>();
  for (const { table_name, column_name } of columns) {
    if (!byTable.has(table_name)) byTable.set(table_name, new Set());
    byTable.get(table_name)!.add(column_name);
  }
  const tableFindings: Record<string, { ok: boolean; missing: string[] }> = {};
  for (const [table, spec] of Object.entries(criticalSchema)) {
    const presentCols = byTable.get(table);
    if (!presentCols) {
      tableFindings[table] = { ok: false, missing: spec.required };
      issues.push(`Table '${table}' missing entirely.`);
    } else {
      const missing = spec.required.filter(c => !presentCols.has(c));
      if (missing.length) {
        tableFindings[table] = { ok: false, missing };
        issues.push(`Table '${table}' missing columns: ${missing.join(', ')}`);
      } else {
        tableFindings[table] = { ok: true, missing: [] };
      }
    }
  }

  // 3. Summary
  if (issues.length === 0) {
    console.log('=== CLEAN MIGRATION VERIFICATION: PASS ===');
  console.log(`Migrations applied: ${expectedHashes.length} / ${expectedHashes.length}`);
    console.log('Critical tables & columns present.');
    process.exit(0);
  } else {
    console.error('=== CLEAN MIGRATION VERIFICATION: FAIL ===');
    for (const issue of issues) console.error(' - ' + issue);
    console.error('\nRemediation tips:');
    console.error(' 1. Ensure you pointed POSTGRES_URL at a brand-new empty database before running npm run db:migrate.');
    console.error(' 2. Re-run: npm run db:migrate');
    console.error(' 3. If tables were partially created then dropped manually, drop and recreate the database for a pristine test.');
    console.error(' 4. If a migration file was edited after initial application, clear the database and re-apply from scratch.');
    process.exit(1);
  }
}

main().catch(e => {
  console.error('[VERIFY] Unhandled error:', e);
  process.exit(1);
});
