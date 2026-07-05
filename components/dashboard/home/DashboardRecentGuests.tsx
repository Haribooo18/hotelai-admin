"use client";

import Link from "next/link";
import { ArrowRight, Crown, Users } from "lucide-react";

import type { Guest } from "@/types/guest";
import { GuestAvatar } from "@/components/dashboard/guests/GuestAvatar";
import {
  DashboardEmptyState,
  DashboardPanelHeader,
  DashboardSkeleton,
  DashboardSurface,
} from "./DashboardPrimitives";
import { formatDashboardCurrency } from "./dashboard-metrics";

type Props = {
  guests: Guest[];
  loading: boolean;
};

function formatJoined(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

export function DashboardRecentGuests({ guests, loading }: Props) {
  return (
    <DashboardSurface className="p-[var(--ds-surface-padding)]">
      <DashboardPanelHeader
        title="Recent guests"
        subtitle="Newly added profiles"
        action={
          <Link
            href="/guests"
            className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--shell-accent)] transition-opacity duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:opacity-80"
          >
            All
            <ArrowRight size={13} />
          </Link>
        }
      />

      {loading ? (
        <DashboardSkeleton />
      ) : guests.length === 0 ? (
        <DashboardEmptyState
          title="No guests yet"
          description="Guest profiles will appear here as you add them."
          icon={<Users size={18} />}
        />
      ) : (
        <div className="space-y-2">
          {guests.map((guest) => (
            <Link
              key={guest.id}
              href={`/guests/${guest.id}`}
              className="group flex items-center gap-3 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 p-3 transition-[transform,background-color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px hover:bg-[var(--shell-surface-raised)] hover:shadow-[var(--shell-shadow-sm)]"
            >
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
                      aria-label="VIP"
                    />
                  ) : null}
                </div>
                <p className="mt-0.5 text-[11px] text-[var(--shell-muted)]">
                  {guest.total_bookings} bookings ·{" "}
                  {formatDashboardCurrency(guest.total_spent)} · Joined{" "}
                  {formatJoined(guest.created_at)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardSurface>
  );
}
