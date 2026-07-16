import { describe, expect, it } from "vitest";

import {
  FINAL_CTA_VARIANTS,
  getFinalCtaContent,
} from "@/lib/marketing/final-cta";
import { MARKETING_CTA } from "@/lib/marketing/routes";

describe("final cta content", () => {
  it("defines a quiet homepage closing invitation", () => {
    const content = getFinalCtaContent("default");
    expect(content.headline).toBe("Your hotel already has software.");
    expect(content.headlineAccent).toBe("Now give it one Runtime.");
    expect(content.body).toEqual([
      "Launch in days.",
      "Works with your existing PMS.",
      "Guided onboarding from day one.",
    ]);
    expect(content.primaryCtaLabel).toBe("Start free trial");
    expect(content.primaryCtaHref).toBe(MARKETING_CTA.trial);
    expect(content.secondaryCtaLabel).toBe("Book a demo");
    expect(content.secondaryCtaHref).toBe(MARKETING_CTA.demo);
    expect(content.trustItems).toBeUndefined();
    expect(content.overline).toBeUndefined();
    expect(content.statement).toBeUndefined();
  });

  it("defines page-specific variants", () => {
    expect(getFinalCtaContent("demo").primaryCtaLabel).toBe("Book a demo");
    expect(getFinalCtaContent("contact").primaryCtaLabel).toBe("Contact sales");
    expect(getFinalCtaContent("security").primaryCtaLabel).toBe("Contact sales");
    expect(getFinalCtaContent("docs").primaryCtaLabel).toBe("Start free trial");
  });

  it("defines a quiet AI page closing invitation", () => {
    const content = getFinalCtaContent("ai");
    expect(content.headline).toBe(
      "Your next guest should never have to wait."
    );
    expect(content.primaryCtaLabel).toBe("Start free trial");
    expect(content.secondaryCtaLabel).toBe("Book a demo");
  });

  it("uses neutral product trust facts only when present", () => {
    for (const variant of Object.values(FINAL_CTA_VARIANTS)) {
      const joined = (variant.trustItems ?? []).join(" ");
      expect(joined).not.toMatch(/\d+\+?\s*(hotels|customers)/i);
    }
  });
});
