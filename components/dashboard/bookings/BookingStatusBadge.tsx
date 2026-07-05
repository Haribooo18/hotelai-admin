import { cn } from "@/lib/utils";
import { getBookingStatusMeta } from "@/lib/booking-status";

import { Badge } from "@/components/ui/display/Badge";

type Props = {
  status: string;
  className?: string;
};

export function BookingStatusBadge({ status, className }: Props) {
  const meta = getBookingStatusMeta(status);

  return (
    <Badge
      variant="outline"
      className={cn(
        "uppercase",
        meta?.badgeClassName ??
          "bg-[var(--shell-surface-raised)] text-[var(--shell-muted)]",
        className
      )}
    >
      {meta?.label ?? status}
    </Badge>
  );
}
