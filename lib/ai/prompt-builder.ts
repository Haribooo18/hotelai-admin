import type { Conversation } from "@/types/conversation";
import type { Message } from "@/types/message";
import type { KnowledgeArticle } from "@/types/knowledge-article";

export type PromptContext = {
  hotelName: string;
  conversation: Conversation;
  messages: Message[];
  knowledge: Pick<KnowledgeArticle, "id" | "title" | "content">[];
};

/**
 * Builds the system prompt and any provider-specific message formatting.
 * Keeps prompt engineering isolated from provider adapters.
 */
export type PromptBuilder = {
  buildSystemPrompt(ctx: PromptContext): string;
};
