import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
  ToolRegistry,
  createToolExecutor,
} from "@/lib/ai/tool-registry";
import type { AITool } from "@/lib/ai/tools";
import { toolDefinitionFromZod } from "@/lib/ai/tools";
import type { AIRequest } from "@/lib/ai/types";

import { makeConversation } from "../../helpers/fixtures";

const inputSchema = z.object({ query: z.string().min(1) });
const outputSchema = z.object({ answer: z.string() });

const testTool: AITool = {
  definition: toolDefinitionFromZod(
    "test_lookup",
    "Lookup test data",
    inputSchema
  ),
  risk: "read",
  permission: "knowledge:read",
  inputSchema,
  outputSchema,
  async execute(ctx, args) {
    const input = inputSchema.parse(args);
    return {
      output: { answer: `${ctx.hotelId}:${input.query}` },
      summary: "ok",
    };
  },
};

function makeRequest(hotelId: string): AIRequest {
  return {
    hotelId,
    conversation: makeConversation({ hotel_id: hotelId }),
    messages: [],
    knowledgeSnippets: [],
    systemPrompt: "test",
    tools: [],
    language: "ru",
    transcript: "",
  };
}

describe("ToolExecutor", () => {
  const registry = new ToolRegistry([testTool]);
  const executor = createToolExecutor(registry);

  const validCtx = {
    hotelId: "hotel_a",
    conversationId: "conv-1",
    request: makeRequest("hotel_a"),
  };

  it("executes a valid tool and returns structured output", async () => {
    const result = await executor.execute("test_lookup", validCtx, {
      query: "rooms",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.result.output).toEqual({ answer: "hotel_a:rooms" });
    }
  });

  it("rejects unknown tools", async () => {
    const result = await executor.execute("missing_tool", validCtx, {});

    expect(result).toEqual({
      ok: false,
      error: {
        code: "TOOL_NOT_FOUND",
        message: "Инструмент не найден: missing_tool",
      },
    });
  });

  it("rejects invalid input", async () => {
    const result = await executor.execute("test_lookup", validCtx, {
      query: "",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("INVALID_INPUT");
      expect(result.error.message.length).toBeGreaterThan(0);
    }
  });

  it("preserves tenant context in tool execution", async () => {
    const result = await executor.execute("test_lookup", validCtx, {
      query: "wifi",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.result.output.answer).toContain("hotel_a");
    }
  });

  it("returns structured error on tenant mismatch", async () => {
    const mismatchedCtx = {
      ...validCtx,
      hotelId: "hotel_b",
    };

    const result = await executor.execute("test_lookup", mismatchedCtx, {
      query: "wifi",
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: "TENANT_MISMATCH",
        message: "Контекст отеля не совпадает с запросом",
      },
    });
  });

  it("returns structured error when permission is denied", async () => {
    const restricted = createToolExecutor(
      registry,
      new Set(["bookings:read"])
    );

    const result = await restricted.execute("test_lookup", validCtx, {
      query: "wifi",
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: "PERMISSION_DENIED",
        message: "Недостаточно прав: knowledge:read",
      },
    });
  });
});
