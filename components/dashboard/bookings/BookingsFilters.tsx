"use client";

import { Filter, LayoutGrid, List, Plus } from "lucide-react";

import { BookingCreateButton } from "./BookingCreateDialog";
import { Input } from "@/components/ui/core/Input";
import { SearchInput } from "@/components/ui/core/SearchInput";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterBar, FilterChip } from "@/components/ui/data/FilterBar";
import { SegmentedControl } from "@/components/ui/navigation/SegmentedControl";
import { BOOKING_STATUS_OPTIONS } from "@/lib/booking-status";
import { toolbarControlClass } from "@/lib/dashboard/design-system";
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
    <FilterBar
      leading={
        <SearchInput
          containerClassName="flex-1 xl:max-w-md"
          placeholder="Search by guest, email, or phone"
          aria-label="Search reservations"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      }
      trailing={
        <>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            aria-label="Filter by date"
            className="h-[var(--ds-input-height)] w-full rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] text-[13px] shadow-[var(--shell-shadow-sm)] sm:w-[156px]"
          />

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Filter by status"
              className={toolbarControlClass}
            >
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

          <SegmentedControl
            value={viewMode}
            onChange={onViewModeChange}
            options={[
              {
                value: "cards",
                ariaLabel: "Card view",
                label: <LayoutGrid size={15} aria-hidden />,
              },
              {
                value: "table",
                ariaLabel: "Table view",
                label: <List size={15} aria-hidden />,
              },
            ]}
          />

          <BookingCreateButton
            onClick={onCreateClick}
            className="h-[var(--ds-input-height)] rounded-[var(--ds-radius-sm)] bg-emerald-600 px-4 text-[13px] font-medium text-white shadow-[var(--shell-shadow-sm)] transition-[transform,background-color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px hover:bg-emerald-500"
            label="New reservation"
            icon={Plus}
          />
        </>
      }
      filters={
        <>
          {CHIP_FILTERS.map((chip) => (
            <FilterChip
              key={chip.id}
              active={chipFilter === chip.id}
              onClick={() => onChipFilterChange(chip.id)}
            >
              {chip.label}
            </FilterChip>
          ))}
        </>
      }
    />
  );
}
