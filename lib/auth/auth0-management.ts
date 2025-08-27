// Lightweight Auth0 Management helpers for revoking sessions / refresh tokens
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

async function getManagementToken(): Promise<string | null> {
  if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID || !AUTH0_CLIENT_SECRET) return null;
  try {
    const resp = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET,
        audience: `https://${AUTH0_DOMAIN}/api/v2/`
      })
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    return data.access_token ?? null;
  } catch (err) {
    console.error('getManagementToken error:', err);
    return null;
  }
}

export async function revokeUserSessionsByAuth0Sub(auth0Sub: string) {
  if (!auth0Sub) return false;
  const token = await getManagementToken();
  if (!token) return false;
  try {
    const url = `https://${AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(auth0Sub)}/sessions`;
    const resp = await fetch(url, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    return resp.ok;
  } catch (err) {
    console.error('revokeUserSessionsByAuth0Sub error:', err);
    return false;
  }
}

export async function revokeRefreshToken(refreshToken: string) {
  if (!refreshToken || !AUTH0_CLIENT_ID || !AUTH0_CLIENT_SECRET || !AUTH0_DOMAIN) return false;
  try {
    const body = new URLSearchParams();
    body.set('client_id', AUTH0_CLIENT_ID);
    body.set('client_secret', AUTH0_CLIENT_SECRET);
    body.set('token', refreshToken);

    const resp = await fetch(`https://${AUTH0_DOMAIN}/oauth/revoke`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });
    return resp.ok;
  } catch (err) {
    console.error('revokeRefreshToken error:', err);
    return false;
  }
}

export async function getAuth0SubForLocalUser(localUserId: string) {
  try {
    const rows = await db.select().from(users).where(eq(users.id, localUserId)).limit(1);
    const r = rows[0] as any | undefined;
    return r?.auth0_sub ?? null;
  } catch (err) {
    console.error('getAuth0SubForLocalUser error:', err);
    return null;
  }

}
