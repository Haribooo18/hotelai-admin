import { describe, expect, it } from "vitest";
import { z } from "zod";

import { PromptAssembler } from "@/lib/ai/prompt-assembler";
import {
  ToolRegistry,
  createToolRegistry,
} from "@/lib/ai/tool-registry";
import type { KnowledgeRetriever, RetrievedKnowledge } from "@/lib/ai/knowledge-retriever";
import type { AITool } from "@/lib/ai/tools";
import { toolDefinitionFromZod } from "@/lib/ai/tools";

import { TEST_HOTEL, makeConversation, makeMessage } from "../../helpers/fixtures";

const echoInputSchema = z.object({ text: z.string() });
const echoOutputSchema = z.object({ echoed: z.string() });

const echoTool: AITool = {
  definition: toolDefinitionFromZod(
    "echo_tool",
    "Echo input text",
    echoInputSchema
  ),
  permission: "knowledge:read",
  inputSchema: echoInputSchema,
  outputSchema: echoOutputSchema,
  async execute(_ctx, args) {
    const input = echoInputSchema.parse(args);
    return { output: { echoed: input.text } };
  },
};

function createRetriever(articles: RetrievedKnowledge[]): KnowledgeRetriever {
  return {
    async retrieve() {
      return articles;
    },
  };
}

describe("PromptAssembler", () => {
  const conversation = makeConversation();
  const messages = [
    makeMessage({ id: "m1", role: "guest", body: "Какой WiFi пароль?" }),
    makeMessage({ id: "m2", role: "ai", body: "Сейчас проверю." }),
  ];

  it("includes system prompt, history, knowledge, tools, and language", async () => {
    const knowledge = [
      {
        id: "k1",
        title: "WiFi",
        content: "Пароль: hotel-wifi",
        category: "Услуги",
        language: "ru",
        priority: "normal" as const,
      },
    ];

    const registry = createToolRegistry([echoTool]);
    const assembler = new PromptAssembler({
      knowledgeRetriever: createRetriever(knowledge),
      toolRegistry: registry,
    });

    const request = await assembler.build({
      hotel: TEST_HOTEL,
      conversation,
      messages,
      language: "en",
      retrievalQuery: "wifi password",
    });

    expect(request.systemPrompt.length).toBeGreaterThan(0);
    expect(request.systemPrompt).toContain("Test Hotel");
    expect(request.messages).toHaveLength(2);
    expect(request.messages[0]?.body).toBe("Какой WiFi пароль?");
    expect(request.knowledgeSnippets).toHaveLength(1);
    expect(request.knowledgeSnippets[0]?.title).toBe("WiFi");
    expect(request.tools).toHaveLength(1);
    expect(request.tools[0]?.name).toBe("echo_tool");
    expect(request.language).toBe("en");
    expect(request.transcript).toContain("Гость: Какой WiFi пароль?");
    expect(request.promptVersion).toBeTruthy();
    expect(request.systemPromptHash).toHaveLength(16);
  });

  it("handles empty knowledge retrieval", async () => {
    const assembler = new PromptAssembler({
      knowledgeRetriever: createRetriever([]),
      toolRegistry: new ToolRegistry([]),
    });

    const request = await assembler.build({
      hotel: TEST_HOTEL,
      conversation,
      messages,
      language: "ru",
    });

    expect(request.knowledgeSnippets).toHaveLength(0);
    expect(request.systemPrompt).toContain("Test Hotel");
    expect(request.tools).toHaveLength(0);
  });

  it("propagates language to context and request", async () => {
    const assembler = new PromptAssembler({
      knowledgeRetriever: createRetriever([]),
      toolRegistry: new ToolRegistry([]),
    });

    const request = await assembler.build({
      hotel: TEST_HOTEL,
      conversation,
      messages,
      language: "de",
    });

    expect(request.language).toBe("de");
  });
});
