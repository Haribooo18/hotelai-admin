"use client";

import { Users } from "lucide-react";

import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Skeleton } from "@/components/ui/display/Skeleton";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";

import { GuestCard } from "./GuestCard";
import { GuestsTable } from "./GuestsTable";
import type { GuestCardModel, GuestViewMode } from "./guest-crm-metrics";

type Props = {
  models: GuestCardModel[];
  viewMode: GuestViewMode;
  loading?: boolean;
  selectedId?: string | null;
  onOpenGuest: (model: GuestCardModel) => void;
  onEditGuest: (model: GuestCardModel) => void;
  onDeleteGuest: (model: GuestCardModel) => void;
  onToggleFavorite: (model: GuestCardModel) => void;
};

export function GuestsCardsView({
  models,
  viewMode,
  loading = false,
  selectedId = null,
  onOpenGuest,
  onEditGuest,
  onDeleteGuest,
  onToggleFavorite,
}: Props) {
  if (loading) {
    return (
      <GlassSurface className="p-[var(--ds-surface-padding)]">
        {viewMode === "cards" ? (
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-56 rounded-[var(--ds-radius)]" />
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
        title="No guests found"
        description="Adjust filters or add a new guest to the CRM."
        icon={<Users size={18} />}
      />
    );
  }

  if (viewMode === "table") {
    return (
      <GuestsTable
        models={models}
        selectedId={selectedId}
        onOpenGuest={onOpenGuest}
        onEditGuest={onEditGuest}
        onDeleteGuest={onDeleteGuest}
        onToggleFavorite={onToggleFavorite}
      />
    );
  }

  return (
    <div
      className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3"
      role="list"
      aria-label="Guest cards"
    >
      {models.map((model) => (
        <GuestCard
          key={model.guest.id}
          model={model}
          selected={selectedId === model.guest.id}
          onOpen={onOpenGuest}
          onEdit={onEditGuest}
          onDelete={onDeleteGuest}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
