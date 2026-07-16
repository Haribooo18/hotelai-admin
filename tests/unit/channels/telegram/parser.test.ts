import { describe, expect, it } from "vitest";

import { parseTelegramUpdate } from "@/lib/channels/telegram/parser";
import type { TelegramUpdate } from "@/lib/channels/telegram/types";

describe("parseTelegramUpdate", () => {
  it("parses a text message from a guest", () => {
    const update: TelegramUpdate = {
      update_id: 42,
      message: {
        message_id: 7,
        date: 1_700_000_000,
        chat: { id: 123456, type: "private", first_name: "Ivan" },
        from: {
          id: 99,
          first_name: "Ivan",
          last_name: "Petrov",
          username: "ivan_p",
        },
        text: "  Есть ли парковка?  ",
      },
    };

    const parsed = parseTelegramUpdate(update);

    expect(parsed).toEqual({
      channel: "telegram",
      externalChatId: "123456",
      externalMessageId: "7",
      guestName: "Ivan Petrov",
      guestUsername: "ivan_p",
      body: "Есть ли парковка?",
      metadata: {
        telegram: {
          update_id: 42,
          chat_id: 123456,
          message_id: 7,
          user_id: 99,
          username: "ivan_p",
        },
      },
    });
  });

  it("returns null for bot messages", () => {
    const parsed = parseTelegramUpdate({
      update_id: 1,
      message: {
        message_id: 1,
        date: 1,
        chat: { id: 1, type: "private" },
        from: { id: 1, first_name: "Bot", is_bot: true },
        text: "hello",
      },
    });

    expect(parsed).toBeNull();
  });

  it("returns null when text is missing", () => {
    const parsed = parseTelegramUpdate({
      update_id: 2,
      message: {
        message_id: 2,
        date: 1,
        chat: { id: 2, type: "private" },
        from: { id: 2, first_name: "Guest" },
      },
    });

    expect(parsed).toBeNull();
  });
});
