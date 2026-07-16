import { describe, expect, it, vi } from "vitest";

import {
  buildGuestMessageFrame,
  buildStreamUrl,
  createMessageId,
  getOrCreateSessionId,
  getSessionStorageKey,
  normalizeApiUrl,
  parseSSEChunk,
  parseWebsiteStreamEvent,
  streamGuestMessage,
  streamGuestMessageWithRetry,
} from "@/src/widget/client";

describe("widget session persistence", () => {
  it("creates and reuses session id per hotel", () => {
    const storage = new Map<string, string>();
    const mockStorage = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
    };

    const first = getOrCreateSessionId("hotel_aurora", mockStorage);
    const second = getOrCreateSessionId("hotel_aurora", mockStorage);
    const otherHotel = getOrCreateSessionId("hotel_other", mockStorage);

    expect(first).toBe(second);
    expect(otherHotel).not.toBe(first);
    expect(getSessionStorageKey("hotel_aurora")).toBe(
      "hotelai:widget:session:hotel_aurora"
    );
  });
});

describe("widget message serialization", () => {
  it("builds guest_message frame with hotel id", () => {
    const frame = buildGuestMessageFrame(
      { hotelId: "hotel_aurora", guestName: "Maria" },
      "sess-1",
      "  Есть парковка? ",
      "msg-1"
    );

    expect(frame).toEqual({
      type: "guest_message",
      session_id: "sess-1",
      message_id: "msg-1",
      guest_name: "Maria",
      body: "Есть парковка?",
      hotel_id: "hotel_aurora",
    });
  });

  it("defaults guest name when omitted", () => {
    const frame = buildGuestMessageFrame(
      { hotelId: "hotel_aurora" },
      "sess-1",
      "Привет"
    );

    expect(frame.guest_name).toBe("Website Guest");
    expect(frame.message_id).toBeTruthy();
  });

  it("normalizes api url and stream endpoint", () => {
    expect(normalizeApiUrl("https://hotelai.example/")).toBe(
      "https://hotelai.example"
    );
    expect(buildStreamUrl("https://hotelai.example")).toBe(
      "https://hotelai.example/api/channels/website/stream"
    );
  });
});

describe("widget stream transport", () => {
  it("parses SSE data lines", () => {
    const chunk =
      'data: {"type":"ack","guest_message_id":"g1","conversation_id":"c1"}\n\n' +
      "data: {\"type\":\"text_delta\",\"delta\":\"Привет\"}\n\n";

    const parsed = parseSSEChunk(chunk);

    expect(parsed.events).toHaveLength(2);
    expect(parsed.events[0]?.type).toBe("ack");
    expect(parsed.events[1]?.type).toBe("text_delta");
  });

  it("ignores done sentinel", () => {
    expect(parseWebsiteStreamEvent("[DONE]")).toBeNull();
  });

  it("streams events from fetch response", async () => {
    const encoder = new TextEncoder();
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            'data: {"type":"text_delta","delta":"Hi"}\n\ndata: [DONE]\n\n'
          )
        );
        controller.close();
      },
    });

    const fetchImpl = vi.fn(async () => ({
      ok: true,
      body,
    })) as unknown as typeof fetch;

    const events: string[] = [];

    await streamGuestMessage({
      apiUrl: "https://hotelai.example",
      frame: buildGuestMessageFrame(
        { hotelId: "hotel_aurora" },
        "sess-1",
        "Hello",
        createMessageId()
      ),
      fetchImpl,
      onEvent: (event) => {
        events.push(event.type);
      },
    });

    expect(fetchImpl).toHaveBeenCalledWith(
      "https://hotelai.example/api/channels/website/stream",
      expect.objectContaining({ method: "POST" })
    );
    expect(events).toEqual(["text_delta"]);
  });

  it("does not retry non-retryable transport errors", async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: false,
      status: 403,
      json: async () => ({ error: "Origin not allowed" }),
    })) as unknown as typeof fetch;

    await expect(
      streamGuestMessageWithRetry({
        apiUrl: "https://hotelai.example",
        frame: buildGuestMessageFrame(
          { hotelId: "hotel_aurora" },
          "sess-1",
          "Hello"
        ),
        fetchImpl,
        onEvent: () => undefined,
        maxAttempts: 3,
      })
    ).rejects.toMatchObject({ status: 403, retryable: false });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});
