"use client";

import { MoreHorizontal, Pencil, Star, Trash2, Users } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import { SkeletonRows } from "@/components/ui/display/Skeleton";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { TableContainer } from "@/components/ui/data/TableContainer";
import { GuestAvatar } from "@/components/dashboard/guests/GuestAvatar";
import { tableRowA11yProps } from "@/lib/dashboard/a11y";
import { iconActionClass } from "@/lib/dashboard/design-system";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

import { GuestTags } from "./GuestTags";
import {
  formatGuestCurrency,
  formatGuestDate,
  type GuestCardModel,
} from "./guest-crm-metrics";
import { getGuestLanguageLabel } from "./guests-ui";

type Props = {
  models: GuestCardModel[];
  loading?: boolean;
  selectedId?: string | null;
  onOpenGuest: (model: GuestCardModel) => void;
  onEditGuest: (model: GuestCardModel) => void;
  onDeleteGuest: (model: GuestCardModel) => void;
  onToggleFavorite: (model: GuestCardModel) => void;
};

const HEADERS = [
  "Guest",
  "Country",
  "Language",
  "Stays",
  "Revenue",
  "Last booking",
  "Next stay",
  "Actions",
] as const;

export function GuestsTable({
  models,
  loading = false,
  selectedId = null,
  onOpenGuest,
  onEditGuest,
  onDeleteGuest,
  onToggleFavorite,
}: Props) {
  if (loading) {
    return (
      <TableContainer>
        <SkeletonRows rows={8} />
      </TableContainer>
    );
  }

  if (models.length === 0) {
    return (
      <EmptyState
        title="No guests found"
        description="Adjust filters or add a new guest to the CRM."
        icon={<Users size={18} />}
      />
    );
  }

  return (
    <TableContainer scrollable className="shadow-[var(--shell-shadow-sm)]">
      <table className="w-full min-w-[980px] border-collapse">
        <caption className="sr-only">Guest list</caption>
        <thead className="sticky top-0 z-10 bg-[var(--shell-surface)]">
          <tr className="border-b border-[var(--shell-border)]/50">
            {HEADERS.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--shell-muted)] last:text-right"
              >
                {header === "Actions" ? (
                  <span className="sr-only">{header}</span>
                ) : (
                  header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {models.map((model) => {
            const { guest, stats } = model;
            const fullName = `${guest.first_name} ${guest.last_name}`.trim();
            const selected = selectedId === guest.id;
            const language = getGuestLanguageLabel(guest);

            return (
              <tr
                key={guest.id}
                onClick={() => onOpenGuest(model)}
                aria-selected={selected}
                className={cn(
                  "cursor-pointer border-b border-[var(--shell-border)]/30 last:border-b-0",
                  motionPresets.transitionBase,
                  "hover:bg-[var(--shell-surface-raised)]/70 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--shell-accent-ring)]",
                  selected &&
                    "bg-[var(--shell-nav-active-bg)]/40 shadow-[inset_2px_0_0_0_var(--shell-accent)]"
                )}
                {...tableRowA11yProps(`Open guest ${fullName}`, () =>
                  onOpenGuest(model)
                )}
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
                <td className="px-4 py-3 text-[12px] text-[var(--shell-muted)]">
                  {language ?? "—"}
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
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      aria-label={`Actions for ${fullName}`}
                      onClick={(event) => event.stopPropagation()}
                      className={cn(iconActionClass, "max-md:opacity-100")}
                    >
                      <MoreHorizontal size={16} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          onEditGuest(model);
                        }}
                        className="gap-2"
                      >
                        <Pencil size={14} />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          onToggleFavorite(model);
                        }}
                        className="gap-2"
                      >
                        <Star size={14} />
                        Favorite
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeleteGuest(model);
                        }}
                        className="gap-2 text-red-400"
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
    </TableContainer>
  );
}
