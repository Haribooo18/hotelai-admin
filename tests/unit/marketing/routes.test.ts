import { describe, expect, it } from "vitest";

import {
  isMarketingPublicPath,
  MARKETING_CTA,
  MARKETING_PRODUCT_HREF,
  MARKETING_PRODUCT_SECTION_ID,
  MARKETING_PUBLIC_PATHS,
} from "@/lib/marketing/routes";

describe("marketing routes", () => {
  it("treats home and marketing pages as public", () => {
    expect(isMarketingPublicPath("/")).toBe(true);
    expect(isMarketingPublicPath("/features")).toBe(false);
    expect(isMarketingPublicPath("/ai")).toBe(true);
    expect(isMarketingPublicPath("/security")).toBe(true);
    expect(isMarketingPublicPath("/integrations")).toBe(true);
    expect(isMarketingPublicPath("/demo")).toBe(true);
    expect(isMarketingPublicPath("/about")).toBe(true);
    expect(isMarketingPublicPath("/blog")).toBe(false);
    expect(isMarketingPublicPath("/docs")).toBe(true);
    expect(isMarketingPublicPath("/docs/getting-started")).toBe(true);
    expect(isMarketingPublicPath("/brand")).toBe(true);
    expect(isMarketingPublicPath("/privacy")).toBe(true);
  });

  it("requires auth for app routes", () => {
    expect(isMarketingPublicPath("/dashboard")).toBe(false);
    expect(isMarketingPublicPath("/bookings")).toBe(false);
    expect(isMarketingPublicPath("/app/ai")).toBe(false);
    expect(isMarketingPublicPath("/ai")).toBe(true);
  });

  it("exposes trial and demo CTA destinations", () => {
    expect(MARKETING_CTA.trial).toBe("/login?intent=trial");
    expect(MARKETING_CTA.demo).toBe("/demo");
    expect(MARKETING_PUBLIC_PATHS).toContain("/demo");
    expect(MARKETING_PUBLIC_PATHS).toContain("/about");
    expect(MARKETING_PUBLIC_PATHS).not.toContain("/blog");
    expect(MARKETING_PUBLIC_PATHS).toContain("/docs");
    expect(MARKETING_PUBLIC_PATHS).toContain("/brand");
  });

  it("exposes exactly one canonical Product destination", () => {
    expect(MARKETING_PRODUCT_SECTION_ID).toBe("product");
    expect(MARKETING_PRODUCT_HREF).toBe("/#product");
    expect(MARKETING_PRODUCT_HREF).not.toMatch(/#.*#/);
  });
});