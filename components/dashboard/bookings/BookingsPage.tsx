"use client";

import { useMemo, useState } from "react";

import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import { BookingCreateDialog } from "./BookingCreateDialog";
import { BookingEditDialog } from "./BookingEditDialog";
import { BookingsCards } from "./BookingsCards";
import {
  BookingsFilters,
  type BookingsChipFilter,
} from "./BookingsFilters";
import { BookingsStats } from "./BookingsStats";
import {
  AdminPageStack,
  DashboardPageHeader,
} from "@/components/dashboard/home/DashboardPrimitives";
import { useI18n } from "@/lib/i18n";

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
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [chipFilter, setChipFilter] = useState<BookingsChipFilter>("all");
  const [dateFilter, setDateFilter] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
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
  }, [bookings, search, status, chipFilter, dateFilter, today]);

  function handleEdit(booking: Booking) {
    setSelectedBooking(booking);
    setEditOpen(true);
  }

  return (
    <AdminPageStack>
      <DashboardPageHeader
        title={t("pages.reservations.title")}
        subtitle={t("pages.reservations.subtitle")}
      />

      <BookingsStats bookings={bookings} />

      <BookingsFilters
        search={search}
        chipFilter={chipFilter}
        dateFilter={dateFilter}
        status={status}
        onSearchChange={setSearch}
        onChipFilterChange={setChipFilter}
        onDateFilterChange={setDateFilter}
        onStatusChange={setStatus}
        onCreateClick={() => setCreateOpen(true)}
      />

      <BookingsCards
        bookings={filteredBookings}
        rooms={rooms}
        onEdit={handleEdit}
      />

      <BookingCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        rooms={rooms}
      />

      <BookingEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        booking={selectedBooking}
        rooms={rooms}
      />
    </AdminPageStack>
  );
}
