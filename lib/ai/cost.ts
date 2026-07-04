import type { AITokenUsage } from "@/types/ai-settings";

import { getModelPricing } from "./models";

export function estimateCostUsd(model: string, usage: AITokenUsage): number {
  const rates = getModelPricing(model);
  const inputCost = (usage.input_tokens / 1_000_000) * rates.inputCost;
  const outputCost = (usage.output_tokens / 1_000_000) * rates.outputCost;
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
