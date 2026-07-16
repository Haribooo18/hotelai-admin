"use client";

import { Pencil, Star, Trash2, Users } from "lucide-react";

import {
  TableRowActions,
  WorkspaceTable,
  WorkspaceTableCell,
  WorkspaceTableRow,
} from "@/components/dashboard/shared/WorkspaceTable";
import { GuestAvatar } from "@/components/dashboard/guests/GuestAvatar";
import {
  tableAvatarCellClass,
  tablePrimaryTextClass,
} from "@/lib/dashboard/design-system";
import { formatTranslation, useI18n } from "@/lib/i18n";

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

const HEADER_KEYS = [
  "guest",
  "country",
  "language",
  "stays",
  "revenue",
  "colLastBooking",
  "colNextStay",
  "actions",
] as const;

const HEADER_LABELS: Record<(typeof HEADER_KEYS)[number], string> = {
  guest: "bookings.guest",
  country: "guests.crmCountriesTitle",
  language: "guests.crmLanguagesTitle",
  stays: "guests.totalStays",
  revenue: "guests.lifetimeRevenue",
  colLastBooking: "guests.colLastBooking",
  colNextStay: "guests.colNextStay",
  actions: "a11y.actions",
};

export function GuestsTable({
  models,
  loading = false,
  selectedId = null,
  onOpenGuest,
  onEditGuest,
  onDeleteGuest,
  onToggleFavorite,
}: Props) {
  const { t } = useI18n();

  return (
    <WorkspaceTable
      caption={t("guests.tableCaption")}
      minWidth={980}
      loading={loading}
      isEmpty={models.length === 0}
      empty={{
        title: t("guests.noResults"),
        description: t("guests.noResultsDesc"),
        icon: <Users size={18} />,
        guidance: t("workspace.guests.emptyGuidance"),
      }}
      headers={HEADER_KEYS.map((headerKey) => ({
        key: headerKey,
        label: t(HEADER_LABELS[headerKey] as "guests.totalStays"),
        srOnly: headerKey === "actions",
      }))}
    >
      {models.map((model) => {
        const { guest, stats } = model;
        const fullName = `${guest.first_name} ${guest.last_name}`.trim();
        const selected = selectedId === guest.id;
        const language = getGuestLanguageLabel(guest);

        return (
          <WorkspaceTableRow
            key={guest.id}
            selected={selected}
            onClick={() => onOpenGuest(model)}
            a11yLabel={fullName}
            onActivate={() => onOpenGuest(model)}
          >
            <WorkspaceTableCell>
              <div className={tableAvatarCellClass}>
                <GuestAvatar
                  firstName={guest.first_name}
                  lastName={guest.last_name}
                  avatarUrl={guest.avatar_url}
                  size="sm"
                />
                <div className="min-w-0">
                  <p className={tablePrimaryTextClass}>{fullName}</p>
                  <GuestTags
                    tags={guest.tags.slice(0, 1)}
                    isVip={guest.is_vip}
                    isFavorite={guest.is_favorite}
                  />
                </div>
              </div>
            </WorkspaceTableCell>
            <WorkspaceTableCell muted>{guest.country ?? "—"}</WorkspaceTableCell>
            <WorkspaceTableCell muted>{language ?? "—"}</WorkspaceTableCell>
            <WorkspaceTableCell>{guest.total_bookings}</WorkspaceTableCell>
            <WorkspaceTableCell metric>
              {formatGuestCurrency(guest.total_spent)}
            </WorkspaceTableCell>
            <WorkspaceTableCell muted>
              {stats.lastStay ? formatGuestDate(stats.lastStay) : "—"}
            </WorkspaceTableCell>
            <WorkspaceTableCell muted>
              {stats.upcomingCheckIn
                ? formatGuestDate(stats.upcomingCheckIn)
                : "—"}
            </WorkspaceTableCell>
            <WorkspaceTableCell align="right">
              <TableRowActions
                ariaLabel={formatTranslation(t("bookings.actionsFor"), {
                  name: fullName,
                })}
                onTriggerClick={(event) => event.stopPropagation()}
                actions={[
                  {
                    label: t("common.edit"),
                    icon: Pencil,
                    onClick: () => onEditGuest(model),
                  },
                  {
                    label: t("guests.addFavorite"),
                    icon: Star,
                    onClick: () => onToggleFavorite(model),
                  },
                  {
                    label: t("common.delete"),
                    icon: Trash2,
                    onClick: () => onDeleteGuest(model),
                    destructive: true,
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
