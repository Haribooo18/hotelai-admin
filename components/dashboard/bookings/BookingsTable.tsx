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
        toast.success("Reservation deleted");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete reservation");
      } finally {
        setTarget(null);
      }
    });
  }

  const columns: DataTableColumn<Booking>[] = [
    {
      header: "Guest",
      cell: (booking) => (
        <div className="flex items-center gap-3">
          <User size={18} />

          <div>
            <div className="font-medium">{booking.guest_name}</div>

            <div className="text-sm text-[var(--shell-muted)]">{booking.guest_email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Check-in",
      cell: (booking) => (
        <div className="flex items-center gap-2">
          <CalendarDays size={16} />
          {booking.check_in}
        </div>
      ),
    },
    {
      header: "Check-out",
      cell: (booking) => booking.check_out,
    },
    {
      header: "Status",
      cell: (booking) => <BookingStatusBadge status={booking.status} />,
    },
    {
      header: "Total",
      cell: (booking) => `$${booking.total_price}`,
      cellClassName: "font-medium",
    },
    {
      header: "Actions",
      align: "right",
      cell: (booking) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label={`Edit reservation for ${booking.guest_name}`}
            onClick={() => onEdit?.(booking)}
          >
            <Pencil size={16} />
          </Button>

          <Button
            variant="destructive"
            size="icon"
            aria-label={`Delete reservation for ${booking.guest_name}`}
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
        caption="Reservation list"
        empty={
          <div className="rounded-[var(--ds-radius)] border border-[var(--shell-border)] bg-[var(--shell-surface)] py-16 text-center text-[var(--shell-muted)]">
            No reservations yet
          </div>
        }
      />

      <ConfirmDialog
        open={target !== null}
        onOpenChange={(open) => {
          if (!open) setTarget(null);
        }}
        title="Delete reservation?"
        description={
          target
            ? `The reservation for "${target.guest_name}" will be permanently deleted.`
            : undefined
        }
        confirmLabel="Delete"
        destructive
        loading={pending}
        onConfirm={confirmDelete}
      />
    </>
  );
}
