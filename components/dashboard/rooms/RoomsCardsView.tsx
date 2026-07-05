"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BedDouble } from "lucide-react";

import type { Room } from "@/types/room";

import { deleteRoom } from "@/lib/services/rooms.mutations";
import { cn } from "@/lib/utils";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DashboardEmptyState,
  DashboardSkeleton,
} from "@/components/dashboard/home/DashboardPrimitives";

import { RoomCard } from "./RoomCard";
import type { RoomCardModel, RoomViewMode } from "./room-ops-metrics";

type Props = {
  models: RoomCardModel[];
  viewMode: RoomViewMode;
  loading?: boolean;
  selectedIds: Set<string>;
  onSelectedIdsChange: (ids: Set<string>) => void;
  onOpenRoom: (model: RoomCardModel) => void;
  onEditRoom: (room: Room) => void;
  onDuplicateRoom: (room: Room) => void;
};

export function RoomsCardsView({
  models,
  viewMode,
  loading = false,
  selectedIds,
  onSelectedIdsChange,
  onOpenRoom,
  onEditRoom,
  onDuplicateRoom,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<Room | null>(null);
  const [optimisticModels, removeOptimistic] = useOptimistic(
    models,
    (state, id: string) => state.filter((model) => model.room.id !== id)
  );

  function toggleSelected(id: string, checked: boolean) {
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    onSelectedIdsChange(next);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;

    startTransition(async () => {
      removeOptimistic(id);
      const next = new Set(selectedIds);
      next.delete(id);
      onSelectedIdsChange(next);

      try {
        await deleteRoom(id);
        toast.success("Room deleted successfully");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete room");
      } finally {
        setDeleteTarget(null);
      }
    });
  }

  if (loading) {
    return (
      <div
        className={cn(
          "grid gap-4",
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-4"
            : "grid-cols-1"
        )}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[var(--ds-radius)] bg-[var(--shell-surface)] p-5 shadow-[var(--shell-shadow-sm)]"
          >
            <DashboardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (optimisticModels.length === 0) {
    return (
      <div className="rounded-[var(--ds-radius)] bg-[var(--shell-surface)] shadow-[var(--shell-shadow-sm)]">
        <DashboardEmptyState
          title="No rooms found"
          description="Adjust filters or add the first room to your inventory."
          icon={<BedDouble size={20} />}
        />
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "grid gap-4",
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-4"
            : "grid-cols-1"
        )}
      >
        {optimisticModels.map((model) => (
          <RoomCard
            key={model.room.id}
            model={model}
            viewMode={viewMode}
            selected={selectedIds.has(model.room.id)}
            onSelect={(checked) => toggleSelected(model.room.id, checked)}
            onOpen={() => onOpenRoom(model)}
            onEdit={() => onEditRoom(model.room)}
            onDuplicate={() => onDuplicateRoom(model.room)}
            onDelete={() => setDeleteTarget(model.room)}
          />
        ))}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete room?"
        description={
          deleteTarget
            ? `Room "${deleteTarget.room_type}" will be permanently deleted.`
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
