"use client";

import { useState } from "react";
import { Bot, Copy, Paperclip, Sparkles, UserRound } from "lucide-react";
import { toast } from "@/lib/toast";

import { Avatar, AvatarFallback } from "@/components/ui/display/Avatar";
import { Badge } from "@/components/ui/display/Badge";
import { motionPresets } from "@/lib/design/motion";
import { formatAdminTime } from "@/lib/dashboard/format";
import { useI18n } from "@/lib/i18n";
import type { TranslationPath } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/message";

import { AIThinkingBlock, AIToolBlock } from "./ai-ui";
import { getGuestInitials } from "./ai-ops-metrics";

type Props = {
  message: Message;
  guestName: string;
  grouped?: boolean;
};

function formatTime(iso: string, locale: ReturnType<typeof useI18n>["locale"]) {
  return formatAdminTime(iso, locale);
}

const ROLE_KEYS: Record<string, TranslationPath> = {
  guest: "ai.roleGuest",
  staff: "ai.roleStaff",
  ai: "ai.roleAi",
  system: "ai.roleSystem",
};

function getToolMetadata(message: Message): { title: string; detail?: string } | null {
  const metadata = message.metadata;
  if (!metadata || typeof metadata !== "object") return null;

  const toolName =
    (typeof metadata.tool_name === "string" && metadata.tool_name) ||
    (typeof metadata.tool === "string" && metadata.tool) ||
    null;

  if (!toolName) return null;

  const detail =
    typeof metadata.tool_result === "string"
      ? metadata.tool_result
      : typeof metadata.summary === "string"
        ? metadata.summary
        : undefined;

  return { title: toolName, detail };
}

function isThinkingMessage(message: Message): boolean {
  const metadata = message.metadata;
  if (!metadata || typeof metadata !== "object") return false;
  return metadata.thinking === true || metadata.is_thinking === true;
}

export function MessageBubble({ message, guestName, grouped = false }: Props) {
  const { locale, t } = useI18n();
  const [copied, setCopied] = useState(false);
  const isOwn = message.role === "staff" || message.role === "ai";
  const isInternal = message.is_internal;
  const toolMeta = getToolMetadata(message);
  const thinking = isThinkingMessage(message);
  const roleLabel = t(ROLE_KEYS[message.role] ?? "ai.roleSystem");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.body);
      setCopied(true);
      toast.success(t("ai.copied"));
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error(t("ai.copyFailed"));
    }
  }

  return (
    <article
      className={cn(
        "group flex w-full gap-2",
        isOwn ? "justify-end" : "justify-start",
        grouped && "mt-1"
      )}
    >
      {!isOwn && !grouped ? (
        <Avatar className="mt-1 size-7">
          <AvatarFallback className="text-[10px] font-semibold">
            {getGuestInitials(guestName)}
          </AvatarFallback>
        </Avatar>
      ) : !isOwn ? (
        <div className="w-7 shrink-0" aria-hidden />
      ) : null}

      <div className={cn("max-w-[78%]", isOwn && "order-first")}>
        {!grouped ? (
          <div
            className={cn(
              "mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.06em] text-[var(--shell-muted)]",
              isOwn && "justify-end"
            )}
          >
            {isOwn && message.role === "ai" ? (
              <Bot size={12} className="text-emerald-400" aria-hidden />
            ) : null}
            <span>{roleLabel}</span>
            {isInternal ? (
              <Badge variant="warning" className="normal-case">
                {t("ai.internalBadge")}
              </Badge>
            ) : null}
          </div>
        ) : null}

        <div
          className={cn(
            "relative rounded-[var(--ds-radius)] px-3.5 py-2.5 text-[13px] leading-relaxed shadow-[var(--shell-shadow-sm)]",
            motionPresets.transitionBase,
            motionPresets.hover.surfaceLift,
            isInternal &&
              "border border-dashed border-amber-500/30 bg-amber-500/10 text-[var(--shell-text)]",
            !isInternal &&
              message.role === "guest" &&
              "bg-[var(--shell-surface-raised)] text-[var(--shell-text)]",
            !isInternal &&
              message.role === "staff" &&
              "bg-emerald-600 text-white",
            !isInternal &&
              message.role === "ai" &&
              "border border-emerald-500/20 bg-gradient-to-br from-emerald-600/90 to-emerald-500/80 text-white shadow-[0_0_18px_rgba(16,185,129,0.12)]",
            !isInternal &&
              message.role === "system" &&
              "bg-[var(--shell-surface-raised)]/80 text-[var(--shell-muted)] text-[12px]"
          )}
        >
          {thinking ? <AIThinkingBlock label={t("ai.thinking")} /> : null}

          <p className="whitespace-pre-wrap break-words">{message.body}</p>

          {toolMeta ? (
            <AIToolBlock title={toolMeta.title} detail={toolMeta.detail} />
          ) : null}

          <div
            className={cn(
              "mt-2 flex items-center gap-2",
              isOwn ? "justify-end" : "justify-between"
            )}
          >
            <time
              dateTime={message.created_at}
              className={cn(
                "text-[10px]",
                message.role === "staff" || message.role === "ai"
                  ? "text-white/70"
                  : "text-[var(--shell-muted)]"
              )}
            >
              {formatTime(message.created_at, locale)}
            </time>

            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                "inline-flex items-center gap-1 rounded-[var(--ds-radius-sm)] px-1.5 py-0.5 text-[10px] opacity-0 transition-opacity duration-[var(--ds-duration)] group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]",
                message.role === "staff" || message.role === "ai"
                  ? "text-white/80 hover:bg-white/10"
                  : "text-[var(--shell-muted)] hover:bg-[var(--shell-nav-hover-bg)]"
              )}
            >
              <Copy size={11} aria-hidden />
              {copied ? t("ai.copiedShort") : t("ai.copyLabel")}
            </button>
          </div>
        </div>

        {message.metadata &&
        typeof message.metadata === "object" &&
        "attachments" in message.metadata &&
        Array.isArray(message.metadata.attachments) ? (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {(message.metadata.attachments as string[]).map((attachment) => (
              <Badge
                key={attachment}
                variant="outline"
                className="gap-1 normal-case"
              >
                <Paperclip size={11} aria-hidden />
                {attachment}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      {isOwn && !grouped ? (
        <div
          className={cn(
            "mt-1 flex size-7 shrink-0 items-center justify-center rounded-full",
            message.role === "ai"
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-[var(--shell-surface-raised)] text-[var(--shell-muted)]"
          )}
        >
          {message.role === "ai" ? (
            <Sparkles size={13} aria-hidden />
          ) : (
            <UserRound size={13} aria-hidden />
          )}
        </div>
      ) : isOwn ? (
        <div className="w-7 shrink-0" aria-hidden />
      ) : null}
    </article>
  );
}
