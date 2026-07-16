import { configureAIServices } from "./container";
import { getOpenAIApiKey, getOpenAIDefaultModel } from "./config";
import { createOpenAIProvider } from "./providers/openai";

let initialized = false;

/**
 * Lazy singleton bootstrap — the only place providers are wired.
 * Called exclusively from `getAIServices()` in `container.ts`.
 */
export function ensureAIServicesInitialized(): void {
  if (initialized) return;
  initialized = true;

  const apiKey = getOpenAIApiKey();
  if (!apiKey) return;

  configureAIServices({
    provider: createOpenAIProvider({
      apiKey,
      defaultModel: getOpenAIDefaultModel(),
      defaultTimeoutMs: 60_000,
      defaultMaxRetries: 2,
    }),
  });
}
