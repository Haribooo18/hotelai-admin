import { describe, expect, it } from "vitest";

import {
  FINAL_CTA_CONTENT,
  FINAL_CTA_TRUST_ITEMS,
} from "@/lib/marketing/final-cta";
import { MARKETING_CTA } from "@/lib/marketing/routes";

describe("final cta content", () => {
  it("defines headline and conversion ctas", () => {
    expect(FINAL_CTA_CONTENT.headline).toBe("Ready to modernize your hotel?");
    expect(FINAL_CTA_CONTENT.primaryCtaLabel).toBe("Start free trial");
    expect(FINAL_CTA_CONTENT.primaryCtaHref).toBe(MARKETING_CTA.trial);
    expect(FINAL_CTA_CONTENT.secondaryCtaLabel).toBe("Book a demo");
    expect(FINAL_CTA_CONTENT.secondaryCtaHref).toBe(MARKETING_CTA.demo);
  });

  it("mentions unified platform in subhead", () => {
    expect(FINAL_CTA_CONTENT.subhead).toContain("PMS");
    expect(FINAL_CTA_CONTENT.subhead).toContain("AI reception");
    expect(FINAL_CTA_CONTENT.subhead).toContain("guest communication");
  });

  it("uses neutral product trust facts only", () => {
    expect(FINAL_CTA_TRUST_ITEMS).toEqual([
      "No self-hosting",
      "AI Reception",
      "Telegram & Website Chat",
      "Secure cloud platform",
    ]);

    const joined = FINAL_CTA_TRUST_ITEMS.join(" ");
    expect(joined).not.toMatch(/\d+\+?\s*(hotels|customers)/i);
  });
});
