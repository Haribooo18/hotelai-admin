/**
 * Central registry of supported AI models and per-1M-token USD pricing.
 * Update pricing here only — cost estimation reads from this file.
 */
export const AI_MODELS = {
  "gpt-4o-mini": {
    inputCost: 0.15,
    outputCost: 0.6,
    label: "GPT-4o Mini",
  },
  "gpt-4o": {
    inputCost: 2.5,
    outputCost: 10,
    label: "GPT-4o",
  },
  "gpt-4.1-mini": {
    inputCost: 0.4,
    outputCost: 1.6,
    label: "GPT-4.1 Mini",
  },
  "gpt-4.1": {
    inputCost: 2.0,
    outputCost: 8.0,
    label: "GPT-4.1",
  },
  "gpt-5": {
    inputCost: 2.5,
    outputCost: 10,
    label: "GPT-5",
  },
  "gpt-5-mini": {
    inputCost: 0.4,
    outputCost: 1.6,
    label: "GPT-5 Mini",
  },
} as const;

export type AIModelId = keyof typeof AI_MODELS;

export const AI_MODEL_IDS = Object.keys(AI_MODELS) as AIModelId[];

export const DEFAULT_MODEL_ID: AIModelId = "gpt-4o-mini";

export const DEFAULT_MODEL_PRICING = {
  inputCost: 0.5,
  outputCost: 1.5,
} as const;

export function getModelPricing(model: string) {
  const entry = AI_MODELS[model as AIModelId];
  return entry
    ? { inputCost: entry.inputCost, outputCost: entry.outputCost }
    : DEFAULT_MODEL_PRICING;
}
