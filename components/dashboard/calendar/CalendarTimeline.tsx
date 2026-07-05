"use client";

import { useEffect, useMemo, useRef, useState, type UIEvent } from "react";

import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { Room } from "@/types/room";
import { cn } from "@/lib/utils";
import {
  DAY_WIDTH,
  ROOM_COL_WIDTH,
  ROW_HEIGHT,
  computeOccupancy,
  isToday,
  isWeekend,
  placeBooking,
} from "@/lib/calendar";
import { buildBookingCardModels } from "@/components/dashboard/bookings/booking-ops-metrics";
import {
  DashboardEmptyState,
  DashboardSkeletonBlock,
} from "@/components/dashboard/home/DashboardPrimitives";
import { CalendarDays } from "lucide-react";

import { CalendarDateHeader } from "./CalendarDateHeader";
import { CalendarRoomCell } from "./CalendarRoomCell";
import { CalendarBookingBar } from "./CalendarBookingBar";
import type { CalendarRoomModel } from "./calendar-ops-metrics";

const HEADER_HEIGHT = 68;
const OVERSCAN = 4;

type Props = {
  rooms: Room[];
  roomModels: CalendarRoomModel[];
  bookings: Booking[];
  guests: Guest[];
  days: Date[];
  loading?: boolean;
  scrollToTodayTick?: number;
  onReschedule: (
    booking: Booking,
    next: { check_in: string; check_out: string }
  ) => void;
  onOpen: (booking: Booking) => void;
};

export function CalendarTimeline({
  rooms,
  roomModels,
  bookings,
  guests,
  days,
  loading,
  scrollToTodayTick = 0,
  onReschedule,
  onOpen,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTopRef = useRef(0);
  const scrollRafRef = useRef<number | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(600);

  const roomModelById = useMemo(
    () => new Map(roomModels.map((model) => [model.room.id, model])),
    [roomModels]
  );

  useEffect(() => {
    if (!scrollToTodayTick || !scrollRef.current) return;

    const todayIndex = days.findIndex((day) => isToday(day));
    if (todayIndex < 0) return;

    const el = scrollRef.current;
    const targetLeft =
      ROOM_COL_WIDTH +
      todayIndex * DAY_WIDTH -
      el.clientWidth / 2 +
      DAY_WIDTH / 2;

    el.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
  }, [scrollToTodayTick, days]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const measure = () => setViewportHeight(el.clientHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const occupancy = useMemo(
    () => computeOccupancy(bookings, rooms.length, days),
    [bookings, rooms.length, days]
  );

  const bookingsByRoom = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const booking of bookings) {
      const list = map.get(booking.room_id) ?? [];
      list.push(booking);
      map.set(booking.room_id, list);
    }
    return map;
  }, [bookings]);

  const bookingModelsById = useMemo(() => {
    const models = buildBookingCardModels(bookings, rooms, guests);
    return new Map(models.map((model) => [model.booking.id, model]));
  }, [bookings, rooms, guests]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    scrollTopRef.current = event.currentTarget.scrollTop;
    if (scrollRafRef.current !== null) return;

    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      setScrollTop(scrollTopRef.current);
    });
  };

  const firstVisible = Math.max(
    0,
    Math.floor((scrollTop - HEADER_HEIGHT) / ROW_HEIGHT) - OVERSCAN
  );
  const visibleCount =
    Math.ceil(viewportHeight / ROW_HEIGHT) + OVERSCAN * 2;
  const lastVisible = Math.min(rooms.length, firstVisible + visibleCount);

  const topSpacer = firstVisible * ROW_HEIGHT;
  const bottomSpacer = Math.max(0, (rooms.length - lastVisible) * ROW_HEIGHT);
  const visibleRooms = rooms.slice(firstVisible, lastVisible);

  const totalWidth = ROOM_COL_WIDTH + days.length * DAY_WIDTH;
  const gridWidth = days.length * DAY_WIDTH;

  if (loading) {
    return (
      <div className="space-y-2 rounded-[var(--ds-radius)] bg-[var(--shell-surface)]/80 p-4 shadow-[var(--shell-shadow-sm)] backdrop-blur-xl">
        <DashboardSkeletonBlock className="h-[68px] w-full" />
        {Array.from({ length: 6 }).map((_, index) => (
          <DashboardSkeletonBlock key={index} className="h-[72px] w-full" />
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <DashboardEmptyState
        title="No rooms configured"
        description="Add rooms to your property to see the operations calendar."
        icon={<CalendarDays size={18} />}
      />
    );
  }

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      role="region"
      aria-label="Reservation calendar"
      className="relative max-h-[min(70svh,720px)] min-h-[420px] overflow-auto overscroll-contain rounded-[var(--ds-radius)] bg-[var(--shell-surface)]/80 shadow-[var(--shell-shadow-sm)] backdrop-blur-xl"
    >
      <div style={{ width: totalWidth, minWidth: totalWidth }}>
        <CalendarDateHeader days={days} occupancy={occupancy} />

        <div style={{ height: topSpacer }} />

        {visibleRooms.map((room) => {
          const roomBookings = bookingsByRoom.get(room.id) ?? [];
          const roomModel = roomModelById.get(room.id);

          return (
            <div
              key={room.id}
              className="relative flex border-b border-[var(--shell-border)]/40"
              style={{ height: ROW_HEIGHT }}
            >
              {roomModel ? (
                <CalendarRoomCell model={roomModel} />
              ) : (
                <div
                  className="sticky left-0 z-20 border-r border-[var(--shell-border)]/50 bg-[var(--shell-surface)]/95 px-3"
                  style={{ width: ROOM_COL_WIDTH, minWidth: ROOM_COL_WIDTH }}
                />
              )}

              <div className="relative" style={{ width: gridWidth }}>
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={cn(
                      "absolute inset-y-0 border-r border-[var(--shell-border)]/30",
                      isWeekend(day) && "bg-[var(--shell-surface-raised)]/15",
                      isToday(day) && "bg-emerald-500/[0.06]"
                    )}
                    style={{ left: index * DAY_WIDTH, width: DAY_WIDTH }}
                  />
                ))}

                {roomBookings.map((booking) => {
                  const placement = placeBooking(booking, days);
                  if (!placement) return null;

                  const model = bookingModelsById.get(booking.id);
                  if (!model) return null;

                  return (
                    <CalendarBookingBar
                      key={booking.id}
                      model={model}
                      placement={placement}
                      onReschedule={onReschedule}
                      onOpen={onOpen}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        <div style={{ height: bottomSpacer }} />
      </div>
    </div>
  );
}
