import { describe, expect, it } from "vitest";

import {
  PLATFORM_AUTOMATION_READINESS,
  PLATFORM_DEFAULT_PERSPECTIVE_ID,
  PLATFORM_DEFAULT_WORKSPACE_ID,
  PLATFORM_HOTEL_CONTEXT,
  PLATFORM_PERSPECTIVES,
  PLATFORM_SHOWCASE_CONTENT,
  PLATFORM_WORKSPACES,
} from "@/lib/marketing/platform";

describe("marketing platform showcase", () => {
  it("preserves eight existing product views", () => {
    expect(PLATFORM_WORKSPACES).toHaveLength(8);

    const ids = PLATFORM_WORKSPACES.map((workspace) => workspace.id);

    expect(ids).toEqual([
      "dashboard",
      "bookings",
      "guests",
      "rooms",
      "calendar",
      "revenue",
      "knowledge",
      "reception-ai",
    ]);
  });

  it("groups product views into four operational perspectives", () => {
    expect(PLATFORM_PERSPECTIVES).toHaveLength(4);

    expect(
      PLATFORM_PERSPECTIVES.map((perspective) => perspective.id)
    ).toEqual([
      "operations",
      "revenue",
      "knowledge",
      "automation",
    ]);

    expect(
      PLATFORM_PERSPECTIVES.map((perspective) => perspective.label)
    ).toEqual([
      "Operations Perspective",
      "Revenue Perspective",
      "Knowledge Perspective",
      "Automation Perspective",
    ]);
  });

  it("keeps every existing product view reachable through perspectives", () => {
    const reachable = new Set(
      PLATFORM_PERSPECTIVES.flatMap((perspective) =>
        perspective.views.map((view) => view.id)
      )
    );

    for (const workspace of PLATFORM_WORKSPACES) {
      expect(reachable.has(workspace.id)).toBe(true);
    }
  });

  it("defaults to the operations perspective with dashboard view", () => {
    expect(PLATFORM_DEFAULT_PERSPECTIVE_ID).toBe("operations");
    expect(PLATFORM_DEFAULT_WORKSPACE_ID).toBe("dashboard");

    expect(
      PLATFORM_PERSPECTIVES.find(
        (perspective) => perspective.id === "operations"
      )?.defaultViewId
    ).toBe("dashboard");
  });

  it("keeps one living hotel identity across perspectives", () => {
    expect(PLATFORM_HOTEL_CONTEXT.hotelLive).toBe("Monavel Grand • Live");
    expect(PLATFORM_HOTEL_CONTEXT.guestName).toBe("Maria Thompson");
    expect(PLATFORM_HOTEL_CONTEXT.reservation).toBe("Reservation #48291");
    expect(PLATFORM_HOTEL_CONTEXT.room).toBe("Room 407");
  });

  it("frames automation as operational readiness", () => {
    expect([...PLATFORM_AUTOMATION_READINESS]).toEqual([
      "12 workflows active",
      "Everything synced",
      "Online",
    ]);
  });

  it("exposes Runtime-first showcase copy without workspace language", () => {
    expect(PLATFORM_SHOWCASE_CONTENT.sectionId).toBe("product");
    expect(PLATFORM_SHOWCASE_CONTENT.headline).toBe("One Runtime.");
    expect(PLATFORM_SHOWCASE_CONTENT.headlineAccent).toBe(
      "Every operational perspective."
    );
    expect(PLATFORM_SHOWCASE_CONTENT.supporting).toBe(
      "Every perspective reflects the same live hotel in real time."
    );
    expect(PLATFORM_SHOWCASE_CONTENT.runtimeStatus).toBe("Online");

    expect([...PLATFORM_SHOWCASE_CONTENT.closingLines]).toEqual([
      "One living hotel.",
      "Different perspectives.",
    ]);

    expect(
      PLATFORM_SHOWCASE_CONTENT.headlineAccent.toLowerCase()
    ).not.toContain("workspace");

    expect(
      PLATFORM_SHOWCASE_CONTENT.supporting.toLowerCase()
    ).not.toContain("workspace");
  });
});