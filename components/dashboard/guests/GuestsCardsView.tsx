"use client";

import { Users } from "lucide-react";

import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Skeleton } from "@/components/ui/display/Skeleton";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { useI18n } from "@/lib/i18n";

import { GuestCard } from "./GuestCard";
import type { GuestCardModel } from "./guest-crm-metrics";

type Props = {
  models: GuestCardModel[];
  loading?: boolean;
  selectedId?: string | null;
  onOpenGuest: (model: GuestCardModel) => void;
  onEditGuest: (model: GuestCardModel) => void;
  onDeleteGuest: (model: GuestCardModel) => void;
  onToggleFavorite: (model: GuestCardModel) => void;
};

export function GuestsCardsView({
  models,
  loading = false,
  selectedId = null,
  onOpenGuest,
  onEditGuest,
  onDeleteGuest,
  onToggleFavorite,
}: Props) {
  const { t } = useI18n();

  if (loading) {
    return (
      <GlassSurface className="p-[var(--ds-surface-padding)]">
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-56 rounded-[var(--ds-radius)]" />
          ))}
        </div>
      </GlassSurface>
    );
  }

  if (models.length === 0) {
    return (
      <EmptyState
        title={t("guests.noResults")}
        description={t("guests.noResultsDesc")}
        icon={<Users size={18} />}
      />
    );
  }

  return (
    <div
      className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3"
      role="list"
      aria-label={t("guests.cardsAriaLabel")}
    >
      {models.map((model) => (
        <GuestCard
          key={model.guest.id}
          model={model}
          selected={selectedId === model.guest.id}
          onOpen={() => onOpenGuest(model)}
          onEdit={() => onEditGuest(model)}
          onDelete={() => onDeleteGuest(model)}
          onToggleFavorite={() => onToggleFavorite(model)}
        />
      ))}
    </div>
  );
}
