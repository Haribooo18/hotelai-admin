"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import { deleteBooking } from "@/lib/services/bookings.mutations";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  AdminPageStack,
  DashboardPageHeader,
} from "@/components/dashboard/home/DashboardPrimitives";
import { useI18n } from "@/lib/i18n";

import { BookingCreateDialog } from "./BookingCreateDialog";
import { BookingDetailDrawer } from "./BookingDetailDrawer";
import { BookingEditDialog } from "./BookingEditDialog";
import { BookingsCards } from "./BookingsCards";
import {
  BookingsFilters,
  type BookingsChipFilter,
} from "./BookingsFilters";
import { BookingsExecutiveKpis } from "./BookingsExecutiveKpis";
import { BookingsTable } from "./BookingsTable";
import {
  buildBookingCardModel,
  computeBookingOpsKpis,
  type BookingCardModel,
  type BookingViewMode,
} from "./booking-ops-metrics";
import { useBookingsGuests } from "./useBookingsGuests";

type Props = {
  bookings: Booking[];
  rooms: Room[];
};

function isNewBooking(booking: Booking): boolean {
  const created = new Date(booking.created_at);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  return created >= weekAgo;
}

function isStayingOnDate(booking: Booking, date: string): boolean {
  return booking.check_in <= date && booking.check_out > date;
}

export function BookingsPage({ bookings, rooms }: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const hotelId = bookings[0]?.hotel_id ?? rooms[0]?.hotel_id ?? null;
  const { guests, loading: guestsLoading } = useBookingsGuests(hotelId);

  const [optimisticBookings, removeOptimistic] = useOptimistic(
    bookings,
    (state, id: string) => state.filter((booking) => booking.id !== id)
  );

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BookingCardModel | null>(
    null
  );
  const [selectedModel, setSelectedModel] = useState<BookingCardModel | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [chipFilter, setChipFilter] = useState<BookingsChipFilter>("all");
  const [dateFilter, setDateFilter] = useState("");
  const [viewMode, setViewMode] = useState<BookingViewMode>("cards");

  const today = new Date().toISOString().slice(0, 10);

  const filteredBookings = useMemo(() => {
    return optimisticBookings.filter((booking) => {
      const query = search.toLowerCase();

      const matchesSearch =
        booking.guest_name.toLowerCase().includes(query) ||
        booking.guest_email?.toLowerCase().includes(query) ||
        booking.guest_phone?.toLowerCase().includes(query);

      const matchesStatus = status === "" || booking.status === status;

      const matchesChip = (() => {
        switch (chipFilter) {
          case "new":
            return isNewBooking(booking);
          case "confirmed":
            return booking.status === "confirmed";
          case "check_in_today":
            return booking.check_in === today;
          case "check_out_today":
            return booking.check_out === today;
          default:
            return true;
        }
      })();

      const matchesDate =
        dateFilter === "" || isStayingOnDate(booking, dateFilter);

      return matchesSearch && matchesStatus && matchesChip && matchesDate;
    });
  }, [optimisticBookings, search, status, chipFilter, dateFilter, today]);

  const kpis = useMemo(
    () => computeBookingOpsKpis(optimisticBookings, rooms.length),
    [optimisticBookings, rooms.length]
  );

  const loading = guestsLoading;

  function openDrawer(model: BookingCardModel) {
    setSelectedModel(model);
    setDrawerOpen(true);
  }

  function handleSelect(model: BookingCardModel) {
    openDrawer(model);
  }

  function handleEdit(model: BookingCardModel) {
    setSelectedModel(model);
    setEditOpen(true);
  }

  function handleDeleteRequest(model: BookingCardModel) {
    setDrawerOpen(false);
    setDeleteTarget(model);
  }

  function confirmDelete() {
    if (!deleteTarget) return;

    const id = deleteTarget.booking.id;

    startTransition(async () => {
      removeOptimistic(id);

      try {
        await deleteBooking(id);
        toast.success("Reservation deleted");
        setDeleteTarget(null);
        setSelectedModel(null);
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete reservation");
      }
    });
  }

  return (
    <AdminPageStack className="ds-page-enter">
      <DashboardPageHeader
        title={t("pages.reservations.title")}
        subtitle={t("pages.reservations.subtitle")}
      />

      <BookingsExecutiveKpis kpis={kpis} loading={loading} />

      <BookingsFilters
        search={search}
        chipFilter={chipFilter}
        dateFilter={dateFilter}
        status={status}
        viewMode={viewMode}
        onSearchChange={setSearch}
        onChipFilterChange={setChipFilter}
        onDateFilterChange={setDateFilter}
        onStatusChange={setStatus}
        onViewModeChange={setViewMode}
        onCreateClick={() => setCreateOpen(true)}
      />

      {viewMode === "cards" ? (
        <BookingsCards
          bookings={filteredBookings}
          rooms={rooms}
          guests={guests}
          loading={loading}
          onSelect={handleSelect}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      ) : (
        <BookingsTable
          bookings={filteredBookings}
          rooms={rooms}
          guests={guests}
          loading={loading}
          onSelect={handleSelect}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      )}

      <BookingDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        model={selectedModel}
        onEdit={(booking) => {
          handleEdit(
            selectedModel ?? buildBookingCardModel(booking, rooms, guests)
          );
        }}
        onDelete={(booking) => {
          handleDeleteRequest(
            selectedModel ?? buildBookingCardModel(booking, rooms, guests)
          );
        }}
      />

      <BookingCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        rooms={rooms}
      />

      <BookingEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        booking={selectedModel?.booking ?? null}
        rooms={rooms}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete reservation?"
        description={
          deleteTarget
            ? `The reservation for "${deleteTarget.booking.guest_name}" will be permanently deleted.`
            : undefined
        }
        confirmLabel="Delete"
        destructive
        loading={pending}
        onConfirm={confirmDelete}
      />
    </AdminPageStack>
  );
}
