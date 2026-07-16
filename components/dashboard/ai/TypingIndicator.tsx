"use client";

import { Bot, UserRound } from "lucide-react";

import { motionPresets } from "@/lib/design/motion";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Props = {
  label?: string;
  actor?: "guest" | "ai";
};

export function TypingIndicator({
  label,
  actor = "guest",
}: Props) {
  const { t } = useI18n();
  const defaultLabel =
    actor === "ai" ? t("ai.composing") : t("ai.guestTyping");

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-1 py-1",
        actor === "ai" && "text-emerald-400",
        motionPresets.page.enter
      )}
      role="status"
      aria-live="polite"
      aria-label={label ?? defaultLabel}
    >
      <div
        className={cn(
          "flex size-7 items-center justify-center rounded-full",
          actor === "ai"
            ? "bg-emerald-500/12 shadow-[0_0_14px_rgba(16,185,129,0.15)]"
            : "bg-[var(--shell-surface-raised)]"
        )}
      >
        {actor === "ai" ? (
          <Bot size={13} aria-hidden />
        ) : (
          <UserRound size={13} className="text-[var(--shell-muted)]" aria-hidden />
        )}
      </div>

      <span className="text-[12px] text-[var(--shell-muted)]">
        {label ?? defaultLabel}
      </span>

      <span className="flex gap-1" aria-hidden>
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={cn(
              "size-1.5 animate-bounce rounded-full",
              actor === "ai" ? "bg-emerald-400/80" : "bg-[var(--shell-muted)]"
            )}
            style={{ animationDelay: `${index * 150}ms` }}
          />
        ))}
      </span>
    </div>
  );
}
