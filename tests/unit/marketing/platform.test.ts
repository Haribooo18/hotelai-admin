import { describe, expect, it } from "vitest";

import {
  PLATFORM_DEFAULT_WORKSPACE_ID,
  PLATFORM_SHOWCASE_CONTENT,
  PLATFORM_WORKSPACES,
} from "@/lib/marketing/platform";

describe("marketing platform showcase", () => {
  it("defines eight workspaces", () => {
    expect(PLATFORM_WORKSPACES).toHaveLength(8);
    const ids = PLATFORM_WORKSPACES.map((workspace) => workspace.id);
    expect(ids).toContain("dashboard");
    expect(ids).toContain("bookings");
    expect(ids).toContain("guests");
    expect(ids).toContain("rooms");
    expect(ids).toContain("calendar");
    expect(ids).toContain("revenue");
    expect(ids).toContain("knowledge");
    expect(ids).toContain("reception-ai");
  });

  it("defaults to dashboard workspace", () => {
    expect(PLATFORM_DEFAULT_WORKSPACE_ID).toBe("dashboard");
  });

  it("exposes platform section copy", () => {
    expect(PLATFORM_SHOWCASE_CONTENT.sectionId).toBe("platform-overview");
    expect(PLATFORM_SHOWCASE_CONTENT.overline).toBe("Platform");
    expect(PLATFORM_SHOWCASE_CONTENT.headlineAccent).toContain("AI");
  });

  it("uses english workspace labels", () => {
    const labels = PLATFORM_WORKSPACES.map((workspace) => workspace.label);
    expect(labels).toContain("Dashboard");
    expect(labels).toContain("Reception AI");
  });
});
