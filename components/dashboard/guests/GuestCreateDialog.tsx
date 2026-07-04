"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { GuestForm } from "./GuestForm";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function GuestCreateDialog({ open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Новый гость</SheetTitle>
        </SheetHeader>

        <div className="mt-6 px-6 pb-6">
          <GuestForm onSuccess={() => onOpenChange(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

type ButtonProps = {
  onClick: () => void;
};

export function GuestCreateButton({ onClick }: ButtonProps) {
  return (
    <Button onClick={onClick}>
      <Plus className="mr-2 h-4 w-4" />
      Добавить гостя
    </Button>
  );
}
