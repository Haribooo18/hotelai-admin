import { describe, expect, it } from "vitest";

import {
  FINAL_CTA_VARIANTS,
  getFinalCtaContent,
} from "@/lib/marketing/final-cta";
import { MARKETING_CTA } from "@/lib/marketing/routes";

describe("final cta content", () => {
  it("defines default why-now conversion copy", () => {
    const content = getFinalCtaContent("default");
    expect(content.overline).toBe("Why now");
    expect(content.statement).toEqual([
      "Other software solves individual problems.",
      "Monavel connects your entire hotel into one intelligent operating system.",
    ]);
    expect(content.headline).toBe("Hotels already have the tools");
    expect(content.headlineAccent).toBe("They need one operating system");
    expect(content.body?.join(" ")).toMatch(/never work together/i);
    expect(content.primaryCtaLabel).toBe("Start free trial");
    expect(content.primaryCtaHref).toBe(MARKETING_CTA.trial);
    expect(content.secondaryCtaLabel).toBe("Book a demo");
    expect(content.secondaryCtaHref).toBe(MARKETING_CTA.demo);
    expect(content.trustItems).toContain("Secure cloud platform");
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
