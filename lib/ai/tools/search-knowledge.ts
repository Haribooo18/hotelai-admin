import { searchPublishedKnowledge } from "@/lib/services/knowledge.service";
import {
  searchKnowledgeToolInputSchema,
  searchKnowledgeToolOutputSchema,
} from "@/lib/validations/ai-tools";

import type { AITool } from "../tools";
import { toolDefinitionFromZod } from "../tools";

export const searchKnowledgeTool: AITool = {
  definition: toolDefinitionFromZod(
    "search_knowledge",
    "Найти релевантные статьи в базе знаний отеля",
    searchKnowledgeToolInputSchema
  ),
  risk: "read",
  permission: "knowledge:read",
  inputSchema: searchKnowledgeToolInputSchema,
  outputSchema: searchKnowledgeToolOutputSchema,
  async execute(_ctx, args) {
    const input = searchKnowledgeToolInputSchema.parse(args);

    const results = await searchPublishedKnowledge(
      input.query,
      input.limit ?? 5
    );

    const filtered = input.language
      ? results.filter((r) => r.language === input.language)
      : results;

    const output = {
      results: filtered.map((r) => ({
        id: r.id,
        title: r.title,
        content: r.content.slice(0, 500),
        category: r.category,
        score: r.score,
      })),
    };

    searchKnowledgeToolOutputSchema.parse(output);

    return {
      output,
      summary: `Найдено статей: ${output.results.length}`,
    };
  },
};
