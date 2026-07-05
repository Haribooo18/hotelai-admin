import { cn } from "@/lib/utils";
import { BOOKING_STATUSES } from "@/lib/booking-status";

export function CalendarLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--shell-muted)]">
      {BOOKING_STATUSES.map((status) => (
        <div key={status.value} className="flex items-center gap-2">
          <span
            className={cn(
              "h-3 w-3 rounded-sm",
              status.barClassName.split(" ")[0]
            )}
          />
          {status.label}
        </div>
      ))}

      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-sm border border-emerald-500/40 bg-emerald-500/10" />
        Available room
      </div>
    </div>
  );
}
