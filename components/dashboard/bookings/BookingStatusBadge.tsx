import { cn } from "@/lib/utils";
import { getBookingStatusMeta } from "@/lib/booking-status";

type Props = {
  status: string;
};

export function BookingStatusBadge({ status }: Props) {
  const meta = getBookingStatusMeta(status);

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.05em]",
        meta?.badgeClassName ??
          "bg-[var(--shell-surface-raised)] text-[var(--shell-muted)]"
      )}
    >
      {meta?.label ?? status}
    </span>
  );
}
