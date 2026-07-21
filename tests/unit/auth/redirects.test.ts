import { describe, expect, it } from "vitest";

import { resolvePostSignInDestination } from "@/lib/services/auth.mutations";

describe("resolvePostSignInDestination", () => {
  it("keeps an internal path with query and hash", () => {
    expect(resolvePostSignInDestination("/bookings?view=week#today")).toBe(
      "/bookings?view=week#today",
    );
  });

  it.each([
    "",
    "dashboard",
    "https://evil.example/path",
    "//evil.example/path",
    "/\\evil.example/path",
  ])("rejects unsafe redirect value %s", (value) => {
    expect(resolvePostSignInDestination(value)).toBe("/dashboard");
  });
});
