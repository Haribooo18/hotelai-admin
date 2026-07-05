import {
  Brush,
  CheckCircle2,
  Sparkles,
  Wrench,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/display/Badge";
import { cn } from "@/lib/utils";

import type { RoomOperationalStatus } from "./room-ops-metrics";
import { getRoomStatusMeta } from "./room-ops-metrics";

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
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 uppercase",
        meta.badgeClass,
        className
      )}
    >
      <Icon size={12} aria-hidden />
      {meta.label}
    </Badge>
  );
}
