"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
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
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--shell-border)] bg-[var(--shell-surface)] p-4">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous period"
          onClick={onPrevious}
        >
          <ChevronLeft size={18} />
        </Button>

        <Button variant="outline" onClick={onToday}>
          Today
        </Button>

        <Button
          variant="outline"
          size="icon"
          aria-label="Next period"
          onClick={onNext}
        >
          <ChevronRight size={18} />
        </Button>

        <h2 className="ml-2 text-xl font-semibold capitalize">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-sm text-[var(--shell-muted)] sm:block">
          Average occupancy:{" "}
          <span className="font-semibold text-emerald-400">
            {occupancyPercent}%
          </span>
        </div>

        <div
          role="tablist"
          aria-label="View mode"
          className="flex rounded-lg border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] p-1"
        >
          {(["month", "week"] as CalendarView[]).map((mode) => (
            <button
              key={mode}
              type="button"
              role="tab"
              aria-selected={view === mode}
              onClick={() => onViewChange(mode)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition",
                view === mode
                  ? "bg-emerald-600 text-white"
                  : "text-[var(--shell-muted)] hover:text-[var(--shell-text)]"
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
