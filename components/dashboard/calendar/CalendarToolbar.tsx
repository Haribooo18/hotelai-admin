"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight, Filter, RefreshCw } from "lucide-react";

import { IconButton } from "@/components/ui/core/IconButton";
import { ToolbarDateInput } from "@/components/ui/core/ToolbarDateInput";
import { SearchInput } from "@/components/ui/core/SearchInput";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import {
  FilterChip,
  ToolbarSecondaryButton,
} from "@/components/ui/data/FilterBar";
import { WorkspaceToolbar } from "@/components/dashboard/shared/WorkspaceToolbar";
import { BOOKING_STATUS_OPTIONS } from "@/lib/booking-status";
import {
  toolbarCalendarNavButtonClass,
  toolbarControlClass,
  toolbarFilterIconSize,
  toolbarTitleClass,
} from "@/lib/dashboard/design-system";
import type { CalendarView } from "@/lib/calendar";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Room } from "@/types/room";

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
  onViewChange: (view: CalendarView) => void;
  onRefresh: () => void;
};

const compactNavButtonClass = cn(
  toolbarCalendarNavButtonClass,
  "size-9 min-h-0 min-w-9"
);

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
  onViewChange,
  onRefresh,
}: Props) {
  const { t } = useI18n();

  const viewModes = useMemo(
    (): { value: CalendarView; label: string }[] => [
      { value: "day", label: t("calendar.day") },
      { value: "week", label: t("calendar.week") },
      { value: "month", label: t("calendar.month") },
    ],
    [t]
  );

  const statusOptions = useMemo(
    () => [
      { value: "", label: t("toolbar.allStatuses") },
      ...BOOKING_STATUS_OPTIONS.map((option) => ({
        value: option.value,
        label: t(`statuses.booking.${option.value}`),
      })),
    ],
    [t]
  );

  const activeRoomLabel =
    rooms.find((room) => room.id === roomFilter)?.room_type ??
    t("toolbar.allRooms");
  const activeStatusLabel =
    statusOptions.find((option) => option.value === statusFilter)?.label ??
    t("toolbar.allStatuses");

  return (
    <WorkspaceToolbar
      nowrap
      searchGrow
      search={
        <SearchInput
          placeholder={t("calendar.searchPlaceholder")}
          aria-label={t("calendar.searchAria")}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      }
      primaryFilters={
        <>
          <IconButton
            aria-label={t("calendar.previousPeriod")}
            onClick={onPrevious}
            className={compactNavButtonClass}
          >
            <ChevronLeft size={toolbarFilterIconSize} className="text-white" />
          </IconButton>

          <ToolbarDateInput
            value={anchorDate}
            onChange={(event) => onAnchorDateChange(event.target.value)}
            aria-label={t("calendar.calendarDate")}
          />

          <IconButton
            aria-label={t("calendar.nextPeriod")}
            onClick={onNext}
            className={compactNavButtonClass}
          >
            <ChevronRight size={toolbarFilterIconSize} className="text-white" />
          </IconButton>

          <h2 className={cn(toolbarTitleClass, "max-w-[120px] shrink-0")}>
            {title}
          </h2>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label={t("calendar.roomFilter")}
            >
              <Filter size={toolbarFilterIconSize} aria-hidden />
              <span className="max-w-[88px] truncate">{activeRoomLabel}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onRoomFilterChange("")}>
                {t("toolbar.allRooms")}
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
              aria-label={t("calendar.statusFilter")}
            >
              <Filter size={toolbarFilterIconSize} aria-hidden />
              <span className="max-w-[88px] truncate">{activeStatusLabel}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {statusOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value || "all"}
                  onClick={() => onStatusFilterChange(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {viewModes.map((mode) => (
            <FilterChip
              key={mode.value}
              active={view === mode.value}
              onClick={() => onViewChange(mode.value)}
            >
              {mode.label}
            </FilterChip>
          ))}

          <ToolbarSecondaryButton
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            loading={refreshing}
            aria-label={t("calendar.refreshAria")}
          >
            <RefreshCw size={toolbarFilterIconSize} aria-hidden />
            {t("common.refresh")}
          </ToolbarSecondaryButton>
        </>
      }
    />
  );
}
