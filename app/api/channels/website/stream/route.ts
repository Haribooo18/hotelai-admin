import {
  cleanupWebsiteStream,
  handleWebsiteStream,
} from "@/lib/channels/website/stream";
import {
  jsonWebsiteError,
  preflightWebsiteStreamRequest,
} from "@/lib/channels/website/guards";
import {
  logWebsiteWidget,
  PUBLIC_WEBSITE_ERROR_MESSAGE,
} from "@/lib/channels/website/logger";
import {
  buildWebsiteWidgetCorsHeaders,
  evaluateWebsiteWidgetOrigin,
} from "@/lib/channels/website/cors";
import { serializeWebsiteEvent } from "@/lib/channels/website/sender";
import type { WebsiteOutboundEvent } from "@/lib/channels/website/types";
import { bindApiContext, runApiRoute } from "@/lib/ops/api-route";
import { opsMetrics } from "@/lib/ops/metrics";
import { readJsonBody } from "@/lib/http/json-body";

export const runtime = "nodejs";

export async function OPTIONS(request: Request) {
  const originDecision = evaluateWebsiteWidgetOrigin(
    request.headers.get("origin")
  );

  if (!originDecision.allowed) {
    return new Response(null, { status: 403 });
  }

  return new Response(null, {
    status: 204,
    headers: buildWebsiteWidgetCorsHeaders(originDecision.origin),
  });
}

export async function POST(request: Request) {
  return runApiRoute(
    request,
    {
      module: "api.website",
      operation: "stream",
      endpoint: "/api/channels/website/stream",
    },
    async () => {
      let body: unknown;
      try {
        body = await readJsonBody(request, { maxBytes: 16 * 1024 });
      } catch {
        const corsHeaders = buildWebsiteWidgetCorsHeaders(
          evaluateWebsiteWidgetOrigin(request.headers.get("origin")).allowed
            ? request.headers.get("origin")
            : null
        );
        return jsonWebsiteError(400, "Invalid JSON", corsHeaders);
      }

      const preflight = await preflightWebsiteStreamRequest(request, body);
      if (!preflight.ok) {
        return jsonWebsiteError(
          preflight.status,
          preflight.error,
          preflight.corsHeaders,
          preflight.retryAfterMs
        );
      }

      const { frame, corsHeaders, sessionId, hotelId, ipAddress } = preflight;
      bindApiContext({
        hotelId,
        conversationId: sessionId,
        provider: "openai",
      });

      logWebsiteWidget("connection_start", {
        session_id: sessionId,
        hotel_id: hotelId,
        ip: ipAddress,
      });

      const encoder = new TextEncoder();
      let disconnectReason = "completed";
      const streamStartedAt = Date.now();

      const stream = new ReadableStream({
        async start(controller) {
          const send = (event: WebsiteOutboundEvent) => {
            if (request.signal.aborted) return;
            controller.enqueue(
              encoder.encode(`data: ${serializeWebsiteEvent(event)}\n\n`)
            );
          };

          try {
            await handleWebsiteStream(frame, send, request.signal);
            if (!request.signal.aborted) {
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            } else {
              disconnectReason = "aborted";
            }
          } catch {
            if (request.signal.aborted) {
              disconnectReason = "aborted";
            } else {
              disconnectReason = "error";
              send({ type: "error", message: PUBLIC_WEBSITE_ERROR_MESSAGE });
            }
          } finally {
            opsMetrics.recordStreamDuration(
              "website_sse",
              Date.now() - streamStartedAt
            );
            logWebsiteWidget(
              request.signal.aborted ? "disconnect" : "connection_end",
              {
                session_id: sessionId,
                hotel_id: hotelId,
                reason: disconnectReason,
              }
            );
            await cleanupWebsiteStream(sessionId);
            controller.close();
          }
        },
        async cancel() {
          disconnectReason = "cancelled";
          logWebsiteWidget("disconnect", {
            session_id: sessionId,
            hotel_id: hotelId,
            reason: disconnectReason,
          });
          await cleanupWebsiteStream(sessionId);
        },
      });

      return new Response(stream, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "X-Content-Type-Options": "nosniff",
          "X-Accel-Buffering": "no",
        },
      });
    }
  );
}
