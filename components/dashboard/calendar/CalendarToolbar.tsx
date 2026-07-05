"use client";

import {
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/core/Button";
import { IconButton } from "@/components/ui/core/IconButton";
import { Input } from "@/components/ui/core/Input";
import { SearchInput } from "@/components/ui/core/SearchInput";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import { FilterBar } from "@/components/ui/data/FilterBar";
import { SegmentedControl } from "@/components/ui/navigation/SegmentedControl";
import { BookingCreateButton } from "@/components/dashboard/bookings/BookingCreateDialog";
import { BOOKING_STATUS_OPTIONS } from "@/lib/booking-status";
import { toolbarControlClass } from "@/lib/dashboard/design-system";
import type { CalendarView } from "@/lib/calendar";
import type { Room } from "@/types/room";

const VIEW_MODES: { value: CalendarView; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

type Props = {
  title: string;
  view: CalendarView;
  anchorDate: string;
  search: string;
  roomFilter: string;
  statusFilter: string;
  rooms: Room[];
  refreshing: boolean;
  onSearchChange: (value: string) => void;
  onRoomFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onAnchorDateChange: (value: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarView) => void;
  onRefresh: () => void;
  onCreateClick: () => void;
};

export function CalendarToolbar({
  title,
  view,
  anchorDate,
  search,
  roomFilter,
  statusFilter,
  rooms,
  refreshing,
  onSearchChange,
  onRoomFilterChange,
  onStatusFilterChange,
  onAnchorDateChange,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
  onRefresh,
  onCreateClick,
}: Props) {
  const activeRoomLabel =
    rooms.find((room) => room.id === roomFilter)?.room_type ?? "All rooms";
  const activeStatusLabel =
    BOOKING_STATUS_OPTIONS.find((option) => option.value === statusFilter)
      ?.label ?? "All statuses";

  return (
    <FilterBar
      leading={
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 xl:max-w-none">
          <Input
            type="date"
            value={anchorDate}
            onChange={(event) => onAnchorDateChange(event.target.value)}
            aria-label="Calendar date"
            className="h-[var(--ds-input-height)] w-[148px] rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] text-[13px] shadow-[var(--shell-shadow-sm)]"
          />

          <div className="flex items-center gap-1">
            <IconButton
              aria-label="Previous period"
              onClick={onPrevious}
              className="border-0 bg-[var(--shell-surface-raised)] shadow-[var(--shell-shadow-sm)]"
            >
              <ChevronLeft size={16} />
            </IconButton>

            <Button variant="outline" size="sm" onClick={onToday}>
              Today
            </Button>

            <IconButton
              aria-label="Next period"
              onClick={onNext}
              className="border-0 bg-[var(--shell-surface-raised)] shadow-[var(--shell-shadow-sm)]"
            >
              <ChevronRight size={16} />
            </IconButton>
          </div>

          <h2 className="min-w-0 truncate text-[14px] font-semibold capitalize text-[var(--shell-text)]">
            {title}
          </h2>
        </div>
      }
      trailing={
        <>
          <SearchInput
            containerClassName="w-full sm:w-[220px] xl:w-[240px]"
            placeholder="Search guest, email, or phone"
            aria-label="Search reservations"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />

          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label="Room filter"
            >
              <Filter size={15} aria-hidden />
              <span className="max-w-[96px] truncate">{activeRoomLabel}</span>
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
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label="Status filter"
            >
              <Filter size={15} aria-hidden />
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

          <SegmentedControl
            value={view}
            onChange={onViewChange}
            options={VIEW_MODES.map((mode) => ({
              value: mode.value,
              label: mode.label,
            }))}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={refreshing}
            loading={refreshing}
            aria-label="Refresh calendar"
          >
            <RefreshCw size={15} aria-hidden />
            Refresh
          </Button>

          <BookingCreateButton
            onClick={onCreateClick}
            label="Add reservation"
            className="h-[var(--ds-input-height)] gap-2 bg-emerald-600 hover:bg-emerald-500"
          />
        </>
      }
    />
  );
}
