import type { AIProvider } from "./types";
import type { KnowledgeRetriever } from "./knowledge-retriever";
import { PromptAssembler } from "./prompt-assembler";
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
import { ensureAIServicesInitialized } from "./bootstrap";

export type AIServices = {
  provider: AIProvider;
  knowledgeRetriever: KnowledgeRetriever;
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
  promptAssembler: defaultAssembler,
  tools: discoveredTools,
  toolRegistry: defaultRegistry,
  toolResolver: new ToolResolver(defaultRegistry),
  toolExecutor: createToolExecutor(defaultRegistry),
};

function isProviderOnlyUpdate(
  services: Partial<AIServices>
): services is Pick<AIServices, "provider"> {
  const keys = Object.keys(services) as (keyof AIServices)[];
  return keys.length === 1 && keys[0] === "provider";
}

/** Register production implementations (tests or custom adapters only). */
export function configureAIServices(services: Partial<AIServices>) {
  if (isProviderOnlyUpdate(services)) {
    _services = { ..._services, provider: services.provider };
    return;
  }

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
  };
}

/**
 * Returns the shared AI service container.
 * Lazily initializes the OpenAI provider on first access.
 */
export function getAIServices(): AIServices {
  ensureAIServicesInitialized();
  return _services;
}
