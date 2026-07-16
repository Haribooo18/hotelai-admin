"use client";

import {
  Brush,
  CheckCircle2,
  Sparkles,
  Wrench,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/display/Badge";
import { statusBadgeClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { TranslationPath } from "@/lib/i18n/translations";

import type { RoomOperationalStatus } from "./room-ops-metrics";
import { getRoomStatusMeta } from "./room-ops-metrics";

const STATUS_ICONS = {
  available: CheckCircle2,
  occupied: UserRound,
  cleaning: Brush,
  maintenance: Wrench,
  reserved: Sparkles,
} as const;

const STATUS_KEYS: Record<RoomOperationalStatus, TranslationPath> = {
  available: "statuses.room.available",
  occupied: "statuses.room.occupied",
  cleaning: "statuses.room.cleaning",
  maintenance: "statuses.room.maintenance",
  reserved: "statuses.room.reserved",
};

type Props = {
  status: RoomOperationalStatus;
  className?: string;
};

export function RoomStatusBadge({ status, className }: Props) {
  const { t } = useI18n();
  const meta = getRoomStatusMeta(status);
  const Icon = STATUS_ICONS[status];

  return (
    <Badge
      variant="outline"
      className={cn(statusBadgeClass, "gap-1.5", meta.badgeClass, className)}
    >
      <Icon size={12} aria-hidden />
      {t(STATUS_KEYS[status])}
    </Badge>
  );
}
