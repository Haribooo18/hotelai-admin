import type { AIRequest } from "./types";

export type ToolContext = {
  hotelId: string;
  conversationId: string;
  request: AIRequest;
};

export type ToolResult = {
  output: Record<string, unknown>;
  /** Optional user-facing message derived from the tool result. */
  summary?: string;
};

/**
 * Executable tool the AI provider may invoke during a completion.
 * Each tool is registered in the DI container and must be tenant-safe.
 */
export type AITool = {
  definition: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
  execute(ctx: ToolContext, args: Record<string, unknown>): Promise<ToolResult>;
};
