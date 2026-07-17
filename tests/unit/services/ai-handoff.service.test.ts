import { describe, expect, it } from "vitest";

import { requestAIHumanHandoff } from "@/lib/services/ai-handoff.service";

function createSupabaseMock(conversation: Record<string, unknown> | null) {
  const updates: Array<Record<string, unknown>> = [];
  const inserts: Array<{ table: string; data: Record<string, unknown> }> = [];
  const client = {
    from(table: string) {
      return {
        select() {
          const builder: Record<string, unknown> = {};
          builder.eq = () => builder;
          builder.is = () => builder;
          builder.maybeSingle = async () => ({ data: conversation, error: null });
          return builder;
        },
        update(data: Record<string, unknown>) {
          updates.push(data);
          const result = { data: null, error: null };
          const builder: Record<string, unknown> = {};
          builder.eq = () => builder;
          builder.not = () => builder;
          builder.then = (resolve: (value: typeof result) => void) => resolve(result);
          return builder;
        },
        insert(data: Record<string, unknown>) {
          inserts.push({ table, data });
          return Promise.resolve({ data: null, error: null });
        },
      };
    },
  };
  return { client, updates, inserts };
}

describe("requestAIHumanHandoff", () => {
  it("moves an active conversation to the handoff queue and writes audit records", async () => {
    const { client, updates, inserts } = createSupabaseMock({
      id: "00000000-0000-0000-0000-000000000001",
      status: "ai_answering",
      priority: "normal",
      internal_notes: "Existing note",
    });
    const result = await requestAIHumanHandoff(client as never, {
      hotelId: "00000000-0000-0000-0000-000000000010",
      conversationId: "00000000-0000-0000-0000-000000000001",
      reason: "Guest explicitly asked for a manager",
      urgency: "urgent",
      guestMessage: "Позовите менеджера",
    });
    expect(result).toMatchObject({
      handoff_requested: true,
      status: "handoff_requested",
      priority: "urgent",
      already_requested: false,
    });
    expect(updates).toContainEqual(expect.objectContaining({
      status: "handoff_requested",
      priority: "urgent",
      assigned_to: null,
      is_ai_typing: false,
    }));
    expect(inserts.map((row) => row.table)).toEqual(["ai_actions", "messages"]);
  });

  it("is idempotent when handoff was already requested", async () => {
    const { client, updates, inserts } = createSupabaseMock({
      id: "00000000-0000-0000-0000-000000000001",
      status: "handoff_requested",
      priority: "high",
      internal_notes: null,
    });
    const result = await requestAIHumanHandoff(client as never, {
      hotelId: "00000000-0000-0000-0000-000000000010",
      conversationId: "00000000-0000-0000-0000-000000000001",
      reason: "Repeated request",
      urgency: "urgent",
    });
    expect(result.already_requested).toBe(true);
    expect(result.priority).toBe("high");
    expect(updates).toEqual([]);
    expect(inserts).toEqual([]);
  });

  it("rejects handoff for a closed conversation", async () => {
    const { client } = createSupabaseMock({
      id: "00000000-0000-0000-0000-000000000001",
      status: "resolved",
      priority: "normal",
      internal_notes: null,
    });
    await expect(requestAIHumanHandoff(client as never, {
      hotelId: "00000000-0000-0000-0000-000000000010",
      conversationId: "00000000-0000-0000-0000-000000000001",
      reason: "Need a person",
      urgency: "high",
    })).rejects.toThrow("Нельзя передать закрытый диалог");
  });
});
