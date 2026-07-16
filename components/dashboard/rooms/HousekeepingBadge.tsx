"use client";

import { Badge } from "@/components/ui/display/Badge";
import { statusBadgeClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { TranslationPath } from "@/lib/i18n/translations";

import {
  getHousekeepingMeta,
  type HousekeepingStatus,
} from "./room-ops-metrics";

const HOUSEKEEPING_KEYS: Record<HousekeepingStatus, TranslationPath> = {
  clean: "statuses.housekeeping.clean",
  dirty: "statuses.housekeeping.dirty",
  inspected: "statuses.housekeeping.inspected",
};

type Props = {
  status: HousekeepingStatus;
  className?: string;
};

export function HousekeepingBadge({ status, className }: Props) {
  const { t } = useI18n();
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
      className={cn(statusBadgeClass, meta.badgeClass, className)}
    >
      {t(HOUSEKEEPING_KEYS[status])}
    </Badge>
  );
}
