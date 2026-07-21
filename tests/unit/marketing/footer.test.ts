import { describe, expect, it } from "vitest";

import {
  FOOTER_BOTTOM,
  FOOTER_BRAND,
  FOOTER_COLUMNS,
} from "@/lib/marketing/footer";
import { MARKETING_PRODUCT_HREF } from "@/lib/marketing/routes";

describe("footer content", () => {
  it("defines brand identity without marketing tagline", () => {
    expect(FOOTER_BRAND.name).toBe("Monavel");
  });

  it("defines four enterprise navigation columns", () => {
    expect(FOOTER_COLUMNS).toHaveLength(4);
    expect(FOOTER_COLUMNS.map((column) => column.title)).toEqual([
      "Platform",
      "Resources",
      "Company",
      "Legal",
    ]);
  });

  it("includes platform, resources, company, and legal links", () => {
    const platform = FOOTER_COLUMNS.find((column) => column.id === "platform");
    const resources = FOOTER_COLUMNS.find((column) => column.id === "resources");
    const company = FOOTER_COLUMNS.find((column) => column.id === "company");
    const legal = FOOTER_COLUMNS.find((column) => column.id === "legal");
    if (!resources || !company) {
      throw new Error("Expected footer columns are missing");
    }
    expect(platform?.links.map((link) => link.label)).toEqual([
      "AI Reception",
      "Operations",
      "Integrations",
      "Security",
    ]);
    expect(
      platform?.links.find((link) => link.label === "Operations")?.href
    ).toBe(MARKETING_PRODUCT_HREF);
    expect(resources.links.map((link) => link.label)).toEqual([
      "Documentation",
    ]);
    expect(company.links.map((link) => link.label)).toEqual([
      "About",
      "Contact",
    ]);
    expect(legal?.links.map((link) => link.label)).toEqual(["Privacy", "Terms"]);
  });

  it("defines a quiet final signature", () => {
    expect(FOOTER_BOTTOM.signature).toBe(
      "© Monavel — AI Operating System for Hotels"
    );
  });
});
