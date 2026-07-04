import type { BuiltContext } from "./context-builder";

export type SystemPromptInput = {
  context: BuiltContext;
  instructions?: string[];
};

const DEFAULT_INSTRUCTIONS = [
  "Вы — AI-ресепшн отеля. Отвечайте вежливо, кратко и по делу.",
  "Используйте базу знаний отеля для точных ответов.",
  "Если информации недостаточно — предложите связаться с живым оператором.",
  "Не выдумывайте цены, наличие номеров и политики — используйте инструменты.",
  "Отвечайте на языке гостя, если он указан.",
];

/**
 * Builds the system prompt from structured context blocks.
 */
export class SystemPromptBuilder {
  build(input: SystemPromptInput): string {
    const instructions = input.instructions ?? DEFAULT_INSTRUCTIONS;
    const { context } = input;

    return [
      "# Роль",
      instructions.join("\n"),
      "",
      "# Профиль отеля",
      context.hotelProfile,
      "",
      "# Информация о госте",
      context.guestInfo,
      "",
      "# Дата и время",
      context.dateContext,
      "",
      `# Язык ответа: ${context.language}`,
      "",
      "# База знаний",
      context.knowledgeBlock,
      "",
      "# Доступные инструменты",
      context.toolsDescription,
    ].join("\n");
  }
}

export const defaultSystemPromptBuilder = new SystemPromptBuilder();
