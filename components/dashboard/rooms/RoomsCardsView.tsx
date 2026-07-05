"use client";

import { BedDouble } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  DashboardEmptyState,
  DashboardSkeletonBlock,
} from "@/components/dashboard/home/DashboardPrimitives";

import { RoomCard } from "./RoomCard";
import { RoomsTable } from "./RoomsTable";
import type { RoomCardModel, RoomViewMode } from "./room-ops-metrics";
import type { Room } from "@/types/room";

type Props = {
  models: RoomCardModel[];
  viewMode: RoomViewMode;
  loading?: boolean;
  onOpenRoom: (model: RoomCardModel) => void;
  onEditRoom: (room: Room) => void;
};

export function RoomsCardsView({
  models,
  viewMode,
  loading = false,
  onOpenRoom,
  onEditRoom,
}: Props) {
  if (loading) {
    return (
      <div
        className={cn(
          viewMode === "cards"
            ? "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
            : "space-y-2"
        )}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <DashboardSkeletonBlock
            key={index}
            className={viewMode === "cards" ? "h-52" : "h-12"}
          />
        ))}
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="rounded-[var(--ds-radius)] bg-[var(--shell-surface)]/80 p-6 shadow-[var(--shell-shadow-sm)] backdrop-blur-xl">
        <DashboardEmptyState
          title="No rooms found"
          description="Adjust filters or add the first room to your inventory."
          icon={<BedDouble size={18} />}
        />
      </div>
    );
  }

  if (viewMode === "table") {
    return (
      <RoomsTable
        models={models}
        onOpen={onOpenRoom}
        onEdit={(model) => onEditRoom(model.room)}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {models.map((model) => (
        <RoomCard
          key={model.room.id}
          model={model}
          onOpen={onOpenRoom}
          onEdit={onEditRoom}
        />
      ))}
    </div>
  );
}
