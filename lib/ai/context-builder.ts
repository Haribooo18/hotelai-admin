import type { Conversation } from "@/types/conversation";
import type { Guest } from "@/types/guest";
import type { KnowledgeArticle } from "@/types/knowledge-article";
import type { Message } from "@/types/message";

import type { CurrentHotel } from "@/lib/tenant";

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

/**
 * Assembles structured context blocks for prompt construction.
 */
export class ContextBuilder {
  build(input: AIContextInput): BuiltContext {
    const now = input.now ?? new Date();
    const language = input.language ?? "ru";

    return {
      hotelProfile: this.buildHotelProfile(input.hotel),
      guestInfo: this.buildGuestInfo(input.conversation, input.guest),
      knowledgeBlock: this.buildKnowledgeBlock(input.knowledge),
      dateContext: this.buildDateContext(now),
      language,
      toolsDescription: this.buildToolsDescription(input.tools),
    };
  }

  private buildHotelProfile(hotel: CurrentHotel): string {
    return `Отель: ${hotel.name} (ID: ${hotel.id})`;
  }

  private buildGuestInfo(
    conversation: Conversation,
    guest?: AIContextInput["guest"]
  ): string {
    const lines = [
      `Гость: ${conversation.guest_name}`,
      conversation.guest_email
        ? `Email: ${conversation.guest_email}`
        : null,
      conversation.guest_phone
        ? `Телефон: ${conversation.guest_phone}`
        : null,
      conversation.channel ? `Канал: ${conversation.channel}` : null,
    ].filter(Boolean);

    if (guest) {
      lines.push(
        `CRM: ${guest.first_name} ${guest.last_name}`,
        guest.is_vip ? "VIP-гость" : null
      );
    }

    return lines.join("\n");
  }

  private buildKnowledgeBlock(
    knowledge: AIContextInput["knowledge"]
  ): string {
    if (knowledge.length === 0) {
      return "База знаний: нет релевантных статей.";
    }

    return knowledge
      .map(
        (k, i) =>
          `[${i + 1}] ${k.title}${k.category ? ` (${k.category})` : ""}\n${k.content}`
      )
      .join("\n\n");
  }

  private buildDateContext(now: Date): string {
    return `Текущая дата и время: ${now.toLocaleString("ru-RU", {
      timeZone: "Europe/Moscow",
      dateStyle: "full",
      timeStyle: "short",
    })}`;
  }

  private buildToolsDescription(tools: AIToolDefinition[]): string {
    if (tools.length === 0) return "Доступные инструменты: нет.";

    return tools
      .map((t) => `- ${t.name}: ${t.description}`)
      .join("\n");
  }
}

export const defaultContextBuilder = new ContextBuilder();
