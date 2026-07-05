"use client";

type StreamCallbacks = {
  onDelta?: (text: string) => void;
  onError?: (message: string) => void;
};

export async function streamAIConversation(
  conversationId: string,
  callbacks: StreamCallbacks = {}
): Promise<void> {
  const res = await fetch("/api/ai/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversation_id: conversationId }),
  });

  if (!res.ok || !res.body) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "AI error");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let accumulated = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;

      const payload = line.slice(6).trim();
      if (payload === "[DONE]") continue;

      try {
        const event = JSON.parse(payload) as {
          type: string;
          delta?: string;
          content?: string;
          message?: string;
        };

        if (event.type === "text_delta" && event.delta) {
          accumulated += event.delta;
          callbacks.onDelta?.(accumulated);
        }

        if (event.type === "text_final" && event.content) {
          accumulated = event.content;
          callbacks.onDelta?.(accumulated);
        }

        if (event.type === "error") {
          const message = event.message ?? "AI error";
          callbacks.onError?.(message);
          throw new Error(message);
        }
      } catch (error) {
        if (error instanceof SyntaxError) continue;
        throw error;
      }
    }
  }
}
