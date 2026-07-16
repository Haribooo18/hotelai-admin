"use client";

import { useMemo } from "react";
import { Filter, RefreshCw } from "lucide-react";

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
import {
  toolbarControlClass,
  toolbarFilterIconSize,
} from "@/lib/dashboard/design-system";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import type {
  HousekeepingStatus,
  RoomOperationalStatus,
  RoomSortKey,
} from "./room-ops-metrics";
import type { RoomsToolbarFilters } from "./rooms-ui";

type Props = {
  filters: RoomsToolbarFilters;
  floorOptions: string[];
  roomTypeOptions: string[];
  refreshing: boolean;
  onFiltersChange: (filters: RoomsToolbarFilters) => void;
  onRefresh: () => void;
};

export function RoomToolbar({
  filters,
  floorOptions,
  roomTypeOptions,
  refreshing,
  onFiltersChange,
  onRefresh,
}: Props) {
  const { t } = useI18n();

  const sortOptions = useMemo(
    (): { value: RoomSortKey; label: string }[] => [
      { value: "type_asc", label: t("rooms.sortTypeAsc") },
      { value: "type_desc", label: t("rooms.sortTypeDesc") },
      { value: "price_asc", label: t("rooms.sortPriceAsc") },
      { value: "price_desc", label: t("rooms.sortPriceDesc") },
      { value: "capacity", label: t("rooms.sortCapacity") },
      { value: "status", label: t("rooms.sortStatus") },
    ],
    [t]
  );

  const statusOptions = useMemo(
    (): { value: RoomOperationalStatus | ""; label: string }[] => [
      { value: "", label: t("toolbar.allStatuses") },
      { value: "available", label: t("statuses.room.available") },
      { value: "occupied", label: t("statuses.room.occupied") },
      { value: "cleaning", label: t("statuses.room.cleaning") },
      { value: "maintenance", label: t("statuses.room.maintenance") },
      { value: "reserved", label: t("statuses.room.reserved") },
    ],
    [t]
  );

  const housekeepingOptions = useMemo(
    (): { value: HousekeepingStatus | ""; label: string }[] => [
      { value: "", label: t("toolbar.allHousekeeping") },
      { value: "clean", label: t("statuses.housekeeping.clean") },
      { value: "dirty", label: t("statuses.housekeeping.dirty") },
      { value: "inspected", label: t("statuses.housekeeping.inspected") },
    ],
    [t]
  );

  const maintenanceOptions = useMemo(
    () =>
      [
        { value: "", label: t("toolbar.allMaintenance") },
        { value: "open", label: t("rooms.maintenanceOpen") },
        { value: "clear", label: t("rooms.maintenanceClear") },
      ] as const,
    [t]
  );

  function patch(partial: Partial<RoomsToolbarFilters>) {
    onFiltersChange({ ...filters, ...partial });
  }

  const activeSort =
    sortOptions.find((option) => option.value === filters.sort)?.label ??
    t("common.sort");
  const activeStatus =
    statusOptions.find((option) => option.value === filters.status)?.label ??
    t("toolbar.allStatuses");
  const activeHousekeeping =
    housekeepingOptions.find((option) => option.value === filters.housekeeping)
      ?.label ?? t("toolbar.allHousekeeping");
  const activeMaintenance =
    maintenanceOptions.find((option) => option.value === filters.maintenance)
      ?.label ?? t("toolbar.allMaintenance");
  const activeRoomType = filters.roomType || t("toolbar.allTypes");
  const activeFloor = filters.floor || t("toolbar.allFloors");

  const statusChipOptions = useMemo(
    (): { value: RoomOperationalStatus | ""; label: string }[] => [
      { value: "", label: t("common.all") },
      { value: "available", label: t("statuses.room.available") },
      { value: "occupied", label: t("statuses.room.occupied") },
      { value: "cleaning", label: t("statuses.room.cleaning") },
      { value: "maintenance", label: t("statuses.room.maintenance") },
      { value: "reserved", label: t("statuses.room.reserved") },
    ],
    [t]
  );

  return (
    <WorkspaceToolbar
      search={
        <SearchInput
          placeholder={t("rooms.searchPlaceholder")}
          aria-label={t("rooms.searchAria")}
          value={filters.search}
          onChange={(event) => patch({ search: event.target.value })}
        />
      }
      primaryFilters={
        <>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label={t("rooms.statusFilter")}
            >
              <Filter size={toolbarFilterIconSize} aria-hidden />
              {activeStatus}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {statusOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value || "all"}
                  onClick={() => patch({ status: option.value })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label={t("rooms.housekeepingFilter")}
            >
              <Filter size={toolbarFilterIconSize} aria-hidden />
              {activeHousekeeping}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {housekeepingOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value || "all"}
                  onClick={() => patch({ housekeeping: option.value })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label={t("rooms.maintenanceFilter")}
            >
              <Filter size={toolbarFilterIconSize} aria-hidden />
              {activeMaintenance}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {maintenanceOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value || "all"}
                  onClick={() => patch({ maintenance: option.value })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label={t("rooms.floorFilter")}
            >
              <Filter size={toolbarFilterIconSize} aria-hidden />
              <span className="max-w-[96px] truncate">{activeFloor}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => patch({ floor: "" })}>
                {t("toolbar.allFloors")}
              </DropdownMenuItem>
              {floorOptions.map((value) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => patch({ floor: value })}
                >
                  {value}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label={t("rooms.roomTypeFilter")}
            >
              <Filter size={toolbarFilterIconSize} aria-hidden />
              <span className="max-w-[96px] truncate">{activeRoomType}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => patch({ roomType: "" })}>
                {t("toolbar.allTypes")}
              </DropdownMenuItem>
              {roomTypeOptions.map((value) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => patch({ roomType: value })}
                >
                  {value}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={toolbarControlClass}
              aria-label={t("rooms.sortAria")}
            >
              <Filter size={toolbarFilterIconSize} aria-hidden />
              {activeSort}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => patch({ sort: option.value })}
                  className={cn(
                    filters.sort === option.value &&
                      "bg-[var(--shell-nav-active-bg)] text-[var(--shell-nav-active-text)]"
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      }
      actions={
        <>
          <ToolbarSecondaryButton
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            loading={refreshing}
            aria-label={t("rooms.refreshAria")}
          >
            <RefreshCw size={toolbarFilterIconSize} aria-hidden />
            {t("common.refresh")}
          </ToolbarSecondaryButton>
        </>
      }
      chips={
        <>
          {statusChipOptions.map((option) => (
            <FilterChip
              key={option.value || "all"}
              active={filters.status === option.value}
              onClick={() => patch({ status: option.value })}
            >
              {option.label}
            </FilterChip>
          ))}
        </>
      }
    />
  );
}
