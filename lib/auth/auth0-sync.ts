import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

export async function upsertAuth0User(payload: any | null, session: any) {
  const auth0Sub = payload?.sub || session?.user?.sub || null;
  const email = (payload?.email || session?.user?.email || '').toLowerCase();
  const name = payload?.name || session?.user?.name || null;

  if (!email) throw new Error('missing_email');

  const client = await pool.connect();
  try {
    const now = new Date().toISOString();
    const id = auth0Sub || cryptoRandomId();
    const query = `
      INSERT INTO users (id, email, name, auth0_sub, is_active, is_admin, created_at, updated_at)
      VALUES ($1,$2,$3,$4,true,false,$5,$5)
      ON CONFLICT (email) DO UPDATE
        SET auth0_sub = EXCLUDED.auth0_sub,
            name = COALESCE(EXCLUDED.name, users.name),
            updated_at = EXCLUDED.updated_at
      RETURNING id, email;
    `;
    const values = [id, email, name, auth0Sub, now];
    const r = await client.query(query, values);
    return r.rows[0] || null;
  } finally {
    client.release();
  }
}

function cryptoRandomId() {
  if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) return (crypto as any).randomUUID();
  return 'id_' + Math.random().toString(36).slice(2, 10);
}
