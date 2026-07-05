"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Paperclip, Send, Sparkles, User } from "lucide-react";
import { toast } from "sonner";

import type { Conversation } from "@/types/conversation";

import { sendMessage } from "@/lib/services/ai.mutations";
import { sendGuestMessage } from "@/lib/services/ai-completion.service";
import { sendMessageSchema } from "@/lib/validations/ai";

import { Button } from "@/components/ui/core/Button";
import { Checkbox } from "@/components/ui/core/Checkbox";
import { Textarea } from "@/components/ui/core/Textarea";
import { FilterChip } from "@/components/ui/data/FilterBar";
import { Spinner } from "@/components/ui/feedback/Spinner";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { Inline } from "@/components/ui/primitives/Inline";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

import { getSuggestedReplies } from "./ai-ops-metrics";
import { streamAIConversation } from "./ai-stream-client";

type Props = {
  conversationId: string;
  conversation: Conversation;
  aiEnabled?: boolean;
  streaming?: boolean;
  onSent?: () => void;
  onStreamDelta?: (text: string) => void;
  onStreamEnd?: () => void;
};

const PROMPT_SHORTCUTS = [
  "Share check-in time",
  "Offer late checkout",
  "Confirm reservation details",
] as const;

export function MessageComposer({
  conversationId,
  conversation,
  aiEnabled = false,
  streaming = false,
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

  const disabled = pending || streaming;

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
    <GlassSurface className="border-t border-[var(--shell-border)]/50 p-3">
      <form onSubmit={handleSubmit} className="space-y-2.5" noValidate>
        <Inline gap="sm" wrap className="justify-between">
          <Inline gap="sm" wrap>
            {suggestions.map((suggestion) => (
              <FilterChip
                key={suggestion}
                active={body === suggestion}
                onClick={() => setBody(suggestion)}
              >
                {suggestion}
              </FilterChip>
            ))}
          </Inline>
          <Inline gap="sm" wrap>
            {PROMPT_SHORTCUTS.map((shortcut) => (
              <button
                key={shortcut}
                type="button"
                onClick={() => setBody(shortcut)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full bg-[var(--shell-surface-raised)] px-2.5 py-1 text-[10px] font-medium text-[var(--shell-muted)] shadow-[var(--shell-shadow-sm)]",
                  motionPresets.transitionBase,
                  "hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]"
                )}
              >
                <Sparkles size={11} aria-hidden />
                {shortcut}
              </button>
            ))}
          </Inline>
        </Inline>

        <label htmlFor="message-body" className="sr-only">
          Message
        </label>

        <Textarea
          id="message-body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={
            asGuest
              ? "Message as guest (test)…"
              : isInternal
                ? "Internal note (not visible to guest)…"
                : "Write a reply…"
          }
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "message-error" : undefined}
          disabled={disabled}
          className="min-h-[88px] rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] text-[13px] shadow-[var(--shell-shadow-sm)]"
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSubmit(event);
            }
          }}
        />

        {error ? (
          <p id="message-error" className="text-[12px] text-red-400">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Inline gap="md" wrap>
            <label className="inline-flex items-center gap-2 text-[12px] text-[var(--shell-muted)]">
              <Checkbox
                checked={isInternal}
                onCheckedChange={(checked) => {
                  const next = checked === true;
                  setIsInternal(next);
                  if (next) setAsGuest(false);
                }}
                disabled={asGuest || disabled}
              />
              Internal note
            </label>

            <label className="inline-flex items-center gap-2 text-[12px] text-[var(--shell-muted)]">
              <Checkbox
                checked={asGuest}
                onCheckedChange={(checked) => {
                  const next = checked === true;
                  setAsGuest(next);
                  if (next) setIsInternal(false);
                }}
                disabled={disabled}
              />
              <User size={13} aria-hidden />
              As guest
            </label>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled
              aria-label="Attachments coming soon"
              title="Attachments coming soon"
            >
              <Paperclip size={14} aria-hidden />
              Attach
            </Button>
          </Inline>

          <Button
            type="submit"
            disabled={disabled || !body.trim()}
            loading={pending}
            className="gap-2 bg-emerald-600 hover:bg-emerald-500"
          >
            {streaming ? <Spinner size={14} label="Streaming" /> : <Send size={14} aria-hidden />}
            {pending ? "Sending…" : streaming ? "Streaming…" : "Send"}
          </Button>
        </div>
      </form>
    </GlassSurface>
  );
}
