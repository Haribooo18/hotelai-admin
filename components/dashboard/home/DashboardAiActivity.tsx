"use client";

import Link from "next/link";
import { Bot, MessageSquare } from "lucide-react";

import { Badge } from "@/components/ui/display/Badge";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { SkeletonGroup } from "@/components/ui/display/Skeleton";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { Section } from "@/components/ui/primitives/Section";

import type { AiActivityItem } from "./dashboard-metrics";
import {
  DashboardCardAction,
  DashboardListItem,
  matchesDashboardSearch,
} from "./dashboard-ui";
import { formatAdminDateShort } from "@/lib/dashboard/format";
import { formatTranslation, useI18n } from "@/lib/i18n";

type Props = {
  items: AiActivityItem[];
  loading: boolean;
  searchQuery?: string;
};

const STATUS_VARIANT: Record<string, "success" | "default" | "warning" | "destructive"> = {
  new: "success",
  contacted: "default",
  confirmed: "default",
  cancelled: "destructive",
};

function formatRelativeTime(
  value: string,
  t: ReturnType<typeof useI18n>["t"],
  locale: ReturnType<typeof useI18n>["locale"]
): string {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) return t("dashboard.justNow");
  if (diffMinutes < 60) {
    return formatTranslation(t("dashboard.relativeMinutesAgo"), {
      count: String(diffMinutes),
    });
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return formatTranslation(t("dashboard.relativeHoursAgo"), {
      count: String(diffHours),
    });
  }

  return formatAdminDateShort(date, locale);
}

export function DashboardAiActivity({
  items,
  loading,
  searchQuery = "",
}: Props) {
  const { locale, t } = useI18n();
  const filteredItems = items.filter((item) =>
    matchesDashboardSearch(searchQuery, [
      item.guestName,
      item.preview,
      item.status,
      item.channel,
    ])
  );

  return (
    <GlassSurface className="overflow-hidden p-[var(--ds-surface-padding)]">
      <Section
        title={t("pages.messages.title")}
        subtitle={t("dashboard.aiActivitySubtitle")}
        action={<DashboardCardAction href="/ai" label={t("dashboard.aiInbox")} />}
      />

      {loading ? (
        <SkeletonGroup />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title={t("dashboard.noConversationsYet")}
          description={t("dashboard.noConversationsDesc")}
          icon={<Bot size={18} />}
        />
      ) : (
        <div className="space-y-2" role="list" aria-label={t("dashboard.aiConversationsAria")}>
          {filteredItems.map((item) => (
            <Link key={item.id} href="/ai" className="block focus-visible:outline-none">
              <DashboardListItem
                as="article"
                className="group flex items-start gap-3 focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)]">
                  <MessageSquare size={15} aria-hidden />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[13px] font-medium text-[var(--shell-text)]">
                      {item.guestName}
                    </p>
                    <span className="shrink-0 text-[11px] text-[var(--shell-muted)]">
                      {formatRelativeTime(item.createdAt, t, locale)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-[12px] text-[var(--shell-muted)]">
                    {item.preview}
                  </p>
                  <Badge
                    variant={STATUS_VARIANT[item.status] ?? "default"}
                    className="mt-2 uppercase"
                  >
                    {item.status}
                  </Badge>
                </div>
              </DashboardListItem>
            </Link>
          ))}
        </div>
      )}
    </GlassSurface>
  );
}
