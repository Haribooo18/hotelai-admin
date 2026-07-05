"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import { rescheduleBooking, deleteBooking } from "@/lib/services/bookings.mutations";
import {
  addDays,
  addMonths,
  buildDays,
  formatRangeTitle,
  hasRoomConflict,
  type CalendarView,
} from "@/lib/calendar";

import {
  BookingCreateDialog,
  BookingDetailDrawer,
  BookingEditDialog,
} from "@/components/dashboard/bookings";
import {
  buildBookingCardModel,
  buildBookingCardModels,
  type BookingCardModel,
} from "@/components/dashboard/bookings/booking-ops-metrics";
import type { Guest } from "@/types/guest";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  AdminPageStack,
  DashboardPageHeader,
} from "@/components/dashboard/home/DashboardPrimitives";
import { useI18n } from "@/lib/i18n";

import { CalendarExecutiveKpis } from "./CalendarExecutiveKpis";
import { CalendarToolbar } from "./CalendarToolbar";
import { CalendarTimeline } from "./CalendarTimeline";
import { CalendarAgenda } from "./CalendarAgenda";
import { CalendarLegend } from "./CalendarLegend";
import {
  buildCalendarRoomModels,
  computeCalendarOpsKpis,
} from "./calendar-ops-metrics";

type Props = {
  bookings: Booking[];
  rooms: Room[];
  guests: Guest[];
};

function matchesSearch(booking: Booking, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return (
    booking.guest_name.toLowerCase().includes(q) ||
    (booking.guest_email?.toLowerCase().includes(q) ?? false) ||
    (booking.guest_phone?.includes(q) ?? false)
  );
}

export function CalendarPage({
  bookings: initialBookings,
  rooms,
  guests,
}: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [bookings, setBookings] = useState(initialBookings);
  const [syncedFrom, setSyncedFrom] = useState(initialBookings);
  const [view, setView] = useState<CalendarView>("month");
  const [anchor, setAnchor] = useState(() => new Date());
  const [scrollToTodayTick, setScrollToTodayTick] = useState(1);

  const [search, setSearch] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BookingCardModel | null>(
    null
  );
  const [selectedModel, setSelectedModel] = useState<BookingCardModel | null>(
    null
  );

  if (initialBookings !== syncedFrom) {
    setSyncedFrom(initialBookings);
    setBookings(initialBookings);
  }

  const days = useMemo(() => buildDays(view, anchor), [view, anchor]);

  const kpis = useMemo(
    () => computeCalendarOpsKpis(bookings, rooms),
    [bookings, rooms]
  );

  const roomModels = useMemo(
    () => buildCalendarRoomModels(rooms, bookings),
    [rooms, bookings]
  );

  const filteredRooms = useMemo(() => {
    if (!roomFilter) return rooms;
    return rooms.filter((room) => room.id === roomFilter);
  }, [rooms, roomFilter]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      if (statusFilter && booking.status !== statusFilter) return false;
      if (!matchesSearch(booking, search)) return false;
      if (roomFilter && booking.room_id !== roomFilter) return false;
      return true;
    });
  }, [bookings, search, statusFilter, roomFilter]);

  const bookingModelsById = useMemo(() => {
    const models = buildBookingCardModels(bookings, rooms, guests);
    return new Map(models.map((model) => [model.booking.id, model]));
  }, [bookings, rooms, guests]);

  const getBookingModel = useCallback(
    (booking: Booking) =>
      bookingModelsById.get(booking.id) ??
      buildBookingCardModel(booking, rooms, guests),
    [bookingModelsById, rooms, guests]
  );

  function goPrevious() {
    setAnchor((current) => {
      if (view === "day") return addDays(current, -1);
      if (view === "week") return addDays(current, -7);
      return addMonths(current, -1);
    });
  }

  function goNext() {
    setAnchor((current) => {
      if (view === "day") return addDays(current, 1);
      if (view === "week") return addDays(current, 7);
      return addMonths(current, 1);
    });
  }

  const openDrawer = useCallback(
    (booking: Booking) => {
      setSelectedModel(getBookingModel(booking));
      setDrawerOpen(true);
    },
    [getBookingModel]
  );

  const handleEdit = useCallback(
    (booking: Booking) => {
      setSelectedModel(getBookingModel(booking));
      setDrawerOpen(false);
      setEditOpen(true);
    },
    [getBookingModel]
  );

  const handleDeleteRequest = useCallback(
    (booking: Booking) => {
      setDeleteTarget(getBookingModel(booking));
      setDrawerOpen(false);
    },
    [getBookingModel]
  );

  function handleDeleteConfirm() {
    if (!deleteTarget) return;

    const id = deleteTarget.booking.id;
    const previous = bookings;
    setBookings((list) => list.filter((booking) => booking.id !== id));
    setDeleteTarget(null);

    startTransition(async () => {
      try {
        await deleteBooking(id);
        toast.success("Reservation deleted");
        router.refresh();
      } catch (error) {
        console.error(error);
        setBookings(previous);
        toast.error(
          error instanceof Error ? error.message : "Failed to delete reservation"
        );
      }
    });
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
        toast.success("Reservation rescheduled");
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
    <AdminPageStack className="ds-page-enter">
      <DashboardPageHeader
        title={t("pages.calendar.title")}
        subtitle={t("pages.calendar.subtitle")}
      />

      <CalendarExecutiveKpis kpis={kpis} loading={false} />

      <CalendarToolbar
        title={formatRangeTitle(days, view)}
        view={view}
        search={search}
        roomFilter={roomFilter}
        statusFilter={statusFilter}
        rooms={rooms}
        onSearchChange={setSearch}
        onRoomFilterChange={setRoomFilter}
        onStatusFilterChange={setStatusFilter}
        onPrevious={goPrevious}
        onNext={goNext}
        onToday={() => {
          setAnchor(new Date());
          setScrollToTodayTick((tick) => tick + 1);
        }}
        onViewChange={setView}
        onCreateClick={() => setCreateOpen(true)}
      />

      <div className="hidden md:block">
        <CalendarTimeline
          rooms={filteredRooms}
          roomModels={roomModels}
          bookings={filteredBookings}
          guests={guests}
          days={days}
          loading={false}
          scrollToTodayTick={scrollToTodayTick}
          onReschedule={handleReschedule}
          onOpen={openDrawer}
        />
      </div>

      <div className="md:hidden">
        <CalendarAgenda
          rooms={filteredRooms}
          bookings={filteredBookings}
          guests={guests}
          days={days}
          onOpen={openDrawer}
        />
      </div>

      <CalendarLegend />

      <BookingDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        model={selectedModel}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <BookingEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        booking={selectedModel?.booking ?? null}
        rooms={rooms}
      />

      <BookingCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        rooms={rooms}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete reservation"
        description={
          deleteTarget
            ? `Delete reservation for ${deleteTarget.booking.guest_name}? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        destructive
        onConfirm={handleDeleteConfirm}
      />
    </AdminPageStack>
  );
}
