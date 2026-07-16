import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { sendTelegramMessage } from "@/lib/channels/telegram/sender";

describe("sendTelegramMessage", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends a message through the Telegram Bot API", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, result: { message_id: 55 } }),
    });

    const result = await sendTelegramMessage(
      { externalChatId: "123", body: "Ответ AI" },
      "test-token"
    );

    expect(result).toEqual({ ok: true, messageId: 55 });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.telegram.org/bottest-token/sendMessage",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ chat_id: "123", text: "Ответ AI" }),
      })
    );
  });

  it("returns an error when the bot token is missing", async () => {
    const result = await sendTelegramMessage(
      { externalChatId: "123", body: "test" },
      ""
    );

    expect(result).toEqual({ ok: false, error: "TELEGRAM_BOT_TOKEN не задан" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns API errors from Telegram", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ ok: false, description: "Bad Request" }),
    });

    const result = await sendTelegramMessage(
      { externalChatId: "bad", body: "test" },
      "token"
    );

    expect(result).toEqual({ ok: false, error: "Bad Request" });
  });
});
