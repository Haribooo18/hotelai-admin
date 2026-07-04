import { describe, expect, it } from "vitest";

import { getMarketingPlans } from "@/lib/marketing/pricing";
import { BILLING_PLAN_IDS } from "@/lib/billing/plans";

describe("getMarketingPlans", () => {
  it("returns all billing plans without duplicating definitions", () => {
    const plans = getMarketingPlans();

    expect(plans).toHaveLength(BILLING_PLAN_IDS.length);
    expect(plans.map((plan) => plan.id)).toEqual([...BILLING_PLAN_IDS]);
  });

  it("highlights the Pro plan", () => {
    const plans = getMarketingPlans();
    const highlighted = plans.filter((plan) => plan.highlighted);

    expect(highlighted).toHaveLength(1);
    expect(highlighted[0]?.id).toBe("pro");
  });

  it("includes marketing price labels and features", () => {
    const plans = getMarketingPlans();

    for (const plan of plans) {
      expect(plan.name.length).toBeGreaterThan(0);
      expect(plan.priceLabel.length).toBeGreaterThan(0);
      expect(plan.features.length).toBeGreaterThan(0);
    }
  });
});
