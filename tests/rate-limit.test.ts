import { rateLimit } from '../lib/rate-limit';

// Basic jest-style test (adjust to your runner). If no test runner configured, this acts as specification.

describe('rateLimit (memory fallback)', () => {
  test('allows first N then blocks', async () => {
    const key = 'test:rl';
    const max = 3;
    for (let i=0;i<max;i++) {
      const res = await rateLimit(key, max, 5);
      expect(res.ok).toBe(true);
    }
    const blocked = await rateLimit(key, max, 5);
    expect(blocked.ok).toBe(false);
  });
});
