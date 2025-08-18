import Redis from 'ioredis';

interface CacheConfig {
  defaultTTL: number;
  maxMemory: string;
  keyPrefix: string;
}

interface CacheEntry<T> {
  value: T;
  ttl: number;
  createdAt: number;
}

export class CacheService {
  private redis: Redis | null = null;
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private config: CacheConfig;
  private cleanupInterval: NodeJS.Timeout;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 300, // 5 minutes
      maxMemory: '100mb',
      keyPrefix: 'saas:',
      ...config
    };

    // Try to connect to Redis if available
    this.initRedis();

    // Cleanup memory cache every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupMemoryCache();
    }, 300000);
  }

  private initRedis() {
    try {
      if (process.env.REDIS_URL) {
        this.redis = new Redis(process.env.REDIS_URL, {
          retryDelayOnFailover: 100,
          maxRetriesPerRequest: 3,
          lazyConnect: true
        });

        this.redis.on('error', (error: Error) => {
          console.warn('Redis connection error, falling back to memory cache:', error);
          this.redis = null;
        });
      }
    } catch (error) {
      console.warn('Redis not available, using memory cache:', error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const fullKey = this.config.keyPrefix + key;

    try {
      if (this.redis) {
        const result = await this.redis.get(fullKey);
        return result ? JSON.parse(result) : null;
      } else {
        return this.getFromMemory<T>(fullKey);
      }
    } catch (error) {
      console.warn('Cache get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    const fullKey = this.config.keyPrefix + key;
    const cacheTTL = ttl || this.config.defaultTTL;

    try {
      if (this.redis) {
        await this.redis.setex(fullKey, cacheTTL, JSON.stringify(value));
        return true;
      } else {
        return this.setInMemory(fullKey, value, cacheTTL);
      }
    } catch (error) {
      console.warn('Cache set error:', error);
      return false;
    }
  }

  async del(key: string | string[]): Promise<boolean> {
    const keys = Array.isArray(key) ? key : [key];
    const fullKeys = keys.map(k => this.config.keyPrefix + k);

    try {
      if (this.redis) {
        await this.redis.del(...fullKeys);
        return true;
      } else {
        fullKeys.forEach(k => this.memoryCache.delete(k));
        return true;
      }
    } catch (error) {
      console.warn('Cache delete error:', error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    const fullKey = this.config.keyPrefix + key;

    try {
      if (this.redis) {
        const result = await this.redis.exists(fullKey);
        return result === 1;
      } else {
        const entry = this.memoryCache.get(fullKey);
        if (!entry) return false;
        
        if (this.isExpired(entry)) {
          this.memoryCache.delete(fullKey);
          return false;
        }
        
        return true;
      }
    } catch (error) {
      console.warn('Cache exists error:', error);
      return false;
    }
  }

  async flush(): Promise<boolean> {
    try {
      if (this.redis) {
        const keys = await this.redis.keys(this.config.keyPrefix + '*');
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
        return true;
      } else {
        const keysToDelete = Array.from(this.memoryCache.keys())
          .filter(key => key.startsWith(this.config.keyPrefix));
        keysToDelete.forEach(key => this.memoryCache.delete(key));
        return true;
      }
    } catch (error) {
      console.warn('Cache flush error:', error);
      return false;
    }
  }

  async getStats(): Promise<{
    type: 'redis' | 'memory';
    keyCount: number;
    memoryUsage: string;
    hitRate?: number;
  }> {
    try {
      if (this.redis) {
        const info = await this.redis.info('memory');
        const keyspace = await this.redis.info('keyspace');
        
        // Parse memory usage from Redis info
        const memoryMatch = info.match(/used_memory_human:([^\r\n]+)/);
        const memoryUsage = memoryMatch ? memoryMatch[1] : 'unknown';
        
        // Parse key count
        const keyMatch = keyspace.match(/keys=(\d+)/);
        const keyCount = keyMatch ? parseInt(keyMatch[1]) : 0;
        
        return {
          type: 'redis',
          keyCount,
          memoryUsage
        };
      } else {
        const keyCount = this.memoryCache.size;
        const memoryUsage = this.estimateMemoryUsage();
        
        return {
          type: 'memory',
          keyCount,
          memoryUsage
        };
      }
    } catch (error) {
      console.warn('Error getting cache stats:', error);
      return {
        type: this.redis ? 'redis' : 'memory',
        keyCount: 0,
        memoryUsage: 'unknown'
      };
    }
  }

  // Utility methods for common caching patterns
  async remember<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const fresh = await fetcher();
    await this.set(key, fresh, ttl);
    return fresh;
  }

  // Tag-based cache invalidation
  async tag(tags: string[]): Promise<CacheTag> {
    return new CacheTag(this, tags);
  }

  // Memory cache specific methods
  private getFromMemory<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);
    if (!entry) return null;

    if (this.isExpired(entry)) {
      this.memoryCache.delete(key);
      return null;
    }

    return entry.value;
  }

  private setInMemory<T>(key: string, value: T, ttl: number): boolean {
    const entry: CacheEntry<T> = {
      value,
      ttl,
      createdAt: Date.now()
    };

    this.memoryCache.set(key, entry);
    return true;
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() > (entry.createdAt + entry.ttl * 1000);
  }

  private cleanupMemoryCache() {
    const now = Date.now();
    for (const [key, entry] of this.memoryCache.entries()) {
      if (now > (entry.createdAt + entry.ttl * 1000)) {
        this.memoryCache.delete(key);
      }
    }
  }

  private estimateMemoryUsage(): string {
    const sizeInBytes = JSON.stringify(Array.from(this.memoryCache.entries())).length;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    if (sizeInMB < 1) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    }
    return `${sizeInMB.toFixed(2)} MB`;
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    if (this.redis) {
      this.redis.disconnect();
    }
    
    this.memoryCache.clear();
  }
}

class CacheTag {
  constructor(
    private cache: CacheService,
    private tags: string[]
  ) {}

  async remember<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    const taggedKey = this.createTaggedKey(key);
    return this.cache.remember(taggedKey, fetcher, ttl);
  }

  async flush(): Promise<boolean> {
    // This is a simplified implementation
    // In a production system, you'd want to maintain tag -> keys mapping
    const allKeys = this.tags.map(tag => `tag:${tag}:*`);
    return this.cache.del(allKeys);
  }

  private createTaggedKey(key: string): string {
    return `${this.tags.join(':')}:${key}`;
  }
}

// Create singleton instance
export const cache = new CacheService({
  defaultTTL: 300, // 5 minutes
  keyPrefix: 'saas:',
});
