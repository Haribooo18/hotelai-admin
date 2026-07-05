"use client";

import { Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import type { Room } from "@/types/room";

import { BookingForm } from "./BookingForm";

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
            New reservation
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
  className?: string;
  label?: string;
  icon?: LucideIcon;
};

export function BookingCreateButton({
  onClick,
  className,
  label = "Create reservation",
  icon: Icon = Plus,
}: ButtonProps) {
  return (
    <Button type="button" onClick={onClick} className={cn(className)}>
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  );
}