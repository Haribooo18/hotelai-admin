import type { AITool, ToolContext, ToolResult } from "./tools";

export type ToolExecutionResult =
  | { ok: true; result: ToolResult }
  | { ok: false; error: { code: string; message: string } };

/**
 * Registry of tenant-safe AI tools. Tools are discovered automatically
 * via `lib/ai/tools/index.ts` and registered at bootstrap.
 */
export class ToolRegistry {
  private readonly tools = new Map<string, AITool>();

  constructor(tools: AITool[] = []) {
    for (const tool of tools) {
      this.register(tool);
    }
  }

  register(tool: AITool): void {
    if (this.tools.has(tool.definition.name)) {
      throw new Error(`Инструмент уже зарегистрирован: ${tool.definition.name}`);
    }
    this.tools.set(tool.definition.name, tool);
  }

  get(name: string): AITool | undefined {
    return this.tools.get(name);
  }

  list(): AITool[] {
    return Array.from(this.tools.values());
  }

  definitions() {
    return this.list().map((t) => t.definition);
  }
}

/** Resolves a tool by name from the registry. */
export class ToolResolver {
  constructor(private readonly registry: ToolRegistry) {}

  resolve(name: string): AITool {
    const tool = this.registry.get(name);
    if (!tool) {
      throw new Error(`Инструмент не найден: ${name}`);
    }
    return tool;
  }
}

/**
 * Executes tools with input validation, tenant scope checks, and error handling.
 */
export class ToolExecutor {
  constructor(
    private readonly registry: ToolRegistry,
    private readonly permissions: Set<string> = new Set([
      "bookings:read",
      "bookings:write",
      "guests:read",
      "rooms:read",
      "knowledge:read",
    ])
  ) {}

  async execute(
    name: string,
    ctx: ToolContext,
    args: Record<string, unknown>
  ): Promise<ToolExecutionResult> {
    try {
      const tool = this.registry.get(name);
      if (!tool) {
        return {
          ok: false,
          error: { code: "TOOL_NOT_FOUND", message: `Инструмент не найден: ${name}` },
        };
      }

      if (!this.permissions.has(tool.permission)) {
        return {
          ok: false,
          error: {
            code: "PERMISSION_DENIED",
            message: `Недостаточно прав: ${tool.permission}`,
          },
        };
      }

      if (ctx.hotelId !== ctx.request.hotelId) {
        return {
          ok: false,
          error: {
            code: "TENANT_MISMATCH",
            message: "Контекст отеля не совпадает с запросом",
          },
        };
      }

      const parsed = tool.inputSchema.safeParse(args);
      if (!parsed.success) {
        return {
          ok: false,
          error: {
            code: "INVALID_INPUT",
            message: parsed.error.issues[0]?.message ?? "Некорректные аргументы",
          },
        };
      }

      const result = await tool.execute(ctx, parsed.data as Record<string, unknown>);
      tool.outputSchema.parse(result.output);

      return { ok: true, result };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Неизвестная ошибка инструмента";
      return { ok: false, error: { code: "TOOL_ERROR", message } };
    }
  }
}

export function createToolRegistry(tools: AITool[]): ToolRegistry {
  return new ToolRegistry(tools);
}

export function createToolExecutor(
  registry: ToolRegistry,
  permissions?: Set<string>
): ToolExecutor {
  return new ToolExecutor(registry, permissions);
}
