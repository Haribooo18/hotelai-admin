import { configureAIServices } from "./index";
import { createOpenAIProvider } from "./providers/openai";
import { getOpenAIApiKey, isOpenAIConfigured } from "./config";

let bootstrapped = false;

/** Wire OpenAI provider when OPENAI_API_KEY is set (server-side only). */
export function bootstrapAIServices() {
  if (bootstrapped) return;
  bootstrapped = true;

  const apiKey = getOpenAIApiKey();
  if (!apiKey) return;

  configureAIServices({
    provider: createOpenAIProvider({
      apiKey,
      defaultModel: "gpt-4o-mini",
      defaultTimeoutMs: 60_000,
      defaultMaxRetries: 2,
    }),
  });
}

export { isOpenAIConfigured };
