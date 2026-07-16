import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  MKT_ELEVATION_TOKENS,
  MKT_MOTION_TOKENS,
  MKT_OPACITY_TOKENS,
  MKT_RADIUS_TOKENS,
  MKT_Z_TOKENS,
} from "@/lib/marketing/design";

const globalsCss = readFileSync(
  join(process.cwd(), "app/globals.css"),
  "utf8"
);

const marketingStart = globalsCss.indexOf('[data-surface="marketing"] {');

if (marketingStart === -1) {
  throw new Error(
    'Marketing CSS root "[data-surface=\\"marketing\\"]" was not found.'
  );
}

const marketingCss = globalsCss.slice(marketingStart);

function marketingRulesCss(source: string): string {
  let depth = 0;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];

    if (character === "{") {
      depth += 1;
    }

    if (character === "}") {
      depth -= 1;

      if (depth === 0) {
        return source.slice(index + 1);
      }
    }
  }

  return source;
}

const rulesCss = marketingRulesCss(marketingCss);

describe("marketing design tokens", () => {
  it("defines radius, elevation, opacity, motion, and z-index token families", () => {
    const requiredTokens = [
      ...MKT_RADIUS_TOKENS,
      ...MKT_ELEVATION_TOKENS,
      ...MKT_OPACITY_TOKENS,
      ...MKT_MOTION_TOKENS,
      ...MKT_Z_TOKENS,
    ];

    for (const token of requiredTokens) {
      expect(marketingCss).toContain(`${token}:`);
    }
  });

  it("keeps the current motion and opacity token values in the marketing root", () => {
    expect(marketingCss).toMatch(/--mkt-duration-instant:\s*0ms;/);
    expect(marketingCss).toMatch(/--mkt-duration-micro:\s*110ms;/);
    expect(marketingCss).toMatch(/--mkt-duration-fast:\s*180ms;/);
    expect(marketingCss).toMatch(/--mkt-duration:\s*260ms;/);
    expect(marketingCss).toMatch(/--mkt-duration-slow:\s*360ms;/);
    expect(marketingCss).toMatch(/--mkt-duration-cycle:\s*12s;/);

    expect(marketingCss).toMatch(
      /--mkt-ease:\s*cubic-bezier\(0\.22,\s*0\.61,\s*0\.36,\s*1\);/
    );
    expect(marketingCss).toMatch(
      /--mkt-ease-out:\s*var\(--mkt-ease\);/
    );

    expect(marketingCss).toMatch(/--mkt-motion-reveal-y:\s*8px;/);
    expect(marketingCss).toMatch(/--mkt-motion-hover-y:\s*2px;/);
    expect(marketingCss).toMatch(/--mkt-motion-btn-hover-y:\s*1px;/);
    expect(marketingCss).toMatch(/--mkt-motion-stagger:\s*55ms;/);

    expect(marketingCss).toMatch(/--mkt-opacity-35:\s*0\.35;/);
    expect(marketingCss).toMatch(/--mkt-radius-full:\s*9999px;/);
  });

  it("uses shared tokens for key marketing motion and elevation rules", () => {
    expect(rulesCss).toMatch(
      /transition:[^;]*var\(--mkt-duration[^)]*\)[^;]*var\(--mkt-ease(?:-out)?\)/s
    );

    expect(rulesCss).toContain("box-shadow: var(--mkt-card-shadow);");
    expect(rulesCss).toContain("max-width: var(--mkt-prose-max);");
  });

  it("routes focus rings and elevation through shared tokens", () => {
    expect(rulesCss).toMatch(
      /box-shadow:\s*var\(--mkt-focus-ring\)/
    );

    expect(marketingCss).toMatch(
      /--mkt-elevation-raised:\s*var\(--mkt-shadow-sm\)/
    );

    expect(marketingCss).toMatch(
      /--mkt-card-shadow:\s*(?:\n\s*)?[^;]+;/
    );

    expect(rulesCss).toContain("box-shadow: var(--mkt-card-shadow);");
  });

  it("preserves spacing and typography token values", () => {
    expect(marketingCss).toMatch(/--mkt-space-1:\s*0\.5rem;/);
    expect(marketingCss).toMatch(/--mkt-space-8:\s*6rem;/);
    expect(marketingCss).toMatch(/--mkt-type-display:\s*clamp\(/);
    expect(marketingCss).toMatch(/--mkt-type-body:\s*1rem;/);
    expect(marketingCss).toMatch(/--mkt-prose-max:\s*60ch;/);
  });
});