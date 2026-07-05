"use client";

import { useMemo, useState } from "react";

import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import {
  BookingCreateButton,
  BookingCreateDialog,
  BookingEditDialog,
  BookingsFilters,
} from "@/components/dashboard/bookings";

import { BookingsStats } from "./BookingsStats";
import { BookingsTable } from "./BookingsTable";

type Props = {
  bookings: Booking[];
  rooms: Room[];
};

export function BookingsPage({
  bookings,
  rooms,
}: Props) {
  const [createOpen, setCreateOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.guest_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        booking.guest_email
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        booking.guest_phone
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "" ||
        booking.status === status;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [bookings, search, status]);

  function handleEdit(
    booking: Booking
  ) {
    setSelectedBooking(booking);

    setEditOpen(true);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Управление бронированиями
          </h1>

          <p className="mt-3 text-zinc-400">
            Создавайте, редактируйте и управляйте бронированиями гостей.
          </p>
        </div>

        <BookingCreateButton
          onClick={() =>
            setCreateOpen(true)
          }
        />
      </div>

      <BookingsStats bookings={bookings} />

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Доступные номера
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Всего номеров: {rooms.length}
            </p>
          </div>
        </div>

        {rooms.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 py-12 text-center text-zinc-500">
            Нет доступных номеров
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-emerald-600"
              >
                <h3 className="text-lg font-semibold">
                  {room.room_type}
                </h3>

                <p className="mt-2 text-zinc-400">
                  ${room.price} / ночь
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold">
            Бронирования
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Управление всеми бронированиями отеля
          </p>
        </div>

        <BookingsFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
        />

        <BookingsTable
          bookings={filteredBookings}
          onEdit={handleEdit}
        />
      </div>

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
    </div>
  );
}