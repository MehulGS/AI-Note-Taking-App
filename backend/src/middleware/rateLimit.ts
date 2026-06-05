import type { Context, Next } from 'hono';
import { genericFailure } from '../utils/response.js';
import { getClientIp } from '../utils/security.js';

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function rateLimit(options: { windowMs: number; max: number; keyPrefix: string }) {
  return async (c: Context, next: Next) => {
    const ip = getClientIp(c);
    const key = `${options.keyPrefix}:${ip}`;
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + options.windowMs });
      await next();
      return;
    }

    if (bucket.count >= options.max) {
      console.warn(`rate_limit_blocked key=${options.keyPrefix} ip=${ip}`);
      return genericFailure(c, 429);
    }

    bucket.count += 1;
    await next();
  };
}
