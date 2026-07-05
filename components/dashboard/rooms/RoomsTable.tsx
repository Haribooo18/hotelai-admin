"use client";

import { MoreHorizontal, Pencil } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { iconActionClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

import { HousekeepingBadge } from "./HousekeepingBadge";
import { RoomStatusBadge } from "./RoomStatusBadge";
import {
  formatRoomCurrency,
  formatRoomDate,
  getGuestInitials,
  type RoomCardModel,
} from "./room-ops-metrics";

type Props = {
  models: RoomCardModel[];
  onOpen: (model: RoomCardModel) => void;
  onEdit: (model: RoomCardModel) => void;
};

export function RoomsTable({ models, onOpen, onEdit }: Props) {
  return (
    <div className="overflow-hidden rounded-[var(--ds-radius)] bg-[var(--shell-surface)]/85 shadow-[var(--shell-shadow-sm)] backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-[12px]">
          <thead className="border-b border-[var(--shell-border)]/50 bg-[var(--shell-surface-raised)]/60 text-[11px] uppercase tracking-[0.06em] text-[var(--shell-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Room</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Guest</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Housekeeping</th>
              <th className="px-4 py-3 font-medium">Revenue</th>
              <th className="px-4 py-3 font-medium">Stay</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model) => {
              const stay = model.activeBooking ?? model.upcomingBooking;

              return (
                <tr
                  key={model.room.id}
                  onClick={() => onOpen(model)}
                  className="cursor-pointer border-b border-[var(--shell-border)]/40 transition-[background-color] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:bg-[var(--shell-surface-raised)]/50"
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
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--shell-accent-muted)] text-[10px] font-semibold text-[var(--shell-accent)]">
                        {getGuestInitials(model.currentGuest)}
                      </span>
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
                  <td className="px-4 py-3 font-medium text-[var(--shell-text)]">
                    {formatRoomCurrency(model.revenueToday)}
                  </td>
                  <td className="px-4 py-3 text-[var(--shell-muted)]">
                    {stay
                      ? `${formatRoomDate(stay.check_in)} → ${formatRoomDate(stay.check_out)}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        aria-label={`Actions for room ${model.roomCode}`}
                        className={cn(iconActionClass, "h-8 w-8")}
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
      </div>
    </div>
  );
}
