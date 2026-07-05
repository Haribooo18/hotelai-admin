import { opsMetrics } from "@/lib/ops/metrics";

type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();

export type RateLimitTrackMeta = {
  endpoint: string;
  hotelId?: string;
  ip?: string;
  conversationId?: string;
  reason?: string;
};

export class RateLimiter {
  constructor(private readonly windowMs = 60_000) {}

  check(
    key: string,
    limit: number,
    track?: RateLimitTrackMeta
  ): { allowed: boolean; retryAfterMs: number } {
    const now = Date.now();
    const bucket = buckets.get(key) ?? { timestamps: [] };

    bucket.timestamps = bucket.timestamps.filter(
      (t) => now - t < this.windowMs
    );

    if (bucket.timestamps.length >= limit) {
      const oldest = bucket.timestamps[0] ?? now;
      const retryAfterMs = Math.max(0, this.windowMs - (now - oldest));

      if (track) {
        opsMetrics.recordRateLimitBlock({
          endpoint: track.endpoint,
          hotelId: track.hotelId,
          ip: track.ip,
          conversationId: track.conversationId,
          reason: track.reason ?? "rate_limit",
          retryAfterMs,
        });
      }

      return {
        allowed: false,
        retryAfterMs,
      };
    }

    bucket.timestamps.push(now);
    buckets.set(key, bucket);
    return { allowed: true, retryAfterMs: 0 };
  }

  reset(key?: string): void {
    if (key) {
      buckets.delete(key);
      return;
    }

    buckets.clear();
  }
}

export const hotelRateLimiter = new RateLimiter();
