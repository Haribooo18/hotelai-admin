import { describe, expect, it } from "vitest";

import {
  isMarketingPublicPath,
  MARKETING_CTA,
  MARKETING_PUBLIC_PATHS,
} from "@/lib/marketing/routes";

describe("marketing routes", () => {
  it("treats home and marketing pages as public", () => {
    expect(isMarketingPublicPath("/")).toBe(true);
    expect(isMarketingPublicPath("/features")).toBe(true);
    expect(isMarketingPublicPath("/ai")).toBe(true);
    expect(isMarketingPublicPath("/security")).toBe(true);
    expect(isMarketingPublicPath("/integrations")).toBe(true);
    expect(isMarketingPublicPath("/demo")).toBe(true);
    expect(isMarketingPublicPath("/privacy")).toBe(true);
  });

  it("requires auth for app routes", () => {
    expect(isMarketingPublicPath("/dashboard")).toBe(false);
    expect(isMarketingPublicPath("/bookings")).toBe(false);
  });

  it("exposes trial and demo CTA destinations", () => {
    expect(MARKETING_CTA.trial).toBe("/login?intent=trial");
    expect(MARKETING_CTA.demo).toBe("/demo");
    expect(MARKETING_PUBLIC_PATHS).toContain("/demo");
  });
});
