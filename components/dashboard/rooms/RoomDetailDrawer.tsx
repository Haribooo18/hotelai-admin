"use client";

import type { ReactNode } from "react";
import { useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  BedDouble,
  Brush,
  Pencil,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { toast } from "@/lib/toast";

import type { Booking } from "@/types/booking";

import { Button } from "@/components/ui/core/Button";
import {
  WorkspaceInspectorDrawer,
  WorkspaceOverlayActions,
} from "@/components/dashboard/shared/WorkspaceOverlay";
import { DrawerTitle } from "@/components/ui/overlay/Drawer";
import { WorkspaceEmptyState } from "@/components/dashboard/shared/WorkspaceEmptyState";
import { WorkspaceInspectorHeader } from "@/components/dashboard/shared/WorkspaceInspectorHeader";
import { Panel } from "@/components/ui/primitives/Panel";
import { Stack } from "@/components/ui/primitives/Stack";
import { PaymentStatusBadge } from "@/components/dashboard/bookings/PaymentStatusBadge";
import { motionPresets } from "@/lib/design/motion";
import {
  cardPaddingClass,
  drawerBadgeRowClass,
  drawerSubtitleClass,
} from "@/lib/dashboard/design-system";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { HousekeepingBadge } from "./HousekeepingBadge";
import { MaintenanceBadge } from "./MaintenanceBadge";
import { RoomStatusBadge } from "./RoomStatusBadge";
import {
  buildRoomTimeline,
  translateRoomTimelineItem,
  formatRoomCurrency,
  formatRoomDate,
  getGuestInitials,
  getRoomBookings,
  getRoomMonthRevenue,
  getStayPaymentLabel,
  translateHousekeepingLabelKey,
  translateRoomFloor,
  type RoomCardModel,
} from "./room-ops-metrics";
import { RoomDetailRow } from "./rooms-ui";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: RoomCardModel | null;
  bookings: Booking[];
  onEdit: () => void;
};

