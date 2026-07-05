"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import { rescheduleBooking } from "@/lib/services/bookings.mutations";
import {
  addDays,
  addMonths,
  buildDays,
  computeOccupancy,
  formatRangeTitle,
  hasRoomConflict,
  type CalendarView,
} from "@/lib/calendar";

import { BookingEditDialog } from "@/components/dashboard/bookings";

import { CalendarToolbar } from "./CalendarToolbar";
import { CalendarTimeline } from "./CalendarTimeline";
import { CalendarAgenda } from "./CalendarAgenda";
import { CalendarLegend } from "./CalendarLegend";
import { DashboardPageHeader } from "@/components/dashboard/home/DashboardPrimitives";
import { useI18n } from "@/lib/i18n";

type Props = {
  bookings: Booking[];
  rooms: Room[];
};

export function CalendarPage({ bookings: initialBookings, rooms }: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [bookings, setBookings] = useState(initialBookings);
  const [syncedFrom, setSyncedFrom] = useState(initialBookings);
  const [view, setView] = useState<CalendarView>("month");
  const [anchor, setAnchor] = useState(() => new Date());
  const [scrollToTodayTick, setScrollToTodayTick] = useState(1);

  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<Booking | null>(null);

  // Reconcile with fresh server data after revalidation (render-time sync,
  // the React-recommended alternative to a syncing effect).
  if (initialBookings !== syncedFrom) {
    setSyncedFrom(initialBookings);
    setBookings(initialBookings);
  }

  const days = useMemo(() => buildDays(view, anchor), [view, anchor]);

  const occupancyPercent = useMemo(() => {
    const occ = computeOccupancy(bookings, rooms.length, days);
    if (occ.length === 0) return 0;
    const avg = occ.reduce((sum, d) => sum + d.ratio, 0) / occ.length;
    return Math.round(avg * 100);
  }, [bookings, rooms.length, days]);

  function goPrevious() {
    setAnchor((current) =>
      view === "month" ? addMonths(current, -1) : addDays(current, -7)
    );
  }

  function goNext() {
    setAnchor((current) =>
      view === "month" ? addMonths(current, 1) : addDays(current, 7)
    );
  }

  function handleOpen(booking: Booking) {
    setSelected(booking);
    setEditOpen(true);
  }

  function handleReschedule(
    booking: Booking,
    next: { check_in: string; check_out: string }
  ) {
    if (
      hasRoomConflict(
        bookings,
        booking.room_id,
        next.check_in,
        next.check_out,
        booking.id
      )
    ) {
      toast.error("Overlaps with another booking for this room");
      return;
    }

    const previous = bookings;
    setBookings((list) =>
      list.map((b) => (b.id === booking.id ? { ...b, ...next } : b))
    );

    startTransition(async () => {
      try {
        await rescheduleBooking({
          id: booking.id,
          room_id: booking.room_id,
          check_in: next.check_in,
          check_out: next.check_out,
        });
        toast.success("Booking rescheduled");
        router.refresh();
      } catch (error) {
        console.error(error);
        setBookings(previous);
        toast.error(
          error instanceof Error ? error.message : "Failed to reschedule"
        );
      }
    });
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={t("pages.calendar.title")}
        subtitle={t("pages.calendar.subtitle")}
      />

      <CalendarToolbar
        title={formatRangeTitle(days, view)}
        view={view}
        occupancyPercent={occupancyPercent}
        onPrevious={goPrevious}
        onNext={goNext}
        onToday={() => {
          setAnchor(new Date());
          setScrollToTodayTick((t) => t + 1);
        }}
        onViewChange={setView}
      />

      {rooms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950 py-16 text-center text-zinc-500">
          No rooms. Add rooms to see the calendar.
        </div>
      ) : (
        <>
          {/* Desktop timeline */}
          <div className="hidden md:block">
            <CalendarTimeline
              rooms={rooms}
              bookings={bookings}
              days={days}
              scrollToTodayTick={scrollToTodayTick}
              onReschedule={handleReschedule}
              onOpen={handleOpen}
            />
          </div>

          {/* Mobile fallback */}
          <div className="md:hidden">
            <CalendarAgenda
              rooms={rooms}
              bookings={bookings}
              days={days}
              onOpen={handleOpen}
            />
          </div>

          <CalendarLegend />
        </>
      )}

      <BookingEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        booking={selected}
        rooms={rooms}
      />
    </div>
  );
}
