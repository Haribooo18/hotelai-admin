import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/display/Badge";

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
    <Badge
      variant={
        status === "clean"
          ? "success"
          : status === "inspected"
            ? "default"
            : "warning"
      }
      className={cn("uppercase", meta.badgeClass, className)}
    >
      {meta.label}
    </Badge>
  );
}
