"use client";

import {
  CalendarDays,
  Pencil,
  Trash2,
  User,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Booking } from "@/types/booking";

import { deleteBooking } from "@/lib/services/bookings.mutations";

import { Button } from "@/components/ui/button";

import { BookingStatusBadge } from "./BookingStatusBadge";

type Props = {
  bookings: Booking[];
  onEdit?: (booking: Booking) => void;
};

export function BookingsTable({
  bookings,
  onEdit,
}: Props) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Удалить бронирование?")) {
      return;
    }

    try {
      await deleteBooking(id);

      toast.success(
        "Бронирование удалено"
      );

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        "Не удалось удалить бронирование"
      );
    }
  }

  if (!bookings.length) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 py-16 text-center text-zinc-500">
        Пока нет бронирований
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
      <table className="w-full">
        <thead className="border-b border-zinc-800 bg-zinc-900">
          <tr>
            <th className="px-6 py-4 text-left">
              Гость
            </th>

            <th className="px-6 py-4 text-left">
              Заезд
            </th>

            <th className="px-6 py-4 text-left">
              Выезд
            </th>

            <th className="px-6 py-4 text-left">
              Статус
            </th>

            <th className="px-6 py-4 text-left">
              Стоимость
            </th>

            <th className="px-6 py-4 text-right">
              Действия
            </th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <tr
              key={booking.id}
              className="border-b border-zinc-900 hover:bg-zinc-900/40"
            >
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <User size={18} />

                  <div>
                    <div className="font-medium">
                      {booking.guest_name}
                    </div>

                    <div className="text-sm text-zinc-500">
                      {booking.guest_email}
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} />

                  {booking.check_in}
                </div>
              </td>

              <td className="px-6 py-5">
                {booking.check_out}
              </td>

              <td className="px-6 py-5">
                <BookingStatusBadge
                  status={booking.status}
                />
              </td>

              <td className="px-6 py-5 font-medium">
                ${booking.total_price}
              </td>

              <td className="px-6 py-5">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      onEdit?.(booking)
                    }
                  >
                    <Pencil size={16} />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() =>
                      handleDelete(
                        booking.id
                      )
                    }
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}