export function RoomDetailDrawer({
  open,
  onOpenChange,
  model,
  bookings,
  onEdit,
}: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const timeline = useMemo(
    () => (model ? buildRoomTimeline(model.room, bookings) : []),
    [model, bookings]
  );

  const roomBookings = useMemo(
    () => (model ? getRoomBookings(model.room.id, bookings) : []),
    [model, bookings]
  );

  const upcomingBookings = useMemo(
    () =>
      roomBookings.filter(
        (booking) =>
          booking.status === "confirmed" &&
          booking.check_in >= new Date().toISOString().slice(0, 10)
      ),
    [roomBookings]
  );

  if (!model) return null;

  const { room, activeBooking, currentGuest, housekeepingStatus, revenueToday } =
    model;
  const monthRevenue = getRoomMonthRevenue(room.id, bookings);
  const paymentStatus = activeBooking
    ? getStayPaymentLabel(activeBooking)
    : null;

  function notify(message: string) {
    startTransition(() => {
      toast.success(message);
      router.refresh();
    });
  }

  return (
    <WorkspaceInspectorDrawer
      open={open}
      onOpenChange={onOpenChange}
      header={
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[18px] font-semibold text-[var(--shell-accent)]">
            {model.roomCode}
          </div>
          <div className="min-w-0 flex-1">
            <DrawerTitle>{model.roomCode}</DrawerTitle>
            <p className={drawerSubtitleClass}>
              {room.room_type} · {translateRoomFloor(model.floorLabel, t)}
            </p>
            <div className={drawerBadgeRowClass}>
              <RoomStatusBadge status={model.status} />
              <HousekeepingBadge status={housekeepingStatus} />
              <MaintenanceBadge active={model.status === "maintenance"} />
            </div>
          </div>
        </div>
      }
      footer={
        <>
          <WorkspaceInspectorHeader compact
            title={t("rooms.drawerActions")}
            subtitle={t("rooms.drawerActionsSubtitle")}
          />
          <WorkspaceOverlayActions className="mt-3">
            <Button type="button" className="gap-2" onClick={onEdit}>
              <Pencil size={14} />
              {t("common.edit")}
            </Button>
            <ActionChip
              icon={<Brush size={14} />}
              label={t("rooms.markCleaning")}
              onClick={() => notify(t("rooms.markCleaningDone"))}
            />
            <ActionChip
              icon={<ShieldCheck size={14} />}
              label={t("rooms.markInspected")}
              onClick={() => notify(t("rooms.markInspectedDone"))}
            />
            <ActionChip
              icon={<Wrench size={14} />}
              label={t("rooms.logMaintenance")}
              onClick={() => notify(t("rooms.logMaintenanceDone"))}
            />
            <ActionChip
              icon={<BedDouble size={14} />}
              label={t("rooms.blockRoom")}
              onClick={() => notify(t("rooms.blockRoomDone"))}
            />
          </WorkspaceOverlayActions>
        </>
      }
    >
          <Stack gap="md">
            <Panel variant="surface" className={cardPaddingClass}>
              <WorkspaceInspectorHeader compact
                title={t("rooms.drawerRoomInfo")}
                subtitle={t("rooms.drawerRoomInfoSubtitle")}
              />
              <dl className="mt-3 grid gap-2">
                <RoomDetailRow label={t("rooms.roomInfo")} value={model.roomCode} />
                <RoomDetailRow label={t("rooms.formRoomType")} value={room.room_type} />
                <RoomDetailRow
                  label={t("rooms.floorLabel").replace("{floor}", "").trim() || t("rooms.floorLabel")}
                  value={translateRoomFloor(model.floorLabel, t)}
                />
                <RoomDetailRow
                  label={t("rooms.formRoomType")}
                  value={String(room.capacity)}
                />
                <RoomDetailRow
                  label={t("rooms.formPricePerNight")}
                  value={formatRoomCurrency(room.price)}
                />
              </dl>
            </Panel>

            <Panel variant="surface" className={cardPaddingClass}>
              <WorkspaceInspectorHeader compact
                title={t("rooms.drawerCurrentStay")}
                subtitle={t("rooms.drawerCurrentStaySubtitle")}
              />
              {activeBooking ? (
                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shell-accent-muted)] text-[11px] font-semibold text-[var(--shell-accent)]">
                      {getGuestInitials(currentGuest)}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[var(--shell-text)]">
                        {currentGuest}
                      </p>
                      <p className="text-[11px] text-[var(--shell-muted)]">
                        {activeBooking.guest_email ??
                          activeBooking.guest_phone ??
                          t("rooms.noContact")}
                      </p>
                    </div>
                  </div>
                  <RoomDetailRow
                    label={t("bookings.checkIn")}
                    value={`${formatRoomDate(activeBooking.check_in)} → ${formatRoomDate(activeBooking.check_out)}`}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] text-[var(--shell-muted)]">
                      {t("bookings.status")}
                    </span>
                    {paymentStatus ? (
                      <PaymentStatusBadge status={paymentStatus} />
                    ) : (
                      <span>—</span>
                    )}
                  </div>
                  <RoomDetailRow
                    label={t("bookings.adult")}
                    value={String(activeBooking.adults)}
                  />
                  <RoomDetailRow
                    label={t("bookings.children")}
                    value={String(activeBooking.children)}
                  />
                </div>
              ) : (
                <p className="mt-3 text-[13px] text-[var(--shell-muted)]">
                  {t("rooms.noGuestAssigned")}
                </p>
              )}
            </Panel>

            <Panel variant="surface" className={cardPaddingClass}>
              <WorkspaceInspectorHeader compact
                title={t("rooms.drawerUpcoming")}
                subtitle={t("rooms.drawerUpcomingSubtitle")}
              />
              {upcomingBookings.length === 0 ? (
                <WorkspaceEmptyState
                  title={t("rooms.noUpcomingBookings")}
                  description={t("rooms.noUpcomingBookingsDesc")}
                  icon={<BedDouble size={16} />}
                />
              ) : (
                <div className="mt-3 space-y-2">
                  {upcomingBookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-2.5"
                    >
                      <p className="text-[13px] font-medium text-[var(--shell-text)]">
                        {booking.guest_name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[var(--shell-muted)]">
                        {formatRoomDate(booking.check_in)} →{" "}
                        {formatRoomDate(booking.check_out)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            <Panel variant="surface" className={cardPaddingClass}>
              <WorkspaceInspectorHeader compact
                title={t("rooms.drawerHousekeeping")}
                subtitle={t("rooms.drawerHousekeepingSubtitle")}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <HousekeepingBadge status={housekeepingStatus} />
              </div>
              <p className="mt-3 text-[12px] text-[var(--shell-text)]">
                {translateHousekeepingLabelKey(t, model.housekeepingLabelKey)}
              </p>
              <p className="mt-2 text-[11px] text-[var(--shell-muted)]">
                {model.cleaningProgress}%
              </p>
            </Panel>

            <Panel variant="surface" className={cardPaddingClass}>
              <WorkspaceInspectorHeader compact
                title={t("rooms.drawerMaintenance")}
                subtitle={t("rooms.drawerMaintenanceSubtitle")}
              />
              <p className="mt-3 text-[12px] text-[var(--shell-muted)]">
                {model.status === "maintenance"
                  ? t("rooms.maintenanceFlagged")
                  : t("rooms.noMaintenanceIncidents")}
              </p>
            </Panel>

            <Panel variant="surface" className={cardPaddingClass}>
              <WorkspaceInspectorHeader compact
                title={t("rooms.drawerRevenue")}
                subtitle={t("rooms.drawerRevenueSubtitle")}
              />
              <dl className="mt-3 grid gap-2">
                <RoomDetailRow
                  label={t("revenue.today")}
                  value={formatRoomCurrency(revenueToday)}
                />
                <RoomDetailRow
                  label={t("rooms.currentStayRevenue")}
                  value={
                    activeBooking
                      ? formatRoomCurrency(Number(activeBooking.total_price))
                      : "—"
                  }
                />
                <RoomDetailRow
                  label={t("revenue.month")}
                  value={formatRoomCurrency(monthRevenue)}
                />
              </dl>
            </Panel>

            <Panel variant="surface" className={cardPaddingClass}>
              <WorkspaceInspectorHeader compact
                title={t("rooms.drawerTimeline")}
                subtitle={t("rooms.drawerTimelineSubtitle")}
              />
              <div className="mt-3 space-y-2">
                {timeline.slice(0, 6).map((item) => {
                  const translated = translateRoomTimelineItem(item, t);

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-start justify-between gap-3 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 p-3",
                        motionPresets.transitionBase
                      )}
                    >
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-[var(--shell-text)]">
                          {translated.title}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[var(--shell-muted)]">
                          {translated.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>
          </Stack>
    </WorkspaceInspectorDrawer>
  );
}

function ActionChip({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-[var(--ds-input-height)] items-center gap-2 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)] px-3 text-[12px] font-medium text-[var(--shell-text)] shadow-[var(--shell-shadow-sm)] transition-[background-color] hover:bg-[var(--shell-nav-hover-bg)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]"
    >
      {icon}
      {label}
    </button>
  );
}
