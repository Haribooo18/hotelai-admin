"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import type { Guest } from "@/types/guest";

import { GuestForm } from "./GuestForm";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guest: Guest | null;
};

export function GuestEditDialog({ open, onOpenChange, guest }: Props) {
  if (!guest) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Редактировать гостя</SheetTitle>
        </SheetHeader>

        <div className="mt-6 px-6 pb-6">
          <GuestForm guest={guest} onSuccess={() => onOpenChange(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
