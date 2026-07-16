import { describe, expect, it } from "vitest";

import { FOOTER_COLUMNS } from "@/lib/marketing/footer";
import { PLATFORM_PILLARS } from "@/lib/marketing/pillars";
import { PLATFORM_SHOWCASE_CONTENT } from "@/lib/marketing/platform";
import {
  MARKETING_PRODUCT_HREF,
  MARKETING_PRODUCT_SECTION_ID,
} from "@/lib/marketing/routes";
import { MARKETING_NAV } from "@/lib/marketing/site";

function findProductEntry<T extends { href: string; label: string }>(
  entries: readonly T[]
): T | undefined {
  return entries.find((entry) => entry.label === "Product");
}

function findRuntimeEntry<T extends { href: string; label: string }>(
  entries: readonly T[]
): T | undefined {
  return entries.find((entry) => entry.label === "Runtime");
}

describe("product navigation destinations", () => {
  it("desktop header nav points at the canonical Product href", () => {
    const entry = findProductEntry(MARKETING_NAV);
    expect(entry?.href).toBe(MARKETING_PRODUCT_HREF);
    expect(entry?.href).toBe("/#product");
  });

  it("footer Runtime link uses the same canonical Product destination as the header", () => {
    const platformColumn = FOOTER_COLUMNS.find(
      (column) => column.id === "platform"
    );
    const entry = findRuntimeEntry(platformColumn?.links ?? []);

    expect(entry?.href).toBe(MARKETING_PRODUCT_HREF);
    expect(entry?.href).toBe(findProductEntry(MARKETING_NAV)?.href);
  });

  it("platform pillars CTA reuses the same canonical Product destination", () => {
    const operations = PLATFORM_PILLARS.find((pillar) => pillar.id === "operations");
    expect(operations?.href).toBe(MARKETING_PRODUCT_HREF);
  });

  it("Product Showcase section id matches the canonical Product section id", () => {
    expect(PLATFORM_SHOWCASE_CONTENT.sectionId).toBe(MARKETING_PRODUCT_SECTION_ID);
  });

  it("never has a duplicated hash across any Product destination", () => {
    const hrefs = [
      findProductEntry(MARKETING_NAV)?.href,
      findRuntimeEntry(
        FOOTER_COLUMNS.find((column) => column.id === "platform")?.links ?? []
      )?.href,
      PLATFORM_PILLARS.find((pillar) => pillar.id === "operations")?.href,
    ];

    for (const href of hrefs) {
      expect(href).toBeDefined();
      expect(href).not.toMatch(/#.*#/);
      expect(href).not.toContain("#product#product");
    }
  });
});
