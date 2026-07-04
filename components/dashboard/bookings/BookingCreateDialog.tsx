"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { BookingForm } from "./BookingForm";

type Room = {
  id: string;
  room_type: string;
  price: number;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rooms: Room[];
};

export function BookingCreateDialog({
  open,
  onOpenChange,
  rooms,
}: Props) {
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            Новое бронирование
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          <BookingForm
            rooms={rooms}
            onSuccess={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

type ButtonProps = {
  onClick: () => void;
};

export function BookingCreateButton({
  onClick,
}: ButtonProps) {
  return (
    <Button onClick={onClick}>
      <Plus className="mr-2 h-4 w-4" />
      Создать бронирование
    </Button>
  );
}