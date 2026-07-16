import { z } from "zod";

import type { AIRequest } from "./types";

export type ToolPermission =
  | "bookings:read"
  | "bookings:write"
  | "guests:read"
  | "rooms:read"
  | "knowledge:read";

export type ToolContext = {
  hotelId: string;
  conversationId: string;
  request: AIRequest;
};

export type ToolResult = {
  output: Record<string, unknown>;
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
  permission: ToolPermission;
  inputSchema: z.ZodType;
  outputSchema: z.ZodType;
  execute(ctx: ToolContext, args: Record<string, unknown>): Promise<ToolResult>;
};

export function toolDefinitionFromZod(
  name: string,
  description: string,
  schema: z.ZodType
): AITool["definition"] {
  return {
    name,
    description,
    parameters: zodToJsonSchema(schema),
  };
}

function zodToJsonSchema(schema: z.ZodType): Record<string, unknown> {
  if ("shape" in schema && typeof schema.shape === "object") {
    const shape = schema.shape as Record<string, z.ZodType>;
    const properties: Record<string, unknown> = {};
    const required: string[] = [];

    for (const [key, field] of Object.entries(shape)) {
      properties[key] = zodFieldToJson(field);
      if (!field.isOptional()) required.push(key);
    }

    return { type: "object", properties, required };
  }

  return { type: "object", properties: {} };
}

function zodFieldToJson(field: z.ZodType): Record<string, unknown> {
  if (field instanceof z.ZodString) return { type: "string" };
  if (field instanceof z.ZodNumber) return { type: "number" };
  if (field instanceof z.ZodBoolean) return { type: "boolean" };
  if (field instanceof z.ZodArray) {
    return { type: "array", items: { type: "string" } };
  }
  if (field instanceof z.ZodEnum) {
    return { type: "string", enum: field.options };
  }
  if (field instanceof z.ZodOptional) {
    return zodFieldToJson(field.unwrap() as z.ZodType);
  }
  return { type: "string" };
}
