import {
  cleanupWebsiteStream,
  handleWebsiteStream,
} from "@/lib/channels/website/stream";
import type { WebsiteOutboundEvent } from "@/lib/channels/website/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Некорректный JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: WebsiteOutboundEvent) => {
        if (request.signal.aborted) return;
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
        );
      };

      try {
        await handleWebsiteStream(body, send, request.signal);
        if (!request.signal.aborted) {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        }
      } catch (err) {
        if (!request.signal.aborted) {
          const message =
            err instanceof Error ? err.message : "Ошибка SSE-потока";
          send({ type: "error", message });
        }
      } finally {
        const sessionId =
          typeof body === "object" &&
          body !== null &&
          "session_id" in body &&
          typeof (body as { session_id?: unknown }).session_id === "string"
            ? (body as { session_id: string }).session_id
            : null;

        if (request.signal.aborted && sessionId) {
          await cleanupWebsiteStream(sessionId);
        }

        controller.close();
      }
    },
    async cancel() {
      const sessionId =
        typeof body === "object" &&
        body !== null &&
        "session_id" in body &&
        typeof (body as { session_id?: unknown }).session_id === "string"
          ? (body as { session_id: string }).session_id
          : null;

      if (sessionId) {
        await cleanupWebsiteStream(sessionId);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
