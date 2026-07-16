import { beforeEach, describe, expect, it, vi } from "vitest";

import { preflightWebsiteStreamRequest } from "@/lib/channels/website/guards";
import { __resetWebsiteRateLimitersForTests } from "@/lib/channels/website/rate-limit";

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(() => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: { id: "hotel_aurora" },
            error: null,
          }),
        }),
      }),
    }),
  })),
}));

const validBody = {
  type: "guest_message",
  session_id: "sess-1",
  message_id: "msg-1",
  guest_name: "Guest",
  body: "Привет",
  hotel_id: "hotel_aurora",
};

function makeRequest(origin?: string): Request {
  return new Request("https://api.hotelai.example/api/channels/website/stream", {
    method: "POST",
    headers: origin ? { Origin: origin } : {},
  });
}

describe("website stream preflight", () => {
  beforeEach(() => {
    __resetWebsiteRateLimitersForTests();
    vi.stubEnv("WEBSITE_WIDGET_ALLOWED_ORIGINS", "https://hotel-one.com");
    vi.stubEnv("WEBSITE_WIDGET_SESSION_RATE_LIMIT", "2");
    vi.stubEnv("WEBSITE_WIDGET_IP_RATE_LIMIT", "2");
    vi.stubEnv("NODE_ENV", "production");
  });

  it("rejects unknown origins", async () => {
    const result = await preflightWebsiteStreamRequest(
      makeRequest("https://evil.example"),
      validBody
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(403);
      expect(result.error).toBe("Origin not allowed");
    }
  });

  it("rejects unknown hotels", async () => {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    vi.mocked(createAdminClient).mockReturnValueOnce({
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: null, error: null }),
          }),
        }),
      }),
    } as never);

    const result = await preflightWebsiteStreamRequest(
      makeRequest("https://hotel-one.com"),
      { ...validBody, hotel_id: "missing_hotel" }
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(404);
      expect(result.error).toBe("Unknown hotel");
    }
  });

  it("rate limits repeated session requests", async () => {
    const request = makeRequest("https://hotel-one.com");

    await preflightWebsiteStreamRequest(request, validBody);
    await preflightWebsiteStreamRequest(request, {
      ...validBody,
      message_id: "msg-2",
    });
    const limited = await preflightWebsiteStreamRequest(request, {
      ...validBody,
      message_id: "msg-3",
    });

    expect(limited.ok).toBe(false);
    if (!limited.ok) {
      expect(limited.status).toBe(429);
      expect(limited.error).toBe("Too many requests");
    }
  });

  it("rejects invalid payloads before stream starts", async () => {
    const result = await preflightWebsiteStreamRequest(
      makeRequest("https://hotel-one.com"),
      { type: "guest_message", body: "" }
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(400);
    }
  });

  it("passes valid requests", async () => {
    const result = await preflightWebsiteStreamRequest(
      makeRequest("https://hotel-one.com"),
      validBody
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.hotelId).toBe("hotel_aurora");
      expect(result.sessionId).toBe("sess-1");
      expect(result.corsHeaders["Access-Control-Allow-Origin"]).toBe(
        "https://hotel-one.com"
      );
    }
  });
});
