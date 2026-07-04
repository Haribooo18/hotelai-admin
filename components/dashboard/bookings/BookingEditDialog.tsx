"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
  if (!booking) return null;

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            Редактировать бронирование
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          <BookingForm
            booking={booking}
            rooms={rooms}
            onSuccess={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}