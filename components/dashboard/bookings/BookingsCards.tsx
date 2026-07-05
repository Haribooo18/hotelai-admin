"use client";

import { CalendarDays } from "lucide-react";

import { DashboardEmptyState } from "@/components/dashboard/home/DashboardPrimitives";

import { BookingCard } from "./BookingCard";
import type { BookingCardModel } from "./booking-ops-metrics";

type Props = {
  models: BookingCardModel[];
  loading?: boolean;
  onSelect?: (model: BookingCardModel) => void;
  onEdit?: (model: BookingCardModel) => void;
  onDelete?: (model: BookingCardModel) => void;
};

export function BookingsCards({
  models,
  loading = false,
  onSelect,
  onEdit,
  onDelete,
}: Props) {

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="ds-skeleton h-48 rounded-[var(--ds-radius)]"
          />
        ))}
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <DashboardEmptyState
        title="No reservations found"
        description="Adjust filters or create a new reservation to populate this workspace."
        icon={<CalendarDays size={18} />}
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {models.map((model) => (
        <BookingCard
          key={model.booking.id}
          model={model}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
