import type { Room } from "@/types/room";
import { cn } from "@/lib/utils";
import { ROOM_COL_WIDTH } from "@/lib/calendar";

type Props = {
  room: Room;
  occupiedDays: number;
  totalDays: number;
  isEmpty: boolean;
};

export function CalendarRoomCell({
  room,
  occupiedDays,
  totalDays,
  isEmpty,
}: Props) {
  const ratio = totalDays > 0 ? occupiedDays / totalDays : 0;
  const percent = Math.round(ratio * 100);

  return (
    <div
      className={cn(
        "sticky left-0 z-20 flex flex-col justify-center gap-1.5 border-r border-[var(--shell-border)] bg-[var(--shell-surface)] px-4",
        isEmpty && "bg-emerald-950/20"
      )}
      style={{ width: ROOM_COL_WIDTH, minWidth: ROOM_COL_WIDTH }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-medium">{room.room_type}</span>
        <span className="shrink-0 text-xs text-[var(--shell-muted)]">${room.price}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--shell-surface-raised)]">
          <div
            className={cn(
              "h-full",
              isEmpty ? "bg-emerald-500/40" : "bg-emerald-500"
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="w-9 shrink-0 text-right text-[10px] text-[var(--shell-muted)]">
          {isEmpty ? "Available" : `${percent}%`}
        </span>
      </div>
    </div>
  );
}
