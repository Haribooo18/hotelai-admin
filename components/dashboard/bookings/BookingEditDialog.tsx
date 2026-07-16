"use client";

import { WorkspaceFormDrawer } from "@/components/dashboard/shared/WorkspaceOverlay";
import { useI18n } from "@/lib/i18n";

import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import { BookingForm } from "./BookingForm";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
  rooms: Room[];
};

export function BookingEditDialog({
  open,
  onOpenChange,
  booking,
  rooms,
}: Props) {
  const { t } = useI18n();

  if (!booking) return null;

  return (
    <WorkspaceFormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={t("bookings.editReservation")}
    >
      <BookingForm
        booking={booking}
        rooms={rooms}
        onSuccess={() => onOpenChange(false)}
      />
    </WorkspaceFormDrawer>
  );
}
