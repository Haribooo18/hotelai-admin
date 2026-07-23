import { createHash } from "node:crypto";

import { createAdminClient } from "@/lib/supabase/admin";

import type { Message } from "@/types/message";

import type { AITool, ToolContext, ToolResult } from "./tools";

// Deliberately strict: each pattern must match the ENTIRE guest message
// (aside from trailing punctuation), not just contain the word somewhere
// in a longer sentence. That's intentional for a safety gate on write-risk
// actions — a word appearing mid-sentence isn't reliable enough to greenlight
// creating or cancelling a real booking. What was missing wasn't stricter
// matching, it was *vocabulary*: this used to be almost Russian-only, which
// meant a guest confirming in another language (or with an everyday "ок")
// could get stuck in an infinite "please confirm" loop, unable to actually
// complete the action they already agreed to.
const AFFIRMATIVE = [
  // Russian
  /^да[.! ]*$/i,
  /^ага[.! ]*$/i,
  /^ок(ей)?[.! ]*$/i,
  /^хорошо[.! ]*$/i,
  /^конечно[.! ]*$/i,
  /^верно[.! ]*$/i,
  /^точно[.! ]*$/i,
  /^подтверждаю[.! ]*$/i,
  /^согласен[.! ]*$/i,
  /^согласна[.! ]*$/i,
  /^выполняй[.! ]*$/i,
  /^подтвердить[.! ]*$/i,
  /^да,?\s*подтверждаю[.! ]*$/i,
  // English
  /^yes[.! ]*$/i,
  /^yep[.! ]*$/i,
  /^yeah[.! ]*$/i,
  /^ok(ay)?[.! ]*$/i,
  /^sure[.! ]*$/i,
  /^correct[.! ]*$/i,
  /^confirm(ed)?[.! ]*$/i,
  /^go ahead[.! ]*$/i,
  // Ukrainian
  /^так[.! ]*$/i,
  /^підтверджую[.! ]*$/i,
  // Spanish / Portuguese / Italian
  /^s[ií]m?[.! ]*$/i,
  /^confirmo[.! ]*$/i,
  // French
  /^oui[.! ]*$/i,
  /^d'accord[.! ]*$/i,
  // German
  /^ja[.! ]*$/i,
];

const NEGATIVE = [
  // Russian
  /^нет[.! ]*$/i,
  /^неа[.! ]*$/i,
  /^отмена[.! ]*$/i,
  /^не надо[.! ]*$/i,
  /^не нужно[.! ]*$/i,
  /^отменить[.! ]*$/i,
  // English
  /^no[.! ]*$/i,
  /^nope[.! ]*$/i,
  /^cancel[.! ]*$/i,
  /^not now[.! ]*$/i,
  // Ukrainian
  /^ні[.! ]*$/i,
  /^скасувати[.! ]*$/i,
  // French
  /^non[.! ]*$/i,
  // German
  /^nein[.! ]*$/i,
];

type StoredToolInput = {
  arguments: Record<string, unknown>;
  fingerprint: string;
  trigger_message_id: string | null;
};

type StoredToolOutput = {
  tool_output?: Record<string, unknown>;
  summary?: string;
  confirmation_message_id?: string | null;
  declined?: boolean;
};

export type ToolSafetyDecision =
  | { kind: "execute"; actionId: string | null; confirmationMessageId: string | null }
  | { kind: "require_confirmation"; result: ToolResult }
  | { kind: "declined"; result: ToolResult }
  | { kind: "cached"; result: ToolResult };

