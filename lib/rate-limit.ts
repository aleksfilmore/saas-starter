// Redis + memory fallback rate limiter.
// Strategy: INCR key, set EXPIRE on first increment; reject if value > max.
// Fallback: simple in-memory fixed window.

let redisClient: any = null;
async function getRedis() {
  if (redisClient !== null) return redisClient;
  const url = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;
  if (!url) { redisClient = false; return redisClient; }
  try {
    // Dynamic import to avoid bundling if unused
    try {
      // @ts-ignore optional dependency
      const upstash = await import('@upstash/redis').catch(()=>null);
      if (upstash && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        const RedisCtor: any = (upstash as any).Redis;
        redisClient = new RedisCtor({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
      } else {
  // @ts-ignore optional dependency
  const mod = await import('ioredis').catch(()=>null);
        if (mod) {
          // @ts-ignore dynamic
            redisClient = new mod.default(url);
        }
      }
    } catch {}
  } catch (e) {
    console.warn('[rateLimit] Redis unavailable, using memory fallback', e);
    redisClient = false;
  }
  return redisClient;
}

const memoryBuckets = new Map<string, { count:number; reset:number }>();

export async function rateLimit(key: string, max: number, windowSeconds: number) {
  const redis = await getRedis();
  if (redis && redis !== false) {
    try {
      const redisKey = `rl:${key}`;
      let count: number;
      if (redis.constructor?.name === 'Redis') { // Upstash
        count = await redis.incr(redisKey);
        if (count === 1) await redis.expire(redisKey, windowSeconds);
      } else {
        // ioredis style
        count = await redis.incr(redisKey);
        if (count === 1) await redis.expire(redisKey, windowSeconds);
      }
      if (count > max) {
        const ttl = await (redis.ttl(redisKey));
        return { ok: false, remaining: 0, retryAfter: ttl };
      }
      return { ok: true, remaining: Math.max(0, max - count) };
    } catch (e) {
      console.warn('[rateLimit] Redis error, falling back to memory', e);
    }
  }
  // Memory fallback
  const now = Date.now();
  const bucket = memoryBuckets.get(key);
  if (!bucket || now > bucket.reset) {
    memoryBuckets.set(key, { count: 1, reset: now + windowSeconds * 1000 });
    return { ok: true, remaining: max - 1 };
  }
  if (bucket.count >= max) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((bucket.reset - now)/1000) };
  }
  bucket.count += 1;
  return { ok: true, remaining: max - bucket.count };
}

export async function rateLimitThrow(key: string, max: number, windowSeconds: number) {
  const res = await rateLimit(key, max, windowSeconds);
  if (!res.ok) throw new Error('Rate limit exceeded');
  return res;
}
