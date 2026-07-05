import { describe, expect, it } from "vitest";

import {
  MAX_MESSAGE_BODY_CHARS,
  assertConversationGuardrails,
  assertContextGuardrails,
  assertMessageSizeLimits,
} from "@/lib/ai/guardrails";
import { CurrentPromptVersion } from "@/lib/ai/prompt-version";
import type { AIRequest } from "@/lib/ai/types";

import { makeConversation, makeMessage } from "../../helpers/fixtures";

describe("guardrails", () => {
  it("rejects oversized messages", () => {
    expect(() =>
      assertMessageSizeLimits([
        makeMessage({ role: "guest", body: "x".repeat(MAX_MESSAGE_BODY_CHARS + 1) }),
      ])
    ).toThrow("Сообщение слишком длинное");
  });

  it("rejects empty AI context", () => {
    const request: AIRequest = {
      hotelId: "hotel_a",
      conversation: makeConversation(),
      messages: [],
      knowledgeSnippets: [],
      systemPrompt: "prompt",
      tools: [],
      language: "ru",
      transcript: "",
      promptVersion: CurrentPromptVersion,
      systemPromptHash: "abc",
    };

    expect(() => assertContextGuardrails(request)).toThrow(
      "Нет сообщений для обработки"
    );
  });

  it("accepts valid conversation input", () => {
    expect(() =>
      assertConversationGuardrails({
        messages: [makeMessage({ role: "guest", body: "Привет" })],
        settings: {
          hotel_id: "hotel_a",
          enabled: true,
          model: "gpt-4o-mini",
          max_output_tokens: 1024,
          temperature: 0.3,
          top_p: 1,
          tool_choice: "auto",
          system_language: "ru",
          rate_limit_per_minute: 30,
          timeout_ms: 60_000,
          max_tool_rounds: 5,
          max_retries: 2,
          extra_instructions: null,
          created_at: "2026-07-04T12:00:00.000Z",
          updated_at: "2026-07-04T12:00:00.000Z",
        },
      })
    ).not.toThrow();
  });
});
