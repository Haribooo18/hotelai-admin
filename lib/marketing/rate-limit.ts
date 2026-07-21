type Entry = { count: number; resetAt: number };

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 8;
const entries = new Map<string, Entry>();

export type MarketingRateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterMs: number };

export function getMarketingClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")?.trim()
    || "unknown";
  return ip;
}

export function checkMarketingLeadRateLimit(
  key: string,
  now = Date.now()
): MarketingRateLimitResult {
  const current = entries.get(key);

  if (!current || current.resetAt <= now) {
    entries.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (current.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfterMs: current.resetAt - now };
  }

  current.count += 1;
  return { allowed: true };
}

export function resetMarketingLeadRateLimitForTests(): void {
  entries.clear();
}
