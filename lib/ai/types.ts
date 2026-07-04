import type { Conversation } from "@/types/conversation";
import type { Message } from "@/types/message";
import type { KnowledgeArticle } from "@/types/knowledge-article";
import type { AITokenUsage } from "@/types/ai-settings";

export type AIProviderOptions = {
  model?: string;
  maxOutputTokens?: number;
  temperature?: number;
  timeoutMs?: number;
  maxRetries?: number;
  signal?: AbortSignal;
};

export type AIRequest = {
  hotelId: string;
  conversation: Conversation;
  messages: Message[];
  knowledgeSnippets: Pick<KnowledgeArticle, "id" | "title" | "content">[];
  systemPrompt: string;
  tools: AIToolDefinition[];
  language: string;
  transcript: string;
};

export type AIResponse = {
  content: string | null;
  toolCalls: AIToolCall[];
  metadata: Record<string, unknown> & {
    model?: string;
    request_id?: string;
    usage?: AITokenUsage;
    provider?: string;
  };
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

export type AIStreamEvent =
  | { type: "text_delta"; delta: string }
  | { type: "completed"; response: AIResponse }
  | { type: "error"; message: string };

/**
 * Provider-agnostic AI completion contract.
 * Implementations (e.g. OpenAI Responses API) are wired via DI.
 */
export type AIProvider = {
  readonly name: string;
  complete(
    request: AIRequest,
    options?: AIProviderOptions
  ): Promise<AIResponse>;
  stream?(
    request: AIRequest,
    options?: AIProviderOptions
  ): AsyncGenerator<AIStreamEvent>;
};
