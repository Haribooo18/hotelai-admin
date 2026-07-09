"use client";

import { CalendarDays } from "lucide-react";

import { SkeletonCrossfade } from "@/components/motion/SkeletonCrossfade";
import { WorkspaceCardGridSkeleton } from "@/components/dashboard/shared/skeleton";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { useI18n } from "@/lib/i18n";

import { BookingCard } from "./BookingCard";
import type { BookingCardModel } from "./booking-ops-metrics";

type Props = {
  models: BookingCardModel[];
  loading?: boolean;
  selectedId?: string | null;
  onSelect?: (model: BookingCardModel) => void;
  onEdit?: (model: BookingCardModel) => void;
  onDelete?: (model: BookingCardModel) => void;
};

export function BookingsCards({
  models,
  loading = false,
  selectedId = null,
  onSelect,
  onEdit,
  onDelete,
}: Props) {
  const { t } = useI18n();

  if (!loading && models.length === 0) {
    return (
      <EmptyState
        title={t("bookings.noResults")}
        description={t("bookings.noResultsDesc")}
        icon={<CalendarDays size={18} />}
      />
    );
  }

  return (
    <SkeletonCrossfade
      loading={loading}
      skeleton={
        <GlassSurface className="p-[var(--ds-surface-padding)]">
          <WorkspaceCardGridSkeleton />
        </GlassSurface>
      }
    >
      <div
        className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3"
        role="list"
        aria-label={t("bookings.cardsAriaLabel")}
      >
        {models.map((model) => (
          <BookingCard
            key={model.booking.id}
            model={model}
            selected={selectedId === model.booking.id}
            onSelect={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </SkeletonCrossfade>
  );
}
