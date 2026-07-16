"use client";

import { BedDouble, Brush, CheckCircle2, DoorOpen, Search, Wrench } from "lucide-react";

import {
  MockupBadge,
  MockupMetric,
  MockupPanel,
  MockupSectionHeader,
} from "@/components/marketing/product/mockups/MockupPrimitives";
import { useMockHotelRuntime } from "@/lib/marketing/mock-hotel-runtime";
import { cn } from "@/lib/utils";

const ROOMS = [
  { room: "407", type: "Deluxe King", status: "Occupied", guest: "Maria Thompson", rate: "$280" },
  { room: "512", type: "Executive Suite", status: "Occupied", guest: "Daniel Cooper", rate: "$365" },
  { room: "204", type: "Standard Queen", status: "Ready", guest: "—", rate: "$210" },
  { room: "305", type: "Deluxe Twin", status: "Cleaning", guest: "—", rate: "$245" },
  { room: "608", type: "Panorama Suite", status: "Ready", guest: "—", rate: "$420" },
  { room: "118", type: "Standard King", status: "Maintenance", guest: "—", rate: "$195" },
] as const;

export function RoomsMockup() {
  const runtime = useMockHotelRuntime();

  return (
    <div data-runtime-tick={runtime.tick}
      data-runtime-phase={runtime.phase}
      className="mku-runtime-root relative h-full min-h-[420px] w-full overflow-hidden bg-[#090c10] text-[#eae7df]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_0%,rgba(200,162,90,0.05),transparent_34%),radial-gradient(circle_at_0%_100%,rgba(11,31,27,0.18),transparent_42%)]" />

      <div className="relative flex h-full flex-col">
        <header className="flex h-11 items-center justify-between border-b border-white/[0.04] bg-[#0d1116]/76 px-5">
          <div>
            <p className="text-[12.5px] font-semibold">Rooms operations</p>
            <p className="mt-0.5 text-[8px] text-[#69717a]">{runtime.hotel.rooms} rooms · {runtime.hotel.occupancy}% occupied</p>
          </div>
          <div className="flex h-7 w-44 items-center gap-2 rounded-[9px] border border-white/[0.06] bg-white/[0.02] px-2.5 text-[8px] text-[#626a73]">
            <Search size={11} aria-hidden />
            Search rooms
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-hidden p-4.5">
          <div className="grid grid-cols-4 gap-3">
            <MockupMetric motionKey={runtime.tick} label="Occupied" value="14" delta="58% of inventory" icon={DoorOpen} tone="gold" />
            <MockupMetric motionKey={runtime.tick} label="Ready" value="7" delta="Available now" icon={CheckCircle2} tone="green" />
            <MockupMetric motionKey={runtime.tick} label="Cleaning" value="2" delta="Avg. 21 min" icon={Brush} />
            <MockupMetric motionKey={runtime.tick} label="Maintenance" value="1" delta="Room 118" icon={Wrench} />
          </div>

          <MockupPanel className="mt-3.5 p-4">
            <MockupSectionHeader eyebrow="Room board" title="Live room status" trailing={<MockupBadge tone="green">Synced</MockupBadge>} />
            <div className="mt-3.5 grid grid-cols-3 gap-3">
              {ROOMS.map((room) => {
                const active = runtime.room.number === room.room;
                const liveStatus = active ? runtime.room.status : room.status;
                return (
                  <article key={room.room} className={cn("rounded-[14px] border p-4", active ? "border-[#6fa58e]/18 bg-[#6fa58e]/[0.055]" : "border-white/[0.05] bg-black/[0.055]")}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-semibold text-[#d5d8dc]">Room {room.room}</p>
                        <p className="mt-1 text-[8px] text-[#717983]">{room.type}</p>
                      </div>
                      <span className="text-[10px] font-medium text-[#d8b66f]">{room.rate}</span>
                    </div>
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div>
                        <MockupBadge tone={liveStatus === "Ready" ? "green" : liveStatus === "Occupied" ? "gold" : "neutral"}>
                          {active ? liveStatus : room.status}
                        </MockupBadge>
                        <p className="mt-2 text-[8px] text-[#626a73]">{active ? `${runtime.guest.name} · ${runtime.event.title}` : room.guest}</p>
                      </div>
                      <BedDouble size={14} className="text-[#666e77]" aria-hidden />
                    </div>
                  </article>
                );
              })}
            </div>
          </MockupPanel>
        </div>
      </div>
    </div>
  );
}
