import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { MKT_MOTION_TOKENS } from "@/lib/marketing/design";
import { MKT_MOTION, MKT_MOTION_CSS, MKT_MOTION_EASE } from "@/lib/marketing/motion";

const globalsCss = readFileSync(
  join(process.cwd(), "app/globals.css"),
  "utf8"
);

const marketingStart = globalsCss.indexOf('[data-surface="marketing"] {');
const marketingCss = globalsCss.slice(marketingStart);

describe("marketing motion language", () => {
  it("exports one Instant/Fast/Normal/Slow/Cycle scale", () => {
    expect(MKT_MOTION.instant).toBe(0);
    expect(MKT_MOTION.micro).toBe(100);
    expect(MKT_MOTION.fast).toBe(150);
    expect(MKT_MOTION.normal).toBe(200);
    expect(MKT_MOTION.slow).toBe(250);
    expect(MKT_MOTION.cycle).toBe(12_000);
    expect(MKT_MOTION.revealY).toBe(6);
    expect(MKT_MOTION.hoverY).toBe(2);
    expect(MKT_MOTION.btnHoverY).toBe(1);
  });

  it("uses a single premium ease-out curve", () => {
    expect(MKT_MOTION_EASE).toBe("cubic-bezier(0.16, 1, 0.3, 1)");
    expect(marketingCss).toContain(`--mkt-ease: ${MKT_MOTION_EASE};`);
    expect(marketingCss).toContain("--mkt-ease-out: var(--mkt-ease);");
  });

  it("keeps CSS motion tokens aligned with the canonical map", () => {
    for (const token of MKT_MOTION_TOKENS) {
      expect(marketingCss).toContain(`${token}:`);
    }

    expect(MKT_MOTION_CSS.normal).toBe("--mkt-duration");
    expect(MKT_MOTION_CSS.ease).toBe("--mkt-ease");
  });

  it("keeps page reveals small — opacity + short translate, no blur/scale", () => {
    const revealBlock = marketingCss.match(
      /@keyframes mkt-reveal \{[\s\S]*?\n\}/
    )?.[0];
    expect(revealBlock).toBeTruthy();
    expect(revealBlock).toContain(
      "transform: translateY(var(--mkt-motion-reveal-y));"
    );
    expect(revealBlock).not.toContain("filter:");
    expect(revealBlock).not.toContain("scale(");
  });

  it("uses the shared card hover lift of 2px", () => {
    expect(marketingCss).toContain(
      "transform: translateY(calc(var(--mkt-motion-hover-y) * -1));"
    );
  });

  it("does not pulse runtime or live status indicators", () => {
    expect(marketingCss).not.toMatch(
      /\.mkt-runtime-status-dot \{[\s\S]*?animation:\s*mkt-runtime-breathe/
    );
    expect(marketingCss).not.toMatch(
      /animation:\s*mkt-ai-live-pulse/
    );
  });
});
