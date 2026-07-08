"use client";

import Link from "next/link";
import { Crown, Users } from "lucide-react";

import { DataCard } from "@/components/ui/data/DataCard";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { SkeletonGroup } from "@/components/ui/display/Skeleton";
import { GuestAvatar } from "@/components/dashboard/guests/GuestAvatar";

import type { Guest } from "@/types/guest";

import { formatDashboardCurrency } from "./dashboard-metrics";
import {
  DashboardCardAction,
  DashboardListItem,
  matchesDashboardSearch,
} from "./dashboard-ui";
import { formatTranslation, useI18n } from "@/lib/i18n";

type Props = {
  guests: Guest[];
  loading: boolean;
  searchQuery?: string;
};

function formatJoined(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

export function DashboardRecentGuests({
  guests,
  loading,
  searchQuery = "",
}: Props) {
  const { t } = useI18n();
  const filteredGuests = guests.filter((guest) =>
    matchesDashboardSearch(searchQuery, [
      guest.first_name,
      guest.last_name,
      guest.email,
      guest.phone,
    ])
  );

  return (
    <DataCard
      interactive
      title={t("dashboard.recentGuests")}
      subtitle={t("dashboard.recentGuestsSubtitle")}
      action={<DashboardCardAction href="/guests" label={t("common.all")} />}
    >
      {loading ? (
        <SkeletonGroup />
      ) : filteredGuests.length === 0 ? (
        <EmptyState
          title={t("dashboard.noGuestsYet")}
          description={t("dashboard.noGuestsYetDesc")}
          icon={<Users size={18} />}
        />
      ) : (
        <div className="space-y-2" role="list" aria-label={t("dashboard.recentGuestsAria")}>
          {filteredGuests.map((guest) => (
            <Link
              key={guest.id}
              href={`/guests/${guest.id}`}
              className="block focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]"
            >
              <DashboardListItem className="group flex items-center gap-3">
                <GuestAvatar
                  firstName={guest.first_name}
                  lastName={guest.last_name}
                  avatarUrl={guest.avatar_url}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[13px] font-medium text-[var(--shell-text)]">
                      {guest.first_name} {guest.last_name}
                    </p>
                    {guest.is_vip ? (
                      <Crown
                        size={12}
                        className="shrink-0 text-amber-400"
                        aria-label={t("dashboard.vipAria")}
                      />
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-[11px] text-[var(--shell-muted)]">
                    {guest.total_bookings} bookings ·{" "}
                    {formatDashboardCurrency(guest.total_spent)} ·{" "}
                    {formatTranslation(t("dashboard.joinedOn"), {
                      date: formatJoined(guest.created_at),
                    })}
                  </p>
                </div>
              </DashboardListItem>
            </Link>
          ))}
        </div>
      )}
    </DataCard>
  );
}
