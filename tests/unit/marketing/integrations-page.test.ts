import { describe, expect, it } from "vitest";

import {
  INTEGRATIONS_PAGE_AVAILABLE,
  INTEGRATIONS_PAGE_FUTURE,
  INTEGRATIONS_PAGE_GUEST_COMMUNICATION,
  INTEGRATIONS_PAGE_HERO,
} from "@/lib/marketing/integrations-page";
import { MARKETING_CTA } from "@/lib/marketing/routes";

describe("integrations page content", () => {
  it("defines hero copy and ctas", () => {
    expect(INTEGRATIONS_PAGE_HERO.headline).toBe(
      "Connect every guest conversation."
    );
    expect(INTEGRATIONS_PAGE_HERO.primaryCtaHref).toBe(MARKETING_CTA.trial);
    expect(INTEGRATIONS_PAGE_HERO.secondaryCtaHref).toBe(MARKETING_CTA.demo);
  });

  it("marks available integrations correctly", () => {
    expect(INTEGRATIONS_PAGE_AVAILABLE.items).toHaveLength(3);
    expect(
      INTEGRATIONS_PAGE_AVAILABLE.items.every((item) => item.status === "available")
    ).toBe(true);
    expect(INTEGRATIONS_PAGE_AVAILABLE.items.map((item) => item.title)).toEqual([
      "Website Chat",
      "Telegram",
      "Knowledge Base",
    ]);
  });

  it("marks all future integrations as planned", () => {
    expect(INTEGRATIONS_PAGE_FUTURE.items.length).toBeGreaterThan(0);
    expect(
      INTEGRATIONS_PAGE_FUTURE.items.every((item) => item.status === "planned")
    ).toBe(true);
    expect(INTEGRATIONS_PAGE_FUTURE.items.map((item) => item.title)).toContain(
      "WhatsApp"
    );
    expect(INTEGRATIONS_PAGE_FUTURE.items.map((item) => item.title)).toContain(
      "PMS integrations"
    );
  });

  it("does not imply planned integrations are live", () => {
    const futureCopy = INTEGRATIONS_PAGE_FUTURE.items
      .map((item) => item.description)
      .join(" ");
    expect(futureCopy.toLowerCase()).toMatch(/planned|not available/);
  });

  it("defines guest communication workflow", () => {
    expect(
      INTEGRATIONS_PAGE_GUEST_COMMUNICATION.steps.map((step) => step.label)
    ).toEqual([
      "Guest",
      "Website Chat / Telegram",
      "Monavel AI",
      "Workspace",
      "Hotel Team",
    ]);
  });
});
