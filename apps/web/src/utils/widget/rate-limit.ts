interface Bucket {
  count: number;
  resetAt: number;
}

export interface RateLimiterOptions {
  limit: number;
  windowMs: number;
  now?: () => number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

/**
 * Simple in-memory fixed-window limiter. Sufficient for a single-instance MVP;
 * swap the store for Upstash/Redis when running multiple instances.
 */
export function createRateLimiter(options: RateLimiterOptions) {
  const now = options.now ?? Date.now;
  const buckets = new Map<string, Bucket>();

  return {
    check(key: string): RateLimitResult {
      const current = now();
      const bucket = buckets.get(key);
      if (!bucket || current >= bucket.resetAt) {
        buckets.set(key, { count: 1, resetAt: current + options.windowMs });
        return { allowed: true, remaining: options.limit - 1 };
      }
      if (bucket.count >= options.limit) {
        return { allowed: false, remaining: 0 };
      }
      bucket.count += 1;
      return { allowed: true, remaining: options.limit - bucket.count };
    },
  };
}
