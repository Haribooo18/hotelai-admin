import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { MARKETING_HOMEPAGE_SECTIONS } from "@/lib/marketing/homepage";

const homepagePath = join(process.cwd(), "app/(marketing)/page.tsx");
const homepageSource = readFileSync(homepagePath, "utf8");

describe("marketing homepage composition", () => {
  it("defines exactly one ordered section registry", () => {
    expect(MARKETING_HOMEPAGE_SECTIONS).toHaveLength(12);
    expect(MARKETING_HOMEPAGE_SECTIONS[0]).toBe("HeroSection");
    expect(MARKETING_HOMEPAGE_SECTIONS.at(-1)).toBe("FinalCtaSection");
    expect(MARKETING_HOMEPAGE_SECTIONS).toContain("HomepageFaqSection");
    expect(MARKETING_HOMEPAGE_SECTIONS).not.toContain("PlatformOverviewSection");
    expect(MARKETING_HOMEPAGE_SECTIONS).not.toContain("WhyNowSection");
    expect(MARKETING_HOMEPAGE_SECTIONS).not.toContain("WhatIsMonavelSection");
  });

  it("renders a single static homepage without conditional variants", () => {
    expect(homepageSource).toContain('export const dynamic = "force-static"');
    expect(homepageSource).toContain("data-homepage-sections");
    expect(homepageSource).toContain("MARKETING_HOMEPAGE_SECTIONS");
    expect(homepageSource).not.toMatch(/\bif\s*\(/);
    expect(homepageSource).not.toContain("HeroProductStage");
    expect(homepageSource).not.toContain("PlatformOverviewSection");
    expect(homepageSource).not.toContain("EcosystemIllustration");
    expect(homepageSource).not.toContain("WhyNowSection");
    expect(homepageSource).not.toContain("WhatIsMonavelSection");
  });

  it("includes every registered section in the page source", () => {
    for (const section of MARKETING_HOMEPAGE_SECTIONS) {
      expect(homepageSource).toContain(`<${section}`);
    }
  });
});
