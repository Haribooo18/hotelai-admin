"use client";

import { CalendarDays, Pencil, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/display/Avatar";
import { GuestAvatar } from "@/components/dashboard/guests/GuestAvatar";
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

import { BookingSourceBadge } from "./BookingSourceBadge";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import {
  formatBookingCurrency,
  formatBookingDate,
  getGuestInitials,
  type BookingCardModel,
} from "./booking-ops-metrics";

type Props = {
  models: BookingCardModel[];
  loading?: boolean;
  selectedId?: string | null;
  onSelect?: (model: BookingCardModel) => void;
  onEdit?: (model: BookingCardModel) => void;
  onDelete?: (model: BookingCardModel) => void;
};

const HEADER_KEYS = [
  "guest",
  "room",
  "colStay",
  "colGuests",
  "status",
  "colPayment",
  "total",
  "colActions",
] as const;

export function BookingsTable({
  models,
  loading = false,
  selectedId = null,
  onSelect,
  onEdit,
  onDelete,
}: Props) {
  const { t } = useI18n();

  return (
    <WorkspaceTable
      caption={t("bookings.tableCaption")}
      minWidth={920}
      loading={loading}
      isEmpty={models.length === 0}
      empty={{
        title: t("bookings.noResults"),
        description: t("bookings.noResultsDesc"),
        icon: <CalendarDays size={18} />,
      }}
      headers={HEADER_KEYS.map((headerKey) => ({
        key: headerKey,
        label: t(`bookings.${headerKey}`),
        srOnly: headerKey === "colActions",
      }))}
    >
      {models.map((model) => {
        const { booking, guest, roomLabel, guestCount, paymentStatus, source } =
          model;
        const selected = selectedId === booking.id;

        return (
          <WorkspaceTableRow
            key={booking.id}
            selected={selected}
            onClick={() => onSelect?.(model)}
            a11yLabel={formatTranslation(t("bookings.openReservation"), {
              name: booking.guest_name,
            })}
            onActivate={() => onSelect?.(model)}
          >
            <WorkspaceTableCell>
              <div className={tableAvatarCellClass}>
                {guest ? (
                  <GuestAvatar
                    firstName={guest.first_name}
                    lastName={guest.last_name}
                    avatarUrl={guest.avatar_url}
                    size="sm"
                  />
                ) : (
                  <Avatar className="size-9">
                    <AvatarFallback className="text-[11px] font-semibold">
                      {getGuestInitials(booking.guest_name)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="min-w-0">
                  <p className={tablePrimaryTextClass}>{booking.guest_name}</p>
                  <BookingSourceBadge source={source} />
                </div>
              </div>
            </WorkspaceTableCell>
            <WorkspaceTableCell muted>{roomLabel}</WorkspaceTableCell>
            <WorkspaceTableCell muted>
              {formatBookingDate(booking.check_in)} —{" "}
              {formatBookingDate(booking.check_out)}
            </WorkspaceTableCell>
            <WorkspaceTableCell>
              {booking.adults}+{booking.children}
              <span className="sr-only"> guests, total {guestCount}</span>
            </WorkspaceTableCell>
            <WorkspaceTableCell>
              <BookingStatusBadge status={booking.status} />
            </WorkspaceTableCell>
            <WorkspaceTableCell>
              <PaymentStatusBadge status={paymentStatus} />
            </WorkspaceTableCell>
            <WorkspaceTableCell metric>
              {formatBookingCurrency(booking.total_price)}
            </WorkspaceTableCell>
            <WorkspaceTableCell align="right">
              <TableRowActions
                ariaLabel={formatTranslation(t("bookings.actionsFor"), {
                  name: booking.guest_name,
                })}
                onTriggerClick={(event) => event.stopPropagation()}
                actions={[
                  {
                    label: t("common.edit"),
                    icon: Pencil,
                    onClick: () => onEdit?.(model),
                  },
                  {
                    label: t("common.delete"),
                    icon: Trash2,
                    onClick: () => onDelete?.(model),
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
