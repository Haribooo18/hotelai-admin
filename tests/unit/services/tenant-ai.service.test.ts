import { beforeEach, describe, expect, it, vi } from "vitest";

import { generateAIResponseForHotel, streamAIResponseForHotel } from "@/lib/services/tenant-ai.service";

type QueryResult = { data: unknown; error: unknown };

const queryResults: Record<string, QueryResult> = {};
const insertMock = vi.fn();
const updateMock = vi.fn();
const orchestratorRunMock = vi.fn();
const orchestratorStreamMock = vi.fn();

function key(table: string, action: string) {
  return `${table}:${action}`;
}

function chain(result: QueryResult) {
  const builder: Record<string, unknown> = {};
  const terminal = async () => result;
  builder.eq = () => builder;
  builder.is = () => builder;
  builder.order = terminal;
  builder.maybeSingle = terminal;
  builder.single = terminal;
  builder.then = (resolve: (v: QueryResult) => void) => resolve(result);
  return builder;
}

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(() => ({
    from: (table: string) => ({
      select: () =>
        chain(queryResults[key(table, "select")] ?? { data: null, error: null }),
      insert: (data: unknown) => {
        insertMock({ table, data });
        return {
          select: () => ({
            single: async () =>
              queryResults[key(table, "insert")] ?? { data: null, error: null },
          }),
        };
      },
      update: (data: unknown) => {
        updateMock({ table, data });
        return chain({ data: null, error: null });
      },
    }),
  })),
}));

vi.mock("@/lib/ai/orchestrator", () => ({
  aiOrchestrator: {
    run: (...args: unknown[]) => orchestratorRunMock(...args),
    stream: (...args: unknown[]) => orchestratorStreamMock(...args),
  },
}));

describe("generateAIResponseForHotel", () => {
  beforeEach(() => {
    for (const k of Object.keys(queryResults)) delete queryResults[k];
    insertMock.mockReset();
    updateMock.mockReset();
    orchestratorRunMock.mockReset();
    orchestratorStreamMock.mockReset();
  });

  it("runs the existing orchestrator and persists the AI reply", async () => {
    queryResults[key("hotel_ai_settings", "select")] = {
      data: {
        hotel_id: "hotel_test",
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
      error: null,
    };
    queryResults[key("hotels", "select")] = {
      data: { name: "Test Hotel" },
      error: null,
    };
    queryResults[key("conversations", "select")] = {
      data: {
        id: "conv-1",
        hotel_id: "hotel_test",
        guest_name: "Anna Guest",
        channel: "telegram",
      },
      error: null,
    };
    queryResults[key("messages", "select")] = {
      data: [
        {
          id: "msg-guest",
          hotel_id: "hotel_test",
          conversation_id: "conv-1",
          role: "guest",
          body: "Вопрос",
          is_internal: false,
          metadata: {},
          deleted_at: null,
          created_at: "2026-07-04T12:00:00.000Z",
        },
      ],
      error: null,
    };
    queryResults[key("messages", "insert")] = {
      data: { id: "msg-ai", created_at: "2026-07-04T12:01:00.000Z" },
      error: null,
    };

    orchestratorRunMock.mockResolvedValue({
      content: "Поздний выезд возможен до 14:00.",
      model: "gpt-4o-mini",
      usage: { input_tokens: 1, output_tokens: 2, total_tokens: 3 },
      costUsd: 0.001,
      toolRounds: 0,
    });

    const result = await generateAIResponseForHotel("hotel_test", "conv-1", {
      messageMetadata: { channel: "telegram" },
    });

    expect(result).toEqual({
      messageId: "msg-ai",
      content: "Поздний выезд возможен до 14:00.",
    });
    expect(orchestratorRunMock).toHaveBeenCalledOnce();
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        table: "messages",
        data: expect.objectContaining({
          role: "ai",
          hotel_id: "hotel_test",
          metadata: expect.objectContaining({ channel: "telegram" }),
        }),
      })
    );

    const typingOn = updateMock.mock.calls.filter(([arg]) => {
      const row = arg as { table: string; data: Record<string, unknown> };
      return row.table === "conversations" && row.data.is_ai_typing === true;
    });
    const statusAnswering = updateMock.mock.calls.filter(([arg]) => {
      const row = arg as { table: string; data: Record<string, unknown> };
      return row.table === "conversations" && row.data.status === "ai_answering";
    });
    expect(typingOn.length).toBeGreaterThan(0);
    expect(statusAnswering.length).toBeGreaterThan(0);
  });

  it("skips AI when hotel settings are disabled", async () => {
    queryResults[key("hotel_ai_settings", "select")] = {
      data: null,
      error: null,
    };

    const result = await generateAIResponseForHotel("hotel_test", "conv-1");
    expect(result).toBeNull();
    expect(orchestratorRunMock).not.toHaveBeenCalled();
  });

  it("throws when AI is disabled and throwIfDisabled is set", async () => {
    queryResults[key("hotel_ai_settings", "select")] = {
      data: null,
      error: null,
    };

    await expect(
      generateAIResponseForHotel("hotel_test", "conv-1", {
        throwIfDisabled: true,
      })
    ).rejects.toThrow("AI-ресепшн отключён");
  });
});

describe("streamAIResponseForHotel", () => {
  beforeEach(() => {
    for (const k of Object.keys(queryResults)) delete queryResults[k];
    orchestratorStreamMock.mockReset();
  });

  it("delegates to aiOrchestrator.stream with hotel-scoped context", async () => {
    queryResults[key("hotel_ai_settings", "select")] = {
      data: {
        hotel_id: "hotel_test",
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
      error: null,
    };
    queryResults[key("hotels", "select")] = {
      data: { name: "Test Hotel" },
      error: null,
    };
    queryResults[key("conversations", "select")] = {
      data: {
        id: "conv-1",
        hotel_id: "hotel_test",
        guest_name: "Website Guest",
        channel: "website",
      },
      error: null,
    };
    queryResults[key("messages", "select")] = {
      data: [
        {
          id: "msg-guest",
          hotel_id: "hotel_test",
          conversation_id: "conv-1",
          role: "guest",
          body: "Вопрос",
          is_internal: false,
          metadata: {},
          deleted_at: null,
          created_at: "2026-07-04T12:00:00.000Z",
        },
      ],
      error: null,
    };

    async function* streamEvents() {
      yield { type: "text_delta" as const, delta: "Ответ" };
      yield { type: "done" as const, messageId: "msg-ai" };
    }

    orchestratorStreamMock.mockReturnValue(streamEvents());

    const events = [];
    for await (const event of streamAIResponseForHotel("hotel_test", "conv-1")) {
      events.push(event);
    }

    expect(events).toHaveLength(2);
    expect(orchestratorStreamMock).toHaveBeenCalledWith(
      expect.objectContaining({
        hotel: expect.objectContaining({ id: "hotel_test", name: "Test Hotel" }),
        conversation: expect.objectContaining({ id: "conv-1" }),
      })
    );
  });

  it("yields nothing when AI is disabled", async () => {
    queryResults[key("hotel_ai_settings", "select")] = {
      data: null,
      error: null,
    };

    const events = [];
    for await (const event of streamAIResponseForHotel("hotel_test", "conv-1")) {
      events.push(event);
    }

    expect(events).toEqual([]);
    expect(orchestratorStreamMock).not.toHaveBeenCalled();
  });
});
