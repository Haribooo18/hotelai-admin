import { describe, expect, it } from "vitest";

import {
  PRICING_DEPLOYMENT_STRIP,
  PRICING_PREVIEW_CONTENT,
  PRICING_PREVIEW_FAQ,
  PRICING_PREVIEW_PLANS,
} from "@/lib/marketing/pricing-preview";

describe("pricing preview content", () => {
  it("defines three deployment models", () => {
    expect(PRICING_PREVIEW_PLANS).toHaveLength(3);
    expect(PRICING_PREVIEW_PLANS.map((plan) => plan.name)).toEqual([
      "Independent Hotel",
      "Growing Hotel",
      "Hotel Groups",
    ]);
    expect(PRICING_PREVIEW_PLANS.map((plan) => plan.id)).toEqual([
      "starter",
      "pro",
      "enterprise",
    ]);
  });

  it("describes how Monavel enters the business without feature comparison", () => {
    expect(PRICING_PREVIEW_PLANS[0]?.audience).toBe("For one property.");
    expect([...PRICING_PREVIEW_PLANS[0]!.points]).toEqual([
      "One Runtime.",
      "Go live in days.",
    ]);
    expect(PRICING_PREVIEW_PLANS[1]?.audience).toBe(
      "One hotel with deeper insight and support."
    );
    expect([...PRICING_PREVIEW_PLANS[1]!.points]).toEqual([
      "Deeper insight.",
      "Priority support.",
      "Same Runtime as you scale.",
    ]);
    expect(PRICING_PREVIEW_PLANS[2]?.audience).toBe("Enterprise deployment.");
    expect([...PRICING_PREVIEW_PLANS[2]!.points]).toEqual([
      "Centralized Runtime.",
      "Dedicated rollout.",
      "Priority support.",
    ]);

    const joined = PRICING_PREVIEW_PLANS.flatMap((plan) => plan.points).join(" ");
    expect(joined.toLowerCase()).not.toContain("everything in");
    expect(joined.toLowerCase()).not.toContain("ai replies");
  });

  it("uses adoption CTAs per deployment model", () => {
    const independent = PRICING_PREVIEW_PLANS.find((plan) => plan.id === "starter");
    const growing = PRICING_PREVIEW_PLANS.find((plan) => plan.id === "pro");
    const groups = PRICING_PREVIEW_PLANS.find((plan) => plan.id === "enterprise");

    expect(growing?.featured).toBe(true);
    expect(independent?.ctaLabel).toBe("Start free trial");
    expect(growing?.ctaLabel).toBe("Book a demo");
    expect(growing?.ctaHref).toBe("/demo");
    expect(groups?.ctaLabel).toBe("Contact sales");
    expect(groups?.ctaHref).toBe("/contact");
  });

  it("states that the Runtime never changes above the cards", () => {
    expect([...PRICING_PREVIEW_CONTENT.keyMessageLines]).toEqual([
      "The Runtime never changes.",
      "Only your operational scale does.",
    ]);
  });

  it("defines deployment guarantees", () => {
    expect(PRICING_PREVIEW_CONTENT.deploymentLabel).toBe("Deployment");
    expect([...PRICING_DEPLOYMENT_STRIP]).toEqual([
      "Launch in days",
      "Works with your PMS",
      "Migration included",
      "Guided onboarding",
      "No rip-and-replace",
    ]);
  });

  it("includes up to four faq preview items", () => {
    expect(PRICING_PREVIEW_FAQ.length).toBeLessThanOrEqual(4);
    expect(PRICING_PREVIEW_FAQ.length).toBeGreaterThan(0);
  });

  it("frames the section as adoption, not SaaS pricing", () => {
    expect(PRICING_PREVIEW_CONTENT.faqLinkHref).toBe("/pricing");
    expect(PRICING_PREVIEW_CONTENT.headline).toBe("Start with one hotel.");
    expect(PRICING_PREVIEW_CONTENT.headlineAccent).toBe(
      "Grow without changing platforms."
    );
    expect(PRICING_PREVIEW_CONTENT.subhead).toContain("same Monavel Runtime");
    expect(PRICING_PREVIEW_CONTENT.headline.toLowerCase()).not.toContain("pricing");
    expect(PRICING_PREVIEW_CONTENT.headlineAccent.toLowerCase()).not.toContain(
      "pricing"
    );
  });
});
