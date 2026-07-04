import type { Conversation } from "@/types/conversation";
import type { Message } from "@/types/message";
import type { KnowledgeArticle } from "@/types/knowledge-article";

/** Context passed to the AI provider for a single completion request. */
export type AIRequest = {
  hotelId: string;
  conversation: Conversation;
  messages: Message[];
  knowledgeSnippets: Pick<KnowledgeArticle, "id" | "title" | "content">[];
  systemPrompt: string;
  tools: AIToolDefinition[];
  /** Resolved response language. */
  language: string;
  /** Formatted conversation transcript for providers that prefer plain text. */
  transcript: string;
};

export type AIResponse = {
  content: string | null;
  toolCalls: AIToolCall[];
  metadata: Record<string, unknown>;
};

export type AIToolDefinition = {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
};

export type AIToolCall = {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
};

/**
 * Provider-agnostic AI completion contract.
 * Implementations (e.g. OpenAI) are wired via dependency injection.
 */
export type AIProvider = {
  readonly name: string;
  complete(request: AIRequest): Promise<AIResponse>;
};
