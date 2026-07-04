import type {
  AIProvider,
  AIProviderOptions,
  AIRequest,
  AIResponse,
  AIStreamEvent,
  AIToolCall,
} from "../types";
import type { AITokenUsage } from "@/types/ai-settings";

import { EMPTY_TOKEN_USAGE, mergeTokenUsage } from "../cost";
import { withRetry, withTimeout } from "../retry";

export type OpenAIProviderConfig = {
  apiKey: string;
  defaultModel?: string;
  defaultTimeoutMs?: number;
  defaultMaxRetries?: number;
};

type ResponseInputItem =
  | { role: "user" | "assistant" | "system"; content: string }
  | { type: "function_call_output"; call_id: string; output: string };

function roleLabel(role: string): "user" | "assistant" {
  if (role === "guest") return "user";
  if (role === "ai" || role === "staff") return "assistant";
  return "user";
}

function buildInput(request: AIRequest): ResponseInputItem[] {
  const items: ResponseInputItem[] = [];

  for (const msg of request.messages) {
    if (msg.is_internal) continue;
    items.push({
      role: roleLabel(msg.role),
      content: msg.body,
    });
  }

  return items;
}

function buildTools(request: AIRequest) {
  return request.tools.map((tool) => ({
    type: "function" as const,
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
    strict: false,
  }));
}

function resolveRequestParams(
  request: AIRequest,
  options?: AIProviderOptions
) {
  const toolChoice = options?.toolChoice ?? "auto";
  const includeTools = toolChoice !== "none" && request.tools.length > 0;

  return {
    instructions: request.systemPrompt,
    input: buildInput(request),
    ...(includeTools
      ? {
          tools: buildTools(request),
          tool_choice: toolChoice === "required" ? ("required" as const) : undefined,
        }
      : {}),
    temperature: options?.temperature,
    top_p: options?.topP,
    max_output_tokens: options?.maxOutputTokens,
  };
}

function extractUsage(raw: unknown): AITokenUsage {
  const usage = (raw as { usage?: Record<string, number> })?.usage;
  if (!usage) return { ...EMPTY_TOKEN_USAGE };

  const input = usage.input_tokens ?? usage.prompt_tokens ?? 0;
  const output = usage.output_tokens ?? usage.completion_tokens ?? 0;
  return {
    input_tokens: input,
    output_tokens: output,
    total_tokens: input + output,
  };
}

function parseToolCalls(output: unknown[]): AIToolCall[] {
  const calls: AIToolCall[] = [];

  for (const item of output) {
    const row = item as Record<string, unknown>;
    if (row.type !== "function_call") continue;

    let args: Record<string, unknown> = {};
    try {
      args =
        typeof row.arguments === "string"
          ? (JSON.parse(row.arguments) as Record<string, unknown>)
          : ((row.arguments as Record<string, unknown>) ?? {});
    } catch {
      args = {};
    }

    calls.push({
      id: String(row.call_id ?? row.id ?? crypto.randomUUID()),
      name: String(row.name ?? ""),
      arguments: args,
    });
  }

  return calls;
}

export type OpenAIProvider = AIProvider & {
  completeWithToolOutputs: (
    request: AIRequest,
    toolOutputs: { call_id: string; output: string }[],
    options?: AIProviderOptions
  ) => Promise<AIResponse>;
};

