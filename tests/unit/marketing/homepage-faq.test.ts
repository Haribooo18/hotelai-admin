import { describe, expect, it } from "vitest";

import {
  HOMEPAGE_FAQ_CONTENT,
  HOMEPAGE_FAQ_ITEMS,
} from "@/lib/marketing/homepage-faq";

describe("homepage FAQ content", () => {
  it("defines eight objection-handling questions", () => {
    expect(HOMEPAGE_FAQ_ITEMS).toHaveLength(8);
    expect(HOMEPAGE_FAQ_ITEMS.map((item) => item.question)).toContain(
      "Why Monavel instead of another PMS?"
    );
    expect(HOMEPAGE_FAQ_ITEMS.map((item) => item.question)).toContain(
      "Is my hotel data secure?"
    );
  });

  it("keeps answers concise and executive", () => {
    for (const item of HOMEPAGE_FAQ_ITEMS) {
      const sentences = item.answer.split(/(?<=[.!?])\s+/).filter(Boolean);
      expect(sentences.length).toBeGreaterThanOrEqual(2);
      expect(sentences.length).toBeLessThanOrEqual(4);
    }
  });

  it("uses a headline without a closing block", () => {
    expect(HOMEPAGE_FAQ_CONTENT.headline).toBe("Frequently Asked Questions");
    expect(HOMEPAGE_FAQ_CONTENT).not.toHaveProperty("closingStatement");
  });
});
