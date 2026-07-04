"use client";

import { useOptimistic, useState, useTransition } from "react";
import { CalendarDays, Pencil, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Booking } from "@/types/booking";

import { deleteBooking } from "@/lib/services/bookings.mutations";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/dashboard/DataTable";

import { BookingStatusBadge } from "./BookingStatusBadge";

type Props = {
  bookings: Booking[];
  onEdit?: (booking: Booking) => void;
};

export function BookingsTable({ bookings, onEdit }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [target, setTarget] = useState<Booking | null>(null);
  const [optimisticBookings, removeOptimistic] = useOptimistic(
    bookings,
    (state, id: string) => state.filter((booking) => booking.id !== id)
  );

  function confirmDelete() {
    if (!target) return;

    const id = target.id;

    startTransition(async () => {
      removeOptimistic(id);

      try {
        await deleteBooking(id);
        toast.success("Бронирование удалено");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Не удалось удалить бронирование");
      } finally {
        setTarget(null);
      }
    });
  }

  const columns: DataTableColumn<Booking>[] = [
    {
      header: "Гость",
      cell: (booking) => (
        <div className="flex items-center gap-3">
          <User size={18} />

          <div>
            <div className="font-medium">{booking.guest_name}</div>

            <div className="text-sm text-zinc-500">{booking.guest_email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Заезд",
      cell: (booking) => (
        <div className="flex items-center gap-2">
          <CalendarDays size={16} />
          {booking.check_in}
        </div>
      ),
    },
    {
      header: "Выезд",
      cell: (booking) => booking.check_out,
    },
    {
      header: "Статус",
      cell: (booking) => <BookingStatusBadge status={booking.status} />,
    },
    {
      header: "Стоимость",
      cell: (booking) => `$${booking.total_price}`,
      cellClassName: "font-medium",
    },
    {
      header: "Действия",
      align: "right",
      cell: (booking) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label={`Редактировать бронирование гостя ${booking.guest_name}`}
            onClick={() => onEdit?.(booking)}
          >
            <Pencil size={16} />
          </Button>

          <Button
            variant="destructive"
            size="icon"
            aria-label={`Удалить бронирование гостя ${booking.guest_name}`}
            onClick={() => setTarget(booking)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={optimisticBookings}
        getRowId={(booking) => booking.id}
        caption="Список бронирований"
        empty={
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 py-16 text-center text-zinc-500">
            Пока нет бронирований
          </div>
        }
      />

      <ConfirmDialog
        open={target !== null}
        onOpenChange={(open) => {
          if (!open) setTarget(null);
        }}
        title="Удалить бронирование?"
        description={
          target
            ? `Бронирование гостя «${target.guest_name}» будет удалено безвозвратно.`
            : undefined
        }
        confirmLabel="Удалить"
        destructive
        loading={pending}
        onConfirm={confirmDelete}
      />
    </>
  );
}
