import { describe, expect, it, vi, beforeEach } from "vitest";

import { getGuestTool } from "@/lib/ai/tools/get-guest";
import type { ToolContext } from "@/lib/ai/tools";
import type { AIRequest } from "@/lib/ai/types";

type QueryResult = { data: unknown; error: unknown };

let queryResult: QueryResult = { data: null, error: null };
const eqCalls: Array<[string, unknown]> = [];

function chain() {
  const builder: Record<string, unknown> = {};
  builder.eq = (col: string, val: unknown) => {
    eqCalls.push([col, val]);
    return builder;
  };
  builder.is = () => builder;
  builder.maybeSingle = async () => queryResult;
  return builder;
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: (_table: string) => ({
      select: () => chain(),
    }),
  })),
}));

function makeContext(hotelId = "hotel_test"): ToolContext {
  return {
    hotelId,
    conversationId: "conv-1",
    request: {} as AIRequest,
  };
}

const GUEST_ROW = {
  id: "11111111-1111-4111-8111-111111111111",
  first_name: "Иван",
  last_name: "Иванов",
  email: "ivan@example.com",
  phone: "+79261234567",
  is_vip: true,
  tags: ["постоянный гость"],
};

describe("getGuestTool", () => {
  beforeEach(() => {
    queryResult = { data: null, error: null };
    eqCalls.length = 0;
  });

  it("returns the matching guest scoped by hotel_id when found by phone", async () => {
    queryResult = { data: GUEST_ROW, error: null };

    const result = await getGuestTool.execute(makeContext(), {
      phone: "+79261234567",
    });

    expect(result.output.guest).toMatchObject({
      id: GUEST_ROW.id,
      first_name: "Иван",
      is_vip: true,
    });
    expect(eqCalls).toContainEqual(["hotel_id", "hotel_test"]);
    expect(eqCalls).toContainEqual(["phone", "+79261234567"]);
  });

  it("looks up by email when both email and phone happen to be provided", async () => {
    queryResult = { data: GUEST_ROW, error: null };

    await getGuestTool.execute(makeContext(), {
      email: "ivan@example.com",
      phone: "+79261234567",
    });

    // email takes priority per the tool's own branching (guest_id > email > phone)
    expect(eqCalls).toContainEqual(["email", "ivan@example.com"]);
    expect(eqCalls).not.toContainEqual(["phone", "+79261234567"]);
  });

  it("returns guest: null when no match is found, not an error", async () => {
    queryResult = { data: null, error: null };

    const result = await getGuestTool.execute(makeContext(), {
      phone: "+70000000000",
    });

    expect(result.output.guest).toBeNull();
    expect(result.summary).toBe("Гость не найден");
  });

  it("defaults tags to an empty array when the row has none", async () => {
    queryResult = { data: { ...GUEST_ROW, tags: null }, error: null };

    const result = await getGuestTool.execute(makeContext(), {
      phone: "+79261234567",
    });

    expect((result.output.guest as { tags: string[] }).tags).toEqual([]);
  });

  it("throws when the input has neither guest_id, email, nor phone", async () => {
    await expect(getGuestTool.execute(makeContext(), {})).rejects.toThrow();
  });

  it("propagates a database error instead of silently returning null", async () => {
    queryResult = { data: null, error: new Error("connection reset") };

    await expect(
      getGuestTool.execute(makeContext(), { phone: "+79261234567" })
    ).rejects.toThrow("connection reset");
  });
});
