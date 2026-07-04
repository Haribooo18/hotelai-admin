import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ChannelInboundMessage } from "@/lib/channels/types";
import {
  __resetWebsiteStreamsForTests,
  cleanupWebsiteStream,
  findOrCreateWebsiteConversation,
  findWebsiteConversation,
  handleWebsiteStream,
  insertWebsiteGuestMessage,
  processWebsiteGuestMessage,
  registerWebsiteConnection,
} from "@/lib/channels/website/stream";

type QueryResult = { data: unknown; error: unknown };

const queryResults: Record<string, QueryResult> = {};
const insertMock = vi.fn();
const updateMock = vi.fn();
const streamAIResponseForHotelMock = vi.fn();

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

vi.mock("@/lib/services/tenant-ai.service", () => ({
  streamAIResponseForHotel: (...args: unknown[]) =>
    streamAIResponseForHotelMock(...args),
}));

const inbound: ChannelInboundMessage = {
  channel: "website",
  externalChatId: "sess-1",
  externalMessageId: "msg-1",
  guestName: "Website Guest",
  guestUsername: null,
  body: "Есть ли завтрак?",
  metadata: {
    website: {
      session_id: "sess-1",
      message_id: "msg-1",
      guest_email: null,
    },
  },
};

const guestFrame = {
  type: "guest_message" as const,
  session_id: "sess-1",
  message_id: "msg-1",
  guest_name: "Website Guest",
  body: "Есть ли завтрак?",
  hotel_id: "hotel_test",
};

describe("website connection lifecycle", () => {
  beforeEach(() => {
    __resetWebsiteStreamsForTests();
    for (const k of Object.keys(queryResults)) delete queryResults[k];
    insertMock.mockReset();
    updateMock.mockReset();
    streamAIResponseForHotelMock.mockReset();
    vi.stubEnv("WEBSITE_CHAT_HOTEL_ID", "hotel_test");
    vi.stubEnv("DEFAULT_HOTEL_ID", "hotel_test");
  });

  it("registers and reuses connection state per session", () => {
    const first = registerWebsiteConnection("sess-1", "hotel_test");
    const second = registerWebsiteConnection("sess-1", "hotel_test");

    expect(second).toBe(first);
    expect(first.sessionId).toBe("sess-1");
    expect(first.hotelId).toBe("hotel_test");
  });

  it("cleans up typing state and removes connection on disconnect", async () => {
    const state = registerWebsiteConnection("sess-1", "hotel_test");
    state.conversationId = "conv-1";

    await cleanupWebsiteStream("sess-1");

    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        table: "conversations",
        data: { is_ai_typing: false },
      })
    );
    expect(registerWebsiteConnection("sess-1", "hotel_test").conversationId).toBeNull();
  });
});

describe("website conversation lifecycle", () => {
  beforeEach(() => {
    __resetWebsiteStreamsForTests();
    for (const k of Object.keys(queryResults)) delete queryResults[k];
    insertMock.mockReset();
    updateMock.mockReset();
  });

  it("reuses an existing website conversation by session id", async () => {
    queryResults[key("conversations", "select")] = {
      data: {
        id: "conv-existing",
        hotel_id: "hotel_test",
        guest_phone: "sess-1",
        channel: "website",
      },
      error: null,
    };

    const result = await findOrCreateWebsiteConversation("hotel_test", inbound);

    expect(result.created).toBe(false);
    expect(result.conversation.id).toBe("conv-existing");
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("inserts guest messages scoped by hotel_id", async () => {
    queryResults[key("messages", "insert")] = {
      data: { id: "msg-guest", created_at: "2026-07-04T12:00:00.000Z" },
      error: null,
    };

    const messageId = await insertWebsiteGuestMessage(
      "hotel_test",
      "conv-1",
      inbound
    );

    expect(messageId).toBe("msg-guest");
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        table: "messages",
        data: expect.objectContaining({
          hotel_id: "hotel_test",
          conversation_id: "conv-1",
          role: "guest",
        }),
      })
    );
  });

  it("looks up conversations by hotel_id and website session id", async () => {
    queryResults[key("conversations", "select")] = {
      data: { id: "conv-lookup", hotel_id: "hotel_test", channel: "website" },
      error: null,
    };

    const conversation = await findWebsiteConversation("hotel_test", "sess-1");
    expect(conversation?.id).toBe("conv-lookup");
  });
});

