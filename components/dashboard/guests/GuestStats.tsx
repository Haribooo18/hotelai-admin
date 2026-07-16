"use client";

import {
  CalendarCheck,
  CalendarClock,
  DollarSign,
  Hotel,
  Moon,
} from "lucide-react";

import type { GuestStats as GuestStatsType } from "@/types/guest";
import { useI18n } from "@/lib/i18n";

type Props = {
  stats: GuestStatsType;
};

export function GuestStats({ stats }: Props) {
  const { t } = useI18n();

  const cards = [
    { title: t("guests.totalStays"), value: stats.totalBookings, icon: Hotel },
    { title: t("guests.statsTotalNights"), value: stats.totalNights, icon: Moon },
    {
      title: t("guests.statsTotalRevenue"),
      value: `$${stats.totalRevenue.toFixed(0)}`,
      icon: DollarSign,
    },
    {
      title: t("guests.statsLastVisit"),
      value: stats.lastStay ?? "—",
      icon: CalendarCheck,
    },
    {
      title: t("guests.statsNextCheckIn"),
      value: stats.upcomingCheckIn ?? "—",
      icon: CalendarClock,
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="rounded-[var(--ds-radius)] border border-[var(--shell-border)] bg-[var(--shell-surface)] p-[var(--ds-surface-padding)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--shell-muted)]">{card.title}</p>
              <Icon size={18} className="text-emerald-500" />
            </div>
            <div className="mt-4 text-2xl font-bold">{card.value}</div>
          </div>
        );
      })}
    </div>
  );
}
