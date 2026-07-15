import { describe, expect, it } from "vitest";

import {
  DOCS_ARTICLES,
  DOCS_GETTING_STARTED,
  DOCS_LANDING,
  DOCS_SIDEBAR_NAV,
  DOCS_TELEGRAM,
  getDocsSearchEntries,
} from "@/lib/marketing/docs";

describe("docs content", () => {
  it("defines sidebar navigation", () => {
    expect(DOCS_SIDEBAR_NAV).toHaveLength(5);
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
    const design = DOCS_SIDEBAR_NAV.find(
      (entry) => entry.type === "group" && entry.label === "Design"
    );
    expect(design?.type).toBe("group");
    if (design?.type === "group") {
      expect(design.items).toEqual([{ href: "/brand", label: "Brand Book" }]);
    }
  });

  it("defines docs portal sections for fast navigation", () => {
    expect(DOCS_LANDING.title).toBe("Documentation");
    expect(DOCS_LANDING.description).toBe(
      "Everything you need to deploy, configure and operate Monavel."
    );
    expect(DOCS_LANDING.searchPlaceholder).toBe("Search documentation...");

    expect(DOCS_LANDING.gettingStarted.cards).toHaveLength(4);
    expect(DOCS_LANDING.gettingStarted.cards.map((card) => card.title)).toEqual([
      "Install Monavel",
      "Create Workspace",
      "Connect Channels",
      "Invite Team",
    ]);

    expect(DOCS_LANDING.platform.cards).toHaveLength(8);
    expect(DOCS_LANDING.platform.cards.map((card) => card.title)).toEqual([
      "Runtime",
      "Reception AI",
      "Knowledge Base",
      "Guests",
      "Reservations",
      "Operations",
      "Analytics",
      "Automation",
    ]);

    expect(DOCS_LANDING.integrations.cards).toHaveLength(7);
    expect(DOCS_LANDING.integrations.cards.map((card) => card.title)).toEqual([
      "Telegram",
      "WhatsApp",
      "Website Chat",
      "Email",
      "PMS",
      "Stripe",
      "Google Calendar",
    ]);

    expect(DOCS_LANDING.administration.cards).toHaveLength(6);
    expect(DOCS_LANDING.administration.cards.map((card) => card.title)).toEqual([
      "Workspace",
      "Users",
      "Roles & Permissions",
      "Billing",
      "Security",
      "Audit Logs",
    ]);

    expect(DOCS_LANDING.developer.cards).toHaveLength(4);
    expect(DOCS_LANDING.developer.cards.map((card) => card.title)).toEqual([
      "API",
      "Authentication",
      "Webhooks",
      "SDK",
    ]);

    expect(DOCS_LANDING.popularArticles.items.map((item) => item.label)).toEqual([
      "Connect Telegram",
      "Train Reception AI",
      "Import Knowledge Base",
      "Configure Website Chat",
      "Invite Hotel Staff",
    ]);

    expect(DOCS_LANDING.support.links.map((link) => link.label)).toEqual([
      "Community",
      "Support",
      "System Status",
    ]);
  });

  it("builds a searchable docs index from portal cards", () => {
    const entries = getDocsSearchEntries();
    expect(entries.length).toBeGreaterThan(20);
    expect(entries.some((entry) => entry.title === "Install Monavel")).toBe(true);
    expect(entries.some((entry) => entry.title === "Telegram")).toBe(true);
    expect(entries.some((entry) => entry.group === "Administration")).toBe(true);
    expect(entries.some((entry) => entry.group === "Developer")).toBe(true);
    expect(
      entries.filter((entry) => entry.title === "API" && entry.group === "Integrations")
    ).toHaveLength(0);
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
