import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { MKT_MOTION_TOKENS } from "@/lib/marketing/design";
import {
  MKT_MOTION,
  MKT_MOTION_CSS,
  MKT_MOTION_EASE,
} from "@/lib/marketing/motion";

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

describe("marketing motion language", () => {
  it("exports the current Instant/Micro/Fast/Normal/Slow/Cycle scale", () => {
    expect(MKT_MOTION.instant).toBe(0);
    expect(MKT_MOTION.micro).toBe(110);
    expect(MKT_MOTION.fast).toBe(180);
    expect(MKT_MOTION.normal).toBe(260);
    expect(MKT_MOTION.slow).toBe(360);
    expect(MKT_MOTION.cycle).toBe(12_000);
    expect(MKT_MOTION.kpiCount).toBe(600);
    expect(MKT_MOTION.stagger).toBe(55);
    expect(MKT_MOTION.revealY).toBe(8);
    expect(MKT_MOTION.hoverY).toBe(2);
    expect(MKT_MOTION.btnHoverY).toBe(1);
  });

  it("uses the canonical premium ease-out curve", () => {
    expect(MKT_MOTION_EASE).toBe(
      "cubic-bezier(0.22, 0.61, 0.36, 1)"
    );

    expect(marketingCss).toContain(
      `--mkt-ease: ${MKT_MOTION_EASE};`
    );

    expect(marketingCss).toContain(
      "--mkt-ease-out: var(--mkt-ease);"
    );
  });

  it("keeps CSS motion tokens aligned with the canonical map", () => {
    for (const token of MKT_MOTION_TOKENS) {
      expect(marketingCss).toContain(`${token}:`);
    }

    expect(MKT_MOTION_CSS.instant).toBe("--mkt-duration-instant");
    expect(MKT_MOTION_CSS.micro).toBe("--mkt-duration-micro");
    expect(MKT_MOTION_CSS.fast).toBe("--mkt-duration-fast");
    expect(MKT_MOTION_CSS.normal).toBe("--mkt-duration");
    expect(MKT_MOTION_CSS.slow).toBe("--mkt-duration-slow");
    expect(MKT_MOTION_CSS.cycle).toBe("--mkt-duration-cycle");
    expect(MKT_MOTION_CSS.ease).toBe("--mkt-ease");
    expect(MKT_MOTION_CSS.easeOut).toBe("--mkt-ease-out");
    expect(MKT_MOTION_CSS.revealY).toBe("--mkt-motion-reveal-y");
    expect(MKT_MOTION_CSS.hoverY).toBe("--mkt-motion-hover-y");
    expect(MKT_MOTION_CSS.btnHoverY).toBe(
      "--mkt-motion-btn-hover-y"
    );
    expect(MKT_MOTION_CSS.stagger).toBe("--mkt-motion-stagger");
  });

  it("matches the canonical TypeScript values with CSS values", () => {
    expect(marketingCss).toContain(
      `--mkt-duration-micro: ${MKT_MOTION.micro}ms;`
    );
    expect(marketingCss).toContain(
      `--mkt-duration-fast: ${MKT_MOTION.fast}ms;`
    );
    expect(marketingCss).toContain(
      `--mkt-duration: ${MKT_MOTION.normal}ms;`
    );
    expect(marketingCss).toContain(
      `--mkt-duration-slow: ${MKT_MOTION.slow}ms;`
    );
    expect(marketingCss).toContain(
      `--mkt-motion-stagger: ${MKT_MOTION.stagger}ms;`
    );
    expect(marketingCss).toContain(
      `--mkt-motion-reveal-y: ${MKT_MOTION.revealY}px;`
    );
    expect(marketingCss).toContain(
      `--mkt-motion-hover-y: ${MKT_MOTION.hoverY}px;`
    );
    expect(marketingCss).toContain(
      `--mkt-motion-btn-hover-y: ${MKT_MOTION.btnHoverY}px;`
    );
  });

  it("keeps page reveals small and restrained", () => {
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

  it("uses the shared card hover lift token", () => {
    expect(marketingCss).toContain(
      "transform: translateY(calc(var(--mkt-motion-hover-y) * -1));"
    );
  });

  it("keeps runtime and live status indicators free from legacy pulse animations", () => {
    expect(marketingCss).not.toMatch(
      /\.mkt-runtime-status-dot\s*\{[\s\S]*?animation:\s*mkt-runtime-breathe/
    );

    expect(marketingCss).not.toMatch(
      /animation:\s*mkt-ai-live-pulse/
    );
  });
});