import { describe, expect, it } from "vitest";

import { ContextBuilder } from "@/lib/ai/context-builder";
import { ConversationMemory } from "@/lib/ai/conversation-memory";
import { detectLanguage } from "@/lib/ai/language";
import { makeConversation, makeMessage, TEST_HOTEL } from "../../helpers/fixtures";

describe("AI context quality", () => {
  it("detects the latest guest language with a fallback", () => {
    expect(detectLanguage("Hello, is a room available?", "ru")).toBe("en");
    expect(detectLanguage("Доброго дня, чи є вільний номер?", "ru")).toBe("uk");
    expect(detectLanguage("Здравствуйте, нужен номер", "en")).toBe("ru");
  });

  it("does not expose hotel ids or guest contact details in the prompt context", () => {
    const context = new ContextBuilder().build({
      hotel: { ...TEST_HOTEL, timezone: "Europe/Kyiv", language: "uk" },
      conversation: {
        ...makeConversation(),
        guest_email: "guest@example.com",
        guest_phone: "+380000000000",
      },
      messages: [makeMessage({ role: "guest", body: "Привет" })],
      knowledge: [],
      tools: [],
      now: new Date("2026-07-18T12:00:00Z"),
    });

    expect(context.hotelProfile).not.toContain(TEST_HOTEL.id);
    expect(context.guestInfo).not.toContain("guest@example.com");
    expect(context.guestInfo).not.toContain("+380000000000");
    expect(context.dateContext).toContain("Europe/Kyiv");
  });

  it("keeps the newest part of an oversized message", () => {
    const memory = new ConversationMemory();
    const marker = "LATEST_DETAILS";
    const formatted = memory.format(
      [makeMessage({ role: "guest", body: `${"x".repeat(5000)}${marker}` })],
      { maxChars: 100, maxMessageChars: 100 },
    );

    expect(formatted).toHaveLength(1);
    expect(formatted[0]?.body).toContain(marker);
    expect(formatted[0]?.body.length).toBeLessThanOrEqual(100);
  });
});
