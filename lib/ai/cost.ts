import type { AITokenUsage } from "@/types/ai-settings";

/** USD per 1M tokens — update when OpenAI pricing changes. */
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "gpt-4o": { input: 2.5, output: 10 },
  "gpt-4.1-mini": { input: 0.4, output: 1.6 },
  "gpt-4.1": { input: 2.0, output: 8.0 },
};

const DEFAULT_PRICING = { input: 0.5, output: 1.5 };

export function estimateCostUsd(model: string, usage: AITokenUsage): number {
  const rates = MODEL_PRICING[model] ?? DEFAULT_PRICING;
  const inputCost = (usage.input_tokens / 1_000_000) * rates.input;
  const outputCost = (usage.output_tokens / 1_000_000) * rates.output;
  return Math.round((inputCost + outputCost) * 1_000_000) / 1_000_000;
}

export function mergeTokenUsage(
  a: AITokenUsage,
  b: Partial<AITokenUsage>
): AITokenUsage {
  const input = a.input_tokens + (b.input_tokens ?? 0);
  const output = a.output_tokens + (b.output_tokens ?? 0);
  return {
    input_tokens: input,
    output_tokens: output,
    total_tokens: input + output,
  };
}

export const EMPTY_TOKEN_USAGE: AITokenUsage = {
  input_tokens: 0,
  output_tokens: 0,
  total_tokens: 0,
};
