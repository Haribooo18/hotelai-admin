import type { OrchestratorStreamEvent } from "@/lib/ai/orchestrator";

import type { WebsiteOutboundEvent } from "./types";

export type WebsiteSendFn = (event: WebsiteOutboundEvent) => void;

export function serializeWebsiteEvent(event: WebsiteOutboundEvent): string {
  return JSON.stringify(event);
}

export function mapOrchestratorEventToWebsite(
  event: OrchestratorStreamEvent
): WebsiteOutboundEvent | null {
  switch (event.type) {
    case "status":
      return { type: "status", status: event.status };
    case "text_delta":
      return { type: "text_delta", delta: event.delta };
    case "text_final":
      return { type: "text_final", content: event.content };
    case "done":
      return { type: "done", message_id: event.messageId };
    default:
      return null;
  }
}

export function sendWebsiteError(send: WebsiteSendFn, message: string): void {
  send({ type: "error", message });
}
