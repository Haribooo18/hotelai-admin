"use client";

import { ArrowUpRight, CircleDollarSign, Sparkles, TrendingUp, WalletCards } from "lucide-react";

import {
  MockupBadge,
  MockupInsightCard,
  MockupMetric,
  MockupPanel,
  MockupSectionHeader,
} from "@/components/marketing/product/mockups/MockupPrimitives";
import {
  formatMockRevenue,
  useMockHotelRuntime,
} from "@/lib/marketing/mock-hotel-runtime";
import { cn } from "@/lib/utils";

function RevenueChart({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 520 180" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="revFillV2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d8b66f" stopOpacity=".22" />
          <stop offset="100%" stopColor="#d8b66f" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[35, 75, 115, 155].map((y) => <line key={y} x1="20" y1={y} x2="500" y2={y} stroke="rgba(255,255,255,.045)" />)}
      <path d="M20 154 C70 144 94 118 136 126 C179 134 202 91 244 97 C286 103 315 68 360 77 C404 85 438 42 500 34 L500 180 L20 180 Z" fill="url(#revFillV2)" />
      <path d="M20 154 C70 144 94 118 136 126 C179 134 202 91 244 97 C286 103 315 68 360 77 C404 85 438 42 500 34" fill="none" stroke="#d8b66f" strokeWidth="2" strokeLinecap="round" className={cn(active ? "drop-shadow-[0_0_7px_rgba(216,182,111,.4)]" : "opacity-85")} />
    </svg>
  );
}

export function RevenueMockup() {
  const runtime = useMockHotelRuntime();
  const active = ["booking", "payment", "upsell"].includes(runtime.event.type);

  return (
    <div data-runtime-tick={runtime.tick}
      data-runtime-phase={runtime.phase}
      className="mku-runtime-root relative h-full min-h-[420px] w-full overflow-hidden bg-[#090c10] text-[#eae7df]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_0%,rgba(200,162,90,0.06),transparent_34%),radial-gradient(circle_at_0%_100%,rgba(11,31,27,0.18),transparent_42%)]" />

      <div className="relative flex h-full flex-col">
        <header className="flex h-11 items-center justify-between border-b border-white/[0.04] bg-[#0d1116]/76 px-5">
          <div>
            <p className="text-[12.5px] font-semibold">Revenue intelligence</p>
            <p className="mt-0.5 text-[8px] text-[#69717a]">{runtime.hotel.name} · Live pricing performance</p>
          </div>
          <MockupBadge tone="gold">July 2026</MockupBadge>
        </header>

        <div className="min-h-0 flex-1 p-4.5">
          <div className="grid grid-cols-4 gap-3">
            <MockupMetric motionKey={runtime.tick} label="Revenue today" value={formatMockRevenue(runtime.revenue.today)} delta={runtime.revenue.delta > 0 ? `+${formatMockRevenue(runtime.revenue.delta)} live` : "No change"} icon={CircleDollarSign} tone="gold" active={active} />
            <MockupMetric motionKey={runtime.tick} label="Forecast" value={formatMockRevenue(runtime.revenue.forecast)} delta="Today close" icon={TrendingUp} tone="gold" />
            <MockupMetric motionKey={runtime.tick} label="ADR" value="$284" delta="+6.2%" icon={WalletCards} />
            <MockupMetric motionKey={runtime.tick} label="RevPAR" value="$244" delta={`${runtime.hotel.occupancy}% occupancy`} icon={ArrowUpRight} tone="green" />
          </div>

          <div className="mt-3.5 grid grid-cols-[1.35fr_0.85fr] gap-4">
            <MockupPanel className="p-4">
              <MockupSectionHeader eyebrow="Performance" title="Revenue trend" trailing={<span className="text-[8px] text-[#6fa58e]">+18.4%</span>} />
              <div className="mt-3 h-[220px]"><RevenueChart active={active} /></div>
            </MockupPanel>

            <div className="space-y-3.5">
              <MockupPanel className="p-4">
                <MockupSectionHeader eyebrow="Monavel AI" title="Pricing opportunities" trailing={<Sparkles size={11} className="text-[#d8b66f]" />} />
                <div className="mt-3 space-y-2.5">
                  <MockupInsightCard title="Increase suite pricing by 8%" confidence="94%" impact="+$420" featured active={active} />
                  <MockupInsightCard title="Close low-rate inventory" confidence="88%" impact="+$180" />
                </div>
              </MockupPanel>
              <MockupPanel className="p-4">
                <MockupSectionHeader eyebrow="Channel mix" title="Direct revenue" />
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div><p className="text-[25px] font-semibold text-[#d8b66f]">42%</p><p className="mt-1 text-[8px] text-[#68717a]">Direct bookings</p></div>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.05]"><div className="h-full w-[42%] rounded-full bg-[#d8b66f]" /></div>
                </div>
              </MockupPanel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
