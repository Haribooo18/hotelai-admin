import { Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { ROOM_COL_WIDTH } from "@/lib/calendar";
import { getRoomStatusMeta } from "@/components/dashboard/rooms/room-ops-metrics";

import type { CalendarRoomModel } from "./calendar-ops-metrics";

type Props = {
  model: CalendarRoomModel;
};

export function CalendarRoomCell({ model }: Props) {
  const { room, status, isAvailableToday } = model;
  const statusMeta = getRoomStatusMeta(status);

  return (
    <div
      className="sticky left-0 z-20 flex flex-col justify-center gap-1.5 border-r border-[var(--shell-border)]/50 bg-[var(--shell-surface)]/95 px-3 backdrop-blur-xl"
      style={{ width: ROOM_COL_WIDTH, minWidth: ROOM_COL_WIDTH }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="truncate text-[13px] font-semibold text-[var(--shell-text)]">
          {room.room_type}
        </span>
        <span
          className={cn(
            "mt-1 h-2 w-2 shrink-0 rounded-full",
            isAvailableToday ? "bg-emerald-400" : "bg-amber-400"
          )}
          title={isAvailableToday ? "Available today" : "Occupied or reserved"}
        />
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-[var(--shell-muted)]">
        <Users size={12} className="shrink-0" />
        <span>{room.capacity} guests</span>
      </div>

      <span
        className={cn(
          "inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
          statusMeta.badgeClass
        )}
      >
        {statusMeta.label}
      </span>
    </div>
  );
}
