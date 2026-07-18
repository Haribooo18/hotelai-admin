import type {
  AIProvider,
  AIProviderOptions,
  AIRequest,
  AIResponse,
  AIStreamEvent,
  AIToolCall,
} from "../types";
import type { AITokenUsage } from "@/types/ai-settings";

import { providerCircuitBreaker } from "../circuit-breaker";
import { EMPTY_TOKEN_USAGE, mergeTokenUsage } from "../cost";
import { createAbortDeadline, withRetry, withTimeout } from "../retry";

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

function extractFinishReason(raw: unknown): string | undefined {
  const status = (raw as { status?: string })?.status;
  return typeof status === "string" ? status : undefined;
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

    const callId = String(row.call_id ?? "").trim();
    const name = String(row.name ?? "").trim();
    if (!callId || !name) continue;

    calls.push({
      id: callId,
      name,
      arguments: args,
    });
  }

  return calls;
}

export type OpenAIProvider = AIProvider & {
  completeWithToolOutputs: (
    request: AIRequest,
    previousResponseId: string,
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

  async function callResponsesApi(
    request: AIRequest,
    options: AIProviderOptions | undefined,
    extra?: {
      input?: ResponseInputItem[];
      previousResponseId?: string;
    }
  ) {
    const client = await getClient();
    const model = options?.model ?? config.defaultModel ?? "gpt-4o-mini";
    const timeoutMs = options?.timeoutMs ?? config.defaultTimeoutMs ?? 60_000;
    const maxRetries = options?.maxRetries ?? config.defaultMaxRetries ?? 2;
    let retryCount = 0;

    const deadline = createAbortDeadline(timeoutMs, options?.signal);

    try {
      return await providerCircuitBreaker.execute("openai", () =>
        withRetry(
          async () => {
            const response = await client.responses.create(
              {
                model,
                ...resolveRequestParams(request, options),
                ...(extra?.input ? { input: extra.input } : {}),
                ...(extra?.previousResponseId
                  ? { previous_response_id: extra.previousResponseId }
                  : {}),
              },
              { signal: deadline.signal }
            );

            return { response, model, retryCount };
          },
          {
            maxRetries,
            signal: options?.signal,
            onRetry: () => {
              retryCount += 1;
            },
          }
        )
      );
    } finally {
      deadline.cleanup();
    }
  }

  return {
    name: "openai",

    async complete(request, options?: AIProviderOptions) {
      const { response, model, retryCount } = await callResponsesApi(
        request,
        options
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
          finish_reason: extractFinishReason(response),
          provider: "openai",
          retry_count: retryCount,
        },
      } satisfies AIResponse;
    },

    async *stream(request, options?: AIProviderOptions) {
      const client = await getClient();
      const model = options?.model ?? config.defaultModel ?? "gpt-4o-mini";
      const timeoutMs = options?.timeoutMs ?? config.defaultTimeoutMs ?? 60_000;
      const maxRetries = options?.maxRetries ?? config.defaultMaxRetries ?? 2;
      let retryCount = 0;

      const streamDeadline = createAbortDeadline(timeoutMs * 2, options?.signal);

      try {
        const stream = await providerCircuitBreaker.execute("openai", () =>
          withRetry(
            () =>
              withTimeout(
                client.responses.create(
                  {
                    model,
                    ...resolveRequestParams(request, options),
                    stream: true,
                  },
                  { signal: streamDeadline.signal }
                ),
                timeoutMs,
                options?.signal
              ),
            {
              maxRetries,
              signal: options?.signal,
              onRetry: () => {
                retryCount += 1;
              },
            }
          )
        );

        let usage = { ...EMPTY_TOKEN_USAGE };
        let requestId: string | undefined;
        let modelUsed = model;
        let finishReason: string | undefined;
        const toolCalls: AIToolCall[] = [];
        const toolArgs = new Map<
          string,
          { callId: string; name: string; args: string }
        >();

        for await (const event of stream) {
          if (options?.signal?.aborted || streamDeadline.signal.aborted) {
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
              const itemId = String(item.id ?? "").trim();
              if (itemId) {
                toolArgs.set(itemId, {
                  callId: String(item.call_id ?? "").trim(),
                  name: String(item.name ?? "").trim(),
                  args: String(item.arguments ?? ""),
                });
              }
            }
          }

          if (ev.type === "response.function_call_arguments.delta") {
            const itemId = String(ev.item_id ?? "").trim();
            if (itemId) {
              const existing = toolArgs.get(itemId) ?? {
                callId: "",
                name: "",
                args: "",
              };
              existing.args += String(ev.delta ?? "");
              toolArgs.set(itemId, existing);
            }
          }

          if (ev.type === "response.function_call_arguments.done") {
            const itemId = String(ev.item_id ?? "").trim();
            const existing = toolArgs.get(itemId);
            const callId = existing?.callId.trim() ?? "";
            const name = String(ev.name ?? existing?.name ?? "").trim();
            const rawArguments = String(ev.arguments ?? existing?.args ?? "{}");

            // The Responses API sends the original function call identifier as
            // item.call_id on response.output_item.added. item_id is a separate
            // output-item identifier and must not be returned as call_id.
            if (callId && name) {
              let args: Record<string, unknown> = {};
              try {
                args = JSON.parse(rawArguments) as Record<string, unknown>;
              } catch {
                args = {};
              }
              toolCalls.push({ id: callId, name, arguments: args });
            }
          }

          if (ev.type === "response.completed") {
            const resp = ev.response as Record<string, unknown> | undefined;
            usage = mergeTokenUsage(usage, extractUsage(resp));
            requestId = (resp?.id as string) ?? requestId;
            modelUsed = (resp?.model as string) ?? modelUsed;
            finishReason = extractFinishReason(resp);

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
              finish_reason: finishReason,
              provider: "openai",
              aborted: options?.signal?.aborted ?? streamDeadline.signal.aborted,
              retry_count: retryCount,
            },
          },
        } satisfies AIStreamEvent;
      } finally {
        streamDeadline.cleanup();
      }
    },

    async completeWithToolOutputs(
      request: AIRequest,
      previousResponseId: string,
      toolOutputs: { call_id: string; output: string }[],
      options?: AIProviderOptions
    ): Promise<AIResponse> {
      const validToolOutputs = toolOutputs.filter(
        (item) => item.call_id.trim().length > 0
      );

      if (validToolOutputs.length !== toolOutputs.length) {
        throw new Error("AI provider received a tool output with an empty call_id");
      }

      const { response, model, retryCount } = await callResponsesApi(
        request,
        options,
        {
          previousResponseId,
          input: validToolOutputs.map((item) => ({
            type: "function_call_output" as const,
            call_id: item.call_id,
            output: item.output,
          })),
        }
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
          finish_reason: extractFinishReason(response),
          provider: "openai",
          retry_count: retryCount,
        },
      };
    },
  };
}
