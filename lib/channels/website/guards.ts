import {
  buildWebsiteWidgetCorsHeaders,
  evaluateWebsiteWidgetOrigin,
} from "./cors";
import { verifyWebsiteHotel } from "./hotel";
import { logWebsiteWidget } from "./logger";
import {
  checkWebsiteWidgetRateLimit,
} from "./rate-limit";
import type { WebsiteInboundFrame } from "./types";
import { validateWebsiteRequiredFields } from "./validation";

type WebsitePreflightResult =
  | {
      ok: true;
      frame: WebsiteInboundFrame;
      corsHeaders: Record<string, string>;
      sessionId: string;
      hotelId: string;
      ipAddress: string;
    }
  | {
      ok: false;
      status: number;
      error: string;
      corsHeaders: Record<string, string>;
      retryAfterMs?: number;
    };

function getClientIpAddress(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function jsonWebsiteError(
  status: number,
  error: string,
  corsHeaders: Record<string, string>,
  retryAfterMs?: number
): Response {
  const headers = new Headers({
    ...corsHeaders,
    "Content-Type": "application/json",
  });

  if (retryAfterMs !== undefined) {
    headers.set("Retry-After", String(Math.ceil(retryAfterMs / 1000)));
  }

  return new Response(JSON.stringify({ error }), {
    status,
    headers,
  });
}

export async function preflightWebsiteStreamRequest(
  request: Request,
  body: unknown
): Promise<WebsitePreflightResult> {
  const originDecision = evaluateWebsiteWidgetOrigin(
    request.headers.get("origin")
  );
  const corsHeaders = buildWebsiteWidgetCorsHeaders(
    originDecision.allowed ? originDecision.origin : null
  );

  if (!originDecision.allowed) {
    logWebsiteWidget("invalid_origin", {
      origin: originDecision.origin,
    });
    return {
      ok: false,
      status: 403,
      error: "Origin not allowed",
      corsHeaders,
    };
  }

  const validation = validateWebsiteRequiredFields(body);
  if (!validation.ok) {
    return {
      ok: false,
      status: validation.status,
      error: validation.error,
      corsHeaders,
    };
  }

  const { sessionId, hotelId } = validation.value;
  const ipAddress = getClientIpAddress(request);
  const rateLimit = checkWebsiteWidgetRateLimit(sessionId, ipAddress);

  if (!rateLimit.allowed) {
    logWebsiteWidget("rate_limited", {
      session_id: sessionId,
      ip: ipAddress,
      scope: rateLimit.scope,
    });
    return {
      ok: false,
      status: 429,
      error: "Too many requests",
      corsHeaders,
      retryAfterMs: rateLimit.retryAfterMs,
    };
  }

  const hotel = await verifyWebsiteHotel(hotelId);
  if (!hotel.ok) {
    logWebsiteWidget("invalid_hotel", { hotel_id: hotelId });
    return {
      ok: false,
      status: 404,
      error: "Unknown hotel",
      corsHeaders,
    };
  }

  const validated = validation.value;
  const frame: WebsiteInboundFrame = {
    type: "guest_message",
    session_id: validated.sessionId,
    message_id: validated.messageId,
    guest_name: validated.guestName,
    guest_email: validated.guestEmail,
    body: validated.body,
    hotel_id: validated.hotelId,
  };

  return {
    ok: true,
    frame,
    corsHeaders,
    sessionId: validated.sessionId,
    hotelId: validated.hotelId,
    ipAddress,
  };
}
