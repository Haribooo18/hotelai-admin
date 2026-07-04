import { describe, expect, it } from "vitest";

import {
  validateWebsiteFrameType,
  validateWebsiteHotelId,
  validateWebsiteMessageBody,
  validateWebsiteRequiredFields,
} from "@/lib/channels/website/validation";

const validFrame = {
  type: "guest_message",
  session_id: "sess-1",
  message_id: "msg-1",
  guest_name: "Guest",
  body: "Привет",
  hotel_id: "hotel_aurora",
};

describe("website widget validation", () => {
  it("rejects invalid frame types", () => {
    expect(validateWebsiteFrameType({ type: "ping" })).toEqual({
      ok: false,
      status: 400,
      error: "Invalid frame type",
    });
  });

  it("requires hotel_id", () => {
    expect(validateWebsiteHotelId({ hotel_id: " " })).toEqual({
      ok: false,
      status: 400,
      error: "hotel_id is required",
    });
  });

  it("rejects empty messages", () => {
    expect(validateWebsiteMessageBody({ body: "   " })).toEqual({
      ok: false,
      status: 400,
      error: "Empty message",
    });
  });

  it("rejects messages over configured length", () => {
    const longBody = "a".repeat(4001);
    expect(validateWebsiteMessageBody({ body: longBody })).toEqual({
      ok: false,
      status: 400,
      error: "Message too long",
    });
  });

  it("accepts valid guest_message frames", () => {
    const result = validateWebsiteRequiredFields(validFrame);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.hotelId).toBe("hotel_aurora");
      expect(result.value.body).toBe("Привет");
    }
  });
});
