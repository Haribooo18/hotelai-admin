import {
  Bell,
  Brush,
  CalendarCheck,
  CalendarClock,
} from "lucide-react";

import type { TimelineItem } from "./dashboard-metrics";
import {
  DashboardEmptyState,
  DashboardPanelHeader,
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
    <DashboardSurface className="p-[var(--ds-surface-padding)]">
      <DashboardPanelHeader
        title="Reservation timeline"
        subtitle="Today's check-ins, departures, and housekeeping"
      />

      {loading ? (
        <DashboardSkeleton />
      ) : items.length === 0 ? (
        <DashboardEmptyState
          title="All quiet for today"
          description="When check-ins, check-outs, or new requests appear, they will show up in this feed."
          icon={<CalendarCheck size={18} />}
        />
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const meta = KIND_META[item.kind];
            const Icon = meta.icon;

            return (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 p-3 transition-[transform,background-color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px hover:bg-[var(--shell-surface-raised)] hover:shadow-[var(--shell-shadow-sm)]"
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)]",
                    meta.color
                  )}
                >
                  <Icon size={15} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-[13px] font-medium text-[var(--shell-text)]">
                      {item.title}
                    </p>
                    <span className="shrink-0 text-[11px] text-[var(--shell-muted)]">
                      {item.time}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-[var(--shell-muted)]">
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
