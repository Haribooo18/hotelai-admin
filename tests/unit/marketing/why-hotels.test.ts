import { describe, expect, it } from "vitest";

import {
  WHY_HOTELS_CARDS,
  WHY_HOTELS_CONTENT,
} from "@/lib/marketing/why-hotels";

describe("why hotels choose content", () => {
  it("defines section metadata", () => {
    expect(WHY_HOTELS_CONTENT.sectionId).toBe("why-hotels-choose");
    expect(WHY_HOTELS_CONTENT.headline).toMatch(/choose Monavel/i);
  });

  it("defines six value proposition cards", () => {
    expect(WHY_HOTELS_CARDS).toHaveLength(6);
    expect(WHY_HOTELS_CARDS.map((card) => card.title)).toContain("Save staff time");
    expect(WHY_HOTELS_CARDS.map((card) => card.title)).toContain("Enterprise security");
  });
});
