"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import { deleteBooking } from "@/lib/services/bookings.mutations";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import { BookingCard, buildRoomLabel } from "./BookingCard";

type Props = {
  bookings: Booking[];
  rooms: Room[];
  onEdit?: (booking: Booking) => void;
};

export function BookingsCards({ bookings, rooms, onEdit }: Props) {
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

  if (optimisticBookings.length === 0) {
    return (
      <div className="rounded-[var(--ds-radius)] bg-[var(--shell-surface)] px-6 py-16 text-center shadow-[var(--shell-shadow-sm)]">
        <p className="text-[15px] font-medium text-[var(--shell-text)]">
          No reservations yet
        </p>
        <p className="mt-2 text-[13px] text-[var(--shell-muted)]">
          Create your first reservation to see it in the list.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {optimisticBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            roomLabel={buildRoomLabel(booking.room_id, rooms)}
            onEdit={onEdit}
            onDelete={setTarget}
          />
        ))}
      </div>

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
