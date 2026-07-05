import { createHash } from "node:crypto";

/** Bump when system prompt assembly semantics change (not copy edits). */
export const CurrentPromptVersion = "2026.07.1" as const;

export type PromptVersion = typeof CurrentPromptVersion;

export function hashSystemPrompt(prompt: string): string {
  return createHash("sha256").update(prompt).digest("hex").slice(0, 16);
}
