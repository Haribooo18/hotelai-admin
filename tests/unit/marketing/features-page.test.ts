import { describe, expect, it } from "vitest";

import {
  FEATURES_AI_INTEGRATIONS,
  FEATURES_BENEFITS,
  FEATURES_OPERATIONS_WORKFLOW,
  FEATURES_PAGE_HERO,
  FEATURES_PLATFORM_OVERVIEW,
  FEATURES_WORKSPACE_GRID,
} from "@/lib/marketing/features-page";
import { MARKETING_CTA } from "@/lib/marketing/routes";

describe("features page content", () => {
  it("defines hero copy and ctas", () => {
    expect(FEATURES_PAGE_HERO.headline).toBe("Everything your hotel needs.");
    expect(FEATURES_PAGE_HERO.headlineAccent).toBe("One connected platform.");
    expect(FEATURES_PAGE_HERO.primaryCtaHref).toBe(MARKETING_CTA.trial);
    expect(FEATURES_PAGE_HERO.secondaryCtaHref).toBe(MARKETING_CTA.demo);
  });

  it("covers five platform areas", () => {
    expect(FEATURES_PLATFORM_OVERVIEW.areas).toHaveLength(5);
    expect(FEATURES_PLATFORM_OVERVIEW.areas.map((area) => area.title)).toEqual([
      "PMS",
      "AI Reception",
      "Guest Channels",
      "Revenue",
      "Knowledge",
    ]);
  });

  it("lists all eight workspaces", () => {
    expect(FEATURES_WORKSPACE_GRID.workspaces).toHaveLength(8);
    expect(FEATURES_WORKSPACE_GRID.workspaces.map((ws) => ws.title)).toContain(
      "Reception AI"
    );
  });

  it("includes ai integrations without fake availability", () => {
    expect(FEATURES_AI_INTEGRATIONS.integrations).toHaveLength(4);
    const future = FEATURES_AI_INTEGRATIONS.integrations.find(
      (item) => item.id === "future"
    );
    expect(future?.status).toBe("planned");
  });

  it("defines operations workflow loop", () => {
    expect(FEATURES_OPERATIONS_WORKFLOW.steps.map((step) => step.label)).toEqual([
      "Guest",
      "AI",
      "Workspace",
      "Team",
      "Guest",
    ]);
  });

  it("defines four benefit cards", () => {
    expect(FEATURES_BENEFITS.items).toHaveLength(4);
    expect(FEATURES_BENEFITS.items.map((item) => item.title)).toEqual([
      "Less manual work",
      "Faster responses",
      "Higher occupancy",
      "One platform",
    ]);
  });
});
