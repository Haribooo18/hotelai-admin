import { describe, expect, it } from "vitest";

import {
  parseWebsiteInboundFrame,
  toChannelInboundMessage,
} from "@/lib/channels/website/parser";

describe("parseWebsiteInboundFrame", () => {
  it("parses a valid guest message frame", () => {
    const parsed = parseWebsiteInboundFrame({
      type: "guest_message",
      session_id: "  sess-abc  ",
      message_id: "msg-1",
      guest_name: "  Maria  ",
      guest_email: "maria@example.com",
      body: "  Нужен номер с видом  ",
    });

    expect(parsed).toEqual({
      type: "guest_message",
      session_id: "sess-abc",
      message_id: "msg-1",
      guest_name: "Maria",
      guest_email: "maria@example.com",
      body: "Нужен номер с видом",
    });
  });

  it("parses optional hotel_id for widget routing", () => {
    const parsed = parseWebsiteInboundFrame({
      type: "guest_message",
      session_id: "sess-abc",
      message_id: "msg-1",
      guest_name: "Maria",
      body: "Привет",
      hotel_id: " hotel_aurora ",
    });

    expect(parsed?.hotel_id).toBe("hotel_aurora");
  });

  it("returns null for non-guest frames", () => {
    expect(parseWebsiteInboundFrame({ type: "ping" })).toBeNull();
    expect(parseWebsiteInboundFrame(null)).toBeNull();
    expect(parseWebsiteInboundFrame("text")).toBeNull();
  });

  it("returns null when required fields are missing", () => {
    expect(
      parseWebsiteInboundFrame({
        type: "guest_message",
        session_id: "",
        message_id: "msg-1",
        guest_name: "Guest",
        body: "Hi",
      })
    ).toBeNull();
  });
});

describe("toChannelInboundMessage", () => {
  it("maps website frames to shared channel inbound type", () => {
    const frame = parseWebsiteInboundFrame({
      type: "guest_message",
      session_id: "sess-99",
      message_id: "msg-42",
      guest_name: "Alex",
      body: "Привет",
    });

    expect(frame).not.toBeNull();
    const inbound = toChannelInboundMessage(frame!);

    expect(inbound).toEqual({
      channel: "website",
      externalChatId: "sess-99",
      externalMessageId: "msg-42",
      guestName: "Alex",
      guestUsername: null,
      body: "Привет",
      metadata: {
        website: {
          session_id: "sess-99",
          message_id: "msg-42",
          guest_email: null,
        },
      },
    });
  });
});
