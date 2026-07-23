import { describe, expect, it, vi, beforeEach } from "vitest";

import { evaluateToolSafety } from "@/lib/ai/tool-safety";
import type { AITool, ToolContext } from "@/lib/ai/tools";
import type { Message } from "@/types/message";
import type { AIRequest } from "@/lib/ai/types";

type QueryResult = { data: unknown; error: unknown };

let selectResult: QueryResult = { data: [], error: null };
const inserted: Record<string, unknown>[] = [];
const updated: Record<string, unknown>[] = [];

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(() => ({
    from: (table: string) => ({
      select: () => ({
        eq: function () {
          return this;
        },
        order: function () {
          return this;
        },
        limit: async () => selectResult,
      }),
      insert: async (row: Record<string, unknown>) => {
        inserted.push({ table, ...row });
        return { error: null };
      },
      update: (row: Record<string, unknown>) => ({
        eq: function () {
          return this;
        },
        // Terminal .eq() resolves the chain — mimic supabase-js by making
        // the last call awaitable.
        then: (resolve: (v: { error: null }) => void) => {
          updated.push({ table, ...row });
          resolve({ error: null });
        },
      }),
    }),
  })),
}));

function guestMessage(body: string, overrides: Partial<Message> = {}): Message {
  return {
    id: "msg-1",
    hotel_id: "hotel_test",
    conversation_id: "conv-1",
    role: "guest",
    body,
    is_internal: false,
    metadata: {},
    deleted_at: null,
    created_at: "2026-07-23T12:00:00.000Z",
    ...overrides,
  };
}

function makeWriteTool(): AITool {
  return {
    definition: { name: "create_booking", description: "Create a booking", parameters: {} },
    risk: "write",
    permission: "bookings:write",
    confirmationSummary: () => "Создать бронирование",
    inputSchema: {} as never,
    outputSchema: {} as never,
    async execute() {
      return { output: { booking_id: "b1" } };
    },
  };
}

function makeContext(messages: Message[]): ToolContext {
  return {
    hotelId: "hotel_test",
    conversationId: "conv-1",
    request: { messages } as unknown as AIRequest,
  };
}

