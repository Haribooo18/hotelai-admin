"use client";

import {
  BedDouble,
  CalendarCheck,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Search,
  UserRound,
} from "lucide-react";
import { useMemo } from "react";

import {
  MockupBadge,
  MockupMetric,
  MockupPanel,
  MockupSectionHeader,
} from "@/components/marketing/product/mockups/MockupPrimitives";
import {
  formatMockRevenue,
  useMockHotelRuntime,
} from "@/lib/marketing/mock-hotel-runtime";
import { cn } from "@/lib/utils";

const STATIC_BOOKINGS = [
  { id: "48291", guest: "Maria Thompson", room: "Deluxe 407", dates: "15–18 Jul", status: "Confirmed", amount: 840, tag: "VIP" },
  { id: "48307", guest: "Daniel Cooper", room: "Suite 512", dates: "16–20 Jul", status: "Checked in", amount: 1460, tag: "Direct" },
  { id: "48312", guest: "Sofia Alvarez", room: "Standard 204", dates: "17–19 Jul", status: "Pending", amount: 420, tag: "Payment" },
  { id: "48318", guest: "Noah Williams", room: "Deluxe 305", dates: "18–21 Jul", status: "Confirmed", amount: 990, tag: "Upsell" },
] as const;

function Status({ value }: { value: string }) {
  return (
    <MockupBadge
      tone={
        value === "Confirmed"
          ? "green"
          : value === "Checked in"
            ? "gold"
            : "neutral"
      }
    >
      {value}
    </MockupBadge>
  );
}

export function BookingsMockup() {
  const runtime = useMockHotelRuntime();

  const bookings = useMemo(() => {
    const live = {
      id: runtime.guest.reservation,
      guest: runtime.guest.name,
      room: runtime.guest.room,
      dates: runtime.booking.dates,
      status: runtime.booking.status,
      amount: runtime.booking.amount,
      tag: runtime.booking.isNew ? "New booking" : "AI update",
      live: true,
    };

    return [
      live,
      ...STATIC_BOOKINGS.filter((item) => item.id !== live.id).map((item) => ({
        ...item,
        live: false,
      })),
    ].slice(0, 5);
  }, [runtime]);

  return (
    <div data-runtime-tick={runtime.tick}
      data-runtime-phase={runtime.phase}
      className="mku-runtime-root relative h-full min-h-[420px] w-full overflow-hidden bg-[#090c10] text-[#eae7df]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_0%,rgba(200,162,90,0.05),transparent_34%),radial-gradient(circle_at_0%_100%,rgba(11,31,27,0.18),transparent_42%)]" />

      <div className="relative flex h-full flex-col">
        <header className="flex h-11 items-center justify-between border-b border-white/[0.04] bg-[#0d1116]/76 px-5">
          <div>
            <p className="text-[12.5px] font-semibold">Bookings command center</p>
            <p className="mt-0.5 text-[8px] text-[#69717a]">
              {runtime.hotel.name} · Cross-channel reservations
            </p>
          </div>
          <div className="flex h-7 w-44 items-center gap-2 rounded-[9px] border border-white/[0.06] bg-white/[0.02] px-2.5 text-[8px] text-[#626a73]">
            <Search size={11} aria-hidden />
            Search bookings
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-hidden p-4.5">
          <div className="grid grid-cols-4 gap-3">
            <MockupMetric motionKey={runtime.tick} label="Arrivals" value="8" delta="3 VIP guests" icon={CalendarCheck} tone="gold" />
            <MockupMetric motionKey={runtime.tick} label="Confirmed" value="24" delta="+4 today" icon={CheckCircle2} tone="green" />
            <MockupMetric motionKey={runtime.tick} label="Pending" value="3" delta="2 need payment" icon={Clock3} />
            <MockupMetric motionKey={runtime.tick}
              label="Booked revenue"
              value={formatMockRevenue(runtime.metrics.revenueToday)}
              delta="+12.8% this week"
              icon={CircleDollarSign}
              tone="gold"
            />
          </div>

          <MockupPanel className="mt-3.5 overflow-hidden">
            <div className="p-4">
              <MockupSectionHeader
                eyebrow="Live reservations"
                title="Today and upcoming"
                trailing={<MockupBadge tone="green">Synced</MockupBadge>}
              />
            </div>

            <div className="grid grid-cols-[0.65fr_1.35fr_0.95fr_0.85fr_0.8fr_0.75fr_0.55fr] px-4 py-2 text-[8px] uppercase tracking-[0.1em] text-[#606873]">
              <span>ID</span><span>Guest</span><span>Room</span><span>Dates</span><span>AI tag</span><span>Status</span><span className="text-right">Total</span>
            </div>

            {bookings.map((booking) => (
              <article
                key={`${booking.id}-${runtime.tick}`}
                className={cn(
                  "grid grid-cols-[0.65fr_1.35fr_0.95fr_0.85fr_0.8fr_0.75fr_0.55fr] items-center px-4 py-3 text-[9px]",
                  booking.live ? "bg-[#6fa58e]/[0.05]" : "bg-transparent"
                )}
              >
                <span className="font-mono text-[#68717a]">#{booking.id}</span>
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border", booking.live ? "border-[#6fa58e]/18 bg-[#6fa58e]/10 text-[#7eae99]" : "border-white/[0.06] bg-white/[0.025] text-[#737b84]")}>
                    <UserRound size={11} aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#cfd3d7]">{booking.guest}</p>
                    {booking.live ? <p className="mt-0.5 text-[8px] text-[#6fa58e]">Live update</p> : null}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[#7f8790]">
                  <BedDouble size={10} aria-hidden />
                  <span className="truncate">{booking.room}</span>
                </div>
                <span className="text-[#7f8790]">{booking.dates}</span>
                <span className="text-[8px] text-[#d8b66f]">{booking.tag}</span>
                <Status value={booking.status} />
                <span className="text-right font-medium text-[#d8b66f]">{formatMockRevenue(booking.amount)}</span>
              </article>
            ))}
          </MockupPanel>
        </div>
      </div>
    </div>
  );
}
