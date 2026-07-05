"use client";

import { memo } from "react";
import {
  CalendarDays,
  Globe,
  Languages,
  MoreHorizontal,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import { Button } from "@/components/ui/core/Button";
import { activateOnKeyboard } from "@/lib/dashboard/a11y";
import { hoverRevealClass, iconActionClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

import { GuestAvatar } from "./GuestAvatar";
import { GuestTags } from "./GuestTags";
import {
  formatGuestCurrency,
  formatGuestDate,
  type GuestCardModel,
} from "./guest-crm-metrics";
import {
  getGuestLanguageLabel,
  GuestWorkspaceCard,
} from "./guests-ui";

type Props = {
  model: GuestCardModel;
  selected?: boolean;
  onOpen?: (model: GuestCardModel) => void;
  onEdit?: (model: GuestCardModel) => void;
  onDelete?: (model: GuestCardModel) => void;
  onToggleFavorite?: (model: GuestCardModel) => void;
};

export const GuestCard = memo(function GuestCard({
  model,
  selected = false,
  onOpen,
  onEdit,
  onDelete,
  onToggleFavorite,
}: Props) {
  const { guest, stats } = model;
  const fullName = `${guest.first_name} ${guest.last_name}`.trim();
  const language = getGuestLanguageLabel(guest);

  const lastVisit = stats.lastStay ? formatGuestDate(stats.lastStay) : "—";
  const nextReservation = stats.upcomingCheckIn
    ? formatGuestDate(stats.upcomingCheckIn)
    : "—";

  return (
    <GuestWorkspaceCard
      selected={selected}
      role="button"
      tabIndex={0}
      aria-label={`Open guest ${fullName}`}
      aria-pressed={selected}
      onClick={() => onOpen?.(model)}
      onKeyDown={(event) => activateOnKeyboard(event, () => onOpen?.(model))}
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
            <h3 className="truncate text-[14px] font-semibold tracking-[-0.01em] text-[var(--shell-text)]">
              {fullName}
            </h3>
            <div className="mt-1.5">
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
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onOpen?.(model);
              }}
            >
              Open profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onEdit?.(model);
              }}
              className="gap-2"
            >
              <Pencil size={14} />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onToggleFavorite?.(model);
              }}
              className="gap-2"
            >
              <Star size={14} />
              {guest.is_favorite ? "Remove favorite" : "Add favorite"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onDelete?.(model);
              }}
              className="gap-2 text-red-400"
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
          <Languages size={14} className="shrink-0 text-[var(--shell-accent)]" />
          <span className="truncate">{language ?? "—"}</span>
        </div>
        <div>
          <p className="text-[11px] text-[var(--shell-muted)]">Lifetime revenue</p>
          <p className="mt-0.5 text-[13px] font-semibold text-[var(--shell-text)]">
            {formatGuestCurrency(guest.total_spent)}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-[var(--shell-muted)]">Total stays</p>
          <p className="mt-0.5 text-[13px] font-semibold text-[var(--shell-text)]">
            {guest.total_bookings}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[var(--shell-border)]/50 pt-3 text-[11px]">
        <div>
          <p className="text-[var(--shell-muted)]">Last stay</p>
          <p className="mt-0.5 font-medium text-[var(--shell-text)]">{lastVisit}</p>
        </div>
        <div>
          <p className="text-[var(--shell-muted)]">Next stay</p>
          <p className="mt-0.5 font-medium text-[var(--shell-text)]">
            {nextReservation}
          </p>
        </div>
      </div>

      {model.activeBooking ? (
        <div className="mt-3 flex items-center gap-2 rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] px-3 py-2 text-[11px] text-[var(--shell-accent)]">
          <CalendarDays size={13} aria-hidden />
          Currently staying · {model.roomLabel ?? "Room assigned"}
        </div>
      ) : null}

      <div className="mt-3 flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 flex-1"
          onClick={(event) => {
            event.stopPropagation();
            onOpen?.(model);
          }}
        >
          Profile
        </Button>
        <Button
          type="button"
          size="sm"
          className="h-8 flex-1 bg-[var(--shell-accent-muted)] text-[var(--shell-accent)] hover:bg-[var(--shell-nav-active-bg)]"
          onClick={(event) => {
            event.stopPropagation();
            onEdit?.(model);
          }}
        >
          Edit
        </Button>
      </div>
    </GuestWorkspaceCard>
  );
});
