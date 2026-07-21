import { beforeEach, describe, expect, it } from "vitest";

import {
  checkMarketingLeadRateLimit,
  resetMarketingLeadRateLimitForTests,
} from "@/lib/marketing/rate-limit";

describe("marketing lead rate limit", () => {
  beforeEach(() => resetMarketingLeadRateLimitForTests());

  it("allows the initial requests and blocks excess submissions", () => {
    for (let index = 0; index < 8; index += 1) {
      expect(checkMarketingLeadRateLimit("127.0.0.1", 1000)).toEqual({
        allowed: true,
      });
    }

    expect(checkMarketingLeadRateLimit("127.0.0.1", 1000)).toEqual({
      allowed: false,
      retryAfterMs: 10 * 60 * 1000,
    });
  });

  it("resets after the window", () => {
    checkMarketingLeadRateLimit("127.0.0.1", 1000);
    expect(
      checkMarketingLeadRateLimit("127.0.0.1", 1000 + 10 * 60 * 1000)
    ).toEqual({ allowed: true });
  });
});
