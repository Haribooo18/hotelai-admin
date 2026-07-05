"use client";

import type { ReactNode } from "react";
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

import { GuestAvatar } from "./GuestAvatar";
import { GuestTags } from "./GuestTags";
import {
  formatGuestCurrency,
  formatGuestDate,
  formatGuestDateTime,
  type GuestCardModel,
  type GuestViewMode,
} from "./guest-crm-metrics";

type Props = {
  model: GuestCardModel;
  viewMode: GuestViewMode;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
};

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--shell-muted)]">
        {label}
      </p>
      <div className="mt-1 flex items-center gap-1.5 text-[13px] text-[var(--shell-text)]">
        <span className="text-[var(--shell-muted)]">{icon}</span>
        <span className="truncate">{value}</span>
      </div>
    </div>
  );
}

export function GuestCard({
  model,
  viewMode,
  selected,
  onSelect,
  onOpen,
  onEdit,
  onDelete,
  onToggleFavorite,
}: Props) {
  const { guest, activeBooking, roomLabel, statusLabel } = model;
  const fullName = `${guest.first_name} ${guest.last_name}`.trim();

  const stayDates = activeBooking
    ? `${formatGuestDate(activeBooking.check_in)} — ${formatGuestDate(activeBooking.check_out)}`
    : "—";

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <label className="mt-1 flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => {
                e.stopPropagation();
                onSelect(e.target.checked);
              }}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Select ${fullName}`}
              className="h-4 w-4 rounded border-[var(--shell-border)] text-emerald-600 focus:ring-emerald-500/30"
            />
          </label>

          <button
            type="button"
            onClick={onOpen}
            className="flex min-w-0 items-start gap-3 text-left"
          >
            <GuestAvatar
              firstName={guest.first_name}
              lastName={guest.last_name}
              avatarUrl={guest.avatar_url}
              size="md"
            />
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-[var(--shell-text)]">
                {fullName}
              </p>
              <div className="mt-2">
                <GuestTags
                  tags={guest.tags}
                  isVip={guest.is_vip}
                  isFavorite={guest.is_favorite}
                />
              </div>
            </div>
          </button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Actions for ${fullName}`}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] text-[var(--shell-muted)] transition-all duration-[180ms] ease-out",
              "hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
            )}
          >
            <MoreHorizontal size={18} />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="min-w-44 rounded-[12px] border-0 bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-md)]"
          >
            <DropdownMenuItem
              onClick={onOpen}
              className="rounded-[10px] px-3 py-2 text-[13px] text-[var(--shell-text)]"
            >
              Open profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onEdit}
              className="gap-2 rounded-[10px] px-3 py-2 text-[13px] text-[var(--shell-text)]"
            >
              <Pencil size={14} />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onToggleFavorite}
              className="gap-2 rounded-[10px] px-3 py-2 text-[13px] text-[var(--shell-text)]"
            >
              <Star size={14} />
              {guest.is_favorite ? "Remove from favorites" : "Add to favorites"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="gap-2 rounded-[10px] px-3 py-2 text-[13px] text-red-400"
            >
              <Trash2 size={14} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div
        className={cn(
          "mt-5 gap-4",
          viewMode === "grid"
            ? "grid sm:grid-cols-2"
            : "grid md:grid-cols-4 xl:grid-cols-6"
        )}
      >
        <MetaItem
          icon={<CalendarDays size={14} />}
          label="Room"
          value={roomLabel ?? "—"}
        />
        <MetaItem
          icon={<CalendarDays size={14} />}
          label="Stay dates"
          value={stayDates}
        />
        <MetaItem
          icon={<CalendarDays size={14} />}
          label="Visits"
          value={String(guest.total_bookings)}
        />
        <MetaItem
          icon={<CalendarDays size={14} />}
          label="Spent"
          value={formatGuestCurrency(guest.total_spent)}
        />
        <MetaItem
          icon={<Globe size={14} />}
          label="Country"
          value={guest.country ?? "—"}
        />
        <MetaItem
          icon={<Phone size={14} />}
          label="Phone"
          value={guest.phone ?? "—"}
        />
        <MetaItem
          icon={<Mail size={14} />}
          label="Email"
          value={guest.email ?? "—"}
        />
        <MetaItem
          icon={<CalendarDays size={14} />}
          label="Status"
          value={statusLabel}
        />
        <MetaItem
          icon={<CalendarDays size={14} />}
          label="Activity"
          value={formatGuestDateTime(guest.updated_at)}
        />
      </div>
    </>
  );

  return (
    <article
      className={cn(
        "rounded-[20px] bg-[var(--shell-surface)] p-5 shadow-[var(--shell-shadow-sm)] transition-all duration-[180ms] ease-out",
        "hover:-translate-y-1 hover:shadow-[var(--shell-shadow-md)]",
        selected && "ring-2 ring-emerald-500/40"
      )}
    >
      {content}
    </article>
  );
}
