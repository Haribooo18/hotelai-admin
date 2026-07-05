"use client";

import {
  Filter,
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
import { cn } from "@/lib/utils";

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
  onSearchChange: (value: string) => void;
  onChipFilterChange: (value: BookingsChipFilter) => void;
  onDateFilterChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCreateClick: () => void;
};

export function BookingsFilters({
  search,
  chipFilter,
  dateFilter,
  status,
  onSearchChange,
  onChipFilterChange,
  onDateFilterChange,
  onStatusChange,
  onCreateClick,
}: Props) {
  const activeStatusLabel =
    BOOKING_STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    "All statuses";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative min-w-0 flex-1 xl:max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--shell-muted)]"
            size={18}
          />
          <Input
            className="h-11 rounded-[12px] border-0 bg-[var(--shell-surface)] pl-10 text-[13px] shadow-[var(--shell-shadow-sm)] transition-all duration-[180ms] ease-out focus-visible:ring-emerald-500/30"
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
            className="h-11 w-[156px] rounded-[12px] border-0 bg-[var(--shell-surface)] text-[13px] shadow-[var(--shell-shadow-sm)] transition-all duration-[180ms] ease-out focus-visible:ring-emerald-500/30"
          />

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-[12px] bg-[var(--shell-surface)] px-4 text-[13px] font-medium text-[var(--shell-text)] shadow-[var(--shell-shadow-sm)] transition-all duration-[180ms] ease-out",
                "hover:bg-[var(--shell-nav-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
              )}
            >
              <Filter size={16} className="text-[var(--shell-muted)]" />
              {activeStatusLabel}
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="min-w-48 rounded-[12px] border-0 bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-md)]"
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

          <BookingCreateButton
            onClick={onCreateClick}
            className="h-11 rounded-[12px] bg-emerald-600 px-4 text-[13px] font-medium text-white shadow-[var(--shell-shadow-sm)] transition-all duration-[180ms] ease-out hover:bg-emerald-500"
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
              className={cn(
                "rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-[180ms] ease-out",
                active
                  ? "bg-emerald-500/15 text-emerald-500 shadow-[var(--shell-shadow-sm)]"
                  : "bg-[var(--shell-surface)] text-[var(--shell-muted)] shadow-[var(--shell-shadow-sm)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)]"
              )}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
