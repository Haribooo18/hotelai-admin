import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { MKT_TYPE_TOKENS } from "@/lib/marketing/design";

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

describe("marketing typography scale", () => {
  it("defines the full type token set on the marketing surface", () => {
    for (const token of MKT_TYPE_TOKENS) {
      expect(marketingCss).toContain(`${token}:`);
    }
  });

  it("wires semantic headline classes to the scale", () => {
    expect(marketingCss).toMatch(
      /\.mkt-display\s*\{[^}]*font-size:\s*var\(--mkt-type-display\)/s
    );

    expect(marketingCss).toMatch(
      /\.mkt-hero-headline\s*\{[^}]*font-size:\s*clamp\(2\.5rem,\s*5\.4vw,\s*4\.05rem\)/s
    );

    expect(marketingCss).toMatch(
      /\.mkt-page-hero-headline\s*\{[^}]*font-size:\s*var\(--mkt-type-h1\)/s
    );

    expect(marketingCss).toMatch(
      /\.mkt-section-headline\s*\{[^}]*font-size:\s*var\(--mkt-type-h2\)/s
    );

    expect(marketingCss).toMatch(
      /\.mkt-btn\s*\{[^}]*font-size:\s*var\(--mkt-type-small\)/s
    );

    expect(marketingCss).toMatch(
      /\.mkt-overline\s*\{[^}]*font-size:\s*var\(--mkt-type-overline\)/s
    );
  });

  it("keeps hero copy optically quieter than the architecture diagram", () => {
    expect(marketingCss).toMatch(
      /\.mkt-hero-headline\s*\{[^}]*line-height:\s*0\.97/s
    );

    expect(marketingCss).toMatch(
      /\.mkt-hero-headline-accent\s*\{[^}]*margin-top:\s*-0\.06em/s
    );

    expect(marketingCss).toMatch(
      /\.mkt-hero-subhead\s*\{[^}]*font-size:\s*var\(--mkt-type-body\)/s
    );
  });

  it("keeps prose measure in a readable character range", () => {
    expect(marketingCss).toMatch(/--mkt-prose-max:\s*60ch;/);
    expect(marketingCss).toMatch(/--mkt-body-max:\s*64ch;/);
  });

  it("keeps section headlines optically softer than page heroes", () => {
    expect(marketingCss).toMatch(
      /\.mkt-section-headline\s*\{[^}]*font-weight:\s*var\(--mkt-weight-semibold\)/s
    );

    expect(marketingCss).toMatch(
      /\.mkt-page-hero-headline\s*\{[^}]*font-weight:\s*var\(--mkt-weight-display\)/s
    );

    expect(marketingCss).toMatch(/--mkt-leading-h2:/);
    expect(marketingCss).toMatch(/--mkt-leading-h1:/);
  });

  it("avoids competing section-header overline size overrides", () => {
    const match = marketingCss.match(
      /\.mkt-section-header \.mkt-overline\s*\{([^}]+)\}/s
    );

    expect(match?.[1]).toBeTruthy();
    expect(match?.[1]).not.toMatch(/font-size:/);
  });
});