import { RateLimiter } from "@/lib/ai/rate-limiter";
import { opsMetrics } from "@/lib/ops/metrics";

const websiteSessionRateLimiter = new RateLimiter();
const websiteIpRateLimiter = new RateLimiter();

type WebsiteRateLimitConfig = {
  sessionPerMinute: number;
  ipPerMinute: number;
};

function getWebsiteWidgetRateLimitConfig(): WebsiteRateLimitConfig {
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

type WebsiteRateLimitResult =
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
    opsMetrics.recordRateLimitBlock({
      endpoint: "/api/channels/website/stream",
      ip: ipAddress,
      conversationId: sessionId,
      reason: "website_session",
      retryAfterMs: sessionCheck.retryAfterMs,
    });

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
    opsMetrics.recordRateLimitBlock({
      endpoint: "/api/channels/website/stream",
      ip: ipAddress,
      reason: "website_ip",
      retryAfterMs: ipCheck.retryAfterMs,
    });

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
