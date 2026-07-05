"use client";

import { useState } from "react";
import { Bot, Copy, Sparkles, UserRound } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import type { Message } from "@/types/message";

import { getGuestInitials } from "./ai-ops-metrics";

type Props = {
  message: Message;
  guestName: string;
  grouped?: boolean;
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const roleLabels: Record<string, string> = {
  guest: "Guest",
  staff: "Staff",
  ai: "AI Assistant",
  system: "System",
};

export function MessageBubble({ message, guestName, grouped = false }: Props) {
  const [copied, setCopied] = useState(false);
  const isOwn = message.role === "staff" || message.role === "ai";
  const isInternal = message.is_internal;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.body);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  }

  return (
    <div
      className={cn(
        "group flex w-full gap-2",
        isOwn ? "justify-end" : "justify-start",
        grouped && "mt-1"
      )}
    >
      {!isOwn && !grouped ? (
        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--shell-surface-raised)] text-[10px] font-semibold text-[var(--shell-muted)]">
          {getGuestInitials(guestName)}
        </div>
      ) : !isOwn ? (
        <div className="w-7 shrink-0" />
      ) : null}

      <div className={cn("max-w-[78%]", isOwn && "order-first")}>
        {!grouped ? (
          <div
            className={cn(
              "mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.06em]",
              isOwn ? "justify-end text-[var(--shell-muted)]" : "text-[var(--shell-muted)]"
            )}
          >
            {isOwn && message.role === "ai" ? (
              <Bot size={12} className="text-emerald-400" />
            ) : null}
            <span>{roleLabels[message.role] ?? message.role}</span>
            {isInternal ? <span>· internal</span> : null}
          </div>
        ) : null}

        <div
          className={cn(
            "relative rounded-[var(--ds-radius)] px-3.5 py-2.5 text-[13px] leading-relaxed shadow-[var(--shell-shadow-sm)] transition-[transform,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] group-hover:-translate-y-px group-hover:shadow-[var(--shell-shadow-md)]",
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
          <p className="whitespace-pre-wrap break-words">{message.body}</p>

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
              {formatTime(message.created_at)}
            </time>

            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                "inline-flex items-center gap-1 rounded-[var(--ds-radius-sm)] px-1.5 py-0.5 text-[10px] opacity-0 transition-opacity duration-[var(--ds-duration)] group-hover:opacity-100",
                message.role === "staff" || message.role === "ai"
                  ? "text-white/80 hover:bg-white/10"
                  : "text-[var(--shell-muted)] hover:bg-[var(--shell-nav-hover-bg)]"
              )}
            >
              <Copy size={11} />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {message.metadata &&
        typeof message.metadata === "object" &&
        "attachments" in message.metadata &&
        Array.isArray(message.metadata.attachments) ? (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {(message.metadata.attachments as string[]).map((attachment) => (
              <span
                key={attachment}
                className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)] px-2 py-1 text-[11px] text-[var(--shell-muted)]"
              >
                {attachment}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {isOwn && !grouped ? (
        <div
          className={cn(
            "mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
            message.role === "ai"
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-[var(--shell-surface-raised)] text-[var(--shell-muted)]"
          )}
        >
          {message.role === "ai" ? (
            <Sparkles size={13} />
          ) : (
            <UserRound size={13} />
          )}
        </div>
      ) : isOwn ? (
        <div className="w-7 shrink-0" />
      ) : null}
    </div>
  );
}
