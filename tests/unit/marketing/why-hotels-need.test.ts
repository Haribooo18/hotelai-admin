import { describe, expect, it } from "vitest";

import {
  MONAVEL_IN_ACTION_STATUS,
  MONAVEL_IN_ACTION_STEPS,
  MONAVEL_IN_ACTION_TITLE,
  WHY_HOTELS_NEED_CONTENT,
  WITH_MONAVEL_ITEMS,
  WITHOUT_MONAVEL_ITEMS,
} from "@/lib/marketing/why-hotels-need";

describe("why hotels need content", () => {
  it("defines comparison section metadata", () => {
    expect(WHY_HOTELS_NEED_CONTENT.sectionId).toBe("why-hotels-need");
    expect(WHY_HOTELS_NEED_CONTENT.headline).toMatch(/need Monavel/i);
  });

  it("defines without and with comparison lists", () => {
    expect(WITHOUT_MONAVEL_ITEMS.length).toBeGreaterThanOrEqual(5);
    expect(WITH_MONAVEL_ITEMS.length).toBeGreaterThanOrEqual(5);
    expect(WITHOUT_MONAVEL_ITEMS).toContain("Multiple systems");
    expect(WITH_MONAVEL_ITEMS).toContain("One workspace");
  });

  it("defines the Monavel in Action workflow", () => {
    expect(MONAVEL_IN_ACTION_TITLE).toBe("Monavel in Action");
    expect(MONAVEL_IN_ACTION_STEPS).toHaveLength(5);
    expect(MONAVEL_IN_ACTION_STEPS.map((step) => step.label)).toEqual([
      "Guest",
      "WhatsApp",
      "AI Reception",
      "Knowledge + PMS",
      "Reply Delivered",
    ]);
  });

  it("defines the Monavel in Action status indicators", () => {
    expect(MONAVEL_IN_ACTION_STATUS).toHaveLength(3);
    expect(MONAVEL_IN_ACTION_STATUS).toContain("Reservation found");
    expect(MONAVEL_IN_ACTION_STATUS).toContain("PMS updated");
    expect(MONAVEL_IN_ACTION_STATUS).toContain("Guest notified");
  });
});
