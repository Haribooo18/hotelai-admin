"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  chipActiveClass,
  chipClass,
  chipIdleClass,
  sectionTitleClass,
  toolbarShellClass,
} from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";
import type { CalendarView } from "@/lib/calendar";

type Props = {
  title: string;
  view: CalendarView;
  occupancyPercent: number;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarView) => void;
};

export function CalendarToolbar({
  title,
  view,
  occupancyPercent,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
}: Props) {
  return (
    <div className={cn(toolbarShellClass, "flex flex-wrap items-center justify-between gap-4")}>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Previous period"
          onClick={onPrevious}
        >
          <ChevronLeft size={16} />
        </Button>

        <Button variant="secondary" size="sm" onClick={onToday}>
          Today
        </Button>

        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Next period"
          onClick={onNext}
        >
          <ChevronRight size={16} />
        </Button>

        <h2 className={cn(sectionTitleClass, "ml-1 capitalize")}>{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-[13px] text-[var(--shell-muted)] sm:block">
          Average occupancy:{" "}
          <span className="font-semibold text-[var(--shell-accent)]">
            {occupancyPercent}%
          </span>
        </div>

        <div
          role="tablist"
          aria-label="View mode"
          className="flex rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)] p-1 shadow-[var(--shell-shadow-sm)]"
        >
          {(["month", "week"] as CalendarView[]).map((mode) => (
            <button
              key={mode}
              type="button"
              role="tab"
              aria-selected={view === mode}
              onClick={() => onViewChange(mode)}
              className={cn(
                chipClass,
                "rounded-[var(--ds-radius-sm)] px-3 py-1",
                view === mode ? chipActiveClass : chipIdleClass
              )}
            >
              {mode === "month" ? "Month" : "Week"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
