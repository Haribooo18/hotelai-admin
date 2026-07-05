"use client";

import {
  Filter,
  LayoutGrid,
  List,
  Plus,
  Search,
} from "lucide-react";

import { BookingCreateButton } from "./BookingCreateDialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BOOKING_STATUS_OPTIONS } from "@/lib/booking-status";
import {
  chipActiveClass,
  chipClass,
  chipIdleClass,
  stickyToolbarClass,
  toolbarControlClass,
  toolbarInputClass,
} from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

import type { BookingViewMode } from "./booking-ops-metrics";

export type BookingsChipFilter =
  | "all"
  | "new"
  | "confirmed"
  | "check_in_today"
  | "check_out_today";

const CHIP_FILTERS: { id: BookingsChipFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "confirmed", label: "Confirmed" },
  { id: "check_in_today", label: "Check-in today" },
  { id: "check_out_today", label: "Check-out today" },
];

type Props = {
  search: string;
  chipFilter: BookingsChipFilter;
  dateFilter: string;
  status: string;
  viewMode: BookingViewMode;
  onSearchChange: (value: string) => void;
  onChipFilterChange: (value: BookingsChipFilter) => void;
  onDateFilterChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onViewModeChange: (value: BookingViewMode) => void;
  onCreateClick: () => void;
};

export function BookingsFilters({
  search,
  chipFilter,
  dateFilter,
  status,
  viewMode,
  onSearchChange,
  onChipFilterChange,
  onDateFilterChange,
  onStatusChange,
  onViewModeChange,
  onCreateClick,
}: Props) {
  const activeStatusLabel =
    BOOKING_STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    "All statuses";

  return (
    <div className={stickyToolbarClass}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative min-w-0 flex-1 xl:max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--shell-muted)]"
            size={17}
          />
          <Input
            className={toolbarInputClass}
            placeholder="Search by guest, email, or phone"
            aria-label="Search reservations"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            aria-label="Filter by date"
            className="h-[var(--ds-input-height)] w-[156px] rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] text-[13px] shadow-[var(--shell-shadow-sm)]"
          />

          <DropdownMenu>
            <DropdownMenuTrigger className={toolbarControlClass}>
              <Filter size={15} className="text-[var(--shell-muted)]" />
              {activeStatusLabel}
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="min-w-48 rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-md)]"
            >
              <DropdownMenuItem
                onClick={() => onStatusChange("")}
                className={cn(
                  "rounded-[10px] px-3 py-2 text-[13px]",
                  status === ""
                    ? "bg-[var(--shell-nav-active-bg)] text-[var(--shell-nav-active-text)]"
                    : "text-[var(--shell-text)]"
                )}
              >
                All statuses
              </DropdownMenuItem>

              {BOOKING_STATUS_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onStatusChange(option.value)}
                  className={cn(
                    "rounded-[10px] px-3 py-2 text-[13px]",
                    status === option.value
                      ? "bg-[var(--shell-nav-active-bg)] text-[var(--shell-nav-active-text)]"
                      : "text-[var(--shell-text)]"
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)] p-1 shadow-[var(--shell-shadow-sm)]">
            <button
              type="button"
              aria-label="Card view"
              aria-pressed={viewMode === "cards"}
              onClick={() => onViewModeChange("cards")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-[10px] transition-all duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
                viewMode === "cards"
                  ? "bg-[var(--shell-nav-active-bg)] text-[var(--shell-accent)]"
                  : "text-[var(--shell-muted)] hover:text-[var(--shell-text)]"
              )}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              aria-label="Table view"
              aria-pressed={viewMode === "table"}
              onClick={() => onViewModeChange("table")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-[10px] transition-all duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
                viewMode === "table"
                  ? "bg-[var(--shell-nav-active-bg)] text-[var(--shell-accent)]"
                  : "text-[var(--shell-muted)] hover:text-[var(--shell-text)]"
              )}
            >
              <List size={15} />
            </button>
          </div>

          <BookingCreateButton
            onClick={onCreateClick}
            className="h-[var(--ds-input-height)] rounded-[var(--ds-radius-sm)] bg-emerald-600 px-4 text-[13px] font-medium text-white shadow-[var(--shell-shadow-sm)] transition-[transform,background-color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px hover:bg-emerald-500"
            label="New reservation"
            icon={Plus}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {CHIP_FILTERS.map((chip) => {
          const active = chipFilter === chip.id;

          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => onChipFilterChange(chip.id)}
              className={cn(chipClass, active ? chipActiveClass : chipIdleClass)}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
