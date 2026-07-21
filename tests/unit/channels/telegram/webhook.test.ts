import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ChannelInboundMessage } from "@/lib/channels/types";
import {
  createTelegramConversation,
  findOrCreateTelegramConversation,
  findTelegramConversation,
  insertTelegramGuestMessage,
  getTelegramHotelId,
  processTelegramUpdate,
  validateWebhookSecret,
} from "@/lib/channels/telegram/webhook";

type QueryResult = { data: unknown; error: unknown };

const queryResults: Record<string, QueryResult> = {};
const insertMock = vi.fn();
const updateMock = vi.fn();
const generateAIResponseForHotelMock = vi.fn();
const sendTelegramMock = vi.fn();

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
  generateAIResponseForHotel: (...args: unknown[]) =>
    generateAIResponseForHotelMock(...args),
}));

vi.mock("@/lib/channels/telegram/sender", () => ({
  sendTelegramMessage: (...args: unknown[]) => sendTelegramMock(...args),
  getTelegramBotToken: () => "test-token",
}));

const inbound: ChannelInboundMessage = {
  channel: "telegram",
  externalChatId: "9001",
  externalMessageId: "15",
  guestName: "Anna Guest",
  guestUsername: "anna_g",
  body: "Нужен поздний выезд",
  metadata: { telegram: { chat_id: 9001, message_id: 15 } },
};

describe("validateWebhookSecret", () => {
  it("accepts matching secrets", () => {
    expect(validateWebhookSecret("secret-1", "secret-1")).toBe(true);
  });

  it("rejects missing or mismatched secrets", () => {
    expect(validateWebhookSecret(null, "secret-1")).toBe(false);
    expect(validateWebhookSecret("wrong", "secret-1")).toBe(false);
    expect(validateWebhookSecret("secret-1", undefined)).toBe(false);
  });
});

describe("getTelegramHotelId", () => {
  it("requires an explicit Telegram hotel configuration", () => {
    vi.stubEnv("TELEGRAM_HOTEL_ID", "");
    vi.stubEnv("DEFAULT_HOTEL_ID", "fallback-must-not-be-used");

    expect(() => getTelegramHotelId()).toThrow(
      "TELEGRAM_HOTEL_ID is not configured"
    );
  });
});

