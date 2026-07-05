import { cn } from "@/lib/utils";

import {
  getHousekeepingMeta,
  type HousekeepingStatus,
} from "./room-ops-metrics";

type Props = {
  status: HousekeepingStatus;
  className?: string;
};

export function HousekeepingBadge({ status, className }: Props) {
  const meta = getHousekeepingMeta(status);

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        meta.badgeClass,
        className
      )}
    >
      {meta.label}
    </span>
  );
}
