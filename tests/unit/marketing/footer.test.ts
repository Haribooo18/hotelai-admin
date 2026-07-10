import { describe, expect, it } from "vitest";

import {
  FOOTER_BOTTOM,
  FOOTER_BRAND,
  FOOTER_COLUMNS,
} from "@/lib/marketing/footer";

describe("footer content", () => {
  it("defines brand column copy", () => {
    expect(FOOTER_BRAND.name).toBe("Monavel");
    expect(FOOTER_BRAND.tagline).toBe(
      "The AI Operating System for Modern Hotels."
    );
  });

  it("defines three navigation columns", () => {
    expect(FOOTER_COLUMNS).toHaveLength(3);
    expect(FOOTER_COLUMNS.map((column) => column.title)).toEqual([
      "Product",
      "Resources",
      "Company",
    ]);
  });

  it("includes product and company links", () => {
    const product = FOOTER_COLUMNS.find((column) => column.id === "product");
    const company = FOOTER_COLUMNS.find((column) => column.id === "company");

    expect(product?.links.map((link) => link.label)).toEqual([
      "Features",
      "AI",
      "Pricing",
      "Integrations",
      "Security",
    ]);
    expect(company?.links.map((link) => link.label)).toContain("Login");
    expect(company?.links.map((link) => link.label)).toContain("Privacy");
  });

  it("defines bottom bar copy and legal links", () => {
    expect(FOOTER_BOTTOM.copyright).toBe("© Monavel");
    expect(FOOTER_BOTTOM.tagline).toBe("Built for modern hotels.");
    expect(FOOTER_BOTTOM.legalLinks.map((link) => link.label)).toEqual([
      "Privacy",
      "Terms",
    ]);
  });
});
