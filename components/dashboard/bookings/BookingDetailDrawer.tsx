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
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/overlay/Drawer";
import { Avatar, AvatarFallback } from "@/components/ui/display/Avatar";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Panel } from "@/components/ui/primitives/Panel";
import { Scrollable } from "@/components/ui/primitives/Scrollable";
import { Section } from "@/components/ui/primitives/Section";
import { Stack } from "@/components/ui/primitives/Stack";
import { GuestAvatar } from "@/components/dashboard/guests/GuestAvatar";
import { motionPresets } from "@/lib/design/motion";
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
  const timeline = useMemo(
    () => (model ? buildBookingStayTimeline(model.booking) : []),
    [model]
  );

  if (!model) return null;

  const { booking, guest, roomLabel, nights, paymentStatus, source, internalNotes } =
    model;

  const displayName = guest
    ? `${guest.first_name} ${guest.last_name}`.trim()
    : booking.guest_name;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        side="right"
        className="w-full gap-0 overflow-hidden border-0 bg-[var(--shell-content)] p-0 sm:max-w-xl"
      >
        <DrawerHeader className="border-b border-[var(--shell-border)]/70 px-6 py-5">
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
              <DrawerTitle className="text-left text-[18px] font-semibold tracking-[-0.02em] text-[var(--shell-text)]">
                {displayName}
              </DrawerTitle>
              <p className="mt-1 text-left text-[13px] text-[var(--shell-muted)]">
                {roomLabel} · {nights} {nights === 1 ? "night" : "nights"}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <BookingStatusBadge status={booking.status} />
                <PaymentStatusBadge status={paymentStatus} />
                <BookingSourceBadge source={source} />
              </div>
            </div>
          </div>
        </DrawerHeader>

        <Scrollable className="flex-1 px-6 py-5">
          <Stack gap="md">
            <Panel variant="surface" className="p-4">
              <Section
                title="Booking"
                subtitle="Reservation reference and status"
              />
              <dl className="mt-3 grid gap-2 text-[12px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-[var(--shell-muted)]">Reservation ID</dt>
                  <dd className="font-mono text-[var(--shell-text)]">
                    {booking.id.slice(0, 12)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[var(--shell-muted)]">Created</dt>
                  <dd className="text-[var(--shell-text)]">
                    {formatBookingDateTime(booking.created_at)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[var(--shell-muted)]">Updated</dt>
                  <dd className="text-[var(--shell-text)]">
                    {formatBookingDateTime(booking.updated_at)}
                  </dd>
                </div>
              </dl>
            </Panel>

            <Panel variant="surface" className="p-4">
              <Section title="Guest" subtitle="Contact and profile details" />
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

            <Panel variant="surface" className="p-4">
              <Section title="Stay" subtitle="Dates, room, and occupancy" />
              <div className="mt-3 space-y-2.5 text-[13px] text-[var(--shell-muted)]">
                <div className="flex items-center gap-2">
                  <CalendarDays size={14} />
                  {booking.check_in} — {booking.check_out}
                </div>
                <p>{roomLabel}</p>
                <p>
                  {booking.adults} {booking.adults === 1 ? "adult" : "adults"} ·{" "}
                  {booking.children}{" "}
                  {booking.children === 1 ? "child" : "children"}
                </p>
              </div>
            </Panel>

            <Panel variant="surface" className="p-4">
              <Section title="Payment" subtitle="Charges and settlement" />
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[13px] text-[var(--shell-muted)]">
                  <CreditCard size={14} />
                  Total amount
                </div>
                <p className="text-[16px] font-semibold text-[var(--shell-text)]">
                  {formatBookingCurrency(booking.total_price)}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <PaymentStatusBadge status={paymentStatus} />
                <span className="text-[12px] text-[var(--shell-muted)]">
                  {paymentStatus === "paid"
                    ? "Fully settled"
                    : paymentStatus === "deposit"
                      ? "Balance due at check-out"
                      : paymentStatus === "pending"
                        ? "Awaiting payment"
                        : "No charge"}
                </span>
              </div>
            </Panel>

            <Panel variant="surface" className="p-4">
              <Section title="Notes" subtitle="Team-only context" />
              {internalNotes ? (
                <p className="mt-3 text-[13px] leading-relaxed text-[var(--shell-text)]">
                  {internalNotes}
                </p>
              ) : (
                <EmptyState
                  title="No internal notes"
                  description="Notes from the guest profile will appear here when available."
                  icon={<FileText size={16} />}
                />
              )}
            </Panel>

            <Panel variant="surface" className="p-4">
              <Section title="Timeline" subtitle="Reservation lifecycle" />
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
                          {item.label}
                        </p>
                        <p className="mt-0.5 text-[12px] text-[var(--shell-muted)]">
                          {item.detail}
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
        </Scrollable>

        <div className="border-t border-[var(--shell-border)]/70 px-6 py-4">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="h-[var(--ds-input-height)] gap-2 bg-emerald-600 hover:bg-emerald-500"
              onClick={() => onEdit(booking)}
            >
              <Pencil size={14} />
              Edit reservation
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-[var(--ds-input-height)] gap-2 text-red-400 hover:bg-red-500/10"
              onClick={() => onDelete(booking)}
            >
              <Trash2 size={14} />
              Delete
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
