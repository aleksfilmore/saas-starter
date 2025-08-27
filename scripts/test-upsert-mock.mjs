#!/usr/bin/env node
(async () => {
  // Mock payload and session
  const payload = { sub: 'auth0|12345', email: 'TEST+mock@example.com', name: 'Mock User' };
  const session = { user: { sub: 'auth0|12345', email: 'test+mock@example.com', name: 'Mock User' } };

  function cryptoRandomId() {
    return 'id_' + Math.random().toString(36).slice(2, 10);
  }

  // Mock client that records query/values and returns a synthetic row
  const client = {
    released: false,
    async query(q, values) {
      console.log('\n[MOCK CLIENT] Received query with values:', values);
      // Simulate DB returning the inserted/updated row
      return { rows: [{ id: values[0], email: values[1] }] };
    },
    release() {
      this.released = true;
    }
  };

  async function upsertAuth0UserWithClient(client, payload, session) {
    const auth0Sub = payload?.sub || session?.user?.sub || null;
    const email = (payload?.email || session?.user?.email || '').toLowerCase();
    const name = payload?.name || session?.user?.name || null;
    if (!email) throw new Error('missing_email');
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
  }

  try {
    const user = await upsertAuth0UserWithClient(client, payload, session);
    console.log('\n[TEST] Upsert result:', user);
    console.log('[TEST] Client released?', client.released);
    process.exit(0);
  } catch (err) {
    console.error('[TEST] Error', err);
    process.exit(2);
  }
})();
