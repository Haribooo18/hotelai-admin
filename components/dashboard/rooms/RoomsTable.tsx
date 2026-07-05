"use client";

import { BedDouble, MoreHorizontal, Pencil } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import { Avatar, AvatarFallback } from "@/components/ui/display/Avatar";
import { SkeletonRows } from "@/components/ui/display/Skeleton";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { TableContainer } from "@/components/ui/data/TableContainer";
import { tableRowA11yProps } from "@/lib/dashboard/a11y";
import { iconActionClass } from "@/lib/dashboard/design-system";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

import { HousekeepingBadge } from "./HousekeepingBadge";
import { MaintenanceBadge } from "./MaintenanceBadge";
import { RoomStatusBadge } from "./RoomStatusBadge";
import {
  formatRoomCurrency,
  formatRoomDate,
  getGuestInitials,
  type RoomCardModel,
} from "./room-ops-metrics";

type Props = {
  models: RoomCardModel[];
  loading?: boolean;
  selectedId?: string | null;
  onOpen: (model: RoomCardModel) => void;
  onEdit: (model: RoomCardModel) => void;
};

const HEADERS = [
  "Room",
  "Type",
  "Guest",
  "Status",
  "Housekeeping",
  "Maintenance",
  "Revenue",
  "Stay",
  "Actions",
] as const;

export function RoomsTable({
  models,
  loading = false,
  selectedId = null,
  onOpen,
  onEdit,
}: Props) {
  if (loading) {
    return (
      <TableContainer>
        <SkeletonRows rows={8} />
      </TableContainer>
    );
  }

  if (models.length === 0) {
    return (
      <EmptyState
        title="No rooms found"
        description="Adjust filters or add the first room to your inventory."
        icon={<BedDouble size={18} />}
      />
    );
  }

  return (
    <TableContainer scrollable className="shadow-[var(--shell-shadow-sm)]">
      <table className="w-full min-w-[980px] border-collapse text-left text-[12px]">
        <caption className="sr-only">Room list</caption>
        <thead className="sticky top-0 z-10 bg-[var(--shell-surface)]">
          <tr className="border-b border-[var(--shell-border)]/50">
            {HEADERS.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--shell-muted)] last:text-right"
              >
                {header === "Actions" ? (
                  <span className="sr-only">{header}</span>
                ) : (
                  header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {models.map((model) => {
            const stay = model.activeBooking ?? model.upcomingBooking;
            const selected = selectedId === model.room.id;

            return (
              <tr
                key={model.room.id}
                onClick={() => onOpen(model)}
                aria-selected={selected}
                className={cn(
                  "cursor-pointer border-b border-[var(--shell-border)]/30 last:border-b-0",
                  motionPresets.transitionBase,
                  "hover:bg-[var(--shell-surface-raised)]/70 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--shell-accent-ring)]",
                  selected &&
                    "bg-[var(--shell-nav-active-bg)]/40 shadow-[inset_2px_0_0_0_var(--shell-accent)]"
                )}
                {...tableRowA11yProps(`Open room ${model.roomCode}`, () =>
                  onOpen(model)
                )}
              >
                <td className="px-4 py-3">
                  <p className="font-semibold text-[var(--shell-text)]">
                    {model.roomCode}
                  </p>
                  <p className="text-[11px] text-[var(--shell-muted)]">
                    {model.floorLabel}
                  </p>
                </td>
                <td className="px-4 py-3 text-[var(--shell-text)]">
                  {model.room.room_type}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                      <AvatarFallback className="text-[10px] font-semibold">
                        {getGuestInitials(model.currentGuest)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-[var(--shell-text)]">
                      {model.currentGuest ?? "—"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <RoomStatusBadge status={model.status} />
                </td>
                <td className="px-4 py-3">
                  <HousekeepingBadge status={model.housekeepingStatus} />
                </td>
                <td className="px-4 py-3">
                  {model.status === "maintenance" ? (
                    <MaintenanceBadge active />
                  ) : (
                    <span className="text-[11px] text-[var(--shell-muted)]">—</span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-[var(--shell-text)]">
                  {formatRoomCurrency(model.revenueToday)}
                </td>
                <td className="px-4 py-3 text-[var(--shell-muted)]">
                  {stay
                    ? `${formatRoomDate(stay.check_in)} → ${formatRoomDate(stay.check_out)}`
                    : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      aria-label={`Actions for room ${model.roomCode}`}
                      className={cn(iconActionClass, "max-md:opacity-100")}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <MoreHorizontal size={16} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          onOpen(model);
                        }}
                      >
                        Open
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          onEdit(model);
                        }}
                        className="gap-2"
                      >
                        <Pencil size={14} />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableContainer>
  );
}
