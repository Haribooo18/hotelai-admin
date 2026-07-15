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
const marketingCss = globalsCss.slice(marketingStart);

function marketingRulesCss(source: string): string {
  let depth = 0;
  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === "{") depth += 1;
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(i + 1);
    }
  }
  return source;
}

const rulesCss = marketingRulesCss(marketingCss);

describe("marketing design tokens", () => {
  it("defines radius, elevation, opacity, motion, and z-index token families", () => {
    for (const token of [
      ...MKT_RADIUS_TOKENS,
      ...MKT_ELEVATION_TOKENS,
      ...MKT_OPACITY_TOKENS,
      ...MKT_MOTION_TOKENS,
      ...MKT_Z_TOKENS,
    ]) {
      expect(marketingCss).toContain(`${token}:`);
    }
  });

  it("keeps motion and opacity token values as literals in the root", () => {
    expect(marketingCss).toMatch(/--mkt-duration-instant:\s*0ms;/);
    expect(marketingCss).toMatch(/--mkt-duration-micro:\s*100ms;/);
    expect(marketingCss).toMatch(/--mkt-duration-fast:\s*150ms;/);
    expect(marketingCss).toMatch(/--mkt-duration:\s*200ms;/);
    expect(marketingCss).toMatch(/--mkt-duration-slow:\s*250ms;/);
    expect(marketingCss).toMatch(/--mkt-duration-cycle:\s*12s;/);
    expect(marketingCss).toMatch(
      /--mkt-ease:\s*cubic-bezier\(0\.16,\s*1,\s*0\.3,\s*1\);/
    );
    expect(marketingCss).toMatch(/--mkt-ease-out:\s*var\(--mkt-ease\);/);
    expect(marketingCss).toMatch(/--mkt-motion-reveal-y:\s*6px;/);
    expect(marketingCss).toMatch(/--mkt-motion-hover-y:\s*2px;/);
    expect(marketingCss).toMatch(/--mkt-opacity-35:\s*0\.35;/);
    expect(marketingCss).toMatch(/--mkt-radius-full:\s*9999px;/);
  });

  it("does not leave hardcoded radius / z-index / opacity in marketing rules", () => {
    expect(rulesCss).not.toMatch(/border-radius:\s*9999px;/);
    expect(rulesCss).not.toMatch(/border-radius:\s*999px;/);
    expect(rulesCss).not.toMatch(/border-radius:\s*0\.5rem;/);
    expect(rulesCss).not.toMatch(/z-index:\s*\d+;/);
    expect(rulesCss).not.toMatch(/opacity:\s*0\.35;/);
    expect(rulesCss).not.toMatch(/opacity:\s*0\.55;/);
    expect(rulesCss).not.toMatch(/opacity:\s*0\.92;/);
  });

  it("routes focus rings and elevation through shared tokens", () => {
    expect(rulesCss).toMatch(/box-shadow:\s*var\(--mkt-focus-ring\)/);
    expect(marketingCss).toMatch(
      /--mkt-elevation-raised:\s*var\(--mkt-shadow-sm\)/
    );
    expect(marketingCss).toMatch(
      /--mkt-card-shadow:\s*var\(--mkt-elevation-flat\)/
    );
  });

  it("preserves spacing and typography token values", () => {
    expect(marketingCss).toMatch(/--mkt-space-1:\s*0\.5rem;/);
    expect(marketingCss).toMatch(/--mkt-space-8:\s*6rem;/);
    expect(marketingCss).toMatch(/--mkt-type-display:\s*clamp\(/);
    expect(marketingCss).toMatch(/--mkt-type-body:\s*1rem;/);
  });
});
