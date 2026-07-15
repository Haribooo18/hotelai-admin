"use client";

import {
  BedDouble,
  Bell,
  Bot,
  CalendarCheck,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  MessageSquare,
  Search,
  Sparkles,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { useMemo } from "react";

import {
  MockupBadge,
  MockupInsightCard,
  MockupMetric,
  MockupPanel,
  MockupSectionHeader,
  MockupTimelineItem,
} from "@/components/marketing/product/mockups/MockupPrimitives";
import {
  formatMockRevenue,
  useMockHotelRuntime,
} from "@/lib/marketing/mock-hotel-runtime";

const STATIC_ACTIVITY = [
  {
    time: "10:14",
    title: "Maria Thompson checked in",
    detail: "Room 407 · PMS synchronized",
    icon: CalendarCheck,
  },
  {
    time: "10:31",
    title: "Room 305 is ready",
    detail: "Housekeeping completed inspection",
    icon: CheckCircle2,
  },
  {
    time: "10:42",
    title: "Guest question resolved",
    detail: "WhatsApp · 14 seconds",
    icon: MessageSquare,
  },
  {
    time: "11:02",
    title: "Late checkout approved",
    detail: "Reservation #48291 · +$38",
    icon: Clock3,
  },
  {
    time: "11:18",
    title: "VIP profile updated",
    detail: "Preference recorded · Quiet upper floor",
    icon: UserCheck,
  },
  {
    time: "11:36",
    title: "Payment reconciled",
    detail: "Suite 512 · $1,460 received",
    icon: CircleDollarSign,
  },
] as const;

export function DashboardMockup() {
  const runtime = useMockHotelRuntime();

  const liveActivity = useMemo(() => {
    const icon =
      runtime.event.type === "booking"
        ? CalendarCheck
        : runtime.event.type === "payment"
          ? CircleDollarSign
          : runtime.event.type === "upsell"
            ? Sparkles
            : runtime.event.type === "sync"
              ? CheckCircle2
              : MessageSquare;

    return {
      time: "Now",
      title: runtime.event.title,
      detail:
        runtime.event.amount === undefined
          ? runtime.event.detail
          : `${runtime.event.detail} · +${formatMockRevenue(runtime.event.amount)}`,
      icon,
    };
  }, [runtime]);

  const activity = [liveActivity, ...STATIC_ACTIVITY].slice(0, 6);

  const completedActions = runtime.ai.completedSteps;
  const pendingActions = runtime.ai.totalSteps - runtime.ai.completedSteps;

  return (
    <div data-runtime-tick={runtime.tick}
      data-runtime-phase={runtime.phase}
      className="mku-runtime-root relative h-full min-h-[420px] w-full overflow-hidden bg-[#090c10] text-[#eae7df]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_0%,rgba(200,162,90,0.055),transparent_34%),radial-gradient(circle_at_0%_100%,rgba(11,31,27,0.18),transparent_42%)]" />

      <div className="relative flex h-full flex-col">
        <header className="flex h-11 items-center justify-between border-b border-white/[0.04] bg-[#0d1116]/76 px-5 backdrop-blur-xl">
          <div>
            <p className="text-[12.5px] font-semibold tracking-[-0.025em]">
              Operations overview
            </p>

            <p className="mt-0.5 text-[8px] text-[#69717a]">
              {runtime.hotel.name} · {runtime.story.title}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-7 w-44 items-center gap-2 rounded-[9px] border border-white/[0.06] bg-white/[0.02] px-2.5 text-[8px] text-[#626a73]">
              <Search size={11} strokeWidth={1.6} aria-hidden />
              Search operations
            </div>

            <button
              type="button"
              aria-label="Notifications"
              className="flex h-7 w-7 items-center justify-center rounded-[9px] border border-white/[0.06] bg-white/[0.02] text-[#78808a]"
            >
              <Bell size={11} strokeWidth={1.6} aria-hidden />
            </button>

            <MockupBadge tone="green">Live</MockupBadge>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-hidden p-4.5">
          <div className="grid grid-cols-3 gap-3">
            <MockupMetric motionKey={runtime.tick}
              label="Occupancy"
              value={`${runtime.hotel.occupancy}%`}
              delta="+4.2% vs yesterday"
              icon={BedDouble}
              tone="gold"
              active={runtime.event.type === "booking"}
              sparkline="M2 22 C16 22 22 17 34 18 C47 19 52 10 64 12 C76 14 83 5 94 6"
            />

            <MockupMetric motionKey={runtime.tick}
              label="Revenue today"
              value={formatMockRevenue(runtime.revenue.today)}
              delta="+8.1% vs yesterday"
              icon={TrendingUp}
              tone="gold"
              active={
                runtime.event.type === "booking" ||
                runtime.event.type === "payment" ||
                runtime.event.type === "upsell"
              }
              sparkline="M2 23 C14 20 21 22 31 15 C41 8 49 17 59 12 C70 7 80 10 94 3"
            />

            <MockupMetric motionKey={runtime.tick}
              label="Automation steps"
              value={String(completedActions)}
              delta={`${pendingActions} actions pending`}
              icon={Bot}
              tone="green"
              active={
                runtime.event.type === "message" ||
                runtime.event.type === "sync"
              }
              sparkline="M2 21 C17 18 22 20 34 14 C47 9 53 13 65 8 C76 7 84 5 94 4"
            />
          </div>

          <div className="mt-3.5 grid min-h-0 grid-cols-[1.32fr_0.88fr] gap-4">
            <MockupPanel className="h-fit p-4">
              <MockupSectionHeader
                eyebrow="Live operations"
                title="Activity timeline"
                trailing={
                  <span className="text-[8px] text-[#6fa58e]">
                    Updating now
                  </span>
                }
              />

              <div className="mt-3.5">
                {activity.map((item, index) => (
                  <MockupTimelineItem
                    key={`${item.title}-${runtime.tick}-${index}`}
                    time={item.time}
                    title={item.title}
                    detail={item.detail}
                    icon={item.icon}
                    active={index === 0}
                    last={index === activity.length - 1}
                  />
                ))}
              </div>
            </MockupPanel>

            <div className="space-y-3.5">
              <MockupPanel className="p-4">
                <MockupSectionHeader
                  eyebrow="Monavel AI"
                  title="Recommendations"
                  trailing={<Sparkles size={12} className="text-[#d8b66f]" />}
                />

                <div className="mt-3.5 space-y-2.5">
                  <MockupInsightCard
                    title="Increase suite pricing by 8%"
                    confidence="94%"
                    impact="+$420"
                    featured
                    active={
                      runtime.event.type === "booking" ||
                      runtime.event.type === "payment"
                    }
                  />

                  <MockupInsightCard
                    title="Offer late checkout to Room 407"
                    confidence="87%"
                    impact="+$38"
                    active={runtime.event.type === "upsell"}
                  />

                  <MockupInsightCard
                    title="Prepare VIP arrival amenity"
                    confidence="82%"
                    impact="Guest value"
                  />
                </div>
              </MockupPanel>

              <MockupPanel className="p-4">
                <MockupSectionHeader eyebrow="Today" title="Stay movement" />

                <div className="mt-3.5 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[23px] font-semibold leading-none tracking-[-0.04em] text-[#ece9e2]">
                      8
                    </p>
                    <p className="mt-1.5 text-[8px] text-[#6f7781]">
                      Arrivals
                    </p>
                  </div>

                  <div>
                    <p className="text-[23px] font-semibold leading-none tracking-[-0.04em] text-[#ece9e2]">
                      6
                    </p>
                    <p className="mt-1.5 text-[8px] text-[#6f7781]">
                      Departures
                    </p>
                  </div>
                </div>
              </MockupPanel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
