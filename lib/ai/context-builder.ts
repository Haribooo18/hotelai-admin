import type { Conversation } from "@/types/conversation";
import type { Guest } from "@/types/guest";
import type { KnowledgeArticle } from "@/types/knowledge-article";
import type { Message } from "@/types/message";

import type { CurrentHotel } from "@/lib/tenant";

import { languageDisplayName, normalizeLanguage } from "./language";
import type { AIToolDefinition } from "./types";

export type AIContextInput = {
  hotel: CurrentHotel;
  conversation: Conversation;
  messages: Message[];
  knowledge: Pick<
    KnowledgeArticle,
    "id" | "title" | "content" | "category" | "language"
  >[];
  guest?: Pick<
    Guest,
    "id" | "first_name" | "last_name" | "email" | "phone" | "is_vip"
  > | null;
  language?: string;
  tools: AIToolDefinition[];
  now?: Date;
};

export type BuiltContext = {
  hotelProfile: string;
  guestInfo: string;
  knowledgeBlock: string;
  dateContext: string;
  language: string;
  toolsDescription: string;
};

const MAX_KNOWLEDGE_CHARS = 9_000;
const MAX_ARTICLE_CHARS = 2_500;

/** Assembles bounded, privacy-conscious context blocks for prompt construction. */
export class ContextBuilder {
  build(input: AIContextInput): BuiltContext {
    const now = input.now ?? new Date();
    const language = normalizeLanguage(input.language ?? input.hotel.language ?? "ru");

    return {
      hotelProfile: this.buildHotelProfile(input.hotel),
      guestInfo: this.buildGuestInfo(input.conversation, input.guest),
      knowledgeBlock: this.buildKnowledgeBlock(input.knowledge),
      dateContext: this.buildDateContext(now, input.hotel.timezone, language),
      language,
      toolsDescription: this.buildToolsDescription(input.tools),
    };
  }

  private buildHotelProfile(hotel: CurrentHotel): string {
    const lines = [`Отель: ${hotel.name}`];
    if (hotel.language) lines.push(`Основной язык отеля: ${languageDisplayName(hotel.language)}`);
    if (hotel.timezone) lines.push(`Часовой пояс отеля: ${hotel.timezone}`);
    return lines.join("\n");
  }

  private buildGuestInfo(
    conversation: Conversation,
    guest?: AIContextInput["guest"],
  ): string {
    const displayName = guest
      ? [guest.first_name, guest.last_name].filter(Boolean).join(" ").trim()
      : conversation.guest_name?.trim();

    return [
      displayName ? `Имя гостя: ${displayName}` : "Имя гостя не указано",
      conversation.channel ? `Канал: ${conversation.channel}` : null,
      guest?.is_vip ? "Статус: VIP-гость" : null,
    ]
      .filter(Boolean)
      .join("\n");
  }

  private buildKnowledgeBlock(knowledge: AIContextInput["knowledge"]): string {
    if (knowledge.length === 0) {
      return "База знаний: нет релевантных опубликованных материалов.";
    }

    const blocks: string[] = [];
    let remaining = MAX_KNOWLEDGE_CHARS;

    for (const [index, article] of knowledge.entries()) {
      if (remaining <= 0) break;
      const header = `[${index + 1}] ${article.title}${article.category ? ` (${article.category})` : ""}${article.language ? ` [${article.language}]` : ""}`;
      const maxContent = Math.max(0, Math.min(MAX_ARTICLE_CHARS, remaining - header.length - 2));
      const content = truncate(article.content, maxContent);
      if (!content) continue;
      const block = `${header}\n${content}`;
      blocks.push(block);
      remaining -= block.length + 2;
    }

    return blocks.length > 0
      ? blocks.join("\n\n")
      : "База знаний: релевантные материалы превысили допустимый размер контекста.";
  }

  private buildDateContext(now: Date, timezone: string | undefined, language: string): string {
    const safeTimezone = isValidTimeZone(timezone) ? timezone : "UTC";
    const locale = language === "uk" ? "uk-UA" : language === "en" ? "en-US" : "ru-RU";

    return [
      `Текущая дата и время в отеле: ${now.toLocaleString(locale, {
        timeZone: safeTimezone,
        dateStyle: "full",
        timeStyle: "short",
      })}`,
      `Часовой пояс: ${safeTimezone}`,
    ].join("\n");
  }

  private buildToolsDescription(tools: AIToolDefinition[]): string {
    if (tools.length === 0) return "Доступные инструменты: нет.";
    return tools.map((tool) => `- ${tool.name}: ${tool.description}`).join("\n");
  }
}

function truncate(value: string, limit: number): string {
  const normalized = value.trim();
  if (normalized.length <= limit) return normalized;
  if (limit <= 1) return "";
  return `${normalized.slice(0, limit - 1).trimEnd()}…`;
}

function isValidTimeZone(value?: string): value is string {
  if (!value) return false;
  try {
    new Intl.DateTimeFormat("en", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

export const defaultContextBuilder = new ContextBuilder();
