import { beforeEach, describe, expect, it } from "vitest";

import {
  __resetWebsiteRateLimitersForTests,
  checkWebsiteWidgetRateLimit,
} from "@/lib/channels/website/rate-limit";

describe("website widget rate limiting", () => {
  beforeEach(() => {
    __resetWebsiteRateLimitersForTests();
  });

  it("limits by session and ip independently", () => {
    const config = { sessionPerMinute: 1, ipPerMinute: 1 };

    expect(
      checkWebsiteWidgetRateLimit("sess-1", "1.1.1.1", config).allowed
    ).toBe(true);

    const sessionLimited = checkWebsiteWidgetRateLimit(
      "sess-1",
      "1.1.1.1",
      config
    );
    expect(sessionLimited.allowed).toBe(false);
    if (!sessionLimited.allowed) {
      expect(sessionLimited.scope).toBe("session");
    }

    expect(
      checkWebsiteWidgetRateLimit("sess-2", "1.1.1.1", config).allowed
    ).toBe(false);
  });
});
