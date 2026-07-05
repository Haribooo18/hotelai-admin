"use client";

import { Users } from "lucide-react";

import { DashboardEmptyState } from "@/components/dashboard/home/DashboardPrimitives";

import { GuestCard } from "./GuestCard";
import type { GuestCardModel } from "./guest-crm-metrics";

type Props = {
  models: GuestCardModel[];
  loading?: boolean;
  onOpenGuest: (model: GuestCardModel) => void;
  onEditGuest: (model: GuestCardModel) => void;
  onDeleteGuest: (model: GuestCardModel) => void;
  onToggleFavorite: (model: GuestCardModel) => void;
};

export function GuestsCardsView({
  models,
  loading = false,
  onOpenGuest,
  onEditGuest,
  onDeleteGuest,
  onToggleFavorite,
}: Props) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="ds-skeleton h-56 rounded-[var(--ds-radius)]"
          />
        ))}
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <DashboardEmptyState
        title="No guests found"
        description="Adjust filters or add a new guest to the CRM."
        icon={<Users size={18} />}
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {models.map((model) => (
        <GuestCard
          key={model.guest.id}
          model={model}
          onOpen={onOpenGuest}
          onEdit={onEditGuest}
          onDelete={onDeleteGuest}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
