"use client";

import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  message: string;
  className?: string;
};

export function WorkspaceAiHint({ message, className }: Props) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-[var(--ds-radius-card)] border border-[var(--shell-border)]/35 bg-[var(--shell-surface-raised)]/45 px-3.5 py-3",
        className
      )}
    >
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)]">
        <Sparkles size={12} aria-hidden />
      </div>
      <p className="min-w-0 pt-0.5 text-[12px] leading-relaxed text-[var(--shell-nav-text)]">
        {message}
      </p>
    </div>
  );
}
