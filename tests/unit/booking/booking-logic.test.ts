import { describe, expect, it } from "vitest";

import {
  calculateTotalPrice,
  countBookingNights,
  findAvailabilityConflict,
  formatAvailabilityConflictError,
} from "@/lib/booking-logic";

describe("calculateTotalPrice", () => {
  it("charges one night for same-day turnover", () => {
    expect(calculateTotalPrice(100, "2026-07-01", "2026-07-02")).toBe(100);
    expect(countBookingNights("2026-07-01", "2026-07-02")).toBe(1);
  });

  it("multiplies room price by night count", () => {
    expect(calculateTotalPrice(120, "2026-07-01", "2026-07-04")).toBe(360);
    expect(countBookingNights("2026-07-01", "2026-07-04")).toBe(3);
  });

  it("enforces a minimum of one night", () => {
    expect(calculateTotalPrice(200, "2026-07-05", "2026-07-05")).toBe(200);
    expect(countBookingNights("2026-07-05", "2026-07-05")).toBe(1);
  });

  it("supports decimal room prices", () => {
    expect(calculateTotalPrice(99.5, "2026-07-01", "2026-07-03")).toBe(199);
  });
});

describe("ensureRoomAvailable overlap logic", () => {
  const existing = [
    {
      id: "b1",
      guest_name: "Анна",
      check_in: "2026-07-10",
      check_out: "2026-07-15",
    },
  ];

  it("allows booking when room is available", () => {
    expect(
      findAvailabilityConflict(existing, "2026-07-01", "2026-07-05")
    ).toBeUndefined();
  });

  it("rejects overlapping booking", () => {
    const conflict = findAvailabilityConflict(
      existing,
      "2026-07-12",
      "2026-07-18"
    );
    expect(conflict?.id).toBe("b1");
    expect(formatAvailabilityConflictError(conflict!)).toBe(
      "Room is already booked (2026-07-10 — 2026-07-15)"
    );
  });

  it("allows adjacent booking (checkout meets next check-in)", () => {
    expect(
      findAvailabilityConflict(existing, "2026-07-15", "2026-07-18")
    ).toBeUndefined();
  });

  it("ignores cancelled bookings excluded before conflict check", () => {
    const withCancelled = [
      ...existing,
      {
        id: "b-cancelled",
        guest_name: "Отмена",
        check_in: "2026-07-20",
        check_out: "2026-07-25",
      },
    ];

    const activeOnly = withCancelled.filter((b) => b.id !== "b-cancelled");

    expect(
      findAvailabilityConflict(activeOnly, "2026-07-21", "2026-07-22")
    ).toBeUndefined();
  });
});
