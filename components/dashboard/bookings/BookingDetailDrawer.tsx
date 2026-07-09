"use client";

import { useMemo } from "react";
import {
  CalendarDays,
  CreditCard,
  FileText,
  Mail,
  Pencil,
  Phone,
  Trash2,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/core/Button";
import {
  WorkspaceInspectorDrawer,
  WorkspaceOverlayActions,
} from "@/components/dashboard/shared/WorkspaceOverlay";
import { DrawerTitle } from "@/components/ui/overlay/Drawer";
import { Avatar, AvatarFallback } from "@/components/ui/display/Avatar";
import { WorkspaceInspectorHeader } from "@/components/dashboard/shared/WorkspaceInspectorHeader";
import { WorkspaceEmptyState } from "@/components/dashboard/shared/WorkspaceEmptyState";
import { Panel } from "@/components/ui/primitives/Panel";
import { Stack } from "@/components/ui/primitives/Stack";
import { GuestAvatar } from "@/components/dashboard/guests/GuestAvatar";
import { motionPresets } from "@/lib/design/motion";
import {
  cardPaddingClass,
  drawerBadgeRowClass,
  drawerSubtitleClass,
  overlayDangerButtonClass,
} from "@/lib/dashboard/design-system";
import { formatTranslation, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { BookingSourceBadge } from "./BookingSourceBadge";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import {
  buildBookingStayTimeline,
  formatBookingCurrency,
  formatBookingDateTime,
  getGuestInitials,
  type BookingCardModel,
} from "./booking-ops-metrics";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: BookingCardModel | null;
  onEdit: (booking: BookingCardModel["booking"]) => void;
  onDelete: (booking: BookingCardModel["booking"]) => void;
};

const TIMELINE_DOT = {
  created: "bg-violet-400",
  check_in: "bg-emerald-500",
  stay: "bg-sky-400",
  check_out: "bg-amber-400",
  status: "bg-[var(--shell-muted)]",
} as const;

export function BookingDetailDrawer({
  open,
  onOpenChange,
  model,
  onEdit,
  onDelete,
}: Props) {
  const { t } = useI18n();
  const timeline = useMemo(
    () => (model ? buildBookingStayTimeline(model.booking) : []),
    [model]
  );

  if (!model) return null;

  const { booking, guest, roomLabel, nights, paymentStatus, source, internalNotes } =
    model;

  function timelineLabel(kind: (typeof timeline)[number]["kind"]): string {
    switch (kind) {
      case "created":
        return t("bookings.timelineCreated");
      case "check_in":
        return t("bookings.timelineCheckIn");
      case "stay":
        return t("bookings.timelineStay");
      case "check_out":
        return t("bookings.timelineCheckOut");
      case "status":
        return t("bookings.timelineStatus");
      default:
        return kind;
    }
  }

  function timelineDetail(item: (typeof timeline)[number]): string {
    switch (item.kind) {
      case "created":
        return formatTranslation(t("bookings.timelineRefDetail"), {
          ref: booking.id.slice(0, 8),
        });
      case "stay":
        return formatTranslation(t("bookings.timelineStayDetail"), {
          nights,
          guests: booking.adults + booking.children,
        });
      case "status":
        return t(`statuses.booking.${booking.status}` as "statuses.booking.confirmed");
      default:
        return item.detail;
    }
  }

  const displayName = guest
    ? `${guest.first_name} ${guest.last_name}`.trim()
    : booking.guest_name;

  return (
    <WorkspaceInspectorDrawer
      open={open}
      onOpenChange={onOpenChange}
      header={
        <div className="flex items-start gap-4">
          {guest ? (
            <GuestAvatar
              firstName={guest.first_name}
              lastName={guest.last_name}
              avatarUrl={guest.avatar_url}
              size="md"
            />
          ) : (
            <Avatar className="size-11">
              <AvatarFallback className="text-[13px] font-semibold">
                {getGuestInitials(booking.guest_name)}
              </AvatarFallback>
            </Avatar>
          )}

          <div className="min-w-0 flex-1">
            <DrawerTitle>{displayName}</DrawerTitle>
            <p className={drawerSubtitleClass}>
              {roomLabel} · {nights}{" "}
              {nights === 1 ? t("common.night") : t("common.nights")}
            </p>
            <div className={drawerBadgeRowClass}>
              <BookingStatusBadge status={booking.status} />
              <PaymentStatusBadge status={paymentStatus} />
              <BookingSourceBadge source={source} />
            </div>
          </div>
        </div>
      }
      footer={
        <WorkspaceOverlayActions>
          <Button
            type="button"
            className="gap-2"
            onClick={() => onEdit(booking)}
          >
            <Pencil size={14} />
            {t("bookings.editReservation")}
          </Button>
          <Button
            type="button"
            variant="outline"
            className={overlayDangerButtonClass}
            onClick={() => onDelete(booking)}
          >
            <Trash2 size={14} />
            {t("common.delete")}
          </Button>
        </WorkspaceOverlayActions>
      }
    >
          <Stack gap="md">
            <Panel variant="surface" className={cardPaddingClass}>
              <WorkspaceInspectorHeader compact
                title={t("bookings.drawerBooking")}
                subtitle={t("bookings.drawerBookingSubtitle")}
              />
              <dl className="mt-3 grid gap-2 text-[12px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-[var(--shell-muted)]">{t("bookings.reservationId")}</dt>
                  <dd className="font-mono text-[var(--shell-text)]">
                    {booking.id.slice(0, 12)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[var(--shell-muted)]">{t("knowledge.created")}</dt>
                  <dd className="text-[var(--shell-text)]">
                    {formatBookingDateTime(booking.created_at)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[var(--shell-muted)]">{t("knowledge.updated")}</dt>
                  <dd className="text-[var(--shell-text)]">
                    {formatBookingDateTime(booking.updated_at)}
                  </dd>
                </div>
              </dl>
            </Panel>

            <Panel variant="surface" className={cardPaddingClass}>
              <WorkspaceInspectorHeader compact title={t("bookings.drawerGuest")} subtitle={t("bookings.drawerGuestSubtitle")} />
              <div className="mt-3 space-y-2.5">
                <div className="flex items-center gap-2 text-[13px] text-[var(--shell-text)]">
                  <UserRound size={14} className="text-[var(--shell-muted)]" />
                  {displayName}
                </div>
                {booking.guest_email ? (
                  <div className="flex items-center gap-2 text-[13px] text-[var(--shell-muted)]">
                    <Mail size={14} />
                    {booking.guest_email}
                  </div>
                ) : null}
                {booking.guest_phone ? (
                  <div className="flex items-center gap-2 text-[13px] text-[var(--shell-muted)]">
                    <Phone size={14} />
                    {booking.guest_phone}
                  </div>
                ) : null}
              </div>
            </Panel>

            <Panel variant="surface" className={cardPaddingClass}>
              <WorkspaceInspectorHeader compact title={t("bookings.drawerStay")} subtitle={t("bookings.drawerStaySubtitle")} />
              <div className="mt-3 space-y-2.5 text-[13px] text-[var(--shell-muted)]">
                <div className="flex items-center gap-2">
                  <CalendarDays size={14} />
                  {booking.check_in} — {booking.check_out}
                </div>
                <p>{roomLabel}</p>
                <p>
                  {booking.adults}{" "}
                  {booking.adults === 1 ? t("bookings.adult") : t("bookings.adults")} ·{" "}
                  {booking.children}{" "}
                  {booking.children === 1 ? t("bookings.child") : t("bookings.children")}
                </p>
              </div>
            </Panel>

            <Panel variant="surface" className={cardPaddingClass}>
              <WorkspaceInspectorHeader compact title={t("bookings.drawerPayment")} subtitle={t("bookings.drawerPaymentSubtitle")} />
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[13px] text-[var(--shell-muted)]">
                  <CreditCard size={14} />
                  {t("bookings.totalAmount")}
                </div>
                <p className="text-[16px] font-semibold text-[var(--shell-text)]">
                  {formatBookingCurrency(booking.total_price)}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <PaymentStatusBadge status={paymentStatus} />
                <span className="text-[12px] text-[var(--shell-muted)]">
                  {paymentStatus === "paid"
                    ? t("bookings.paymentFullySettled")
                    : paymentStatus === "deposit"
                      ? t("bookings.paymentBalanceDue")
                      : paymentStatus === "pending"
                        ? t("bookings.paymentAwaiting")
                        : t("bookings.paymentNoCharge")}
                </span>
              </div>
            </Panel>

            <Panel variant="surface" className={cardPaddingClass}>
              <WorkspaceInspectorHeader compact title={t("bookings.drawerNotes")} subtitle={t("bookings.drawerNotesSubtitle")} />
              {internalNotes ? (
                <p className="mt-3 text-[13px] leading-relaxed text-[var(--shell-text)]">
                  {internalNotes}
                </p>
              ) : (
                <WorkspaceEmptyState
                  title={t("bookings.noInternalNotes")}
                  description={t("bookings.noInternalNotesDesc")}
                  icon={<FileText size={16} />}
                />
              )}
            </Panel>

            <Panel variant="surface" className={cardPaddingClass}>
              <WorkspaceInspectorHeader compact title={t("bookings.drawerTimeline")} subtitle={t("bookings.drawerTimelineSubtitle")} />
              <div className="mt-3 space-y-2">
                {timeline.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-start gap-3 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 p-3",
                      motionPresets.transitionBase
                    )}
                  >
                      <div
                        className={cn(
                          "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                          TIMELINE_DOT[item.kind]
                        )}
                        aria-hidden
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-[var(--shell-text)]">
                          {timelineLabel(item.kind)}
                        </p>
                        <p className="mt-0.5 text-[12px] text-[var(--shell-muted)]">
                          {timelineDetail(item)}
                        </p>
                      </div>
                      <span className="shrink-0 text-[11px] text-[var(--shell-muted)]">
                        {formatBookingDateTime(item.at)}
                      </span>
                    </div>
                ))}
              </div>
            </Panel>
          </Stack>
    </WorkspaceInspectorDrawer>
  );
}
