import type { AIProvider } from "./types";
import type { KnowledgeRetriever } from "./knowledge-retriever";
import type { PromptBuilder } from "./prompt-builder";
import type { AITool } from "./tools";

export type AIServices = {
  provider: AIProvider;
  knowledgeRetriever: KnowledgeRetriever;
  promptBuilder: PromptBuilder;
  tools: AITool[];
};

/**
 * Thrown when no AI provider has been configured (Sprint 6 foundation).
 * Feature code must catch this and surface a user-facing "AI не настроен" message
 * rather than generating fake responses.
 */
export class AIProviderNotConfiguredError extends Error {
  constructor() {
    super("AI-провайдер не настроен");
    this.name = "AIProviderNotConfiguredError";
  }
}

/** Placeholder provider — does not generate content. */
export const unconfiguredAIProvider: AIProvider = {
  name: "unconfigured",
  async complete() {
    throw new AIProviderNotConfiguredError();
  },
};

let _services: AIServices = {
  provider: unconfiguredAIProvider,
  knowledgeRetriever: {
    async retrieve() {
      return [];
    },
  },
  promptBuilder: {
    buildSystemPrompt(ctx) {
      return `Вы — AI-ресепшн отеля ${ctx.hotelName}. Отвечайте вежливо и по делу.`;
    },
  },
  tools: [],
};

/** Register production implementations (e.g. OpenAI adapter) at app bootstrap. */
export function configureAIServices(services: Partial<AIServices>) {
  _services = { ..._services, ...services };
}

export function getAIServices(): AIServices {
  return _services;
}
