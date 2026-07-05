"use client";

import { MoreHorizontal, Pencil, Star, Trash2, Users } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GuestAvatar } from "@/components/dashboard/guests/GuestAvatar";
import { DashboardEmptyState } from "@/components/dashboard/home/DashboardPrimitives";
import { cn } from "@/lib/utils";

import { GuestSatisfactionBadge } from "./GuestSatisfactionBadge";
import { GuestTags } from "./GuestTags";
import {
  deriveSatisfaction,
  formatGuestCurrency,
  formatGuestDate,
  type GuestCardModel,
} from "./guest-crm-metrics";

type Props = {
  models: GuestCardModel[];
  loading?: boolean;
  onOpenGuest: (model: GuestCardModel) => void;
  onEditGuest: (model: GuestCardModel) => void;
  onDeleteGuest: (model: GuestCardModel) => void;
  onToggleFavorite: (model: GuestCardModel) => void;
};

export function GuestsTable({
  models,
  loading = false,
  onOpenGuest,
  onEditGuest,
  onDeleteGuest,
  onToggleFavorite,
}: Props) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="ds-skeleton h-14 rounded-[var(--ds-radius-sm)]"
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
    <div className="overflow-hidden rounded-[var(--ds-radius)] bg-[var(--shell-glass)] shadow-[var(--shell-shadow-sm)] backdrop-blur-xl">
      <table className="w-full">
        <caption className="sr-only">Guest list</caption>
        <thead>
          <tr className="border-b border-[var(--shell-border)]/50">
            {[
              "Guest",
              "Country",
              "Stays",
              "Revenue",
              "Last visit",
              "Next stay",
              "Satisfaction",
              "",
            ].map((header) => (
              <th
                key={header}
                scope="col"
                className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--shell-muted)] last:text-right"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {models.map((model) => {
            const { guest, stats } = model;
            const fullName = `${guest.first_name} ${guest.last_name}`.trim();
            const satisfaction = deriveSatisfaction(model);

            return (
              <tr
                key={guest.id}
                onClick={() => onOpenGuest(model)}
                className="cursor-pointer border-b border-[var(--shell-border)]/35 transition-[background-color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] last:border-0 hover:bg-[var(--shell-surface-raised)]/50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <GuestAvatar
                      firstName={guest.first_name}
                      lastName={guest.last_name}
                      avatarUrl={guest.avatar_url}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-[var(--shell-text)]">
                        {fullName}
                      </p>
                      <GuestTags
                        tags={guest.tags.slice(0, 1)}
                        isVip={guest.is_vip}
                        isFavorite={guest.is_favorite}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[12px] text-[var(--shell-muted)]">
                  {guest.country ?? "—"}
                </td>
                <td className="px-4 py-3 text-[13px] text-[var(--shell-text)]">
                  {guest.total_bookings}
                </td>
                <td className="px-4 py-3 text-[13px] font-semibold text-[var(--shell-text)]">
                  {formatGuestCurrency(guest.total_spent)}
                </td>
                <td className="px-4 py-3 text-[12px] text-[var(--shell-muted)]">
                  {stats.lastStay ? formatGuestDate(stats.lastStay) : "—"}
                </td>
                <td className="px-4 py-3 text-[12px] text-[var(--shell-muted)]">
                  {stats.upcomingCheckIn
                    ? formatGuestDate(stats.upcomingCheckIn)
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <GuestSatisfactionBadge satisfaction={satisfaction} />
                </td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      aria-label={`Actions for ${fullName}`}
                      onClick={(event) => event.stopPropagation()}
                      className={cn(
                        "inline-flex h-8 w-8 items-center justify-center rounded-[var(--ds-radius-sm)] text-[var(--shell-muted)] transition-[background-color,color] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)]"
                      )}
                    >
                      <MoreHorizontal size={16} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="min-w-40 rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-md)]"
                    >
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          onEditGuest(model);
                        }}
                        className="gap-2 rounded-[10px] px-3 py-2 text-[13px]"
                      >
                        <Pencil size={14} />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          onToggleFavorite(model);
                        }}
                        className="gap-2 rounded-[10px] px-3 py-2 text-[13px]"
                      >
                        <Star size={14} />
                        Favorite
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeleteGuest(model);
                        }}
                        className="gap-2 rounded-[10px] px-3 py-2 text-[13px] text-red-400"
                      >
                        <Trash2 size={14} />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
