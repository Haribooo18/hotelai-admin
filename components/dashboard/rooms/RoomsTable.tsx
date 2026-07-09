"use client";

import { BedDouble, Pencil } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/display/Avatar";
import {
  TableRowActions,
  WorkspaceTable,
  WorkspaceTableCell,
  WorkspaceTableRow,
} from "@/components/dashboard/shared/WorkspaceTable";
import {
  tableAvatarCellClass,
  tablePrimaryTextClass,
} from "@/lib/dashboard/design-system";
import { formatTranslation, useI18n } from "@/lib/i18n";
import type { TranslationPath } from "@/lib/i18n/translations";

import { HousekeepingBadge } from "./HousekeepingBadge";
import { MaintenanceBadge } from "./MaintenanceBadge";
import { RoomStatusBadge } from "./RoomStatusBadge";
import {
  formatRoomCurrency,
  formatRoomDate,
  getGuestInitials,
  type RoomCardModel,
} from "./room-ops-metrics";

type Props = {
  models: RoomCardModel[];
  loading?: boolean;
  selectedId?: string | null;
  onOpen: (model: RoomCardModel) => void;
  onEdit: (model: RoomCardModel) => void;
};

const HEADER_KEYS: TranslationPath[] = [
  "rooms.colRoom",
  "rooms.colType",
  "rooms.colGuest",
  "bookings.status",
  "rooms.housekeeping",
  "rooms.drawerMaintenance",
  "rooms.kpiRevenueToday",
  "rooms.colStay",
  "bookings.colActions",
];

export function RoomsTable({
  models,
  loading = false,
  selectedId = null,
  onOpen,
  onEdit,
}: Props) {
  const { t } = useI18n();

  return (
    <WorkspaceTable
      caption={t("rooms.tableCaption")}
      minWidth={980}
      loading={loading}
      isEmpty={models.length === 0}
      empty={{
        title: t("rooms.noResults"),
        description: t("rooms.noResultsDesc"),
        icon: <BedDouble size={18} />,
        guidance: t("workspace.rooms.emptyGuidance"),
      }}
      headers={HEADER_KEYS.map((key) => ({
        key,
        label: t(key),
        srOnly: key === "bookings.colActions",
      }))}
    >
      {models.map((model) => {
        const stay = model.activeBooking ?? model.upcomingBooking;
        const selected = selectedId === model.room.id;

        return (
          <WorkspaceTableRow
            key={model.room.id}
            selected={selected}
            onClick={() => onOpen(model)}
            a11yLabel={formatTranslation(t("rooms.openRoomAria"), {
              code: model.roomCode,
            })}
            onActivate={() => onOpen(model)}
          >
            <WorkspaceTableCell>
              <p className={tablePrimaryTextClass}>{model.roomCode}</p>
              <p className="ds-caption">{model.floorLabel}</p>
            </WorkspaceTableCell>
            <WorkspaceTableCell>{model.room.room_type}</WorkspaceTableCell>
            <WorkspaceTableCell>
              <div className={tableAvatarCellClass}>
                <Avatar className="size-7">
                  <AvatarFallback className="text-[10px] font-semibold">
                    {getGuestInitials(model.currentGuest)}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{model.currentGuest ?? "—"}</span>
              </div>
            </WorkspaceTableCell>
            <WorkspaceTableCell>
              <RoomStatusBadge status={model.status} />
            </WorkspaceTableCell>
            <WorkspaceTableCell>
              <HousekeepingBadge status={model.housekeepingStatus} />
            </WorkspaceTableCell>
            <WorkspaceTableCell>
              {model.status === "maintenance" ? (
                <MaintenanceBadge active />
              ) : (
                <span className="ds-caption">—</span>
              )}
            </WorkspaceTableCell>
            <WorkspaceTableCell metric>
              {formatRoomCurrency(model.revenueToday)}
            </WorkspaceTableCell>
            <WorkspaceTableCell muted>
              {stay
                ? `${formatRoomDate(stay.check_in)} → ${formatRoomDate(stay.check_out)}`
                : "—"}
            </WorkspaceTableCell>
            <WorkspaceTableCell align="right">
              <TableRowActions
                ariaLabel={formatTranslation(t("rooms.actionsForRoom"), {
                  name: model.roomCode,
                })}
                onTriggerClick={(event) => event.stopPropagation()}
                actions={[
                  {
                    label: t("common.open"),
                    onClick: () => onOpen(model),
                  },
                  {
                    label: t("common.edit"),
                    icon: Pencil,
                    onClick: () => onEdit(model),
                  },
                ]}
              />
            </WorkspaceTableCell>
          </WorkspaceTableRow>
        );
      })}
    </WorkspaceTable>
  );
}
