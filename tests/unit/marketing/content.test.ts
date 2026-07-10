import { describe, expect, it, vi } from "vitest";

import {
  AI_CHANNELS,
  FAQ_ITEMS,
  FEATURE_SECTIONS,
  LANDING_FEATURES,
} from "@/lib/marketing/content";
import { getSiteUrl, MARKETING_NAV, SITE_NAME } from "@/lib/marketing/site";

describe("marketing site config", () => {
  it("exposes site name and navigation", () => {
    expect(SITE_NAME).toBe("Monavel");
    expect(MARKETING_NAV.length).toBe(5);
  });

  it("resolves site url from env", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://hotelai.example");
    expect(getSiteUrl()).toBe("https://hotelai.example");
  });

  it("falls back to localhost", () => {
    vi.unstubAllEnvs();
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_URL;
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });
});

describe("marketing content", () => {
  it("defines landing feature sections", () => {
    expect(LANDING_FEATURES.length).toBeGreaterThanOrEqual(4);
  });

  it("defines AI channels including analytics", () => {
    const titles = AI_CHANNELS.map((channel) => channel.title);
    expect(titles).toContain("Telegram");
    expect(titles).toContain("Website Chat");
    expect(titles).toContain("Knowledge Base");
    expect(titles).toContain("Analytics");
  });

  it("defines FAQ and feature overview content", () => {
    expect(FAQ_ITEMS.length).toBeGreaterThanOrEqual(3);
    expect(FEATURE_SECTIONS.length).toBeGreaterThanOrEqual(4);
  });
});
