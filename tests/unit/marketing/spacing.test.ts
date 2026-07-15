import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  MKT_SPACE_SEMANTIC_TOKENS,
  MKT_SPACE_TOKENS,
} from "@/lib/marketing/design";

const globalsCss = readFileSync(
  join(process.cwd(), "app/globals.css"),
  "utf8"
);

const marketingCss = globalsCss.slice(
  globalsCss.indexOf('[data-surface="marketing"] {')
);

describe("marketing spacing scale", () => {
  it("defines the 8-step spacing scale", () => {
    for (const token of MKT_SPACE_TOKENS) {
      expect(marketingCss).toContain(`${token}:`);
    }
    expect(marketingCss).toMatch(/--mkt-space-1:\s*0\.5rem;/);
    expect(marketingCss).toMatch(/--mkt-space-2:\s*0\.75rem;/);
    expect(marketingCss).toMatch(/--mkt-space-3:\s*1rem;/);
    expect(marketingCss).toMatch(/--mkt-space-4:\s*1\.5rem;/);
    expect(marketingCss).toMatch(/--mkt-space-5:\s*2rem;/);
    expect(marketingCss).toMatch(/--mkt-space-6:\s*3rem;/);
    expect(marketingCss).toMatch(/--mkt-space-7:\s*4rem;/);
    expect(marketingCss).toMatch(/--mkt-space-8:\s*6rem;/);
  });

  it("defines semantic section and stack aliases", () => {
    for (const token of MKT_SPACE_SEMANTIC_TOKENS) {
      expect(marketingCss).toContain(`${token}:`);
    }
  });

  it("keeps AI page body sections on one vertical rhythm", () => {
    for (const section of [
      "mkt-ai-night",
      "mkt-ai-story",
      "mkt-ai-talks",
      "mkt-ai-status",
    ]) {
      expect(marketingCss).toMatch(
        new RegExp(
          `\\.${section}\\s*\\{[^}]*padding-top:\\s*var\\(--mkt-section-y\\);[^}]*padding-bottom:\\s*var\\(--mkt-section-y\\);`,
          "s"
        )
      );
    }
  });

  it("gives closing CTAs a calm landing into the footer", () => {
    expect(marketingCss).toMatch(
      /\.mkt-ai-close\s*\{[^}]*padding-bottom:\s*var\(--mkt-section-y-close\)/s
    );
    expect(marketingCss).toMatch(
      /\.mkt-final-cta-section--closing\s*\{[^}]*padding-bottom:\s*var\(--mkt-section-y-close\)/s
    );
  });

  it("uses card padding tokens instead of the old 1.25rem default", () => {
    expect(marketingCss).toMatch(
      /--mkt-card-padding:\s*var\(--mkt-space-4\);/
    );
  });

  it("keeps homepage and product section pads on the shared scale", () => {
    for (const section of [
      "mkt-platform-section",
      "mkt-pillars-section",
      "mkt-trust-section",
      "mkt-why-need-section",
      "mkt-homepage-faq-section",
      "mkt-how-works-section",
    ]) {
      expect(marketingCss).toMatch(
        new RegExp(
          `\\.${section}\\s*\\{[^}]*padding-top:\\s*var\\(--mkt-section-y-tight\\);[^}]*padding-bottom:\\s*var\\(--mkt-section-y-tight\\);`,
          "s"
        )
      );
    }
  });

  it("aligns docs portal vertical rhythm to section tokens", () => {
    expect(marketingCss).toMatch(
      /\.mkt-docs-portal\s*\{[^}]*padding-bottom:\s*var\(--mkt-section-y-close\)/s
    );
    expect(marketingCss).toMatch(
      /\.mkt-docs-portal-hero\s*\{[^}]*padding-top:\s*var\(--mkt-section-y-tight\)/s
    );
    expect(marketingCss).toMatch(
      /\.mkt-docs-portal-section\s*\{[^}]*padding-top:\s*var\(--mkt-section-y\)/s
    );
  });

  it("uses stack tokens for shared section header → body spacing", () => {
    expect(marketingCss).toMatch(
      /\.mkt-section-subhead\s*\{[^}]*margin-top:\s*var\(--mkt-stack-sm\)/s
    );
    expect(marketingCss).toMatch(
      /\.mkt-section-body\s*\{[^}]*margin-top:\s*var\(--mkt-section-header-gap\)/s
    );
  });
});
