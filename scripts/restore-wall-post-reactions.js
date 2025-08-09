// Idempotent restoration script for wall_post_reactions table & FKs
// Usage: node scripts/restore-wall-post-reactions.js

import postgres from 'postgres';
import { config } from 'dotenv';
config({ path: '.env.local' });

if(!process.env.POSTGRES_URL){
  console.error('POSTGRES_URL not set');
  process.exit(1);
}

const sql = postgres(process.env.POSTGRES_URL);

async function ensureTable(){
  await sql`CREATE TABLE IF NOT EXISTS wall_post_reactions (
    id text PRIMARY KEY NOT NULL,
    post_id text NOT NULL,
    user_id text NOT NULL,
    reaction_type text NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
  )`;
}

async function ensureConstraint(name, ddl){
  const exists = await sql/*sql*/`SELECT 1 FROM pg_constraint WHERE conname = ${name}`;
  if(!exists.length){
    console.log('Creating constraint', name);
    await sql.unsafe(ddl);
  } else {
    console.log('Constraint exists', name);
  }
}

async function run(){
  try {
    await ensureTable();
    await ensureConstraint('wall_post_reactions_post_id_anonymous_posts_id_fk',
      'ALTER TABLE wall_post_reactions ADD CONSTRAINT wall_post_reactions_post_id_anonymous_posts_id_fk FOREIGN KEY (post_id) REFERENCES anonymous_posts(id) ON DELETE NO ACTION ON UPDATE NO ACTION');
    await ensureConstraint('wall_post_reactions_user_id_users_id_fk',
      'ALTER TABLE wall_post_reactions ADD CONSTRAINT wall_post_reactions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION');

    const res = await sql`SELECT to_regclass('public.wall_post_reactions') as reg`;
    const count = await sql`SELECT count(*)::int as c FROM wall_post_reactions`;
    console.log('Table:', res[0].reg, 'Rows:', count[0].c);
  } catch (e){
    console.error('Restore failed', e);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

run();
