import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  AIOrchestrator,
  type OrchestratorStreamEvent,
} from "@/lib/ai/orchestrator";
import { configureAIServices, unconfiguredAIProvider } from "@/lib/ai/container";
import { PromptAssembler } from "@/lib/ai/prompt-assembler";
import { createToolRegistry } from "@/lib/ai/tool-registry";
import type { OpenAIProvider } from "@/lib/ai/providers/openai";
import type { AIResponse, AIStreamEvent } from "@/lib/ai/types";
import { hotelRateLimiter } from "@/lib/ai/rate-limiter";
import type { HotelAISettings } from "@/types/ai-settings";

import {
  TEST_HOTEL,
  makeConversation,
  makeMessage,
} from "../../helpers/fixtures";

const updateMock = vi.fn();
const insertMock = vi.fn();

type MockCall = { table: string; data?: Record<string, unknown> };

function isMockCall(arg: unknown): arg is MockCall {
  return (
    typeof arg === "object" &&
    arg !== null &&
    "table" in arg &&
    typeof (arg as MockCall).table === "string"
  );
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: (table: string) => ({
      update: (data: unknown) => {
        updateMock({ table, data });
        const chain: Record<string, unknown> = {
          eq: () => chain,
        };
        chain.then = (resolve: (v: unknown) => void) =>
          resolve({ error: null, data: null });
        return chain;
      },
      insert: (data: unknown) => {
        insertMock({ table, data });
        return {
          select: () => ({
            single: () =>
              Promise.resolve({
                data:
                  table === "ai_actions"
                    ? { id: "action-1" }
                    : {
                        id: "msg-stream-1",
                        created_at: "2026-07-04T12:00:00.000Z",
                      },
                error: null,
              }),
          }),
        };
      },
    }),
  })),
}));

