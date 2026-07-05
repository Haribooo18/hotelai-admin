"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BedDouble, Pencil, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

import { deleteRoom } from "@/lib/services/rooms.mutations";
import type { Room } from "@/types/room";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/dashboard/DataTable";
import { RoomCreateDialog } from "@/components/dashboard/rooms";

type Props = {
  rooms: Room[];
};

export function RoomsTable({ rooms }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [target, setTarget] = useState<Room | null>(null);
  const [optimisticRooms, removeOptimistic] = useOptimistic(
    rooms,
    (state, id: string) => state.filter((room) => room.id !== id)
  );

  function confirmDelete() {
    if (!target) return;

    const id = target.id;

    startTransition(async () => {
      removeOptimistic(id);

      try {
        await deleteRoom(id);
        toast.success("Room deleted successfully");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete room");
      } finally {
        setTarget(null);
      }
    });
  }

  const columns: DataTableColumn<Room>[] = [
    {
      header: "Room type",
      cell: (room) => (
        <div className="flex items-center gap-3">
          <BedDouble size={18} />
          <span className="font-medium">{room.room_type}</span>
        </div>
      ),
    },
    {
      header: "Capacity",
      cell: (room) => (
        <div className="flex items-center gap-2">
          <Users size={16} />
          {room.capacity}
        </div>
      ),
    },
    {
      header: "Price",
      cell: (room) => `$${Number(room.price).toFixed(0)}`,
    },
    {
      header: "Actions",
      align: "right",
      cell: (room) => (
        <div className="flex justify-end gap-2">
          <RoomCreateDialog
            room={room}
            trigger={
              <button
                type="button"
                aria-label={`Edit room ${room.room_type}`}
                className="rounded-lg border border-[var(--shell-border)] p-2 transition hover:bg-[var(--shell-nav-hover-bg)]"
              >
                <Pencil size={16} />
              </button>
            }
          />

          <button
            type="button"
            aria-label={`Delete room ${room.room_type}`}
            onClick={() => setTarget(room)}
            className="rounded-lg border border-red-900 p-2 text-red-400 transition hover:bg-red-950"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={optimisticRooms}
        getRowId={(room) => room.id}
        caption="Room list"
        empty={
          <div className="rounded-2xl border border-[var(--shell-border)] bg-[var(--shell-surface)] py-16 text-center text-[var(--shell-muted)]">
            No rooms yet. Add your first room.
          </div>
        }
      />

      <ConfirmDialog
        open={target !== null}
        onOpenChange={(open) => {
          if (!open) setTarget(null);
        }}
        title="Delete room?"
        description={
          target
            ? `Room "${target.room_type}" will be permanently deleted.`
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
