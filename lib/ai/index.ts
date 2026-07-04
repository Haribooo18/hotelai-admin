import type { AIProvider } from "./types";
import type { KnowledgeRetriever } from "./knowledge-retriever";
import {
  PromptAssembler,
  createLegacyPromptBuilder,
  type PromptBuilder,
} from "./prompt-assembler";
import { serverKnowledgeRetriever } from "./server-knowledge-retriever";
import {
  ToolExecutor,
  ToolRegistry,
  ToolResolver,
  createToolExecutor,
  createToolRegistry,
} from "./tool-registry";
import { discoveredTools } from "./tools/index";
import type { AITool } from "./tools";
import { bootstrapAIServices, isOpenAIConfigured } from "./bootstrap";

export type AIServices = {
  provider: AIProvider;
  knowledgeRetriever: KnowledgeRetriever;
  promptBuilder: PromptBuilder;
  promptAssembler: PromptAssembler;
  tools: AITool[];
  toolRegistry: ToolRegistry;
  toolResolver: ToolResolver;
  toolExecutor: ToolExecutor;
};

export class AIProviderNotConfiguredError extends Error {
  constructor() {
    super("AI-провайдер не настроен");
    this.name = "AIProviderNotConfiguredError";
  }
}

export const unconfiguredAIProvider: AIProvider = {
  name: "unconfigured",
  async complete() {
    throw new AIProviderNotConfiguredError();
  },
};

const defaultRegistry = createToolRegistry(discoveredTools);
const defaultAssembler = new PromptAssembler({
  knowledgeRetriever: serverKnowledgeRetriever,
  toolRegistry: defaultRegistry,
});

let _services: AIServices = {
  provider: unconfiguredAIProvider,
  knowledgeRetriever: serverKnowledgeRetriever,
  promptBuilder: createLegacyPromptBuilder(defaultAssembler),
  promptAssembler: defaultAssembler,
  tools: discoveredTools,
  toolRegistry: defaultRegistry,
  toolResolver: new ToolResolver(defaultRegistry),
  toolExecutor: createToolExecutor(defaultRegistry),
};

/** Register production implementations at app bootstrap. */
export function configureAIServices(services: Partial<AIServices>) {
  const tools = services.tools ?? _services.tools;
  const registry = services.toolRegistry ?? createToolRegistry(tools);
  const assembler =
    services.promptAssembler ??
    new PromptAssembler({
      knowledgeRetriever:
        services.knowledgeRetriever ?? _services.knowledgeRetriever,
      toolRegistry: registry,
    });

  _services = {
    ..._services,
    ...services,
    tools,
    toolRegistry: registry,
    toolResolver: services.toolResolver ?? new ToolResolver(registry),
    toolExecutor:
      services.toolExecutor ?? createToolExecutor(registry),
    promptAssembler: assembler,
    promptBuilder:
      services.promptBuilder ?? createLegacyPromptBuilder(assembler),
  };
}

export function getAIServices(): AIServices {
  return _services;
}

export {
  PromptAssembler,
  createLegacyPromptBuilder,
  serverKnowledgeRetriever,
  discoveredTools,
  ToolRegistry,
  ToolResolver,
  ToolExecutor,
  createToolRegistry,
  createToolExecutor,
  bootstrapAIServices,
  isOpenAIConfigured,
};

export type { PromptBuilder } from "./prompt-assembler";
export type { KnowledgeRetriever } from "./knowledge-retriever";
export type { AITool, ToolContext, ToolResult } from "./tools";