describe("processWebsiteGuestMessage", () => {
  beforeEach(() => {
    __resetWebsiteStreamsForTests();
    for (const k of Object.keys(queryResults)) delete queryResults[k];
    insertMock.mockReset();
    updateMock.mockReset();
    streamAIResponseForHotelMock.mockReset();
    vi.stubEnv("WEBSITE_CHAT_HOTEL_ID", "hotel_test");
    vi.stubEnv("DEFAULT_HOTEL_ID", "hotel_test");
  });

  it("acks guest message, streams AI events, and maps outbound frames", async () => {
    queryResults[key("conversations", "select")] = {
      data: {
        id: "conv-1",
        hotel_id: "hotel_test",
        guest_phone: "sess-1",
        channel: "website",
      },
      error: null,
    };
    queryResults[key("messages", "insert")] = {
      data: { id: "msg-guest", created_at: "2026-07-04T12:00:00.000Z" },
      error: null,
    };

    async function* streamEvents() {
      yield { type: "status" as const, status: "ai_answering" as const };
      yield { type: "text_delta" as const, delta: "Да, " };
      yield { type: "text_final" as const, content: "Да, завтрак включён." };
      yield { type: "done" as const, messageId: "msg-ai" };
    }

    streamAIResponseForHotelMock.mockReturnValue(streamEvents());

    const events: unknown[] = [];
    await processWebsiteGuestMessage(guestFrame, (event) => events.push(event));

    expect(streamAIResponseForHotelMock).toHaveBeenCalledWith(
      "hotel_test",
      "conv-1",
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
    expect(events).toEqual([
      {
        type: "ack",
        guest_message_id: "msg-guest",
        conversation_id: "conv-1",
      },
      { type: "status", status: "ai_answering" },
      { type: "text_delta", delta: "Да, " },
      { type: "text_final", content: "Да, завтрак включён." },
      { type: "done", message_id: "msg-ai" },
    ]);
  });

  it("emits ai_disabled when stream yields no events", async () => {
    queryResults[key("conversations", "select")] = {
      data: {
        id: "conv-1",
        hotel_id: "hotel_test",
        guest_phone: "sess-1",
        channel: "website",
      },
      error: null,
    };
    queryResults[key("messages", "insert")] = {
      data: { id: "msg-guest", created_at: "2026-07-04T12:00:00.000Z" },
      error: null,
    };

    async function* emptyStream() {
      return;
    }

    streamAIResponseForHotelMock.mockReturnValue(emptyStream());

    const events: unknown[] = [];
    await processWebsiteGuestMessage(guestFrame, (event) => events.push(event));

    expect(events).toContainEqual({ type: "ai_disabled" });
  });
});

describe("handleWebsiteStream", () => {
  beforeEach(() => {
    __resetWebsiteStreamsForTests();
    for (const k of Object.keys(queryResults)) delete queryResults[k];
    insertMock.mockReset();
    updateMock.mockReset();
    streamAIResponseForHotelMock.mockReset();
    vi.stubEnv("WEBSITE_CHAT_HOTEL_ID", "hotel_test");
    vi.stubEnv("DEFAULT_HOTEL_ID", "hotel_test");
  });

  it("surfaces processing errors to the widget", async () => {
    queryResults[key("conversations", "select")] = {
      data: null,
      error: new Error("db down"),
    };

    const events: unknown[] = [];
    await handleWebsiteStream(guestFrame, (event) => events.push(event));

    expect(events).toEqual([{ type: "error", message: "Ошибка обработки" }]);
  });
});
