import { describe, expect, it } from "vitest";

import {
  getProductPresentation,
  PRODUCT_CROP_PRESETS,
  PRODUCT_PRESENTATIONS,
} from "@/lib/marketing/product-presentation";

describe("product presentation", () => {
  it("defines crop presets for each workspace context", () => {
    expect(PRODUCT_CROP_PRESETS.dashboardOverview.objectPosition).toBe("4% 2%");
    expect(PRODUCT_CROP_PRESETS.receptionChannels.objectPosition).toBe("20% 4%");
    expect(PRODUCT_CROP_PRESETS.revenueDashboard.objectPosition).toBe("10% 6%");
    expect(PRODUCT_CROP_PRESETS.calendarTimeline.objectPosition).toBe("8% 10%");
  });

  it("maps page heroes to the correct workspaces and crops", () => {
    expect(getProductPresentation("featuresHero").crop).toEqual(
      PRODUCT_CROP_PRESETS.dashboardOverview
    );
    expect(getProductPresentation("aiHero").crop).toEqual(
      PRODUCT_CROP_PRESETS.receptionInbox
    );
    expect(getProductPresentation("pricingHero").crop).toEqual(
      PRODUCT_CROP_PRESETS.revenueDashboard
    );
    expect(getProductPresentation("securityHero").crop).toEqual(
      PRODUCT_CROP_PRESETS.dashboardAdmin
    );
    expect(getProductPresentation("aboutHero").crop).toEqual(
      PRODUCT_CROP_PRESETS.calendarTimeline
    );
    expect(getProductPresentation("docsHero").crop).toEqual(
      PRODUCT_CROP_PRESETS.knowledgeArticles
    );
  });

  it("uses hero size for page heroes and section size for split sections", () => {
    expect(getProductPresentation("demoHero").size).toBe("hero");
    expect(getProductPresentation("demoPreview").size).toBe("section");
    expect(getProductPresentation("integrationsArchitecture").emphasis).toBe(true);
  });

  it("defines presentations for all marketing contexts", () => {
    expect(Object.keys(PRODUCT_PRESENTATIONS).length).toBeGreaterThanOrEqual(16);
  });
});
