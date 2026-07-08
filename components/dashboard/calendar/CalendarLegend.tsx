"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { BOOKING_STATUSES } from "@/lib/booking-status";

import { GlassSurface } from "@/components/ui/primitives/GlassSurface";

import { BOOKING_STATUS_GRADIENT } from "./calendar-ops-metrics";

export function CalendarLegend() {
  const { t } = useI18n();

  return (
    <GlassSurface className="px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[var(--shell-muted)]">
        {BOOKING_STATUSES.map((status) => (
          <div key={status.value} className="flex items-center gap-2">
            <span
              className={cn(
                "h-2.5 w-5 rounded-full",
                BOOKING_STATUS_GRADIENT[status.value]?.split(" ")[0] ??
                  status.barClassName.split(" ")[0]
              )}
            />
            {t(`statuses.booking.${status.value}` as "statuses.booking.confirmed")}
          </div>
        ))}

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          {t("statuses.payment.paid")}
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-300" />
          {t("statuses.payment.pending")}
        </div>
      </div>
    </GlassSurface>
  );
}
