"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  MockupBadge,
  MockupPanel,
  MockupSectionHeader,
} from "@/components/marketing/product/mockups/MockupPrimitives";
import { useMockHotelRuntime } from "@/lib/marketing/mock-hotel-runtime";
import { cn } from "@/lib/utils";

const DAYS = ["Mon 13", "Tue 14", "Wed 15", "Thu 16", "Fri 17", "Sat 18", "Sun 19"];
const ROWS = [
  { room: "204", type: "Standard", start: 4, span: 2, guest: "Sofia Alvarez" },
  { room: "305", type: "Deluxe", start: 1, span: 3, guest: "Noah Williams" },
  { room: "407", type: "Deluxe", start: 2, span: 4, guest: "Maria Thompson" },
  { room: "512", type: "Suite", start: 3, span: 4, guest: "Daniel Cooper" },
  { room: "608", type: "Suite", start: 5, span: 2, guest: "Emma Stone" },
] as const;

export function CalendarMockup() {
  const runtime = useMockHotelRuntime();

  return (
    <div data-runtime-tick={runtime.tick}
      data-runtime-phase={runtime.phase}
      className="mku-runtime-root relative h-full min-h-[420px] w-full overflow-hidden bg-[#090c10] text-[#eae7df]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_0%,rgba(200,162,90,0.05),transparent_34%),radial-gradient(circle_at_0%_100%,rgba(11,31,27,0.18),transparent_42%)]" />

      <div className="relative flex h-full flex-col">
        <header className="flex h-11 items-center justify-between border-b border-white/[0.04] bg-[#0d1116]/76 px-5">
          <div>
            <p className="text-[12.5px] font-semibold">Stay calendar</p>
            <p className="mt-0.5 text-[8px] text-[#69717a]">{runtime.hotel.name} · {runtime.hotel.occupancy}% occupied</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex h-7 w-7 items-center justify-center rounded-[9px] border border-white/[0.06] bg-white/[0.02]"><ChevronLeft size={11} aria-hidden /></button>
            <span className="text-[9px] text-[#c5c9ce]">13–19 July 2026</span>
            <button className="flex h-7 w-7 items-center justify-center rounded-[9px] border border-white/[0.06] bg-white/[0.02]"><ChevronRight size={11} aria-hidden /></button>
          </div>
        </header>

        <div className="min-h-0 flex-1 p-4.5">
          <MockupPanel className="h-full overflow-hidden">
            <div className="p-4">
              <MockupSectionHeader eyebrow="Weekly view" title="Reservations by room" trailing={<MockupBadge tone="green">Live availability</MockupBadge>} />
            </div>
            <div className="grid grid-cols-[110px_repeat(7,minmax(0,1fr))] bg-white/[0.015]">
              <div className="px-3 py-2 text-[8px] uppercase tracking-[0.1em] text-[#606873]">Rooms</div>
              {DAYS.map((day) => <div key={day} className="px-2 py-2 text-center text-[8px] text-[#7b838c]">{day}</div>)}
            </div>

            {ROWS.map((row) => {
              const active = runtime.room.number === row.room;
              return (
                <div key={row.room} className="grid grid-cols-[110px_repeat(7,minmax(0,1fr))]">
                  <div className="px-3 py-3">
                    <p className="text-[9px] font-medium text-[#cfd3d7]">Room {row.room}</p>
                    <p className="mt-0.5 text-[8px] text-[#626a73]">{row.type}</p>
                  </div>

                  {DAYS.map((day, index) => (
                    <div key={day} className="relative min-h-[52px] bg-black/[0.02]">
                      {index + 1 === row.start ? (
                        <div
                          className={cn(
                            "absolute inset-y-2 left-1 z-10 rounded-[10px] border px-2 py-1.5",
                            active
                              ? "border-[#6fa58e]/20 bg-[#6fa58e]/12 text-[#9bc7b3]"
                              : "border-[#d8b66f]/16 bg-[#d8b66f]/10 text-[#dfc180]"
                          )}
                          style={{
                            width: `calc(${active ? runtime.calendar.nights : row.span} * 100% - 0.5rem)`,
                          }}
                        >
                          <p className="truncate text-[8px] font-medium">{active ? runtime.guest.name : row.guest}</p>
                          <p className="mt-0.5 text-[7px] opacity-70">
                            {active ? runtime.calendar.nights : row.span} nights
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              );
            })}
          </MockupPanel>
        </div>
      </div>
    </div>
  );
}
