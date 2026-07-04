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
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        meta?.badgeClassName ?? "bg-zinc-800 text-zinc-400"
      )}
    >
      {meta?.label ?? status}
    </span>
  );
}
