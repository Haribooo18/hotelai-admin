"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send, Sparkles, User } from "lucide-react";
import { toast } from "@/lib/toast";

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
import {
  formCheckboxLabelClass,
  formCheckboxRowClass,
  formErrorClass,
  formRaisedControlClass,
} from "@/lib/dashboard/design-system";
import { motionPresets } from "@/lib/design/motion";
import { localizeErrorWithT, useI18n } from "@/lib/i18n";
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

const PROMPT_SHORTCUT_KEYS = [
  "ai.shareCheckIn",
  "ai.offerLateCheckout",
  "ai.confirmReservation",
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
  const { t } = useI18n();
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
            localizeErrorWithT(
              t,
              err instanceof Error ? err.message : t("ai.sendFailed")
            )
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
      setError(parsed.error.issues[0]?.message ?? t("errors.invalidData"));
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
          localizeErrorWithT(
            t,
            err instanceof Error ? err.message : t("ai.sendFailed")
          )
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
            {PROMPT_SHORTCUT_KEYS.map((key) => {
              const shortcut = t(key);
              return (
              <button
                key={key}
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
            );
            })}
          </Inline>
        </Inline>

        <label htmlFor="message-body" className="sr-only">
          {t("ai.messageLabel")}
        </label>

        <Textarea
          id="message-body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={
            asGuest
              ? t("ai.messageAsGuest")
              : isInternal
                ? t("ai.internalNote")
                : t("ai.writeReply")
          }
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "message-error" : undefined}
          disabled={disabled}
          className={cn("min-h-[88px] text-[13px]", formRaisedControlClass)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSubmit(event);
            }
          }}
        />

        {error ? (
          <p id="message-error" className={formErrorClass}>
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Inline gap="md" wrap>
            <label className={cn(formCheckboxRowClass, formCheckboxLabelClass, "text-[12px] text-[var(--shell-muted)]")}>
              <Checkbox
                checked={isInternal}
                onCheckedChange={(checked) => {
                  const next = checked === true;
                  setIsInternal(next);
                  if (next) setAsGuest(false);
                }}
                disabled={asGuest || disabled}
              />
              {t("ai.internalNoteLabel")}
            </label>

            <label className={cn(formCheckboxRowClass, formCheckboxLabelClass, "text-[12px] text-[var(--shell-muted)]")}>
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
              {t("ai.asGuestLabel")}
            </label>
          </Inline>

          <Button
            type="submit"
            disabled={disabled || !body.trim()}
            loading={pending}
            className="gap-2"
          >
            {streaming ? <Spinner size={14} label={t("ai.streamingLabel")} /> : <Send size={14} aria-hidden />}
            {pending ? t("common.sending") : streaming ? t("ai.streamingProgress") : t("common.send")}
          </Button>
        </div>
      </form>
    </GlassSurface>
  );
}
