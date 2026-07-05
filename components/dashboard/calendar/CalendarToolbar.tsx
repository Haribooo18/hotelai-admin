"use client";

import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookingCreateButton } from "@/components/dashboard/bookings/BookingCreateDialog";
import { BOOKING_STATUS_OPTIONS } from "@/lib/booking-status";
import {
  chipActiveClass,
  chipClass,
  chipIdleClass,
  sectionTitleClass,
  stickyToolbarClass,
  toolbarControlClass,
  toolbarInputClass,
} from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";
import type { CalendarView } from "@/lib/calendar";
import type { Room } from "@/types/room";

const VIEW_MODES: { id: CalendarView; label: string }[] = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
];

type Props = {
  title: string;
  view: CalendarView;
  search: string;
  roomFilter: string;
  statusFilter: string;
  rooms: Room[];
  onSearchChange: (value: string) => void;
  onRoomFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarView) => void;
  onCreateClick: () => void;
};

export function CalendarToolbar({
  title,
  view,
  search,
  roomFilter,
  statusFilter,
  rooms,
  onSearchChange,
  onRoomFilterChange,
  onStatusFilterChange,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
  onCreateClick,
}: Props) {
  const activeRoomLabel =
    rooms.find((room) => room.id === roomFilter)?.room_type ?? "All rooms";
  const activeStatusLabel =
    BOOKING_STATUS_OPTIONS.find((option) => option.value === statusFilter)
      ?.label ?? "All statuses";

  return (
    <div className={stickyToolbarClass}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous period"
            onClick={onPrevious}
            className="border-0 bg-[var(--shell-surface-raised)] shadow-[var(--shell-shadow-sm)]"
          >
            <ChevronLeft size={16} />
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onToday}
            className="rounded-[var(--ds-radius-sm)]"
          >
            Today
          </Button>

          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next period"
            onClick={onNext}
            className="border-0 bg-[var(--shell-surface-raised)] shadow-[var(--shell-shadow-sm)]"
          >
            <ChevronRight size={16} />
          </Button>

          <h2 className={cn(sectionTitleClass, "ml-1 min-w-0 capitalize")}>
            {title}
          </h2>
        </div>

        <div className="relative min-w-0 flex-1 xl:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--shell-muted)]"
            size={17}
          />
          <Input
            className={toolbarInputClass}
            placeholder="Search guest, email, or phone"
            aria-label="Search reservations"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={15} />
              {activeRoomLabel}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onRoomFilterChange("")}>
                All rooms
              </DropdownMenuItem>
              {rooms.map((room) => (
                <DropdownMenuItem
                  key={room.id}
                  onClick={() => onRoomFilterChange(room.id)}
                >
                  {room.room_type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={15} />
              {activeStatusLabel}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onStatusFilterChange("")}>
                All statuses
              </DropdownMenuItem>
              {BOOKING_STATUS_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onStatusFilterChange(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div
            role="tablist"
            aria-label="View mode"
            className="flex rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)] p-1 shadow-[var(--shell-shadow-sm)]"
          >
            {VIEW_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                role="tab"
                aria-selected={view === mode.id}
                onClick={() => onViewChange(mode.id)}
                className={cn(
                  chipClass,
                  "rounded-[var(--ds-radius-sm)] px-3 py-1",
                  view === mode.id ? chipActiveClass : chipIdleClass
                )}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <BookingCreateButton
            onClick={onCreateClick}
            label="Add reservation"
            className="h-[var(--ds-input-height)] gap-2 rounded-[var(--ds-radius-sm)] bg-emerald-600 px-4 text-[13px] hover:bg-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}
