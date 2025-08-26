#!/usr/bin/env node
/**
 * Generate a drizzle meta/_journal.json from existing migrations directory.
 * This does NOT validate hashes like drizzle-kit would; it creates a linear journal
 * using filename ordering so drizzle won't try to reapply already-applied migrations.
 *
 * Usage: npm run db:journal:generate
 * Output: lib/db/migrations/meta/_journal.json (will refuse to overwrite unless --force)
 */
const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.join(process.cwd(), 'lib', 'db', 'migrations');
const META_DIR = path.join(MIGRATIONS_DIR, 'meta');
const JOURNAL = path.join(META_DIR, '_journal.json');

const force = process.argv.includes('--force');

if (!fs.existsSync(MIGRATIONS_DIR)) {
  console.error('[journal] migrations directory missing');
  process.exit(1);
}

if (fs.existsSync(JOURNAL) && !force) {
  console.error('[journal] meta/_journal.json already exists. Pass --force to overwrite.');
  process.exit(1);
}

const files = fs.readdirSync(MIGRATIONS_DIR)
  .filter(f => f.endsWith('.sql') && f !== '000000_baseline_snapshot.sql') // exclude baseline from journal (optional) – you can include if desired
  .sort();

// Optionally include baseline at start by uncommenting next line
// files.unshift('000000_baseline_snapshot.sql');

const entries = files.map((file, idx) => ({
  idx,
  version: 1,
  when: new Date().toISOString(),
  tag: file,
  // drizzle normally stores a hash; we store null placeholder to prevent mismatch attempts
  hash: null
}));

const data = { version: 1, dialect: 'postgresql', entries };

fs.mkdirSync(META_DIR, { recursive: true });
fs.writeFileSync(JOURNAL, JSON.stringify(data, null, 2));
console.log('[journal] Wrote', JOURNAL, 'with', entries.length, 'entries');
console.log('[journal] Review file and optionally add hash values copied from a fresh drizzle generate run.');
