// Mock 'pg' before importing the module that uses it
jest.mock('pg', () => {
  const mClient = {
    query: jest.fn().mockResolvedValue({ rows: [{ id: 'auth0|123', email: 'test@example.com' }] }),
    release: jest.fn(),
  };
  const mPool = {
    connect: jest.fn().mockResolvedValue(mClient),
  };
  return { Pool: jest.fn(() => mPool) };
});

import { upsertAuth0User } from '@/lib/auth/auth0-sync';

describe('upsertAuth0User', () => {
  it('inserts/updates and returns the user row', async () => {
    const payload = { sub: 'auth0|123', email: 'test@example.com', name: 'Tester' };
    const session = { user: { sub: 'auth0|123', email: 'test@example.com', name: 'Tester' } };
    const result = await upsertAuth0User(payload, session as any);
    expect(result).toEqual({ id: 'auth0|123', email: 'test@example.com' });
  });
});
