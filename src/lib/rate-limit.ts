/**
 * Minimal fixed-window, in-memory rate limiter.
 * Good enough for a single Node instance. On serverless/multi-instance hosting,
 * swap this for a shared store (e.g. Redis / Upstash) to make limits global.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60_000) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 5_000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    }
    return { allowed: true, retryAfter: 0 };
  }

  bucket.count += 1;
  return {
    allowed: bucket.count <= limit,
    retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
  };
}
