"use client";

import { BedDouble } from "lucide-react";

import { WorkspaceEmptyState } from "@/components/dashboard/shared/WorkspaceEmptyState";
import { Skeleton } from "@/components/ui/display/Skeleton";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { useI18n } from "@/lib/i18n";

import { RoomCard } from "./RoomCard";
import type { RoomCardModel } from "./room-ops-metrics";
import type { Room } from "@/types/room";

type Props = {
  models: RoomCardModel[];
  loading?: boolean;
  selectedId?: string | null;
  onOpenRoom: (model: RoomCardModel) => void;
  onEditRoom: (room: Room) => void;
};

export function RoomsCardsView({
  models,
  loading = false,
  selectedId = null,
  onOpenRoom,
  onEditRoom,
}: Props) {
  const { t } = useI18n();

  if (loading) {
    return (
      <GlassSurface className="p-[var(--ds-surface-padding)]">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-52 rounded-[var(--ds-radius)]" />
          ))}
        </div>
      </GlassSurface>
    );
  }

  if (models.length === 0) {
    return (
      <WorkspaceEmptyState
        title={t("rooms.noResults")}
        description={t("rooms.noResultsDesc")}
        guidance={t("workspace.rooms.emptyGuidance")}
        icon={<BedDouble size={18} />}
      />
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      role="list"
      aria-label={t("rooms.cardsAriaLabel")}
    >
      {models.map((model) => (
        <RoomCard
          key={model.room.id}
          model={model}
          selected={selectedId === model.room.id}
          onOpen={() => onOpenRoom(model)}
          onEdit={() => onEditRoom(model.room)}
        />
      ))}
    </div>
  );
}
