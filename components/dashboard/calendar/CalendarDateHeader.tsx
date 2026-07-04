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
  return (
    <div className="sticky top-0 z-30 flex border-b border-zinc-800 bg-zinc-900">
      <div
        className="sticky left-0 z-40 flex items-center border-r border-zinc-800 bg-zinc-900 px-4 text-sm font-semibold"
        style={{ width: ROOM_COL_WIDTH, minWidth: ROOM_COL_WIDTH }}
      >
        Номер
      </div>

      {days.map((day, index) => {
        const occ = occupancy[index];
        const percent = Math.round((occ?.ratio ?? 0) * 100);

        return (
          <div
            key={index}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 border-r border-zinc-800 py-2",
              isWeekend(day) && "bg-zinc-800/40",
              isToday(day) && "bg-emerald-950/50"
            )}
            style={{ width: DAY_WIDTH, minWidth: DAY_WIDTH }}
          >
            <span className="text-[10px] uppercase text-zinc-500">
              {WEEKDAYS_SHORT_RU[day.getDay()]}
            </span>

            <span
              className={cn(
                "text-sm font-medium",
                isToday(day) && "text-emerald-400"
              )}
            >
              {day.getDate()}
            </span>

            <div
              className="mt-1 h-1 w-8 overflow-hidden rounded-full bg-zinc-700"
              title={`Загрузка ${percent}%`}
            >
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
