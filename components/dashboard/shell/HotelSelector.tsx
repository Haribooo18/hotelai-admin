"use client";

import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type ShellHotelOption = {
  id: string;
  name: string;
};

type Props = {
  hotels: ShellHotelOption[];
  activeHotelId: string;
  onSelect?: (hotelId: string) => void;
  compact?: boolean;
};

export function HotelSelector({
  hotels,
  activeHotelId,
  onSelect,
  compact = false,
}: Props) {
  const activeHotel =
    hotels.find((hotel) => hotel.id === activeHotelId) ?? hotels[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-[10px] border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] px-2.5 py-2 text-left transition-[background-color,border-color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
          "hover:border-[var(--shell-border-strong)] hover:bg-[var(--shell-nav-hover-bg)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]",
          compact ? "text-[12px]" : "text-[13px]"
        )}
      >
        <span className="min-w-0 truncate font-medium text-[var(--shell-text)]">
          {activeHotel?.name ?? "Hotel"}
        </span>
        <ChevronDown
          size={14}
          className="shrink-0 text-[var(--shell-muted)]"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="min-w-52 rounded-[var(--ds-radius-sm)] border-[var(--shell-border)] bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-md)]"
      >
        {hotels.map((hotel) => (
          <DropdownMenuItem
            key={hotel.id}
            onClick={() => onSelect?.(hotel.id)}
            className={cn(
              "rounded-[10px] px-2.5 py-2 text-[12px] transition-colors duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
              hotel.id === activeHotelId
                ? "bg-[var(--shell-nav-active-bg)] text-[var(--shell-nav-active-text)]"
                : "text-[var(--shell-text)]"
            )}
          >
            {hotel.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
