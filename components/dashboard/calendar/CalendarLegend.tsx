import { cn } from "@/lib/utils";
import { BOOKING_STATUSES } from "@/lib/booking-status";

import { BOOKING_STATUS_GRADIENT } from "./calendar-ops-metrics";

export function CalendarLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-[var(--ds-radius)] bg-[var(--shell-surface)]/60 px-4 py-3 text-[12px] text-[var(--shell-muted)] shadow-[var(--shell-shadow-sm)] backdrop-blur-xl">
      {BOOKING_STATUSES.map((status) => (
        <div key={status.value} className="flex items-center gap-2">
          <span
            className={cn(
              "h-2.5 w-5 rounded-full",
              BOOKING_STATUS_GRADIENT[status.value]?.split(" ")[0] ??
                status.barClassName.split(" ")[0]
            )}
          />
          {status.label}
        </div>
      ))}

      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        Payment settled
      </div>

      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-amber-300" />
        Payment pending
      </div>
    </div>
  );
}
