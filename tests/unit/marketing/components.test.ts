import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { MKT_COMPONENT_TOKENS } from "@/lib/marketing/design";

const globalsCss = readFileSync(
  join(process.cwd(), "app/globals.css"),
  "utf8"
);

const marketingCss = globalsCss.slice(
  globalsCss.indexOf('[data-surface="marketing"] {')
);

describe("marketing component language", () => {
  it("defines shared component surface tokens", () => {
    for (const token of MKT_COMPONENT_TOKENS) {
      expect(marketingCss).toContain(`${token}:`);
    }
  });

  it("keeps card family on one radius / border / hover recipe", () => {
    for (const card of [
      "mkt-pillar-card",
      "mkt-pricing-card",
      "mkt-trust-card",
      "mkt-features-overview-card",
      "mkt-docs-nav-card",
      "mkt-who-for-card",
      "mkt-why-hotels-card",
      "mkt-what-is-card",
    ]) {
      expect(marketingCss).toMatch(
        new RegExp(
          `\\.${card}[^{]*\\{[^}]*border-radius:\\s*var\\(--mkt-card-radius\\)`,
          "s"
        )
      );
      expect(marketingCss).toMatch(
        new RegExp(
          `\\.${card}[^{]*\\{[^}]*border:\\s*var\\(--mkt-card-border\\)`,
          "s"
        )
      );
    }
  });

  it("uses one button height language for default and small sizes", () => {
    expect(marketingCss).toMatch(
      /\.mkt-btn\s*\{[^}]*height:\s*var\(--mkt-btn-height\)/s
    );
    expect(marketingCss).toMatch(
      /\.mkt-btn-primary\s*\{[^}]*height:\s*var\(--mkt-btn-height\)/s
    );
    expect(marketingCss).toMatch(
      /\.mkt-btn-secondary\s*\{[^}]*height:\s*var\(--mkt-btn-height\)/s
    );
    expect(marketingCss).toMatch(
      /\.mkt-btn-hero\s*\{[^}]*height:\s*var\(--mkt-btn-height\)/s
    );
    expect(marketingCss).toMatch(
      /\.mkt-btn-sm\s*\{[^}]*height:\s*var\(--mkt-btn-height-sm\)/s
    );
    expect(marketingCss).toMatch(
      /\.mkt-btn-ghost\s*\{[^}]*height:\s*var\(--mkt-btn-height-sm\)/s
    );
  });

  it("shares badge and status indicator recipes", () => {
    expect(marketingCss).toMatch(
      /\.mkt-features-integration-badge\s*\{[^}]*border-radius:\s*var\(--mkt-badge-radius\)/s
    );
    expect(marketingCss).toMatch(
      /\.mkt-integration-badge-available\s*\{[^}]*min-height:\s*var\(--mkt-badge-height\)/s
    );
    expect(marketingCss).toMatch(
      /\.mkt-runtime-status-dot\s*\{[^}]*width:\s*var\(--mkt-status-dot-size\)/s
    );
    expect(marketingCss).toMatch(
      /\.mkt-ai-status-dot\s*\{[^}]*width:\s*var\(--mkt-status-dot-size\)/s
    );
  });

  it("aligns FAQ shells and chat bubbles to shared component tokens", () => {
    expect(marketingCss).toMatch(
      /\.mkt-homepage-faq-item\s*\{[^}]*border-radius:\s*var\(--mkt-accordion-radius\)/s
    );
    expect(marketingCss).toMatch(
      /\.mkt-ai-hero-chat-bubble\s*\{[^}]*border:\s*var\(--mkt-chat-bubble-border\)/s
    );
    expect(marketingCss).toMatch(
      /\.mkt-ai-story-bubble\s*\{[^}]*border:\s*var\(--mkt-chat-bubble-border\)/s
    );
  });

  it("does not redefine spacing or type scale token values", () => {
    expect(marketingCss).toMatch(/--mkt-space-1:\s*0\.5rem;/);
    expect(marketingCss).toMatch(/--mkt-space-8:\s*6rem;/);
    expect(marketingCss).toMatch(/--mkt-type-display:\s*clamp\(/);
    expect(marketingCss).toMatch(/--mkt-type-body:\s*1rem;/);
  });
});