describe("evaluateToolSafety", () => {
  beforeEach(() => {
    selectResult = { data: [], error: null };
    inserted.length = 0;
    updated.length = 0;
  });

  it("executes read-risk tools immediately without any confirmation gate", async () => {
    const readTool: AITool = { ...makeWriteTool(), risk: "read" };
    const decision = await evaluateToolSafety(readTool, makeContext([]), {});
    expect(decision.kind).toBe("execute");
  });

  it("requires confirmation the first time a write tool is called", async () => {
    const decision = await evaluateToolSafety(
      makeWriteTool(),
      makeContext([guestMessage("Хочу забронировать")]),
      { room_id: "r1" }
    );

    expect(decision.kind).toBe("require_confirmation");
    expect(inserted).toHaveLength(1);
    expect(inserted[0]).toMatchObject({ table: "ai_actions", status: "pending" });
  });

  const AFFIRMATIVE_CASES = [
    "Да",
    "да.",
    "ок",
    "окей",
    "Подтверждаю",
    "yes",
    "Yes!",
    "ok",
    "okay",
    "sure",
    "confirm",
    "так", // Ukrainian
    "sí", // Spanish
    "sim", // Portuguese
    "oui", // French
    "ja", // German
  ];

  it.each(AFFIRMATIVE_CASES)(
    "executes the pending action when the guest confirms with %j",
    async (body) => {
      const pendingAction = {
        id: "action-1",
        input: {
          arguments: { room_id: "r1" },
          fingerprint: expect.any(String),
          trigger_message_id: null,
        },
        output: null,
        status: "pending",
        created_at: "2026-07-23T11:59:00.000Z",
      };

      const tool = makeWriteTool();
      const args = { room_id: "r1" };

      // First call establishes the fingerprint deterministically so the
      // "pending" fixture below actually matches on the second call.
      const first = await evaluateToolSafety(tool, makeContext([guestMessage("book it")]), args);
      expect(first.kind).toBe("require_confirmation");
      const fingerprint = (inserted[0]!.input as { fingerprint: string }).fingerprint;

      selectResult = {
        data: [{ ...pendingAction, input: { ...pendingAction.input, fingerprint } }],
        error: null,
      };

      const second = await evaluateToolSafety(
        tool,
        makeContext([guestMessage("book it", { id: "msg-earlier", created_at: "2026-07-23T11:58:00.000Z" }), guestMessage(body, { id: "msg-confirm", created_at: "2026-07-23T12:00:00.000Z" })]),
        args
      );

      expect(second.kind).toBe("execute");
    }
  );

  const NEGATIVE_CASES = ["Нет", "нет.", "отмена", "no", "cancel", "nope", "ні", "non", "nein"];

  it.each(NEGATIVE_CASES)("declines the pending action when the guest says %j", async (body) => {
    const tool = makeWriteTool();
    const args = { room_id: "r1" };

    const first = await evaluateToolSafety(tool, makeContext([guestMessage("book it")]), args);
    const fingerprint = (inserted[0]!.input as { fingerprint: string }).fingerprint;

    selectResult = {
      data: [
        {
          id: "action-1",
          input: { arguments: args, fingerprint, trigger_message_id: null },
          output: null,
          status: "pending",
          created_at: "2026-07-23T11:59:00.000Z",
        },
      ],
      error: null,
    };

    const second = await evaluateToolSafety(
      tool,
      makeContext([
        guestMessage("book it", { id: "msg-earlier", created_at: "2026-07-23T11:58:00.000Z" }),
        guestMessage(body, { id: "msg-decline", created_at: "2026-07-23T12:00:00.000Z" }),
      ]),
      args
    );

    expect(second.kind).toBe("declined");
  });

  it("does not treat an ambiguous reply as confirmation — stays pending, does not execute", async () => {
    const tool = makeWriteTool();
    const args = { room_id: "r1" };

    const first = await evaluateToolSafety(tool, makeContext([guestMessage("book it")]), args);
    const fingerprint = (inserted[0]!.input as { fingerprint: string }).fingerprint;

    selectResult = {
      data: [
        {
          id: "action-1",
          input: { arguments: args, fingerprint, trigger_message_id: null },
          output: null,
          status: "pending",
          created_at: "2026-07-23T11:59:00.000Z",
        },
      ],
      error: null,
    };

    const second = await evaluateToolSafety(
      tool,
      makeContext([
        guestMessage("book it", { id: "msg-earlier", created_at: "2026-07-23T11:58:00.000Z" }),
        guestMessage("а сколько будет стоить?", { id: "msg-ambiguous", created_at: "2026-07-23T12:00:00.000Z" }),
      ]),
      args
    );

    expect(second.kind).toBe("require_confirmation");
  });

  it("does not match a confirmation word buried inside a longer sentence", async () => {
    // Intentional strictness check: "да" appearing mid-sentence must not
    // greenlight a real booking — see the comment above AFFIRMATIVE in
    // tool-safety.ts for why this is a deliberate design choice, not a gap.
    const tool = makeWriteTool();
    const args = { room_id: "r1" };

    const first = await evaluateToolSafety(tool, makeContext([guestMessage("book it")]), args);
    const fingerprint = (inserted[0]!.input as { fingerprint: string }).fingerprint;

    selectResult = {
      data: [
        {
          id: "action-1",
          input: { arguments: args, fingerprint, trigger_message_id: null },
          output: null,
          status: "pending",
          created_at: "2026-07-23T11:59:00.000Z",
        },
      ],
      error: null,
    };

    const second = await evaluateToolSafety(
      tool,
      makeContext([
        guestMessage("book it", { id: "msg-earlier", created_at: "2026-07-23T11:58:00.000Z" }),
        guestMessage("да, а можно ещё узнать про завтрак?", {
          id: "msg-mixed",
          created_at: "2026-07-23T12:00:00.000Z",
        }),
      ]),
      args
    );

    expect(second.kind).toBe("require_confirmation");
  });
});
