import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Divider } from "@/components/ui/primitives/Divider";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

export function AIWorkspaceAction({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1 text-[12px] font-medium text-[var(--shell-accent)]",
        motionPresets.transitionOpacity,
        "hover:opacity-80 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]"
      )}
    >
      {label}
      <ArrowRight size={13} aria-hidden />
    </Link>
  );
}

export function AIConversationCard({
  selected = false,
  className,
  children,
  ...props
}: ComponentProps<"button"> & {
  selected?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      className={cn(
        "group w-full border-b border-[var(--shell-border)]/40 px-3 py-3 text-left",
        motionPresets.transitionBase,
        "hover:bg-[var(--shell-surface-raised)]/70 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--shell-accent-ring)]",
        selected &&
          "bg-[var(--shell-nav-active-bg)]/50 shadow-[inset_2px_0_0_0_var(--shell-accent)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function AIDateSeparator({ label }: { label: string }) {
  return (
    <div
      className="flex items-center gap-3 py-1"
      role="separator"
      aria-label={label}
    >
      <Divider className="flex-1 bg-[var(--shell-border)]/60" />
      <span className="ds-overline">
        {label}
      </span>
      <Divider className="flex-1 bg-[var(--shell-border)]/60" />
    </div>
  );
}

export function AIStreamBubble({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-start">
      <div
        className={cn(
          "max-w-[78%] rounded-[var(--ds-radius)] border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2.5 text-[13px] text-[var(--shell-text)] shadow-[0_0_20px_rgba(16,185,129,0.08)]",
          motionPresets.page.enter
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function AIToolBlock({
  title,
  detail,
}: {
  title: string;
  detail?: string;
}) {
  return (
    <div className="mt-2 rounded-[var(--ds-radius-sm)] border border-[var(--shell-border)] bg-[var(--shell-surface-raised)]/80 px-2.5 py-2 text-[11px] text-[var(--shell-muted)]">
      <p className="font-medium text-[var(--shell-text)]">{title}</p>
      {detail ? <p className="mt-1 line-clamp-3">{detail}</p> : null}
    </div>
  );
}

export function AIThinkingBlock({ label }: { label: string }) {
  return (
    <div className="mt-2 rounded-[var(--ds-radius-sm)] border border-dashed border-emerald-500/25 bg-emerald-500/5 px-2.5 py-2 text-[11px] text-emerald-400">
      {label}
    </div>
  );
}
