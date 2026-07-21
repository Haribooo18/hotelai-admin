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
      "Building the operating system for modern hotels."
    );
    expect(ABOUT_PAGE_HERO.primaryCtaHref).toBe(MARKETING_CTA.trial);
    expect(ABOUT_PAGE_HERO.secondaryCtaHref).toBe(MARKETING_CTA.demo);
  });

  it("explains why Monavel exists without fabricated company history", () => {
    expect(ABOUT_PAGE_MISSION.headline).toContain("ten systems");
    expect(ABOUT_PAGE_MISSION.paragraphs).toHaveLength(2);

    const narrative = [
      ...ABOUT_PAGE_MISSION.paragraphs,
      ABOUT_PAGE_MISSION.conclusion,
      ABOUT_PAGE_VISION.subhead,
    ].join(" ");

    expect(narrative.toLowerCase()).not.toMatch(
      /founded in|our team|investor|funding|customers|offices/
    );
  });

  it("defines the three connected-product pillars", () => {
    expect(ABOUT_PAGE_VISION.pillars).toHaveLength(3);
    expect(ABOUT_PAGE_VISION.pillars.map((pillar) => pillar.title)).toEqual([
      "One workspace",
      "One AI",
      "One source of truth",
    ]);
  });

  it("defines four core principles", () => {
    expect(ABOUT_PAGE_PRINCIPLES.items).toHaveLength(4);
    expect(ABOUT_PAGE_PRINCIPLES.items.map((item) => item.title)).toEqual([
      "AI-native, not AI-added",
      "Simple by default",
      "Built around real work",
      "Improve continuously",
    ]);
  });

  it("defines the connected platform inputs and outcomes", () => {
    expect(ABOUT_PAGE_PHILOSOPHY.inputs).toHaveLength(4);
    expect(ABOUT_PAGE_PHILOSOPHY.outputs).toHaveLength(3);
    expect(ABOUT_PAGE_PHILOSOPHY.statement.toLowerCase()).toContain(
      "same hotel context"
    );
  });

  it("defines a directional roadmap without dates", () => {
    expect(ABOUT_PAGE_ROADMAP.steps.map((step) => step.title)).toEqual([
      "Connected operations",
      "AI-first PMS",
      "Operational automation",
      "Hotel intelligence",
    ]);

    const roadmapCopy = [
      ABOUT_PAGE_ROADMAP.subhead,
      ...ABOUT_PAGE_ROADMAP.steps.map((step) => step.description),
    ].join(" ");

    expect(roadmapCopy).not.toMatch(/\b20\d{2}\b|Q[1-4]/);
    expect(roadmapCopy.toLowerCase()).toContain("direction");
  });
});
