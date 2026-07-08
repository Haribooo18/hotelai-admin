"use client";

import { Badge } from "@/components/ui/display/Badge";
import { statusBadgeClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { TranslationPath } from "@/lib/i18n/translations";

type Props = {
  status: string;
  className?: string;
};

const BOOKING_STATUS_CLASS: Record<string, string> = {
  confirmed: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  checked_in: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  checked_out: "bg-zinc-500/15 text-zinc-300 border border-zinc-500/30",
  cancelled: "bg-red-500/15 text-red-400 border border-red-500/30",
};

const BOOKING_STATUS_KEYS: Record<string, TranslationPath> = {
  confirmed: "statuses.booking.confirmed",
  checked_in: "statuses.booking.checked_in",
  checked_out: "statuses.booking.checked_out",
  cancelled: "statuses.booking.cancelled",
};

export function BookingStatusBadge({ status, className }: Props) {
  const { t } = useI18n();
  const key = BOOKING_STATUS_KEYS[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        statusBadgeClass,
        BOOKING_STATUS_CLASS[status] ??
          "bg-[var(--shell-surface-raised)] text-[var(--shell-muted)]",
        className
      )}
    >
      {key ? t(key) : status}
    </Badge>
  );
}