export async function evaluateToolSafety(
  tool: AITool,
  ctx: ToolContext,
  args: Record<string, unknown>
): Promise<ToolSafetyDecision> {
  if (tool.risk === "read" || tool.risk === "system") {
    return { kind: "execute", actionId: null, confirmationMessageId: null };
  }

  const latestGuest = getLatestGuestMessage(ctx.request.messages);
  const fingerprint = createFingerprint(tool.definition.name, args);
  const supabase = createAdminClient();

  const { data: actions, error } = await supabase
    .from("ai_actions")
    .select("id, input, output, status, created_at")
    .eq("hotel_id", ctx.hotelId)
    .eq("conversation_id", ctx.conversationId)
    .eq("action_type", "tool_confirmation")
    .eq("tool_name", tool.definition.name)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw error;

  const matching = (actions ?? []).filter((action) => {
    const input = action.input as unknown as StoredToolInput;
    return input?.fingerprint === fingerprint;
  });

  const cached = matching.find((action) => {
    if (action.status !== "completed") return false;
    const output = action.output as unknown as StoredToolOutput | null;
    return Boolean(
      latestGuest?.id && output?.confirmation_message_id === latestGuest.id
    );
  });

  if (cached) {
    const output = cached.output as unknown as StoredToolOutput;
    return {
      kind: "cached",
      result: {
        output: output.tool_output ?? {},
        summary: output.summary,
      },
    };
  }

  const pending = matching.find((action) => action.status === "pending");

  if (!pending) {
    const storedInput: StoredToolInput = {
      arguments: args,
      fingerprint,
      trigger_message_id: latestGuest?.id ?? null,
    };

    const { error: insertError } = await supabase.from("ai_actions").insert({
      hotel_id: ctx.hotelId,
      conversation_id: ctx.conversationId,
      action_type: "tool_confirmation",
      tool_name: tool.definition.name,
      input: storedInput,
      status: "pending",
    });

    if (insertError) throw insertError;

    return {
      kind: "require_confirmation",
      result: {
        output: {
          confirmation_required: true,
          tool_name: tool.definition.name,
          risk: tool.risk,
          action_summary: tool.confirmationSummary?.(args) ?? tool.definition.description,
          instruction:
            "Попросите гостя явно подтвердить действие. Не сообщайте, что действие уже выполнено.",
        },
        summary: "Требуется подтверждение гостя",
      },
    };
  }

  if (!latestGuest || new Date(latestGuest.created_at) <= new Date(pending.created_at)) {
    return {
      kind: "require_confirmation",
      result: {
        output: {
          confirmation_required: true,
          tool_name: tool.definition.name,
          risk: tool.risk,
          action_summary: tool.confirmationSummary?.(args) ?? tool.definition.description,
        },
        summary: "Ожидается подтверждение гостя",
      },
    };
  }

  if (matchesAny(latestGuest.body, NEGATIVE)) {
    await supabase
      .from("ai_actions")
      .update({
        status: "failed",
        error_message: "DECLINED_BY_GUEST",
        completed_at: new Date().toISOString(),
        output: { declined: true },
      })
      .eq("id", pending.id)
      .eq("hotel_id", ctx.hotelId);

    return {
      kind: "declined",
      result: {
        output: {
          confirmation_required: false,
          declined: true,
          tool_name: tool.definition.name,
        },
        summary: "Гость отменил действие",
      },
    };
  }

  if (!matchesAny(latestGuest.body, AFFIRMATIVE)) {
    return {
      kind: "require_confirmation",
      result: {
        output: {
          confirmation_required: true,
          tool_name: tool.definition.name,
          risk: tool.risk,
          action_summary: tool.confirmationSummary?.(args) ?? tool.definition.description,
          instruction:
            "Подтверждение должно быть явным: например, «Да, подтверждаю». Не выполняйте действие пока подтверждение не получено.",
        },
        summary: "Ожидается явное подтверждение гостя",
      },
    };
  }

  return {
    kind: "execute",
    actionId: pending.id,
    confirmationMessageId: latestGuest.id,
  };
}

export async function completeToolSafetyAction(input: {
  actionId: string | null;
  hotelId: string;
  confirmationMessageId: string | null;
  result: ToolResult;
}): Promise<void> {
  if (!input.actionId) return;

  const supabase = createAdminClient();
  const output: StoredToolOutput = {
    tool_output: input.result.output,
    summary: input.result.summary,
    confirmation_message_id: input.confirmationMessageId,
  };

  const { error } = await supabase
    .from("ai_actions")
    .update({
      status: "completed",
      output,
      completed_at: new Date().toISOString(),
    })
    .eq("id", input.actionId)
    .eq("hotel_id", input.hotelId);

  if (error) throw error;
}

export async function failToolSafetyAction(input: {
  actionId: string | null;
  hotelId: string;
  error: unknown;
}): Promise<void> {
  if (!input.actionId) return;

  const supabase = createAdminClient();
  const message = input.error instanceof Error ? input.error.message : "TOOL_EXECUTION_FAILED";
  await supabase
    .from("ai_actions")
    .update({
      status: "failed",
      error_message: message,
      completed_at: new Date().toISOString(),
    })
    .eq("id", input.actionId)
    .eq("hotel_id", input.hotelId);
}

function createFingerprint(name: string, args: Record<string, unknown>): string {
  return createHash("sha256")
    .update(`${name}:${stableStringify(args)}`)
    .digest("hex");
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, child]) => `${JSON.stringify(key)}:${stableStringify(child)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function getLatestGuestMessage(messages: Message[]): Message | null {
  for (let index = messages.length - 1; index >= 0; index--) {
    if (messages[index]?.role === "guest") return messages[index] ?? null;
  }
  return null;
}

function matchesAny(value: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(value.trim()));
}
