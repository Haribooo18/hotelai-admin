import type { Message } from "@/types/message";

export type MemoryOptions = {
  /** Max messages to include in context window. */
  maxMessages?: number;
  /** Max total characters across included messages. */
  maxChars?: number;
};

const DEFAULT_MAX_MESSAGES = 40;
const DEFAULT_MAX_CHARS = 12_000;

/**
 * Formats and truncates conversation history for AI context.
 */
export class ConversationMemory {
  format(messages: Message[], options: MemoryOptions = {}): Message[] {
    const maxMessages = options.maxMessages ?? DEFAULT_MAX_MESSAGES;
    const maxChars = options.maxChars ?? DEFAULT_MAX_CHARS;

    const visible = messages
      .filter((m) => !m.is_internal && !m.deleted_at)
      .slice(-maxMessages);

    let total = 0;
    const trimmed: Message[] = [];

    for (let i = visible.length - 1; i >= 0; i--) {
      const msg = visible[i];
      const len = msg.body.length;
      if (total + len > maxChars) break;
      total += len;
      trimmed.unshift(msg);
    }

    return trimmed;
  }

  toTranscript(messages: Message[]): string {
    return this.format(messages)
      .map((m) => {
        const role =
          m.role === "guest"
            ? "Гость"
            : m.role === "ai"
              ? "AI"
              : m.role === "staff"
                ? "Сотрудник"
                : "Система";
        return `${role}: ${m.body}`;
      })
      .join("\n");
  }
}

export const defaultConversationMemory = new ConversationMemory();
