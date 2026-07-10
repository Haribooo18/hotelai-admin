import { describe, expect, it } from "vitest";

import {
  SECURITY_PAGE_ARCHITECTURE,
  SECURITY_PAGE_FAQ,
  SECURITY_PAGE_HERO,
  SECURITY_PAGE_INFRASTRUCTURE,
  SECURITY_PAGE_PRINCIPLES,
} from "@/lib/marketing/security-page";
import { MARKETING_CTA } from "@/lib/marketing/routes";

describe("security page content", () => {
  it("defines hero copy and ctas", () => {
    expect(SECURITY_PAGE_HERO.headline).toBe(
      "Security built into every workspace."
    );
    expect(SECURITY_PAGE_HERO.primaryCtaHref).toBe("/contact");
    expect(SECURITY_PAGE_HERO.secondaryCtaHref).toBe(MARKETING_CTA.trial);
  });

  it("defines four security principles", () => {
    expect(SECURITY_PAGE_PRINCIPLES.items).toHaveLength(4);
    expect(SECURITY_PAGE_PRINCIPLES.items.map((item) => item.title)).toEqual([
      "Tenant isolation",
      "Secure authentication",
      "Role-based access",
      "Data protection",
    ]);
  });

  it("defines platform architecture flow", () => {
    expect(SECURITY_PAGE_ARCHITECTURE.steps.map((step) => step.label)).toEqual([
      "Hotel",
      "Monavel Platform",
      "Workspace",
      "Database",
      "Secure infrastructure",
    ]);
  });

  it("describes infrastructure without fake certifications", () => {
    const joined = JSON.stringify(SECURITY_PAGE_INFRASTRUCTURE.items);
    expect(joined).not.toMatch(/\bISO\s*27001\b|\bSOC\s*2\b|GDPR compliant|HIPAA certified/i);
    expect(SECURITY_PAGE_INFRASTRUCTURE.items.map((item) => item.title)).toContain(
      "Encrypted connections"
    );
  });

  it("includes up to six faq items without compliance claims", () => {
    expect(SECURITY_PAGE_FAQ.items.length).toBeLessThanOrEqual(6);
    const joined = SECURITY_PAGE_FAQ.items.map((item) => item.answer).join(" ");
    expect(joined).not.toMatch(/\bISO\s*27001\b|\bSOC\s*2\b|GDPR compliant|HIPAA certified/i);
    expect(SECURITY_PAGE_FAQ.items.map((item) => item.question)).toContain(
      "Where is data stored?"
    );
  });
});
