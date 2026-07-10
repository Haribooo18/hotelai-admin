import { describe, expect, it } from "vitest";

import {
  PRICING_PREVIEW_CONTENT,
  PRICING_PREVIEW_FAQ,
  PRICING_PREVIEW_PLANS,
} from "@/lib/marketing/pricing-preview";

describe("pricing preview content", () => {
  it("defines three pricing plans", () => {
    expect(PRICING_PREVIEW_PLANS).toHaveLength(3);
    expect(PRICING_PREVIEW_PLANS.map((plan) => plan.name)).toEqual([
      "Starter",
      "Pro",
      "Enterprise",
    ]);
  });

  it("marks pro as featured with trial cta", () => {
    const pro = PRICING_PREVIEW_PLANS.find((plan) => plan.id === "pro");
    const enterprise = PRICING_PREVIEW_PLANS.find(
      (plan) => plan.id === "enterprise"
    );

    expect(pro?.featured).toBe(true);
    expect(pro?.ctaLabel).toBe("Start free trial");
    expect(enterprise?.ctaLabel).toBe("Contact sales");
    expect(enterprise?.ctaHref).toBe("/contact");
  });

  it("includes up to four faq preview items", () => {
    expect(PRICING_PREVIEW_FAQ.length).toBeLessThanOrEqual(4);
    expect(PRICING_PREVIEW_FAQ.length).toBeGreaterThan(0);
  });

  it("links to full pricing page", () => {
    expect(PRICING_PREVIEW_CONTENT.faqLinkHref).toBe("/pricing");
    expect(PRICING_PREVIEW_CONTENT.headlineAccent).toContain("grow");
  });
});
