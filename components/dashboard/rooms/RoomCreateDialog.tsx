"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { RoomForm } from "./RoomForm";
import type { Room } from "@/types/room";

type Props = {
  room?: Room;
  trigger?: React.ReactNode;
};

export function RoomCreateDialog({ room, trigger }: Props) {
  const [open, setOpen] = useState(false);

  const defaultTrigger = (
    <Button onClick={() => setOpen(true)}>
      <Plus className="mr-2 h-4 w-4" />
      {room ? "Редактировать" : "Добавить номер"}
    </Button>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        defaultTrigger
      )}

      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {room ? "Редактировать номер" : "Создать номер"}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          <RoomForm
            room={room}
            onSuccess={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}