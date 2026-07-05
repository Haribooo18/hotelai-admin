"use client";

import {
  BedDouble,
  Filter,
  LayoutGrid,
  List,
  Search,
  Trash2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select } from "@/components/ui/select";
import {
  stickyToolbarClass,
  toolbarInputClass,
} from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

import type {
  RoomOperationalStatus,
  RoomSortKey,
  RoomViewMode,
} from "./room-ops-metrics";

const SORT_OPTIONS: { value: RoomSortKey; label: string }[] = [
  { value: "type_asc", label: "Type A–Z" },
  { value: "type_desc", label: "Type Z–A" },
  { value: "price_asc", label: "Price ascending" },
  { value: "price_desc", label: "Price descending" },
  { value: "capacity", label: "By capacity" },
  { value: "status", label: "By status" },
];

const STATUS_OPTIONS: { value: RoomOperationalStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "available", label: "Available" },
  { value: "occupied", label: "Occupied" },
  { value: "cleaning", label: "Housekeeping" },
  { value: "maintenance", label: "Maintenance" },
  { value: "reserved", label: "Reserved" },
];

type Props = {
  search: string;
  floor: string;
  status: string;
  roomType: string;
  floorOptions: string[];
  roomTypeOptions: string[];
  sortKey: RoomSortKey;
  viewMode: RoomViewMode;
  selectedCount: number;
  onSearchChange: (value: string) => void;
  onFloorChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRoomTypeChange: (value: string) => void;
  onSortChange: (value: RoomSortKey) => void;
  onViewModeChange: (value: RoomViewMode) => void;
  onCreateClick: () => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
};

export function RoomToolbar({
  search,
  floor,
  status,
  roomType,
  floorOptions,
  roomTypeOptions,
  sortKey,
  viewMode,
  selectedCount,
  onSearchChange,
  onFloorChange,
  onStatusChange,
  onRoomTypeChange,
  onSortChange,
  onViewModeChange,
  onCreateClick,
  onBulkDelete,
  onClearSelection,
}: Props) {
  const activeSort =
    SORT_OPTIONS.find((option) => option.value === sortKey)?.label ??
    "Sort";

  return (
    <div className={stickyToolbarClass}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative min-w-0 flex-1 xl:max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--shell-muted)]"
            size={18}
          />
          <Input
            className={toolbarInputClass}
            placeholder="Search by room type..."
            aria-label="Search rooms"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={floor}
            onChange={onFloorChange}
            placeholder="All floors"
            aria-label="Filter by floor"
            className="h-[var(--ds-input-height)] min-w-[130px] rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface)] shadow-[var(--shell-shadow-sm)]"
            options={floorOptions.map((value) => ({ value, label: value }))}
          />

          <Select
            value={status}
            onChange={onStatusChange}
            placeholder="All statuses"
            aria-label="Filter by status"
            className="h-[var(--ds-input-height)] min-w-[140px] rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface)] shadow-[var(--shell-shadow-sm)]"
            options={STATUS_OPTIONS.filter((option) => option.value !== "").map(
              (option) => ({ value: option.value, label: option.label })
            )}
          />

          <Select
            value={roomType}
            onChange={onRoomTypeChange}
            placeholder="All types"
            aria-label="Filter by room type"
            className="h-[var(--ds-input-height)] min-w-[150px] rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface)] shadow-[var(--shell-shadow-sm)]"
            options={roomTypeOptions.map((value) => ({ value, label: value }))}
          />

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "inline-flex h-[var(--ds-input-height)] items-center gap-2 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface)] px-4 text-[13px] font-medium text-[var(--shell-text)] shadow-[var(--shell-shadow-sm)] transition-all duration-[var(--ds-duration-slow)] ease-out",
                "hover:bg-[var(--shell-nav-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
              )}
            >
              <Filter size={16} className="text-[var(--shell-muted)]" />
              {activeSort}
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="min-w-52 rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-md)]"
            >
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={cn(
                    "rounded-[10px] px-3 py-2 text-[13px]",
                    sortKey === option.value
                      ? "bg-[var(--shell-nav-active-bg)] text-[var(--shell-nav-active-text)]"
                      : "text-[var(--shell-text)]"
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-sm)]">
            <button
              type="button"
              aria-label="Grid"
              aria-pressed={viewMode === "grid"}
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-[10px] transition-all duration-[var(--ds-duration-slow)] ease-out",
                viewMode === "grid"
                  ? "bg-[var(--shell-nav-active-bg)] text-emerald-500"
                  : "text-[var(--shell-muted)] hover:text-[var(--shell-text)]"
              )}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              aria-label="List"
              aria-pressed={viewMode === "list"}
              onClick={() => onViewModeChange("list")}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-[10px] transition-all duration-[var(--ds-duration-slow)] ease-out",
                viewMode === "list"
                  ? "bg-[var(--shell-nav-active-bg)] text-emerald-500"
                  : "text-[var(--shell-muted)] hover:text-[var(--shell-text)]"
              )}
            >
              <List size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={onCreateClick}
            className="inline-flex h-[var(--ds-input-height)] items-center gap-2 rounded-[var(--ds-radius-sm)] bg-emerald-600 px-4 text-[13px] font-medium text-white shadow-[var(--shell-shadow-sm)] transition-all duration-[var(--ds-duration-slow)] ease-out hover:bg-emerald-500"
          >
            <BedDouble size={16} />
            Add Room
          </button>
        </div>
      </div>

      {selectedCount > 0 ? (
        <div className="flex flex-wrap items-center gap-2 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface)] px-4 py-3 shadow-[var(--shell-shadow-sm)]">
          <span className="text-[13px] font-medium text-[var(--shell-text)]">
            Selected: {selectedCount}
          </span>
          <button
            type="button"
            onClick={onBulkDelete}
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-red-500/10 px-3 py-1.5 text-[12px] font-medium text-red-400 transition-all duration-[var(--ds-duration-slow)] ease-out hover:bg-red-500/15"
          >
            <Trash2 size={14} />
            Delete
          </button>
          <button
            type="button"
            onClick={onClearSelection}
            className="ml-auto text-[12px] text-[var(--shell-muted)] transition-opacity duration-[var(--ds-duration-slow)] ease-out hover:opacity-80"
          >
            Clear selection
          </button>
        </div>
      ) : null}
    </div>
  );
}
