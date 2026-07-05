"use client";

import Link from "next/link";
import { ArrowRight, Bot, MessageSquare } from "lucide-react";

import type { AiActivityItem } from "./dashboard-metrics";
import {
  DashboardEmptyState,
  DashboardPanelHeader,
  DashboardSkeleton,
  DashboardSurface,
} from "./DashboardPrimitives";
import { cn } from "@/lib/utils";

type Props = {
  items: AiActivityItem[];
  loading: boolean;
};

const STATUS_STYLES: Record<string, string> = {
  new: "bg-emerald-500/12 text-emerald-500",
  contacted: "bg-sky-500/12 text-sky-400",
  confirmed: "bg-violet-500/12 text-violet-400",
  cancelled: "bg-red-500/12 text-red-400",
};

function formatRelativeTime(value: string): string {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(date);
}

export function DashboardAiActivity({ items, loading }: Props) {
  return (
    <DashboardSurface glass className="p-[var(--ds-surface-padding)]">
      <DashboardPanelHeader
        title="AI Receptionist"
        subtitle="Live guest conversations"
        action={
          <Link
            href="/ai"
            className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--shell-accent)] transition-opacity duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:opacity-80"
          >
            Inbox
            <ArrowRight size={13} />
          </Link>
        }
      />

      {loading ? (
        <DashboardSkeleton />
      ) : items.length === 0 ? (
        <DashboardEmptyState
          title="No conversations yet"
          description="When guests message your AI receptionist, activity will appear here."
          icon={<Bot size={18} />}
        />
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.id}
              href="/ai"
              className="group flex items-start gap-3 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 p-3 transition-[transform,background-color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px hover:bg-[var(--shell-surface-raised)] hover:shadow-[var(--shell-shadow-sm)]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)]">
                <MessageSquare size={15} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[13px] font-medium text-[var(--shell-text)]">
                    {item.guestName}
                  </p>
                  <span className="shrink-0 text-[11px] text-[var(--shell-muted)]">
                    {formatRelativeTime(item.createdAt)}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-[12px] text-[var(--shell-muted)]">
                  {item.preview}
                </p>
                <span
                  className={cn(
                    "mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.04em]",
                    STATUS_STYLES[item.status] ?? STATUS_STYLES.new
                  )}
                >
                  {item.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardSurface>
  );
}
