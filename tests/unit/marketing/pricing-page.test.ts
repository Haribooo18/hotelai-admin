import { describe, expect, it } from "vitest";

import {
  PRICING_PAGE_COMPARISON,
  PRICING_PAGE_FAQ,
  PRICING_PAGE_HERO,
  PRICING_PAGE_PLANS,
  PRICING_PAGE_PLANS_SECTION,
} from "@/lib/marketing/pricing-page";

describe("pricing page content", () => {
  it("defines a short pricing hero without ctas", () => {
    expect(PRICING_PAGE_HERO.headline).toBe("Pricing");
    expect(PRICING_PAGE_HERO.lead).toBe("One Runtime. Three plans.");
    expect(PRICING_PAGE_HERO).not.toHaveProperty("body");
    expect(PRICING_PAGE_HERO).not.toHaveProperty("primaryCtaLabel");
    expect(PRICING_PAGE_HERO).not.toHaveProperty("secondaryCtaLabel");
  });

  it("defines three plans with Pro featured and no section headline", () => {
    expect(PRICING_PAGE_PLANS_SECTION.ariaLabel).toBe("Plans");
    expect(PRICING_PAGE_PLANS).toHaveLength(3);
    expect(PRICING_PAGE_PLANS.map((plan) => plan.name)).toEqual([
      "Starter",
      "Pro",
      "Enterprise",
    ]);
    expect(PRICING_PAGE_PLANS.find((p) => p.id === "pro")?.featured).toBe(true);
    expect(PRICING_PAGE_PLANS.find((p) => p.id === "pro")?.badge).toBe(
      "Most popular"
    );
    expect(PRICING_PAGE_PLANS.find((p) => p.id === "starter")?.priceLabel).toBe(
      "€49"
    );
    expect(PRICING_PAGE_PLANS.find((p) => p.id === "enterprise")?.ctaLabel).toBe(
      "Contact sales"
    );
  });

  it("groups comparison into Platform AI Operations Support", () => {
    expect(PRICING_PAGE_COMPARISON.groups.map((g) => g.label)).toEqual([
      "Platform",
      "AI",
      "Operations",
      "Support",
    ]);
    const rowCount = PRICING_PAGE_COMPARISON.groups.reduce(
      (sum, group) => sum + group.rows.length,
      0
    );
    expect(rowCount).toBeLessThanOrEqual(12);
    expect(rowCount).toBeGreaterThanOrEqual(6);
  });

  it("includes five short faq items", () => {
    expect(PRICING_PAGE_FAQ.headline).toBe("Pricing FAQ");
    expect(PRICING_PAGE_FAQ.items).toHaveLength(5);
    expect(PRICING_PAGE_FAQ.items.map((item) => item.question)).toContain(
      "Is there a free trial?"
    );
    expect(PRICING_PAGE_FAQ.items.map((item) => item.question)).toContain(
      "Will this replace our PMS?"
    );
  });
});
