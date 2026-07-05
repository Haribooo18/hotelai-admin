import {
  Brush,
  CheckCircle2,
  Sparkles,
  Wrench,
  UserRound,
} from "lucide-react";

import type { RoomOperationalStatus } from "./room-ops-metrics";
import { getRoomStatusMeta } from "./room-ops-metrics";
import { cn } from "@/lib/utils";

const STATUS_ICONS = {
  available: CheckCircle2,
  occupied: UserRound,
  cleaning: Brush,
  maintenance: Wrench,
  reserved: Sparkles,
} as const;

type Props = {
  status: RoomOperationalStatus;
  className?: string;
};

export function RoomStatusBadge({ status, className }: Props) {
  const meta = getRoomStatusMeta(status);
  const Icon = STATUS_ICONS[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.06em]",
        meta.badgeClass,
        className
      )}
    >
      <Icon size={12} />
      {meta.label}
    </span>
  );
}
