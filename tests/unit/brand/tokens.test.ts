import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  BRAND_ASSET_FILENAMES,
  BRAND_ASSETS,
  BRAND_PALETTE,
  BRAND_PALETTE_CSS,
  BRAND_SEMANTIC_CSS,
  BRAND_TOKEN_NAMES,
  brand,
} from "@/lib/brand";

const globalsCss = readFileSync(
  join(process.cwd(), "app/globals.css"),
  "utf8"
);

function normalizeHex(value: string): string {
  return value.toLowerCase();
}

describe("Monavel brand token foundation", () => {
  it("defines the official palette literals", () => {
    expect(BRAND_PALETTE).toEqual({
      black: "#0B0D10",
      charcoal: "#121418",
      green: "#0B1F1B",
      gold: "#C8A25A",
      white: "#F2F2F2",
      gray: "#686F76",
    });
  });

  it("mirrors palette and semantic aliases in globals.css", () => {
    for (const token of BRAND_TOKEN_NAMES) {
      expect(globalsCss).toContain(`${token}:`);
    }

    expect(globalsCss).toMatch(
      new RegExp(
        `${BRAND_PALETTE_CSS.black}:\\s*${normalizeHex(BRAND_PALETTE.black)};`,
        "i"
      )
    );
    expect(globalsCss).toMatch(
      new RegExp(
        `${BRAND_PALETTE_CSS.gold}:\\s*${normalizeHex(BRAND_PALETTE.gold)};`,
        "i"
      )
    );
    expect(globalsCss).toContain(
      `${BRAND_SEMANTIC_CSS.logo}: var(${BRAND_PALETTE_CSS.gold});`
    );
    expect(globalsCss).toContain(
      `${BRAND_SEMANTIC_CSS.premium}: var(${BRAND_PALETTE_CSS.gold});`
    );
    expect(globalsCss).toContain(
      `${BRAND_SEMANTIC_CSS.surface}: var(${BRAND_PALETTE_CSS.black});`
    );
    expect(globalsCss).toContain(
      `${BRAND_SEMANTIC_CSS.surfaceRaised}: var(${BRAND_PALETTE_CSS.charcoal});`
    );
    expect(globalsCss).toContain(
      `${BRAND_SEMANTIC_CSS.identityGreen}: var(${BRAND_PALETTE_CSS.green});`
    );
  });

  it("exposes semantic brand vars without inventing raw hex in the JS layer", () => {
    expect(brand.logo).toBe("var(--brand-logo)");
    expect(brand.premium).toBe("var(--brand-premium)");
    expect(brand.surface).toBe("var(--brand-surface)");
    expect(brand.identityGreen).toBe("var(--brand-identity-green)");
  });

  it("does not remap product shell accents onto brand gold", () => {
    // Brand gold may appear in the brand block only — shell accent stays product green.
    expect(globalsCss).not.toMatch(
      /--shell-accent:\s*var\(--brand-gold\)/
    );
    expect(globalsCss).not.toMatch(
      /--shell-accent:\s*var\(--brand-logo\)/
    );
    expect(globalsCss).not.toMatch(
      /--mkt-accent:\s*var\(--brand-gold\)/
    );
  });

  it("declares a single brand asset structure for official SVGs", () => {
    expect(BRAND_ASSETS.mark).toBe("/brand/monavel-mark.svg");
    expect(BRAND_ASSETS.horizontal).toBe("/brand/monavel-horizontal.svg");
    expect(BRAND_ASSETS.lockup).toBe("/brand/monavel-lockup.svg");
    expect(BRAND_ASSETS.wordmark).toBe("/brand/monavel-wordmark.svg");
    expect([...BRAND_ASSET_FILENAMES]).toEqual([
      "monavel-mark.svg",
      "monavel-horizontal.svg",
      "monavel-lockup.svg",
      "monavel-wordmark.svg",
    ]);

    const brandDir = join(process.cwd(), "public/brand");
    expect(existsSync(brandDir)).toBe(true);
  });
});
