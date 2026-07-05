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
import { cn } from "@/lib/utils";
import { RoomForm } from "./RoomForm";
import type { Room } from "@/types/room";

type Props = {
  room?: Room;
  template?: Pick<Room, "room_type" | "capacity" | "price">;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  buttonClassName?: string;
};

export function RoomCreateDialog({
  room,
  template,
  trigger,
  open: controlledOpen,
  onOpenChange,
  buttonClassName,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;

  function setOpen(next: boolean) {
    if (onOpenChange) onOpenChange(next);
    else setInternalOpen(next);
  }

  const title = room
    ? "Edit Room"
    : template
      ? "Duplicate Room"
      : "Create Room";

  const defaultTrigger = (
    <Button
      type="button"
      onClick={() => setOpen(true)}
      className={cn(buttonClassName)}
    >
      <Plus className="h-4 w-4" />
      {room ? "Edit" : "Add Room"}
    </Button>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : controlledOpen === undefined ? (
        defaultTrigger
      ) : null}

      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          <RoomForm
            room={room}
            template={template}
            onSuccess={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
