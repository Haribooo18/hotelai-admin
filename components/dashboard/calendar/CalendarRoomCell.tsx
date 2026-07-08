"use client";

import { Users } from "lucide-react";

import { StatusDot } from "@/components/ui/display/StatusDot";
import { cn } from "@/lib/utils";
import { ROOM_COL_WIDTH } from "@/lib/calendar";
import { formatTranslation, useI18n } from "@/lib/i18n";

import { RoomStatusBadge } from "@/components/dashboard/rooms/RoomStatusBadge";

import type { CalendarRoomModel } from "./calendar-ops-metrics";

type Props = {
  model: CalendarRoomModel;
};

export function CalendarRoomCell({ model }: Props) {
  const { t } = useI18n();
  const { room, status, isAvailableToday } = model;

  return (
    <div
      className="sticky left-0 z-20 flex flex-col justify-center gap-1.5 border-r border-[var(--shell-border)]/50 bg-[var(--shell-surface)]/98 px-3 backdrop-blur-xl"
      style={{ width: ROOM_COL_WIDTH, minWidth: ROOM_COL_WIDTH }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="truncate text-[13px] font-semibold text-[var(--shell-text)]">
          {room.room_type}
        </span>
        <StatusDot tone={isAvailableToday ? "success" : "warning"} />
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-[var(--shell-muted)]">
        <Users size={12} className="shrink-0" aria-hidden />
        <span>
          {formatTranslation(t("calendar.guestCapacity"), {
            count: String(room.capacity),
          })}
        </span>
      </div>

      <RoomStatusBadge status={status} className={cn("w-fit uppercase")} />
    </div>
  );
}
