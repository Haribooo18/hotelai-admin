import type { Message } from "@/types/message";
import type { HotelAISettings } from "@/types/ai-settings";

import type { AIRequest } from "./types";

export const MAX_MESSAGE_BODY_CHARS = 8_000;
export const MAX_SYSTEM_PROMPT_CHARS = 120_000;
export const DEFAULT_TOOL_TIMEOUT_MS = 30_000;
export const MAX_CONVERSATION_TIMEOUT_MS = 300_000;

export function resolveToolTimeoutMs(settings: HotelAISettings): number {
  return Math.min(settings.timeout_ms, DEFAULT_TOOL_TIMEOUT_MS);
}

export function resolveConversationTimeoutMs(settings: HotelAISettings): number {
  return Math.min(
    settings.timeout_ms * (settings.max_tool_rounds + 2),
    MAX_CONVERSATION_TIMEOUT_MS
  );
}

export function assertMessageSizeLimits(messages: Message[]): void {
  for (const message of messages) {
    if (message.body.length > MAX_MESSAGE_BODY_CHARS) {
      throw new Error("Сообщение слишком длинное");
    }
  }
}

export function assertContextGuardrails(request: AIRequest): void {
  if (request.systemPrompt.length > MAX_SYSTEM_PROMPT_CHARS) {
    throw new Error("Контекст AI превышает допустимый размер");
  }

  if (request.messages.length === 0) {
    throw new Error("Нет сообщений для обработки");
  }
}

export function assertConversationGuardrails(input: {
  messages: Message[];
  settings: HotelAISettings;
}): void {
  assertMessageSizeLimits(input.messages);

  if (input.settings.max_tool_rounds < 0) {
    throw new Error("Некорректный лимит вызовов инструментов");
  }
}
