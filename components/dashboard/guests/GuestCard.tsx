"use client";

import { memo } from "react";
import {
  CalendarDays,
  Globe,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Star,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { hoverRevealClass, iconActionClass } from "@/lib/dashboard/design-system";

import { GuestAvatar } from "./GuestAvatar";
import { GuestSatisfactionBadge } from "./GuestSatisfactionBadge";
import { GuestTags } from "./GuestTags";
import {
  deriveSatisfaction,
  formatGuestCurrency,
  formatGuestDate,
  type GuestCardModel,
} from "./guest-crm-metrics";

type Props = {
  model: GuestCardModel;
  onOpen?: (model: GuestCardModel) => void;
  onEdit?: (model: GuestCardModel) => void;
  onDelete?: (model: GuestCardModel) => void;
  onToggleFavorite?: (model: GuestCardModel) => void;
};

export const GuestCard = memo(function GuestCard({
  model,
  onOpen,
  onEdit,
  onDelete,
  onToggleFavorite,
}: Props) {
  const { guest, stats } = model;
  const fullName = `${guest.first_name} ${guest.last_name}`.trim();
  const satisfaction = deriveSatisfaction(model);

  const lastVisit = stats.lastStay
    ? formatGuestDate(stats.lastStay)
    : "—";

  const nextReservation = stats.upcomingCheckIn
    ? formatGuestDate(stats.upcomingCheckIn)
    : "—";

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Open guest ${fullName}`}
      onClick={() => onOpen?.(model)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen?.(model);
        }
      }}
      className={cn(
        "group cursor-pointer rounded-[var(--ds-radius)] bg-[var(--shell-glass)] p-[var(--ds-surface-padding)] shadow-[var(--shell-shadow-sm)] backdrop-blur-xl",
        "transition-[transform,box-shadow,background-color] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px hover:shadow-[var(--shell-shadow-md)]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <GuestAvatar
            firstName={guest.first_name}
            lastName={guest.last_name}
            avatarUrl={guest.avatar_url}
            size="sm"
          />
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold tracking-[-0.01em] text-[var(--shell-text)]">
              {fullName}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <GuestTags
                tags={guest.tags.slice(0, 2)}
                isVip={guest.is_vip}
                isFavorite={guest.is_favorite}
              />
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Actions for ${fullName}`}
            onClick={(event) => event.stopPropagation()}
            className={cn(iconActionClass, hoverRevealClass, "shrink-0")}
          >
            <MoreHorizontal size={16} />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="min-w-44 rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-md)]"
          >
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onOpen?.(model);
              }}
              className="rounded-[10px] px-3 py-2 text-[13px] text-[var(--shell-text)]"
            >
              Open profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onEdit?.(model);
              }}
              className="gap-2 rounded-[10px] px-3 py-2 text-[13px] text-[var(--shell-text)]"
            >
              <Pencil size={14} />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onToggleFavorite?.(model);
              }}
              className="gap-2 rounded-[10px] px-3 py-2 text-[13px] text-[var(--shell-text)]"
            >
              <Star size={14} />
              {guest.is_favorite ? "Remove favorite" : "Add favorite"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onDelete?.(model);
              }}
              className="gap-2 rounded-[10px] px-3 py-2 text-[13px] text-red-400"
            >
              <Trash2 size={14} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <div className="flex items-center gap-2 text-[12px] text-[var(--shell-muted)]">
          <Globe size={14} className="shrink-0 text-[var(--shell-accent)]" />
          <span className="truncate">{guest.country ?? "—"}</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[var(--shell-muted)]">
          <Mail size={14} className="shrink-0 text-[var(--shell-accent)]" />
          <span className="truncate">{guest.email ?? "—"}</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[var(--shell-muted)]">
          <Phone size={14} className="shrink-0 text-[var(--shell-accent)]" />
          <span className="truncate">{guest.phone ?? "—"}</span>
        </div>
        <div className="text-right text-[13px] font-semibold text-[var(--shell-text)]">
          {formatGuestCurrency(guest.total_spent)}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[var(--shell-border)]/50 pt-3 text-[11px]">
        <div>
          <p className="text-[var(--shell-muted)]">Total stays</p>
          <p className="mt-0.5 font-medium text-[var(--shell-text)]">
            {guest.total_bookings}
          </p>
        </div>
        <div>
          <p className="text-[var(--shell-muted)]">Last visit</p>
          <p className="mt-0.5 font-medium text-[var(--shell-text)]">
            {lastVisit}
          </p>
        </div>
        <div>
          <p className="text-[var(--shell-muted)]">Next reservation</p>
          <p className="mt-0.5 font-medium text-[var(--shell-text)]">
            {nextReservation}
          </p>
        </div>
        <div className="flex items-end justify-end">
          <GuestSatisfactionBadge satisfaction={satisfaction} />
        </div>
      </div>

      {model.activeBooking ? (
        <div className="mt-3 flex items-center gap-2 rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] px-3 py-2 text-[11px] text-[var(--shell-accent)]">
          <CalendarDays size={13} />
          Currently staying · {model.roomLabel ?? "Room assigned"}
        </div>
      ) : null}
    </article>
  );
});
