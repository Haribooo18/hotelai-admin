"use client";

import {
  Bell,
  Brush,
  CalendarCheck,
  CalendarClock,
} from "lucide-react";

import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { SkeletonGroup } from "@/components/ui/display/Skeleton";
import { Surface } from "@/components/ui/primitives/Surface";
import { Section } from "@/components/ui/primitives/Section";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import type { TimelineItem } from "./dashboard-metrics";
import { DashboardListItem, matchesDashboardSearch } from "./dashboard-ui";

type Props = {
  items: TimelineItem[];
  loading: boolean;
  searchQuery?: string;
};

const KIND_META = {
  check_in: {
    icon: CalendarCheck,
    color: "text-emerald-500 bg-emerald-500/10",
  },
  check_out: {
    icon: CalendarClock,
    color: "text-amber-500 bg-amber-500/10",
  },
  cleaning: {
    icon: Brush,
    color: "text-sky-500 bg-sky-500/10",
  },
  reminder: {
    icon: Bell,
    color: "text-violet-500 bg-violet-500/10",
  },
} as const;

export function DashboardTimeline({
  items,
  loading,
  searchQuery = "",
}: Props) {
  const { t } = useI18n();
  const filteredItems = items.filter((item) =>
    matchesDashboardSearch(searchQuery, [item.title, item.subtitle, item.time])
  );

  return (
    <Surface interactive className="overflow-hidden p-[var(--ds-surface-padding)]">
      <Section
        title={t("dashboard.timelineTitle")}
        subtitle={t("dashboard.timelineSubtitle")}
      />

      {loading ? (
        <SkeletonGroup />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title={t("dashboard.timelineAllQuiet")}
          description={t("dashboard.timelineAllQuietDesc")}
          icon={<CalendarCheck size={18} />}
        />
      ) : (
        <div
          className="space-y-2"
          role="list"
          aria-label={t("dashboard.timelineAriaLabel")}
        >
          {filteredItems.map((item) => {
            const meta = KIND_META[item.kind];
            const Icon = meta.icon;

            return (
              <DashboardListItem key={item.id} as="article" className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)]",
                    meta.color
                  )}
                >
                  <Icon size={15} aria-hidden />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-[13px] font-medium text-[var(--shell-text)]">
                      {item.title}
                    </p>
                    <time className="shrink-0 text-[11px] text-[var(--shell-muted)]">
                      {item.time}
                    </time>
                  </div>
                  <p className="mt-0.5 text-[12px] text-[var(--shell-muted)]">
                    {item.subtitle}
                  </p>
                </div>
              </DashboardListItem>
            );
          })}
        </div>
      )}
    </Surface>
  );
}
