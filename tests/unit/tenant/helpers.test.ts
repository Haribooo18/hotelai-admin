import type { User } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";

import { getCurrentHotelId, resolveHotelId } from "@/lib/tenant";

function makeUser(metadata: {
  app?: Record<string, unknown>;
  user?: Record<string, unknown>;
}): User {
  return {
    id: "user-1",
    app_metadata: metadata.app ?? {},
    user_metadata: metadata.user ?? {},
    aud: "authenticated",
    created_at: "2026-01-01T00:00:00.000Z",
  } as User;
}

describe("resolveHotelId", () => {
  it("prefers app_metadata.hotel_id", () => {
    const user = makeUser({
      app: { hotel_id: "hotel_app" },
      user: { hotel_id: "hotel_user" },
    });

    expect(resolveHotelId(user)).toBe("hotel_app");
  });

  it("falls back to user_metadata.hotel_id", () => {
    const user = makeUser({
      user: { hotel_id: "hotel_user" },
    });

    expect(resolveHotelId(user)).toBe("hotel_user");
  });

  it("uses DEFAULT_HOTEL_ID when metadata is missing (temporary fallback, TD-09)", () => {
    const user = makeUser({});

    expect(resolveHotelId(user)).toBe("hotel_aurora");
  });

  it("ignores empty app_metadata hotel_id", () => {
    const user = makeUser({
      app: { hotel_id: "" },
    });

    expect(resolveHotelId(user)).toBe("hotel_aurora");
  });
});

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

describe("getCurrentHotelId", () => {
  it("returns resolved hotel id for authenticated user", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: makeUser({ app: { hotel_id: "hotel_from_auth" } }),
          },
        }),
      },
    } as never);

    await expect(getCurrentHotelId()).resolves.toBe("hotel_from_auth");
  });
});
