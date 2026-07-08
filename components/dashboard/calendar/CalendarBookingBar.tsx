"use client";

import { useRef, useState } from "react";

import type { Booking } from "@/types/booking";
import { cn } from "@/lib/utils";
import {
  DAY_WIDTH,
  addDays,
  parseISODate,
  toISODate,
  type BookingPlacement,
} from "@/lib/calendar";
import type { BookingCardModel } from "@/components/dashboard/bookings/booking-ops-metrics";
import { formatBookingCurrency } from "@/components/dashboard/bookings/booking-ops-metrics";
import { motionPresets } from "@/lib/design/motion";
import { formatTranslation, useI18n } from "@/lib/i18n";
import type { TranslationPath } from "@/lib/i18n/translations";

import {
  BOOKING_STATUS_GRADIENT,
  PAYMENT_DOT,
} from "./calendar-ops-metrics";

type DragMode = "move" | "resize-start" | "resize-end";

type Props = {
  model: BookingCardModel;
  placement: BookingPlacement;
  selected?: boolean;
  onReschedule: (
    booking: Booking,
    next: { check_in: string; check_out: string }
  ) => void;
  onOpen: (booking: Booking) => void;
};

export function CalendarBookingBar({
  model,
  placement,
  selected = false,
  onReschedule,
  onOpen,
}: Props) {
  const { t } = useI18n();
  const { booking, guest, roomLabel, nights, paymentStatus } = model;
  const statusLabel = t(
    `statuses.booking.${booking.status}` as TranslationPath
  );
  const displayName = guest
    ? `${guest.first_name} ${guest.last_name}`.trim()
    : booking.guest_name;

  const [drag, setDrag] = useState<{ mode: DragMode; deltaDays: number } | null>(
    null
  );
  const startX = useRef(0);
  const movedRef = useRef(false);

  const baseLeft = placement.startIndex * DAY_WIDTH;
  const baseWidth = placement.span * DAY_WIDTH;

  let left = baseLeft;
  let width = baseWidth;

  if (drag) {
    const shift = drag.deltaDays * DAY_WIDTH;
    if (drag.mode === "move") left = baseLeft + shift;
    if (drag.mode === "resize-start") {
      left = baseLeft + shift;
      width = baseWidth - shift;
    }
    if (drag.mode === "resize-end") width = baseWidth + shift;
  }

  width = Math.max(DAY_WIDTH, width);

  function beginDrag(mode: DragMode, e: React.PointerEvent) {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    movedRef.current = false;
    setDrag({ mode, deltaDays: 0 });
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!drag) return;
    const deltaDays = Math.round((e.clientX - startX.current) / DAY_WIDTH);
    if (deltaDays !== 0) movedRef.current = true;
    if (deltaDays !== drag.deltaDays) setDrag({ ...drag, deltaDays });
  }

  function commit(mode: DragMode, deltaDays: number) {
    if (deltaDays === 0) return;

    const checkIn = parseISODate(booking.check_in);
    const checkOut = parseISODate(booking.check_out);
    let nextIn = checkIn;
    let nextOut = checkOut;

    if (mode === "move") {
      nextIn = addDays(checkIn, deltaDays);
      nextOut = addDays(checkOut, deltaDays);
    } else if (mode === "resize-start") {
      nextIn = addDays(checkIn, deltaDays);
      if (nextIn >= nextOut) nextIn = addDays(nextOut, -1);
    } else if (mode === "resize-end") {
      nextOut = addDays(checkOut, deltaDays);
      if (nextOut <= nextIn) nextOut = addDays(nextIn, 1);
    }

    const ci = toISODate(nextIn);
    const co = toISODate(nextOut);
    if (ci === booking.check_in && co === booking.check_out) return;

    onReschedule(booking, { check_in: ci, check_out: co });
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!drag) return;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    const { mode, deltaDays } = drag;
    setDrag(null);
    commit(mode, deltaDays);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(booking);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      commit(e.shiftKey ? "resize-end" : "move", 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      commit(e.shiftKey ? "resize-end" : "move", -1);
    }
  }

  const gradient =
    BOOKING_STATUS_GRADIENT[booking.status] ??
    "bg-gradient-to-r from-emerald-600/95 to-emerald-500/90 text-white";

  return (
    <div
      className="group absolute top-2 z-10"
      style={{
        left,
        width,
        height: "calc(100% - 16px)",
        touchAction: "none",
        zIndex: drag ? 30 : undefined,
      }}
    >
      <button
        type="button"
        aria-label={formatTranslation(t("calendar.reservationBarAria"), {
          guest: displayName,
          checkIn: booking.check_in,
          checkOut: booking.check_out,
        })}
        onPointerDown={(e) => beginDrag("move", e)}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
        onClick={() => {
          if (!movedRef.current) onOpen(booking);
        }}
        className={cn(
          "flex h-full w-full cursor-grab items-center overflow-hidden rounded-[var(--ds-radius)] px-1 text-left shadow-[var(--shell-shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 active:cursor-grabbing",
          motionPresets.transitionBase,
          motionPresets.hover.surfaceLift,
          selected && "ring-2 ring-white/80 shadow-[var(--shell-shadow-md)]",
          gradient,
          placement.clippedStart && "rounded-l-[6px]",
          placement.clippedEnd && "rounded-r-[6px]"
        )}
      >
        <div className="min-w-0 flex-1 px-2 py-1">
          <p className="truncate text-[11px] font-semibold leading-tight">
            {displayName}
          </p>
          <p className="mt-0.5 truncate text-[10px] leading-tight opacity-85">
            {roomLabel} · {formatTranslation(t("calendar.nightsShort"), { count: String(nights) })} · {statusLabel}
          </p>
        </div>

        <span
          className={cn(
            "mr-2 h-2 w-2 shrink-0 rounded-full ring-2 ring-white/25",
            PAYMENT_DOT[paymentStatus]
          )}
          title={`${t("calendar.paymentTooltip")}: ${paymentStatus}`}
        />
      </button>

      <div
        role="presentation"
        onPointerDown={(e) => beginDrag("resize-start", e)}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="absolute inset-y-0 left-0 w-2 cursor-ew-resize rounded-l-[var(--ds-radius-sm)] opacity-0 transition-opacity hover:opacity-100 hover:bg-white/10"
        style={{ touchAction: "none" }}
      />
      <div
        role="presentation"
        onPointerDown={(e) => beginDrag("resize-end", e)}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="absolute inset-y-0 right-0 w-2 cursor-ew-resize rounded-r-[var(--ds-radius-sm)] opacity-0 transition-opacity hover:opacity-100 hover:bg-white/10"
        style={{ touchAction: "none" }}
      />

      <div className="pointer-events-none absolute bottom-full left-0 z-40 mb-2 hidden w-60 rounded-[var(--ds-radius)] border border-[var(--shell-border)]/60 bg-[var(--shell-glass)] p-3 text-left shadow-[var(--shell-shadow-md)] backdrop-blur-xl group-hover:block group-focus-within:block">
        <p className="text-[13px] font-semibold text-[var(--shell-text)]">
          {displayName}
        </p>
        <p className="mt-1 text-[11px] text-[var(--shell-muted)]">
          {roomLabel} · {booking.check_in} → {booking.check_out}
        </p>
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className="text-[var(--shell-muted)]">{statusLabel}</span>
          <span className="font-semibold text-[var(--shell-text)]">
            {formatBookingCurrency(Number(booking.total_price))}
          </span>
        </div>
      </div>
    </div>
  );
}
