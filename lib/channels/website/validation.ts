export const DEFAULT_WEBSITE_WIDGET_MAX_MESSAGE_LENGTH = 4000;

export function getWebsiteWidgetMaxMessageLength(): number {
  const raw = process.env.WEBSITE_WIDGET_MAX_MESSAGE_LENGTH?.trim();
  const parsed = raw ? Number.parseInt(raw, 10) : DEFAULT_WEBSITE_WIDGET_MAX_MESSAGE_LENGTH;
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : DEFAULT_WEBSITE_WIDGET_MAX_MESSAGE_LENGTH;
}

export function isValidUtf8Text(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);

    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (next < 0xdc00 || next > 0xdfff) {
        return false;
      }
      index += 1;
      continue;
    }

    if (code >= 0xdc00 && code <= 0xdfff) {
      return false;
    }

    if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
      return false;
    }
  }

  return true;
}

export type WebsiteValidationFailure = {
  ok: false;
  status: 400;
  error: string;
};

export type WebsiteValidationSuccess<T> = {
  ok: true;
  value: T;
};

export type WebsiteValidationResult<T> =
  | WebsiteValidationSuccess<T>
  | WebsiteValidationFailure;

export function validateWebsiteFrameType(
  raw: unknown
): WebsiteValidationResult<Record<string, unknown>> {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, status: 400, error: "Invalid payload" };
  }

  const frame = raw as Record<string, unknown>;
  if (frame.type !== "guest_message") {
    return { ok: false, status: 400, error: "Invalid frame type" };
  }

  return { ok: true, value: frame };
}

export function validateWebsiteHotelId(
  frame: Record<string, unknown>
): WebsiteValidationResult<string> {
  const hotelId =
    typeof frame.hotel_id === "string" ? frame.hotel_id.trim() : "";

  if (!hotelId) {
    return { ok: false, status: 400, error: "hotel_id is required" };
  }

  return { ok: true, value: hotelId };
}

export function validateWebsiteMessageBody(
  frame: Record<string, unknown>
): WebsiteValidationResult<string> {
  if (typeof frame.body !== "string") {
    return { ok: false, status: 400, error: "Empty message" };
  }

  const body = frame.body.trim();
  if (!body) {
    return { ok: false, status: 400, error: "Empty message" };
  }

  if (!isValidUtf8Text(body)) {
    return { ok: false, status: 400, error: "Invalid UTF-8 payload" };
  }

  const maxLength = getWebsiteWidgetMaxMessageLength();
  if (body.length > maxLength) {
    return { ok: false, status: 400, error: "Message too long" };
  }

  return { ok: true, value: body };
}

export function validateWebsiteRequiredFields(
  raw: unknown
): WebsiteValidationResult<{
  sessionId: string;
  messageId: string;
  guestName: string;
  guestEmail: string | null;
  body: string;
  hotelId: string;
}> {
  const typeResult = validateWebsiteFrameType(raw);
  if (!typeResult.ok) {
    return typeResult;
  }

  const frame = typeResult.value;

  const hotelResult = validateWebsiteHotelId(frame);
  if (!hotelResult.ok) {
    return hotelResult;
  }

  const bodyResult = validateWebsiteMessageBody(frame);
  if (!bodyResult.ok) {
    return bodyResult;
  }

  const sessionId =
    typeof frame.session_id === "string" ? frame.session_id.trim() : "";
  const messageId =
    typeof frame.message_id === "string" ? frame.message_id.trim() : "";
  const guestName =
    typeof frame.guest_name === "string" ? frame.guest_name.trim() : "";

  if (!sessionId || !messageId || !guestName) {
    return { ok: false, status: 400, error: "Invalid payload" };
  }

  if (!isValidUtf8Text(sessionId) || !isValidUtf8Text(messageId) || !isValidUtf8Text(guestName)) {
    return { ok: false, status: 400, error: "Invalid UTF-8 payload" };
  }

  const guestEmail =
    typeof frame.guest_email === "string" ? frame.guest_email.trim() : null;

  if (guestEmail && !isValidUtf8Text(guestEmail)) {
    return { ok: false, status: 400, error: "Invalid UTF-8 payload" };
  }

  return {
    ok: true,
    value: {
      sessionId,
      messageId,
      guestName,
      guestEmail,
      body: bodyResult.value,
      hotelId: hotelResult.value,
    },
  };
}
