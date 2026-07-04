import { RateLimiter } from "@/lib/ai/rate-limiter";

export const websiteSessionRateLimiter = new RateLimiter();
export const websiteIpRateLimiter = new RateLimiter();

export type WebsiteRateLimitConfig = {
  sessionPerMinute: number;
  ipPerMinute: number;
};

export function getWebsiteWidgetRateLimitConfig(): WebsiteRateLimitConfig {
  const sessionPerMinute = parsePositiveInt(
    process.env.WEBSITE_WIDGET_SESSION_RATE_LIMIT,
    30
  );
  const ipPerMinute = parsePositiveInt(
    process.env.WEBSITE_WIDGET_IP_RATE_LIMIT,
    60
  );

  return { sessionPerMinute, ipPerMinute };
}

function parsePositiveInt(raw: string | undefined, fallback: number): number {
  const parsed = raw ? Number.parseInt(raw, 10) : fallback;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export type WebsiteRateLimitResult =
  | { allowed: true }
  | { allowed: false; scope: "session" | "ip"; retryAfterMs: number };

export function checkWebsiteWidgetRateLimit(
  sessionId: string,
  ipAddress: string,
  config: WebsiteRateLimitConfig = getWebsiteWidgetRateLimitConfig()
): WebsiteRateLimitResult {
  const sessionCheck = websiteSessionRateLimiter.check(
    `website:session:${sessionId}`,
    config.sessionPerMinute
  );

  if (!sessionCheck.allowed) {
    return {
      allowed: false,
      scope: "session",
      retryAfterMs: sessionCheck.retryAfterMs,
    };
  }

  const ipCheck = websiteIpRateLimiter.check(
    `website:ip:${ipAddress}`,
    config.ipPerMinute
  );

  if (!ipCheck.allowed) {
    return {
      allowed: false,
      scope: "ip",
      retryAfterMs: ipCheck.retryAfterMs,
    };
  }

  return { allowed: true };
}

export function __resetWebsiteRateLimitersForTests(): void {
  websiteSessionRateLimiter.reset();
  websiteIpRateLimiter.reset();
}
