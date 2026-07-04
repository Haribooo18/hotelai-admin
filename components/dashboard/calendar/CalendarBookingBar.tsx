"use client";

import { useRef, useState } from "react";

import type { Booking } from "@/types/booking";
import { cn } from "@/lib/utils";
import { getBookingStatusMeta } from "@/lib/booking-status";
import {
  DAY_WIDTH,
  addDays,
  parseISODate,
  toISODate,
  type BookingPlacement,
} from "@/lib/calendar";

type DragMode = "move" | "resize-start" | "resize-end";

type Props = {
  booking: Booking;
  placement: BookingPlacement;
  onReschedule: (
    booking: Booking,
    next: { check_in: string; check_out: string }
  ) => void;
  onOpen: (booking: Booking) => void;
};

export function CalendarBookingBar({
  booking,
  placement,
  onReschedule,
  onOpen,
}: Props) {
  const meta = getBookingStatusMeta(booking.status);
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

  const nights = Math.max(
    1,
    Math.round(
      (parseISODate(booking.check_out).getTime() -
        parseISODate(booking.check_in).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div
      className="group absolute top-2 z-10 h-12"
      style={{
        left,
        width,
        touchAction: "none",
        zIndex: drag ? 30 : undefined,
      }}
    >
      <button
        type="button"
        aria-label={`Бронирование ${booking.guest_name}, ${booking.check_in} — ${booking.check_out}. Стрелки — перенос, Shift+стрелки — длительность, Enter — детали.`}
        onPointerDown={(e) => beginDrag("move", e)}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
        onClick={() => {
          if (!movedRef.current) onOpen(booking);
        }}
        className={cn(
          "flex h-full w-full cursor-grab items-center overflow-hidden rounded-lg px-3 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 active:cursor-grabbing",
          meta?.barClassName ?? "bg-emerald-600 text-white",
          placement.clippedStart && "rounded-l-none",
          placement.clippedEnd && "rounded-r-none"
        )}
      >
        <span className="truncate">{booking.guest_name}</span>
      </button>

      {/* Resize handles */}
      <div
        role="presentation"
        onPointerDown={(e) => beginDrag("resize-start", e)}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="absolute inset-y-0 left-0 w-2 cursor-ew-resize rounded-l-lg hover:bg-white/20"
        style={{ touchAction: "none" }}
      />
      <div
        role="presentation"
        onPointerDown={(e) => beginDrag("resize-end", e)}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="absolute inset-y-0 right-0 w-2 cursor-ew-resize rounded-r-lg hover:bg-white/20"
        style={{ touchAction: "none" }}
      />

      {/* Hover / focus summary card */}
      <div className="pointer-events-none absolute bottom-full left-0 z-40 mb-2 hidden w-56 rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-left shadow-xl group-hover:block group-focus-within:block">
        <p className="font-semibold text-white">{booking.guest_name}</p>
        <p className="mt-1 text-xs text-zinc-400">
          {booking.check_in} → {booking.check_out} · {nights} ноч.
        </p>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-zinc-400">{meta?.label ?? booking.status}</span>
          <span className="font-semibold text-white">
            ${booking.total_price}
          </span>
        </div>
      </div>
    </div>
  );
}
