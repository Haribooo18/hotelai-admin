import type { Message } from "@/types/message";

export type MemoryOptions = {
  /** Max messages to include in context window. */
  maxMessages?: number;
  /** Max total characters across included messages. */
  maxChars?: number;
  /** Max characters for a single message. */
  maxMessageChars?: number;
};

const DEFAULT_MAX_MESSAGES = 30;
const DEFAULT_MAX_CHARS = 10_000;
const DEFAULT_MAX_MESSAGE_CHARS = 2_500;

/**
 * Formats and truncates conversation history for AI context.
 * The newest messages are always preferred and oversized messages are clipped
 * instead of causing all earlier context to disappear.
 */
export class ConversationMemory {
  format(messages: Message[], options: MemoryOptions = {}): Message[] {
    const maxMessages = options.maxMessages ?? DEFAULT_MAX_MESSAGES;
    const maxChars = options.maxChars ?? DEFAULT_MAX_CHARS;
    const maxMessageChars = options.maxMessageChars ?? DEFAULT_MAX_MESSAGE_CHARS;

    const visible = messages
      .filter((message) => !message.is_internal && !message.deleted_at)
      .slice(-maxMessages);

    let total = 0;
    const trimmed: Message[] = [];

    for (let index = visible.length - 1; index >= 0; index--) {
      const message = visible[index];
      if (!message) continue;

      const body = clipMessage(message.body, maxMessageChars);
      const remaining = maxChars - total;
      if (remaining <= 0) break;

      const boundedBody = body.length > remaining
        ? clipMessage(body, remaining)
        : body;

      if (!boundedBody) break;
      total += boundedBody.length;
      trimmed.unshift({ ...message, body: boundedBody });
    }

    return trimmed;
  }

  toTranscript(messages: Message[]): string {
    return this.format(messages)
      .map((message) => {
        const role =
          message.role === "guest"
            ? "Гость"
            : message.role === "ai"
              ? "AI-ассистент"
              : message.role === "staff"
                ? "Сотрудник отеля"
                : "Система";
        return `${role}: ${message.body}`;
      })
      .join("\n");
  }
}

function clipMessage(value: string, limit: number): string {
  if (limit <= 0) return "";
  const normalized = value.trim();
  if (normalized.length <= limit) return normalized;
  if (limit < 40) return normalized.slice(-limit);
  return `…${normalized.slice(-(limit - 1))}`;
}

export const defaultConversationMemory = new ConversationMemory();
