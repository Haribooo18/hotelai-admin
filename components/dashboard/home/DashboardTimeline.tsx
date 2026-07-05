import {
  Bell,
  Brush,
  CalendarCheck,
  CalendarClock,
} from "lucide-react";

import type { TimelineItem } from "./dashboard-metrics";
import {
  DashboardEmptyState,
  DashboardSectionTitle,
  DashboardSkeleton,
  DashboardSurface,
} from "./DashboardPrimitives";
import { cn } from "@/lib/utils";

type Props = {
  items: TimelineItem[];
  loading: boolean;
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

export function DashboardTimeline({ items, loading }: Props) {
  return (
    <DashboardSurface className="p-6">
      <DashboardSectionTitle
        title="Today"
        subtitle="Check-ins, check-outs, cleaning, and reminders"
      />

      {loading ? (
        <DashboardSkeleton />
      ) : items.length === 0 ? (
        <DashboardEmptyState
          title="All quiet for today"
          description="When check-ins, check-outs, or new requests appear, they will show up in this feed."
          icon={<CalendarCheck size={20} />}
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const meta = KIND_META[item.kind];
            const Icon = meta.icon;

            return (
              <div
                key={item.id}
                className="flex items-start gap-4 rounded-[16px] bg-[var(--shell-nav-hover-bg)]/50 p-4 transition-all duration-[var(--ds-duration-slow)] ease-out hover:bg-[var(--shell-nav-hover-bg)]"
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)]",
                    meta.color
                  )}
                >
                  <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-[14px] font-medium text-[var(--shell-text)]">
                      {item.title}
                    </p>
                    <span className="shrink-0 text-[12px] text-[var(--shell-muted)]">
                      {item.time}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] text-[var(--shell-muted)]">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardSurface>
  );
}
