import { describe, expect, it } from "vitest";

import {
  mapOrchestratorEventToWebsite,
  serializeWebsiteEvent,
} from "@/lib/channels/website/sender";

describe("mapOrchestratorEventToWebsite", () => {
  it("maps orchestrator stream events to website outbound events", () => {
    expect(
      mapOrchestratorEventToWebsite({ type: "status", status: "ai_answering" })
    ).toEqual({ type: "status", status: "ai_answering" });

    expect(
      mapOrchestratorEventToWebsite({ type: "text_delta", delta: "Привет" })
    ).toEqual({ type: "text_delta", delta: "Привет" });

    expect(
      mapOrchestratorEventToWebsite({
        type: "text_final",
        content: "Полный ответ",
      })
    ).toEqual({ type: "text_final", content: "Полный ответ" });

    expect(
      mapOrchestratorEventToWebsite({
        type: "done",
        messageId: "msg-ai-1",
      })
    ).toEqual({ type: "done", message_id: "msg-ai-1" });
  });

  it("ignores unsupported orchestrator events", () => {
    expect(
      mapOrchestratorEventToWebsite({
        type: "tool_calls",
        calls: [],
      } as never)
    ).toBeNull();
  });
});

describe("serializeWebsiteEvent", () => {
  it("serializes outbound events as JSON", () => {
    const payload = serializeWebsiteEvent({
      type: "ack",
      guest_message_id: "msg-guest",
      conversation_id: "conv-1",
    });

    expect(JSON.parse(payload)).toEqual({
      type: "ack",
      guest_message_id: "msg-guest",
      conversation_id: "conv-1",
    });
  });
});
