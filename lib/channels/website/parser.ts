import type { ChannelInboundMessage } from "@/lib/channels/types";

import type { WebsiteInboundFrame } from "./types";

export function parseWebsiteInboundFrame(
  raw: unknown
): WebsiteInboundFrame | null {
  if (typeof raw !== "object" || raw === null) {
    return null;
  }

  const frame = raw as Record<string, unknown>;
  if (frame.type !== "guest_message") {
    return null;
  }

  const sessionId =
    typeof frame.session_id === "string" ? frame.session_id.trim() : "";
  const messageId =
    typeof frame.message_id === "string" ? frame.message_id.trim() : "";
  const guestName =
    typeof frame.guest_name === "string" ? frame.guest_name.trim() : "";
  const body = typeof frame.body === "string" ? frame.body.trim() : "";

  if (!sessionId || !messageId || !guestName || !body) {
    return null;
  }

  const guestEmail =
    typeof frame.guest_email === "string" ? frame.guest_email.trim() : null;
  const hotelId =
    typeof frame.hotel_id === "string" ? frame.hotel_id.trim() : undefined;

  return {
    type: "guest_message",
    session_id: sessionId,
    message_id: messageId,
    guest_name: guestName,
    guest_email: guestEmail || null,
    body,
    hotel_id: hotelId || undefined,
  };
}

export function toChannelInboundMessage(
  frame: WebsiteInboundFrame
): ChannelInboundMessage {
  return {
    channel: "website",
    externalChatId: frame.session_id,
    externalMessageId: frame.message_id,
    guestName: frame.guest_name,
    guestUsername: null,
    body: frame.body,
    metadata: {
      website: {
        session_id: frame.session_id,
        message_id: frame.message_id,
        guest_email: frame.guest_email ?? null,
      },
    },
  };
}