export function createOpenAIProvider(
  config: OpenAIProviderConfig
): OpenAIProvider {
  let clientPromise: Promise<import("openai").default> | null = null;

  async function getClient() {
    if (!clientPromise) {
      clientPromise = import("openai").then(
        ({ default: OpenAI }) => new OpenAI({ apiKey: config.apiKey })
      );
    }
    return clientPromise;
  }

  return {
    name: "openai",

    async complete(request, options?: AIProviderOptions) {
      const client = await getClient();

      const model = options?.model ?? config.defaultModel ?? "gpt-4o-mini";
      const timeoutMs = options?.timeoutMs ?? config.defaultTimeoutMs ?? 60_000;
      const maxRetries = options?.maxRetries ?? config.defaultMaxRetries ?? 2;

      const response = await withRetry(
        async () =>
          withTimeout(
            client.responses.create({
              model,
              ...resolveRequestParams(request, options),
            }),
            timeoutMs,
            options?.signal
          ),
        { maxRetries, signal: options?.signal }
      );

      const output = (response.output ?? []) as unknown[];
      const toolCalls = parseToolCalls(output);
      const content =
        response.output_text?.trim() ||
        (toolCalls.length > 0 ? null : "Информация недоступна. Свяжитесь с ресепшном.");

      return {
        content,
        toolCalls,
        metadata: {
          model: response.model ?? model,
          request_id: response.id,
          usage: extractUsage(response),
          provider: "openai",
        },
      } satisfies AIResponse;
    },

    async *stream(request, options?: AIProviderOptions) {
      const client = await getClient();

      const model = options?.model ?? config.defaultModel ?? "gpt-4o-mini";
      const timeoutMs = options?.timeoutMs ?? config.defaultTimeoutMs ?? 60_000;

      const stream = await withTimeout(
        client.responses.create({
          model,
          ...resolveRequestParams(request, options),
          stream: true,
        }),
        timeoutMs,
        options?.signal
      );

      let usage = { ...EMPTY_TOKEN_USAGE };
      let requestId: string | undefined;
      let modelUsed = model;
      const toolCalls: AIToolCall[] = [];
      const toolArgs = new Map<string, { name: string; args: string }>();

      for await (const event of stream) {
        if (options?.signal?.aborted) {
          break;
        }

        const ev = event as unknown as Record<string, unknown>;

        if (ev.type === "response.created") {
          const resp = ev.response as Record<string, unknown> | undefined;
          requestId = resp?.id as string | undefined;
          modelUsed = (resp?.model as string) ?? model;
        }

        if (ev.type === "response.output_text.delta") {
          const delta = ev.delta as string;
          if (delta) {
            yield { type: "text_delta", delta } satisfies AIStreamEvent;
          }
        }

        if (ev.type === "response.output_item.added") {
          const item = ev.item as Record<string, unknown> | undefined;
          if (item?.type === "function_call") {
            const id = String(item.call_id ?? item.id ?? "");
            toolArgs.set(id, {
              name: String(item.name ?? ""),
              args: String(item.arguments ?? ""),
            });
          }
        }

        if (ev.type === "response.function_call_arguments.delta") {
          const itemId = String(ev.item_id ?? "");
          const existing = toolArgs.get(itemId) ?? { name: "", args: "" };
          existing.args += String(ev.delta ?? "");
          toolArgs.set(itemId, existing);
        }

        if (ev.type === "response.function_call_arguments.done") {
          const item = ev.item as Record<string, unknown> | undefined;
          const id = String(item?.call_id ?? item?.id ?? "");
          let args: Record<string, unknown> = {};
          try {
            args = JSON.parse(String(item?.arguments ?? "{}")) as Record<
              string,
              unknown
            >;
          } catch {
            args = {};
          }
          toolCalls.push({
            id,
            name: String(item?.name ?? ""),
            arguments: args,
          });
        }

        if (ev.type === "response.completed") {
          const resp = ev.response as Record<string, unknown> | undefined;
          usage = mergeTokenUsage(usage, extractUsage(resp));
          requestId = (resp?.id as string) ?? requestId;
          modelUsed = (resp?.model as string) ?? modelUsed;

          if (toolCalls.length === 0 && resp?.output) {
            toolCalls.push(...parseToolCalls(resp.output as unknown[]));
          }
        }
      }

      yield {
        type: "completed",
        response: {
          content: null,
          toolCalls: options?.signal?.aborted ? [] : toolCalls,
          metadata: {
            model: modelUsed,
            request_id: requestId,
            usage,
            provider: "openai",
            aborted: options?.signal?.aborted ?? false,
          },
        },
      } satisfies AIStreamEvent;
    },

    async completeWithToolOutputs(
      request: AIRequest,
      toolOutputs: { call_id: string; output: string }[],
      options?: AIProviderOptions
    ): Promise<AIResponse> {
      const client = await getClient();

      const model = options?.model ?? config.defaultModel ?? "gpt-4o-mini";
      const timeoutMs = options?.timeoutMs ?? config.defaultTimeoutMs ?? 60_000;
      const maxRetries = options?.maxRetries ?? config.defaultMaxRetries ?? 2;

      const response = await withRetry(
        async () =>
          withTimeout(
            client.responses.create({
              model,
              ...resolveRequestParams(request, options),
              input: [
                ...buildInput(request),
                ...toolOutputs.map((t) => ({
                  type: "function_call_output" as const,
                  call_id: t.call_id,
                  output: t.output,
                })),
              ],
            }),
            timeoutMs,
            options?.signal
          ),
        { maxRetries, signal: options?.signal }
      );

      const output = (response.output ?? []) as unknown[];
      const toolCalls = parseToolCalls(output);

      return {
        content:
          response.output_text?.trim() ||
          (toolCalls.length > 0 ? null : "Информация недоступна. Свяжитесь с ресепшном."),
        toolCalls,
        metadata: {
          model: response.model ?? model,
          request_id: response.id,
          usage: extractUsage(response),
          provider: "openai",
        },
      };
    },
  };
}
