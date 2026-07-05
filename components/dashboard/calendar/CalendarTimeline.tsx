"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";
import { cn } from "@/lib/utils";
import {
  DAY_WIDTH,
  ROOM_COL_WIDTH,
  ROW_HEIGHT,
  addDays,
  computeOccupancy,
  isToday,
  isWeekend,
  placeBooking,
  rangesOverlap,
  toISODate,
} from "@/lib/calendar";

import { CalendarDateHeader } from "./CalendarDateHeader";
import { CalendarRoomCell } from "./CalendarRoomCell";
import { CalendarBookingBar } from "./CalendarBookingBar";

const HEADER_HEIGHT = 60;
const OVERSCAN = 4;

type Props = {
  rooms: Room[];
  bookings: Booking[];
  days: Date[];
  /** Increment to scroll the timeline horizontally to today's column. */
  scrollToTodayTick?: number;
  onReschedule: (
    booking: Booking,
    next: { check_in: string; check_out: string }
  ) => void;
  onOpen: (booking: Booking) => void;
};

export function CalendarTimeline({
  rooms,
  bookings,
  days,
  scrollToTodayTick = 0,
  onReschedule,
  onOpen,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(600);

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

  // Vertical row virtualization.
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

  return (
    <div
      ref={scrollRef}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      className="relative max-h-[70vh] overflow-auto rounded-[var(--ds-radius)] border border-[var(--shell-border)] bg-[var(--shell-surface)]"
    >
      <div style={{ width: totalWidth, minWidth: totalWidth }}>
        <CalendarDateHeader days={days} occupancy={occupancy} />

        <div style={{ height: topSpacer }} />

        {visibleRooms.map((room) => {
          const roomBookings = bookingsByRoom.get(room.id) ?? [];
          const activeBookings = roomBookings.filter(
            (b) => b.status !== "cancelled"
          );

          let occupiedDays = 0;
          for (const day of days) {
            const iso = toISODate(day);
            const next = toISODate(addDays(day, 1));
            if (
              activeBookings.some((b) =>
                rangesOverlap(iso, next, b.check_in, b.check_out)
              )
            ) {
              occupiedDays += 1;
            }
          }

          const isEmpty = !activeBookings.some((b) => placeBooking(b, days));

          return (
            <div
              key={room.id}
              className="relative flex border-b border-[var(--shell-border)]"
              style={{ height: ROW_HEIGHT }}
            >
              <CalendarRoomCell
                room={room}
                occupiedDays={occupiedDays}
                totalDays={days.length}
                isEmpty={isEmpty}
              />

              <div className="relative" style={{ width: gridWidth }}>
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={cn(
                      "absolute inset-y-0 border-r border-[var(--shell-border)]",
                      isWeekend(day) && "bg-[var(--shell-surface-raised)]/20",
                      isToday(day) && "bg-emerald-950/20"
                    )}
                    style={{ left: index * DAY_WIDTH, width: DAY_WIDTH }}
                  />
                ))}

                {roomBookings.map((booking) => {
                  const placement = placeBooking(booking, days);
                  if (!placement) return null;

                  return (
                    <CalendarBookingBar
                      key={booking.id}
                      booking={booking}
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
