import { describe, expect, it } from "vitest";

import {
  AI_PAGE_CONVERSATIONS,
  AI_PAGE_CTA,
  AI_PAGE_HERO,
  AI_PAGE_NIGHT,
  AI_PAGE_STATUS,
} from "@/lib/marketing/ai-page";
import { FINAL_CTA_VARIANTS } from "@/lib/marketing/final-cta";
import { HERO_CONTENT } from "@/lib/marketing/hero";
import {
  MKT_CTA,
  MKT_KPI,
  MKT_STATUS,
  MKT_STATUS_VOCABULARY,
} from "@/lib/marketing/product-language";
import { PRICING_PREVIEW_PLANS } from "@/lib/marketing/pricing-preview";

describe("marketing product language", () => {
  it("exposes one CTA vocabulary", () => {
    expect(MKT_CTA.startFreeTrial).toBe("Start free trial");
    expect(MKT_CTA.bookDemo).toBe("Book a demo");
    expect(MKT_CTA.contactSales).toBe("Contact sales");
    expect(MKT_CTA.exploreDocs).toBe("Explore docs");
    expect(MKT_CTA.viewPricing).toBe("View pricing");
  });

  it("keeps hero and closing CTAs on the canonical labels", () => {
    expect(HERO_CONTENT.primaryCta).toBe(MKT_CTA.startFreeTrial);
    expect(HERO_CONTENT.secondaryCta).toBe(MKT_CTA.bookDemo);
    expect(AI_PAGE_CTA.primaryCtaLabel).toBe(MKT_CTA.startFreeTrial);

    for (const variant of Object.values(FINAL_CTA_VARIANTS)) {
      expect([
        MKT_CTA.startFreeTrial,
        MKT_CTA.bookDemo,
        MKT_CTA.contactSales,
        MKT_CTA.exploreDocs,
      ]).toContain(variant.primaryCtaLabel);
      expect([
        MKT_CTA.startFreeTrial,
        MKT_CTA.bookDemo,
        MKT_CTA.contactSales,
        MKT_CTA.exploreDocs,
      ]).toContain(variant.secondaryCtaLabel);
    }

    for (const plan of PRICING_PREVIEW_PLANS) {
      expect([
        MKT_CTA.startFreeTrial,
        MKT_CTA.bookDemo,
        MKT_CTA.contactSales,
      ]).toContain(plan.ctaLabel);
    }
  });

  it("uses one status vocabulary for AI operational states", () => {
    expect(MKT_STATUS_VOCABULARY).toEqual(
      new Set([
        MKT_STATUS.online,
        MKT_STATUS.synced,
        MKT_STATUS.connected,
        MKT_STATUS.approved,
        MKT_STATUS.confirmed,
        MKT_STATUS.booked,
        MKT_STATUS.delivered,
        MKT_STATUS.scheduled,
      ])
    );

    const detailStates = [
      ...AI_PAGE_HERO.liveEvents.map((event) => event.detail),
      ...AI_PAGE_NIGHT.events.map((event) => event.result),
      ...AI_PAGE_CONVERSATIONS.items.map((item) => item.detail),
      ...AI_PAGE_STATUS.systems.map((system) => system.state),
    ].filter(
      (value) =>
        !value.startsWith("+") &&
        !value.startsWith("$") &&
        value !== "8 sec" &&
        value !== "24/7" &&
        value !== "99.8%" &&
        value !== "63" &&
        value !== "0"
    );

    for (const state of detailStates) {
      expect(MKT_STATUS_VOCABULARY.has(state)).toBe(true);
    }
  });

  it("uses short KPI names", () => {
    expect(MKT_KPI.responseTime).toBe("Response Time");
    expect(MKT_KPI.revenue).toBe("Revenue");
    expect(
      AI_PAGE_STATUS.metrics.map((metric) => metric.label)
    ).toEqual(["AI Reception", "Response Time", "Uptime", "Revenue"]);
    expect(
      AI_PAGE_NIGHT.summary.stats.map((stat) => stat.label)
    ).toEqual(["Guests", "Response Time", "Revenue", "Uptime", "Missed"]);
  });

  it("keeps AI replies short and calm", () => {
    for (const conversation of AI_PAGE_HERO.conversations) {
      expect(conversation.reply.endsWith(".")).toBe(true);
      expect(conversation.reply.split(" ").length).toBeLessThanOrEqual(4);
      expect(conversation.reply).not.toMatch(/amazing|successfully|perfect/i);
    }
  });
});
