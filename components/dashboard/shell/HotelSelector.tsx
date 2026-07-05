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
};

export function HotelSelector({ hotels, activeHotelId, onSelect }: Props) {
  const activeHotel =
    hotels.find((hotel) => hotel.id === activeHotelId) ?? hotels[0];

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--shell-muted)]">
        Connected hotel
      </p>

      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-[12px] border border-[var(--shell-border)] bg-[var(--shell-surface)] px-3 py-2.5 text-left transition-all duration-200 ease-out",
            "hover:bg-[var(--shell-nav-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
          )}
        >
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-medium text-[var(--shell-text)]">
              {activeHotel?.name ?? "Hotel"}
            </span>
          </span>
          <ChevronDown
            size={16}
            className="shrink-0 text-[var(--shell-muted)]"
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-[12px] border-[var(--shell-border)] bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-md)]"
        >
          {hotels.map((hotel) => (
            <DropdownMenuItem
              key={hotel.id}
              onClick={() => onSelect?.(hotel.id)}
              className={cn(
                "rounded-[10px] px-3 py-2 text-[13px] transition-colors duration-200 ease-out",
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
    </div>
  );
}
