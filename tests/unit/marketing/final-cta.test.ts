import { describe, expect, it } from "vitest";

import {
  FINAL_CTA_VARIANTS,
  getFinalCtaContent,
} from "@/lib/marketing/final-cta";
import { MARKETING_CTA } from "@/lib/marketing/routes";

describe("final cta content", () => {
  it("defines default headline and conversion ctas", () => {
    const content = getFinalCtaContent("default");
    expect(content.headline).toBe("Ready to modernize your hotel?");
    expect(content.primaryCtaLabel).toBe("Start free trial");
    expect(content.primaryCtaHref).toBe(MARKETING_CTA.trial);
    expect(content.secondaryCtaLabel).toBe("Book a demo");
    expect(content.secondaryCtaHref).toBe(MARKETING_CTA.demo);
  });

  it("defines page-specific variants", () => {
    expect(getFinalCtaContent("pricing").primaryCtaLabel).toBe("Start free trial");
    expect(getFinalCtaContent("demo").primaryCtaLabel).toBe("Book your demo");
    expect(getFinalCtaContent("contact").primaryCtaLabel).toBe("Contact sales");
    expect(getFinalCtaContent("security").primaryCtaLabel).toBe("Talk to our team");
    expect(getFinalCtaContent("docs").primaryCtaLabel).toBe("Start building");
  });

  it("uses neutral product trust facts only", () => {
    for (const variant of Object.values(FINAL_CTA_VARIANTS)) {
      const joined = variant.trustItems.join(" ");
      expect(joined).not.toMatch(/\d+\+?\s*(hotels|customers)/i);
    }
  });
});
