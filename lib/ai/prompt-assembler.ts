import type { Conversation } from "@/types/conversation";
import type { Guest } from "@/types/guest";
import type { Message } from "@/types/message";

import type { CurrentHotel } from "@/lib/tenant";

import {
  ContextBuilder,
  defaultContextBuilder,
  type AIContextInput,
} from "./context-builder";
import {
  ConversationMemory,
  defaultConversationMemory,
} from "./conversation-memory";
import type { KnowledgeRetriever } from "./knowledge-retriever";
import {
  SystemPromptBuilder,
  defaultSystemPromptBuilder,
} from "./system-prompt-builder";
import type { ToolRegistry } from "./tool-registry";
import type { AIRequest } from "./types";

export type BuildAIRequestInput = {
  hotel: CurrentHotel;
  conversation: Conversation;
  messages: Message[];
  guest?: Pick<
    Guest,
    "id" | "first_name" | "last_name" | "email" | "phone" | "is_vip"
  > | null;
  language?: string;
  /** Latest guest message used for knowledge retrieval. */
  retrievalQuery?: string;
  instructions?: string[];
};

/**
 * Orchestrates context assembly and returns a provider-ready AIRequest.
 * No provider calls — context preparation only.
 */
export class PromptAssembler {
  constructor(
    private readonly deps: {
      knowledgeRetriever: KnowledgeRetriever;
      toolRegistry: ToolRegistry;
      contextBuilder?: ContextBuilder;
      conversationMemory?: ConversationMemory;
      systemPromptBuilder?: SystemPromptBuilder;
    }
  ) {}

  async build(input: BuildAIRequestInput): Promise<AIRequest> {
    const memory = this.deps.conversationMemory ?? defaultConversationMemory;
    const contextBuilder = this.deps.contextBuilder ?? defaultContextBuilder;
    const systemPromptBuilder =
      this.deps.systemPromptBuilder ?? defaultSystemPromptBuilder;

    const trimmedMessages = memory.format(input.messages);
    const query =
      input.retrievalQuery ??
      trimmedMessages.filter((m) => m.role === "guest").at(-1)?.body ??
      "";

    const knowledge = await this.deps.knowledgeRetriever.retrieve({
      hotelId: input.hotel.id,
      query,
      limit: 6,
      language: input.language,
      publishedOnly: true,
    });

    const tools = this.deps.toolRegistry.definitions();

    const contextInput: AIContextInput = {
      hotel: input.hotel,
      conversation: input.conversation,
      messages: trimmedMessages,
      knowledge,
      guest: input.guest,
      language: input.language,
      tools,
    };

    const builtContext = contextBuilder.build(contextInput);
    const systemPrompt = systemPromptBuilder.build({
      context: builtContext,
      instructions: input.instructions,
    });

    return {
      hotelId: input.hotel.id,
      conversation: input.conversation,
      messages: trimmedMessages,
      knowledgeSnippets: knowledge.map((k) => ({
        id: k.id,
        title: k.title,
        content: k.content,
      })),
      systemPrompt,
      tools,
      language: builtContext.language,
      transcript: memory.toTranscript(trimmedMessages),
    };
  }
}

/** @deprecated Use PromptAssembler — kept for Sprint 6 interface compatibility. */
export type PromptBuilder = {
  buildSystemPrompt(ctx: {
    hotelName: string;
    conversation: Conversation;
    messages: Message[];
    knowledge: { id: string; title: string; content: string }[];
  }): string;
};

export function createLegacyPromptBuilder(
  assembler: PromptAssembler
): PromptBuilder {
  return {
    buildSystemPrompt(ctx) {
      const built = defaultContextBuilder.build({
        hotel: { id: "", name: ctx.hotelName },
        conversation: ctx.conversation,
        messages: ctx.messages,
        knowledge: ctx.knowledge.map((k) => ({
          ...k,
          category: null,
          language: "ru",
        })),
        tools: [],
      });
      return defaultSystemPromptBuilder.build({ context: built });
    },
  };
}