function makeAISettings(
  overrides: Partial<HotelAISettings> = {}
): HotelAISettings {
  const now = "2026-07-04T12:00:00.000Z";
  return {
    hotel_id: TEST_HOTEL.id,
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
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}

function createStreamProvider(
  events: AIStreamEvent[]
): OpenAIProvider {
  return {
    name: "openai",
    async complete() {
      return {
        content: "fallback",
        toolCalls: [],
        metadata: {
          model: "gpt-4o-mini",
          request_id: "req-1",
          usage: { input_tokens: 1, output_tokens: 2, total_tokens: 3 },
        },
      };
    },
    async *stream() {
      for (const event of events) {
        yield event;
      }
    },
    async completeWithToolOutputs() {
      return {
        content: "after tools",
        toolCalls: [],
        metadata: {
          model: "gpt-4o-mini",
          request_id: "req-2",
          usage: { input_tokens: 2, output_tokens: 3, total_tokens: 5 },
        },
      };
    },
  };
}

async function collectStream(
  gen: AsyncGenerator<OrchestratorStreamEvent>
): Promise<OrchestratorStreamEvent[]> {
  const events: OrchestratorStreamEvent[] = [];
  for await (const event of gen) {
    events.push(event);
  }
  return events;
}

describe("AIOrchestrator.stream", () => {
  const orchestrator = new AIOrchestrator();

  beforeEach(() => {
    updateMock.mockClear();
    insertMock.mockClear();
    vi.restoreAllMocks();

    const assembler = new PromptAssembler({
      knowledgeRetriever: { retrieve: async () => [] },
      toolRegistry: createToolRegistry([]),
    });

    configureAIServices({
      provider: createStreamProvider([
        { type: "text_delta", delta: "Привет" },
        {
          type: "completed",
          response: {
            content: null,
            toolCalls: [],
            metadata: {
              model: "gpt-4o-mini",
              request_id: "req-stream",
              usage: { input_tokens: 4, output_tokens: 6, total_tokens: 10 },
            },
          },
        },
      ]),
      promptAssembler: assembler,
    });
  });

  const baseInput = () => ({
    hotel: TEST_HOTEL,
    conversation: makeConversation(),
    messages: [makeMessage({ role: "guest", body: "Вопрос" })],
    settings: makeAISettings(),
  });

  it("rejects when AI is disabled", async () => {
    await expect(
      collectStream(
        orchestrator.stream({
          ...baseInput(),
          settings: makeAISettings({ enabled: false }),
        })
      )
    ).rejects.toThrow("AI-ресепшн отключён");
  });

  it("rejects when provider is unconfigured", async () => {
    configureAIServices({ provider: unconfiguredAIProvider });

    await expect(collectStream(orchestrator.stream(baseInput()))).rejects.toThrow(
      "AI-провайдер не настроен"
    );
  });

  it("rejects when rate limit is exceeded", async () => {
    vi.spyOn(hotelRateLimiter, "check").mockReturnValue({
      allowed: false,
      retryAfterMs: 12_000,
    });

    await expect(collectStream(orchestrator.stream(baseInput()))).rejects.toThrow(
      "Превышен лимит запросов"
    );
  });

  it("logs ai_actions completion start and persists AI message", async () => {
    const events = await collectStream(orchestrator.stream(baseInput()));

    expect(events.some((e) => e.type === "text_delta")).toBe(true);
    expect(events.at(-1)).toEqual({ type: "done", messageId: "msg-stream-1" });

    const actionInsert = insertMock.mock.calls.find((call) =>
      isMockCall(call[0]) ? call[0].table === "ai_actions" : false
    );
    expect(actionInsert?.[0]).toMatchObject({
      table: "ai_actions",
      data: { action_type: "completion", status: "pending" },
    });

    const messageInsert = insertMock.mock.calls.find((call) =>
      isMockCall(call[0]) ? call[0].table === "messages" : false
    );
    expect(messageInsert?.[0]).toMatchObject({
      table: "messages",
      data: {
        role: "ai",
        body: "Привет",
        metadata: expect.objectContaining({ streamed: true }),
      },
    });
  });

  it("updates conversation status and typing indicator", async () => {
    await collectStream(orchestrator.stream(baseInput()));

    const activeUpdate = updateMock.mock.calls.find((call) => {
      const arg = call[0];
      return (
        isMockCall(arg) &&
        arg.table === "conversations" &&
        arg.data?.is_ai_typing === true &&
        arg.data?.status === "ai_answering"
      );
    });
    expect(activeUpdate).toBeDefined();

    const doneUpdate = updateMock.mock.calls.find((call) => {
      const arg = call[0];
      return (
        isMockCall(arg) &&
        arg.table === "conversations" &&
        arg.data?.is_ai_typing === false &&
        arg.data?.status === "waiting_guest"
      );
    });
    expect(doneUpdate).toBeDefined();
  });

  it("clears typing state on abort without persisting a message", async () => {
    const controller = new AbortController();
    controller.abort();

    const events = await collectStream(
      orchestrator.stream({
        ...baseInput(),
        signal: controller.signal,
      })
    );

    expect(events).toEqual([{ type: "status", status: "ai_answering" }]);
    expect(
      insertMock.mock.calls.some((call) =>
        isMockCall(call[0]) ? call[0].table === "messages" : false
      )
    ).toBe(false);

    const clearTyping = updateMock.mock.calls.find((call) => {
      const arg = call[0];
      return (
        isMockCall(arg) &&
        arg.table === "conversations" &&
        arg.data?.is_ai_typing === false
      );
    });
    expect(clearTyping).toBeDefined();
  });

  it("clears typing state when aborted mid-stream", async () => {
    const controller = new AbortController();

    configureAIServices({
      provider: {
        name: "openai",
        async complete() {
          return {
            content: "fallback",
            toolCalls: [],
            metadata: {
              model: "gpt-4o-mini",
              usage: { input_tokens: 0, output_tokens: 0, total_tokens: 0 },
            },
          };
        },
        async *stream() {
          yield { type: "text_delta", delta: "Часть" };
          controller.abort();
          yield {
            type: "completed",
            response: {
              content: null,
              toolCalls: [],
              metadata: {
                model: "gpt-4o-mini",
                usage: { input_tokens: 1, output_tokens: 1, total_tokens: 2 },
              },
            },
          };
        },
        async completeWithToolOutputs() {
          return {
            content: "unused",
            toolCalls: [],
            metadata: {
              model: "gpt-4o-mini",
              usage: { input_tokens: 0, output_tokens: 0, total_tokens: 0 },
            },
          };
        },
      } as OpenAIProvider,
      promptAssembler: new PromptAssembler({
        knowledgeRetriever: { retrieve: async () => [] },
        toolRegistry: createToolRegistry([]),
      }),
    });

    insertMock.mockClear();
    updateMock.mockClear();

    const events = await collectStream(
      orchestrator.stream({
        ...baseInput(),
        signal: controller.signal,
      })
    );

    expect(events.some((e) => e.type === "done")).toBe(false);
    expect(
      insertMock.mock.calls.some((call) =>
        isMockCall(call[0]) ? call[0].table === "messages" : false
      )
    ).toBe(false);
    expect(
      updateMock.mock.calls.some((call) => {
        const arg = call[0];
        return (
          isMockCall(arg) &&
          arg.table === "conversations" &&
          arg.data?.is_ai_typing === false
        );
      })
    ).toBe(true);
  });

  it("runs tool loop when stream completes with tool calls", async () => {
    const toolResponse: AIResponse = {
      content: null,
      toolCalls: [
        { id: "call-1", name: "search_knowledge", arguments: { query: "wifi" } },
      ],
      metadata: {
        model: "gpt-4o-mini",
        request_id: "req-tools",
        usage: { input_tokens: 1, output_tokens: 1, total_tokens: 2 },
      },
    };

    configureAIServices({
      provider: createStreamProvider([
        {
          type: "completed",
          response: toolResponse,
        },
      ]),
      promptAssembler: new PromptAssembler({
        knowledgeRetriever: { retrieve: async () => [] },
        toolRegistry: createToolRegistry([]),
      }),
    });

    const events = await collectStream(orchestrator.stream(baseInput()));

    expect(events).toContainEqual({ type: "status", status: "tool_calls" });
    expect(events).toContainEqual({
      type: "text_final",
      content: "after tools",
    });
  });
});
