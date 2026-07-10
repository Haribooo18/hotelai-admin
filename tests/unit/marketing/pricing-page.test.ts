import { describe, expect, it } from "vitest";

import {
  PRICING_PAGE_COMPARISON,
  PRICING_PAGE_FAQ,
  PRICING_PAGE_HERO,
  PRICING_PAGE_PLANS,
} from "@/lib/marketing/pricing-page";
import { MARKETING_CTA } from "@/lib/marketing/routes";

describe("pricing page content", () => {
  it("defines hero copy and ctas", () => {
    expect(PRICING_PAGE_HERO.headline).toBe("Simple pricing for every hotel.");
    expect(PRICING_PAGE_HERO.primaryCtaHref).toBe(MARKETING_CTA.trial);
    expect(PRICING_PAGE_HERO.secondaryCtaHref).toBe(MARKETING_CTA.demo);
  });

  it("defines three plans with placeholder prices", () => {
    expect(PRICING_PAGE_PLANS).toHaveLength(3);
    expect(PRICING_PAGE_PLANS.find((p) => p.id === "pro")?.featured).toBe(true);
    expect(PRICING_PAGE_PLANS.find((p) => p.id === "enterprise")?.ctaLabel).toBe(
      "Contact sales"
    );
  });

  it("avoids invented limits in plan features", () => {
    const joined = PRICING_PAGE_PLANS.flatMap((plan) => plan.features).join(" ");
    expect(joined).not.toMatch(/up to \d+/i);
    expect(joined).not.toMatch(/unlimited/i);
  });

  it("defines comparison rows with real capabilities", () => {
    expect(PRICING_PAGE_COMPARISON.rows.length).toBeGreaterThanOrEqual(10);
    expect(PRICING_PAGE_COMPARISON.rows.map((row) => row.label)).toContain(
      "AI Reception"
    );
    expect(PRICING_PAGE_COMPARISON.rows.map((row) => row.label)).toContain(
      "Telegram"
    );
  });

  it("uses included, available, and contact sales statuses", () => {
    const statuses = new Set(
      PRICING_PAGE_COMPARISON.rows.flatMap((row) => [
        row.starter,
        row.pro,
        row.enterprise,
      ])
    );
    expect(statuses).toContain("included");
    expect(statuses).toContain("available");
    expect(statuses).toContain("contact-sales");
  });

  it("includes eight faq items and contact link", () => {
    expect(PRICING_PAGE_FAQ.items).toHaveLength(8);
    expect(PRICING_PAGE_FAQ.contactLinkHref).toBe("/contact");
    expect(PRICING_PAGE_FAQ.items.map((item) => item.question)).toContain(
      "Can I migrate from another PMS?"
    );
  });
});
