"use client";

import { memo } from "react";
import {
  CalendarDays,
  Eye,
  MoreHorizontal,
  Pencil,
  Users,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import { Avatar, AvatarFallback } from "@/components/ui/display/Avatar";
import { Button } from "@/components/ui/core/Button";
import { activateOnKeyboard } from "@/lib/dashboard/a11y";
import { hoverRevealClass, iconActionClass } from "@/lib/dashboard/design-system";
import { formatTranslation, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import type { Room } from "@/types/room";

import { HousekeepingBadge } from "./HousekeepingBadge";
import { MaintenanceBadge } from "./MaintenanceBadge";
import { RoomStatusBadge } from "./RoomStatusBadge";
import {
  formatRoomCurrency,
  formatRoomDate,
  getGuestInitials,
  type RoomCardModel,
} from "./room-ops-metrics";
import { RoomWorkspaceCard } from "./rooms-ui";

type Props = {
  model: RoomCardModel;
  selected?: boolean;
  onOpen?: (model: RoomCardModel) => void;
  onEdit?: (room: Room) => void;
};

const OCCUPANCY_KEYS = {
  occupied: "rooms.cardInHouse",
  reserved: "rooms.cardArriving",
  cleaning: "rooms.cardTurnover",
  maintenance: "rooms.cardBlocked",
  available: "rooms.cardVacant",
} as const;

export const RoomCard = memo(function RoomCard({
  model,
  selected = false,
  onOpen,
  onEdit,
}: Props) {
  const { t } = useI18n();
  const {
    room,
    roomCode,
    currentGuest,
    activeBooking,
    upcomingBooking,
    housekeepingStatus,
    revenueToday,
    status,
  } = model;

  const stayBooking = activeBooking ?? upcomingBooking;
  const occupancyLabel = t(OCCUPANCY_KEYS[status]);

  return (
    <RoomWorkspaceCard
      selected={selected}
      role="button"
      tabIndex={0}
      aria-label={formatTranslation(t("rooms.openRoomAria"), { code: roomCode })}
      aria-pressed={selected}
      onClick={() => onOpen?.(model)}
      onKeyDown={(event) => activateOnKeyboard(event, () => onOpen?.(model))}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-[var(--shell-text)]">
            {roomCode}
          </p>
          <p className="mt-1 truncate text-[13px] font-medium text-[var(--shell-text)]">
            {room.room_type}
          </p>
          <p className="mt-0.5 text-[11px] text-[var(--shell-muted)]">
            {model.floorLabel} · {occupancyLabel}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={formatTranslation(t("rooms.actionsForRoom"), {
              name: room.room_type,
            })}
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
              className="gap-2"
            >
              <Eye size={14} />
              {t("common.open")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onEdit?.(model.room);
              }}
              className="gap-2"
            >
              <Pencil size={14} />
              {t("common.edit")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-3 flex items-center gap-2.5">
        <Avatar className="size-8">
          <AvatarFallback className="text-[10px] font-semibold">
            {getGuestInitials(currentGuest)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-[12px] font-medium text-[var(--shell-text)]">
            {currentGuest ?? t("rooms.noGuestAssigned")}
          </p>
          {stayBooking ? (
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--shell-muted)]">
              <CalendarDays size={11} aria-hidden />
              {formatRoomDate(stayBooking.check_in)} →{" "}
              {formatRoomDate(stayBooking.check_out)}
            </p>
          ) : (
            <p className="mt-0.5 text-[11px] text-[var(--shell-muted)]">
              {t("rooms.cardNoActiveStay")}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <RoomStatusBadge status={status} />
        <HousekeepingBadge status={housekeepingStatus} />
        <MaintenanceBadge active={status === "maintenance"} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-2.5 py-2">
          <p className="text-[var(--shell-muted)]">{t("rooms.kpiRevenueToday")}</p>
          <p className="mt-0.5 font-semibold text-[var(--shell-text)]">
            {formatRoomCurrency(revenueToday)}
          </p>
        </div>
        <div className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-2.5 py-2">
          <p className="text-[var(--shell-muted)]">{t("rooms.cardCapacity")}</p>
          <p className="mt-0.5 flex items-center gap-1 font-semibold text-[var(--shell-text)]">
            <Users size={11} aria-hidden />
            {room.capacity}
          </p>
        </div>
      </div>

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
          {t("rooms.cardDetails")}
        </Button>
        <Button
          type="button"
          size="sm"
          className="h-8 flex-1 bg-[var(--shell-accent-muted)] text-[var(--shell-accent)] hover:bg-[var(--shell-nav-active-bg)]"
          onClick={(event) => {
            event.stopPropagation();
            onEdit?.(model.room);
          }}
        >
          {t("common.edit")}
        </Button>
      </div>
    </RoomWorkspaceCard>
  );
});
