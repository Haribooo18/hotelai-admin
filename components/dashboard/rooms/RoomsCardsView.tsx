"use client";

import { BedDouble } from "lucide-react";

import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Skeleton } from "@/components/ui/display/Skeleton";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";

import { RoomCard } from "./RoomCard";
import { RoomsTable } from "./RoomsTable";
import type { RoomCardModel, RoomViewMode } from "./room-ops-metrics";
import type { Room } from "@/types/room";

type Props = {
  models: RoomCardModel[];
  viewMode: RoomViewMode;
  loading?: boolean;
  selectedId?: string | null;
  onOpenRoom: (model: RoomCardModel) => void;
  onEditRoom: (room: Room) => void;
};

export function RoomsCardsView({
  models,
  viewMode,
  loading = false,
  selectedId = null,
  onOpenRoom,
  onEditRoom,
}: Props) {
  if (loading) {
    return (
      <GlassSurface className="p-[var(--ds-surface-padding)]">
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-52 rounded-[var(--ds-radius)]" />
            ))}
          </div>
        ) : (
          <Skeleton className="h-64 rounded-[var(--ds-radius)]" />
        )}
      </GlassSurface>
    );
  }

  if (models.length === 0) {
    return (
      <EmptyState
        title="No rooms found"
        description="Adjust filters or add the first room to your inventory."
        icon={<BedDouble size={18} />}
      />
    );
  }

  if (viewMode === "table") {
    return (
      <RoomsTable
        models={models}
        selectedId={selectedId}
        onOpen={onOpenRoom}
        onEdit={(model) => onEditRoom(model.room)}
      />
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      role="list"
      aria-label="Room cards"
    >
      {models.map((model) => (
        <RoomCard
          key={model.room.id}
          model={model}
          selected={selectedId === model.room.id}
          onOpen={onOpenRoom}
          onEdit={onEditRoom}
        />
      ))}
    </div>
  );
}
