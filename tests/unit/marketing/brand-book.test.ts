import { describe, expect, it } from "vitest";

import {
  BRAND_BOOK,
  BRAND_BOOK_CHECKLIST,
  BRAND_BOOK_COLORS,
  BRAND_BOOK_NAV,
  BRAND_BOOK_PRODUCT_LANGUAGE,
} from "@/lib/marketing/brand-book";
import { BRAND_PALETTE } from "@/lib/brand";
import { MKT_STATUS } from "@/lib/marketing/product-language";
import { isMarketingPublicPath, MARKETING_SITEMAP_PATHS } from "@/lib/marketing/routes";

describe("Monavel Brand Book", () => {
  it("defines an internal Brand Guidelines v1 document", () => {
    expect(BRAND_BOOK.path).toBe("/brand");
    expect(BRAND_BOOK.title).toBe("Brand Book");
    expect(BRAND_BOOK.subtitle).toBe("Monavel Brand Guidelines v1");
    expect(BRAND_BOOK_NAV).toHaveLength(18);
  });

  it("uses the official brand palette", () => {
    expect(BRAND_BOOK_COLORS.map((color) => color.hex)).toEqual([
      BRAND_PALETTE.black,
      BRAND_PALETTE.charcoal,
      BRAND_PALETTE.green,
      BRAND_PALETTE.gold,
      BRAND_PALETTE.white,
      BRAND_PALETTE.gray,
    ]);
  });

  it("keeps product language canonical", () => {
    expect(BRAND_BOOK_PRODUCT_LANGUAGE.statuses).toEqual(
      Object.values(MKT_STATUS)
    );
  });

  it("ships a complete release checklist", () => {
    expect(BRAND_BOOK_CHECKLIST).toContain("Correct logo");
    expect(BRAND_BOOK_CHECKLIST).toContain("Operational feeling");
    expect(BRAND_BOOK_CHECKLIST).toHaveLength(10);
  });

  it("is publicly reachable but not sitemap-indexed", () => {
    expect(isMarketingPublicPath("/brand")).toBe(true);
    expect(MARKETING_SITEMAP_PATHS).not.toContain("/brand");
  });
});
