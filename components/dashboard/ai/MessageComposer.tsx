"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send, User } from "lucide-react";
import { toast } from "sonner";

import type { Conversation } from "@/types/conversation";

import { sendMessage } from "@/lib/services/ai.mutations";
import { sendGuestMessage } from "@/lib/services/ai-completion.service";
import { sendMessageSchema } from "@/lib/validations/ai";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chipClass, chipIdleClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

import { getSuggestedReplies } from "./ai-ops-metrics";
import { streamAIConversation } from "./ai-stream-client";

type Props = {
  conversationId: string;
  conversation: Conversation;
  aiEnabled?: boolean;
  onSent?: () => void;
  onStreamDelta?: (text: string) => void;
  onStreamEnd?: () => void;
};

export function MessageComposer({
  conversationId,
  conversation,
  aiEnabled = false,
  onSent,
  onStreamDelta,
  onStreamEnd,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [body, setBody] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [asGuest, setAsGuest] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestions = useMemo(
    () => getSuggestedReplies(conversation),
    [conversation]
  );

  async function streamAIResponse() {
    await streamAIConversation(conversationId, {
      onDelta: onStreamDelta,
    });
    onStreamEnd?.();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (asGuest) {
      setError(null);
      const sentBody = body;
      setBody("");

      startTransition(async () => {
        try {
          await sendGuestMessage({
            conversation_id: conversationId,
            body: sentBody,
            trigger_ai: aiEnabled,
          });
          if (aiEnabled) {
            await streamAIResponse();
          }
          router.refresh();
          onSent?.();
        } catch (err) {
          setBody(sentBody);
          toast.error(
            err instanceof Error ? err.message : "Failed to send"
          );
        }
      });
      return;
    }

    const parsed = sendMessageSchema.safeParse({
      conversation_id: conversationId,
      body,
      is_internal: isInternal,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Error");
      return;
    }

    setError(null);
    const sentBody = body;
    setBody("");

    startTransition(async () => {
      try {
        await sendMessage(parsed.data);
        router.refresh();
        onSent?.();
      } catch (err) {
        console.error(err);
        setBody(sentBody);
        toast.error(
          err instanceof Error ? err.message : "Failed to send"
        );
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-[var(--shell-border)]/50 bg-[var(--shell-surface)]/92 p-3 backdrop-blur-xl"
      noValidate
    >
      {suggestions.length > 0 ? (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setBody(suggestion)}
              className={cn(chipClass, chipIdleClass, "rounded-full px-3 py-1 text-[11px]")}
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}

      <label htmlFor="message-body" className="sr-only">
        Message
      </label>

      <Textarea
        id="message-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={
          asGuest
            ? "Message as guest (test)…"
            : isInternal
              ? "Internal note (not visible to guest)…"
              : "Write a reply…"
        }
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "message-error" : undefined}
        className="min-h-[88px] rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] text-[13px] shadow-[var(--shell-shadow-sm)]"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />

      {error ? (
        <p id="message-error" className="mt-1 text-[12px] text-red-400">
          {error}
        </p>
      ) : null}

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-[12px] text-[var(--shell-muted)]">
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(e) => {
                setIsInternal(e.target.checked);
                if (e.target.checked) setAsGuest(false);
              }}
              disabled={asGuest}
              className="h-3.5 w-3.5 rounded border-[var(--shell-border)] accent-emerald-600"
            />
            Internal note
          </label>

          <label className="flex items-center gap-2 text-[12px] text-[var(--shell-muted)]">
            <input
              type="checkbox"
              checked={asGuest}
              onChange={(e) => {
                setAsGuest(e.target.checked);
                if (e.target.checked) setIsInternal(false);
              }}
              className="h-3.5 w-3.5 rounded border-[var(--shell-border)] accent-emerald-600"
            />
            <User size={13} />
            As guest
          </label>
        </div>

        <Button
          type="submit"
          disabled={pending || !body.trim()}
          className="h-[var(--ds-input-height)] gap-2 rounded-[var(--ds-radius-sm)] bg-emerald-600 px-4 text-[13px] hover:bg-emerald-500"
        >
          <Send size={14} />
          {pending ? "Sending…" : "Send"}
        </Button>
      </div>
    </form>
  );
}
