import { describe, expect, it } from "vitest";

import {
  DOCS_ARTICLES,
  DOCS_GETTING_STARTED,
  DOCS_LANDING,
  DOCS_SIDEBAR_NAV,
  DOCS_TELEGRAM,
} from "@/lib/marketing/docs";

describe("docs content", () => {
  it("defines sidebar navigation", () => {
    expect(DOCS_SIDEBAR_NAV).toHaveLength(4);
    const channels = DOCS_SIDEBAR_NAV.find(
      (entry) => entry.type === "group" && entry.label === "Channels"
    );
    expect(channels?.type).toBe("group");
    if (channels?.type === "group") {
      expect(channels.items.map((item) => item.label)).toEqual([
        "Telegram",
        "Website Chat",
      ]);
    }
  });

  it("defines landing cards for all guides", () => {
    expect(DOCS_LANDING.cards).toHaveLength(5);
    expect(DOCS_LANDING.cards.map((card) => card.title)).toEqual([
      "Getting Started",
      "Telegram",
      "Website Chat",
      "Knowledge Base",
      "Billing",
    ]);
  });

  it("defines getting started sections", () => {
    expect(DOCS_GETTING_STARTED.sections.map((section) => section.title)).toEqual(
      [
        "Create account",
        "Create hotel",
        "Configure workspace",
        "Connect first channel",
        "Start receiving conversations",
      ]
    );
  });

  it("defines telegram setup sections", () => {
    expect(DOCS_TELEGRAM.sections.map((section) => section.title)).toEqual([
      "Create bot",
      "Connect token",
      "Enable channel",
      "Test message",
    ]);
  });

  it("keeps article section counts within mvp bounds", () => {
    for (const article of Object.values(DOCS_ARTICLES)) {
      expect(article.sections.length).toBeGreaterThanOrEqual(3);
      expect(article.sections.length).toBeLessThanOrEqual(6);
      expect(article.nextSteps.length).toBeGreaterThan(0);
    }
  });

  it("does not include api documentation or code examples", () => {
    const allCopy = Object.values(DOCS_ARTICLES)
      .flatMap((article) => [
        article.description,
        ...article.sections.map((section) => section.body),
      ])
      .join(" ");

    expect(allCopy.toLowerCase()).not.toMatch(
      /api endpoint|curl |fetch\(|```|post \/api|get \/api/
    );
  });
});
