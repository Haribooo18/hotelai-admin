import { describe, expect, it } from "vitest";

import {
  ABOUT_PAGE_HERO,
  ABOUT_PAGE_MISSION,
  ABOUT_PAGE_PHILOSOPHY,
  ABOUT_PAGE_PRINCIPLES,
  ABOUT_PAGE_ROADMAP,
  ABOUT_PAGE_VISION,
} from "@/lib/marketing/about-page";
import { MARKETING_CTA } from "@/lib/marketing/routes";

describe("about page content", () => {
  it("defines hero copy and ctas", () => {
    expect(ABOUT_PAGE_HERO.headline).toBe(
      "Building the future operating system for hotels."
    );
    expect(ABOUT_PAGE_HERO.primaryCtaHref).toBe(MARKETING_CTA.trial);
    expect(ABOUT_PAGE_HERO.secondaryCtaHref).toBe(MARKETING_CTA.demo);
  });

  it("defines mission and vision without fabricated history", () => {
    expect(ABOUT_PAGE_MISSION.headline).toBe("Less complexity for hotel teams.");
    expect(ABOUT_PAGE_VISION.headline).toContain("One intelligent workspace");
    expect(ABOUT_PAGE_VISION.body.toLowerCase()).toContain("one workspace");
    const narrative = [ABOUT_PAGE_MISSION.body, ABOUT_PAGE_VISION.body].join(" ");
    expect(narrative.toLowerCase()).not.toMatch(
      /founded in|our team|investor|funding|customers|offices/
    );
  });

  it("defines four core principles", () => {
    expect(ABOUT_PAGE_PRINCIPLES.items).toHaveLength(4);
    expect(ABOUT_PAGE_PRINCIPLES.items.map((item) => item.title)).toEqual([
      "AI-first",
      "Simple by default",
      "Built for operators",
      "Continuous improvement",
    ]);
  });

  it("defines product philosophy pillars", () => {
    expect(ABOUT_PAGE_PHILOSOPHY.items).toHaveLength(3);
    expect(ABOUT_PAGE_PHILOSOPHY.items.map((item) => item.title)).toEqual([
      "One workspace",
      "One AI",
      "One source of truth",
    ]);
  });

  it("defines roadmap without dates", () => {
    expect(ABOUT_PAGE_ROADMAP.steps.map((step) => step.label)).toEqual([
      "Today",
      "AI-first PMS",
      "Automation",
      "Hotel intelligence",
      "Future platform",
    ]);
    const roadmapCopy = [
      ABOUT_PAGE_ROADMAP.subhead,
      ...ABOUT_PAGE_ROADMAP.steps.map((step) => step.description),
    ].join(" ");
    expect(roadmapCopy).not.toMatch(/\b20\d{2}\b|Q[1-4]/);
    expect(roadmapCopy.toLowerCase()).toMatch(/direction|no dates|no guarantees/);
  });
});
