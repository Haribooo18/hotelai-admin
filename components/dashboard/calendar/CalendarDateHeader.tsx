"use client";

import { formatTranslation, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  DAY_WIDTH,
  ROOM_COL_WIDTH,
  WEEKDAYS_SHORT_RU,
  isToday,
  isWeekend,
  type DayOccupancy,
} from "@/lib/calendar";

type Props = {
  days: Date[];
  occupancy: DayOccupancy[];
};

export function CalendarDateHeader({ days, occupancy }: Props) {
  const { t } = useI18n();

  return (
    <div className="sticky top-0 z-30 flex border-b border-[var(--shell-border)]/50 bg-[var(--shell-surface)]/95 backdrop-blur-xl">
      <div
        className="sticky left-0 z-40 flex items-center border-r border-[var(--shell-border)]/50 bg-[var(--shell-surface)]/98 px-4 text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--shell-muted)] backdrop-blur-xl"
        style={{ width: ROOM_COL_WIDTH, minWidth: ROOM_COL_WIDTH }}
      >
        {t("calendar.roomsHeader")}
      </div>

      {days.map((day, index) => {
        const occ = occupancy[index];
        const percent = Math.round((occ?.ratio ?? 0) * 100);
        const today = isToday(day);
        const weekend = isWeekend(day);

        return (
          <div
            key={index}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 border-r border-[var(--shell-border)]/40 py-2.5",
              weekend && "bg-[var(--shell-surface-raised)]/35",
              today &&
                "bg-emerald-500/10 shadow-[inset_0_-2px_0_0_rgba(16,185,129,0.55)]"
            )}
            style={{ width: DAY_WIDTH, minWidth: DAY_WIDTH }}
            aria-current={today ? "date" : undefined}
          >
            <span
              className={cn(
                "text-[10px] uppercase tracking-wide",
                weekend ? "text-[var(--shell-muted)]" : "text-[var(--shell-muted)]"
              )}
            >
              {WEEKDAYS_SHORT_RU[day.getDay()]}
            </span>

            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-semibold",
                today
                  ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                  : "text-[var(--shell-text)]"
              )}
            >
              {day.getDate()}
            </span>

            <div
              className="mt-1 h-1 w-7 overflow-hidden rounded-full bg-[var(--shell-nav-hover-bg)]"
              title={formatTranslation(t("calendar.occupancyPercentTitle"), {
                percent: String(percent),
              })}
              role="img"
              aria-label={formatTranslation(t("calendar.occupancyPercentAria"), {
                percent: String(percent),
              })}
            >
              <div
                className="h-full rounded-full bg-emerald-500/80 transition-[width] duration-[var(--ds-duration)] ease-[var(--ds-ease)]"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