describe("Telegram conversation lifecycle", () => {
  beforeEach(() => {
    for (const k of Object.keys(queryResults)) delete queryResults[k];
    insertMock.mockReset();
    updateMock.mockReset();
    generateAIResponseForHotelMock.mockReset();
    sendTelegramMock.mockReset();
  });

  it("reuses an existing telegram conversation", async () => {
    queryResults[key("conversations", "select")] = {
      data: {
        id: "conv-existing",
        hotel_id: "hotel_test",
        guest_name: "Anna Guest",
        guest_phone: "9001",
        channel: "telegram",
      },
      error: null,
    };

    const result = await findOrCreateTelegramConversation("hotel_test", inbound);

    expect(result.created).toBe(false);
    expect(result.conversation.id).toBe("conv-existing");
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("creates a conversation when none exists", async () => {
    queryResults[key("conversations", "insert")] = {
      data: {
        id: "conv-new",
        hotel_id: "hotel_test",
        guest_name: inbound.guestName,
        guest_phone: inbound.externalChatId,
        channel: "telegram",
      },
      error: null,
    };

    const created = await createTelegramConversation("hotel_test", inbound);
    expect(created.id).toBe("conv-new");
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        table: "conversations",
        data: expect.objectContaining({
          hotel_id: "hotel_test",
          channel: "telegram",
          guest_phone: "9001",
        }),
      })
    );
  });

  it("inserts a guest message scoped by hotel_id", async () => {
    queryResults[key("messages", "insert")] = {
      data: { id: "msg-1", created_at: "2026-07-04T12:00:00.000Z" },
      error: null,
    };

    const messageId = await insertTelegramGuestMessage(
      "hotel_test",
      "conv-1",
      inbound
    );

    expect(messageId).toEqual({ messageId: "msg-1", duplicate: false });
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


  it("treats a duplicate Telegram message as already processed", async () => {
    queryResults[key("messages", "insert")] = {
      data: null,
      error: { code: "23505" },
    };

    const result = await insertTelegramGuestMessage(
      "hotel_test",
      "conv-1",
      inbound
    );

    expect(result).toEqual({ messageId: null, duplicate: true });
    expect(updateMock).not.toHaveBeenCalled();
  });

});

describe("processTelegramUpdate", () => {
  beforeEach(() => {
    for (const k of Object.keys(queryResults)) delete queryResults[k];
    insertMock.mockReset();
    updateMock.mockReset();
    generateAIResponseForHotelMock.mockReset();
    sendTelegramMock.mockReset();
    vi.stubEnv("TELEGRAM_HOTEL_ID", "hotel_test");
    vi.stubEnv("DEFAULT_HOTEL_ID", "hotel_test");
  });

  it("handles inbound message, triggers tenant AI service, and sends telegram reply", async () => {
    queryResults[key("conversations", "select")] = {
      data: {
        id: "conv-new",
        hotel_id: "hotel_test",
        guest_name: "Anna Guest",
        guest_phone: "9001",
        channel: "telegram",
      },
      error: null,
    };
    queryResults[key("messages", "insert")] = {
      data: { id: "msg-guest", created_at: "2026-07-04T12:00:00.000Z" },
      error: null,
    };

    generateAIResponseForHotelMock.mockResolvedValue({
      messageId: "msg-ai",
      content: "Да, парковка бесплатная.",
    });
    sendTelegramMock.mockResolvedValue({ ok: true, messageId: 88 });

    const result = await processTelegramUpdate({
      update_id: 10,
      message: {
        message_id: 15,
        date: 1,
        chat: { id: 9001, type: "private" },
        from: { id: 3, first_name: "Anna", username: "anna_g" },
        text: "Есть парковка?",
      },
    });

    expect(result).toEqual({ handled: true });
    expect(generateAIResponseForHotelMock).toHaveBeenCalledWith(
      "hotel_test",
      "conv-new",
      { messageMetadata: { channel: "telegram" } }
    );
    expect(sendTelegramMock).toHaveBeenCalledWith({
      externalChatId: "9001",
      body: "Да, парковка бесплатная.",
    });
  });

  it("returns ai_disabled when tenant AI service skips response", async () => {
    queryResults[key("conversations", "select")] = {
      data: {
        id: "conv-new",
        hotel_id: "hotel_test",
        guest_phone: "9001",
        channel: "telegram",
      },
      error: null,
    };
    queryResults[key("messages", "insert")] = {
      data: { id: "msg-guest", created_at: "2026-07-04T12:00:00.000Z" },
      error: null,
    };

    generateAIResponseForHotelMock.mockResolvedValue(null);

    const result = await processTelegramUpdate({
      update_id: 11,
      message: {
        message_id: 16,
        date: 1,
        chat: { id: 9001, type: "private" },
        from: { id: 3, first_name: "Anna" },
        text: "Привет",
      },
    });

    expect(result).toEqual({ handled: true, reason: "ai_disabled" });
    expect(sendTelegramMock).not.toHaveBeenCalled();
  });
});

describe("findTelegramConversation", () => {
  beforeEach(() => {
    for (const k of Object.keys(queryResults)) delete queryResults[k];
  });

  it("looks up conversations by hotel_id and telegram chat id", async () => {
    queryResults[key("conversations", "select")] = {
      data: { id: "conv-lookup", hotel_id: "hotel_test", channel: "telegram" },
      error: null,
    };

    const conversation = await findTelegramConversation("hotel_test", "9001");
    expect(conversation?.id).toBe("conv-lookup");
  });
});
