"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { WorkspaceFormDrawer } from "@/components/dashboard/shared/WorkspaceOverlay";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
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
  const { t } = useI18n();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;

  function setOpen(next: boolean) {
    if (onOpenChange) onOpenChange(next);
    else setInternalOpen(next);
  }

  const title = room
    ? t("rooms.editRoomTitle")
    : template
      ? t("rooms.duplicateRoomTitle")
      : t("rooms.createRoomTitle");

  const defaultTrigger = (
    <Button
      type="button"
      onClick={() => setOpen(true)}
      className={cn(buttonClassName)}
    >
      <Plus className="h-4 w-4" />
      {room ? t("common.edit") : t("rooms.addRoom")}
    </Button>
  );

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : controlledOpen === undefined ? (
        defaultTrigger
      ) : null}

      <WorkspaceFormDrawer open={open} onOpenChange={setOpen} title={title}>
        <RoomForm
          room={room}
          template={template}
          onSuccess={() => setOpen(false)}
        />
      </WorkspaceFormDrawer>
    </>
  );
}
