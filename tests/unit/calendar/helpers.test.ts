import { describe, expect, it } from "vitest";

import {
  buildDays,
  computeOccupancy,
  hasRoomConflict,
  placeBooking,
  startOfMonth,
} from "@/lib/calendar";
import type { Booking } from "@/types/booking";

function makeBooking(
  overrides: Partial<Booking> & Pick<Booking, "check_in" | "check_out">
): Booking {
  return {
    id: "b1",
    hotel_id: "hotel_1",
    room_id: "room_1",
    guest_name: "Guest",
    guest_email: null,
    guest_phone: null,
    adults: 2,
    children: 0,
    total_price: 100,
    status: "confirmed",
    created_at: "2026-07-01T00:00:00.000Z",
    updated_at: "2026-07-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("placeBooking", () => {
  const july2026 = buildDays("month", startOfMonth(new Date(2026, 6, 15)));

  it("places a booking fully inside the visible range", () => {
    const placement = placeBooking(
      { check_in: "2026-07-05", check_out: "2026-07-08" },
      july2026
    );

    expect(placement).toEqual({
      startIndex: 4,
      span: 3,
      clippedStart: false,
      clippedEnd: false,
    });
  });

  it("returns null when booking is outside the range", () => {
    expect(
      placeBooking({ check_in: "2026-08-01", check_out: "2026-08-03" }, july2026)
    ).toBeNull();
  });

  it("clips bars that extend beyond the visible range", () => {
    const placement = placeBooking(
      { check_in: "2026-06-28", check_out: "2026-07-03" },
      july2026
    );

    expect(placement?.startIndex).toBe(0);
    expect(placement?.clippedStart).toBe(true);
    expect(placement?.span).toBe(2);
  });

  it("returns null for empty day range", () => {
    expect(
      placeBooking({ check_in: "2026-07-01", check_out: "2026-07-03" }, [])
    ).toBeNull();
  });
});

describe("hasRoomConflict", () => {
  const bookings = [
    makeBooking({
      id: "b1",
      room_id: "room_a",
      check_in: "2026-07-10",
      check_out: "2026-07-15",
    }),
    makeBooking({
      id: "b2",
      room_id: "room_b",
      check_in: "2026-07-10",
      check_out: "2026-07-12",
    }),
    makeBooking({
      id: "b3",
      room_id: "room_a",
      check_in: "2026-07-20",
      check_out: "2026-07-22",
      status: "cancelled",
    }),
  ];

  it("detects overlap in the same room", () => {
    expect(
      hasRoomConflict(bookings, "room_a", "2026-07-12", "2026-07-18")
    ).toBe(true);
  });

  it("allows adjacent stays", () => {
    expect(
      hasRoomConflict(bookings, "room_a", "2026-07-15", "2026-07-18")
    ).toBe(false);
  });

  it("ignores cancelled bookings", () => {
    expect(
      hasRoomConflict(bookings, "room_a", "2026-07-20", "2026-07-21")
    ).toBe(false);
  });

  it("ignores the booking being edited", () => {
    expect(
      hasRoomConflict(bookings, "room_a", "2026-07-11", "2026-07-12", "b1")
    ).toBe(false);
  });
});

describe("computeOccupancy", () => {
  const days = [new Date(2026, 6, 10), new Date(2026, 6, 11)];

  it("counts unique occupied rooms per day", () => {
    const bookings = [
      makeBooking({
        id: "b1",
        room_id: "r1",
        check_in: "2026-07-10",
        check_out: "2026-07-12",
      }),
      makeBooking({
        id: "b2",
        room_id: "r2",
        check_in: "2026-07-10",
        check_out: "2026-07-11",
      }),
      makeBooking({
        id: "b3",
        room_id: "r3",
        check_in: "2026-07-09",
        check_out: "2026-07-10",
        status: "cancelled",
      }),
    ];

    const occupancy = computeOccupancy(bookings, 4, days);

    expect(occupancy[0]?.occupied).toBe(2);
    expect(occupancy[0]?.ratio).toBe(0.5);
    expect(occupancy[1]?.occupied).toBe(1);
    expect(occupancy[1]?.ratio).toBe(0.25);
  });

  it("returns zero occupancy when there are no rooms", () => {
    const occupancy = computeOccupancy([], 0, days);
    expect(occupancy[0]?.ratio).toBe(0);
  });

  it("returns zero occupancy when there are no bookings", () => {
    const occupancy = computeOccupancy([], 3, days);
    expect(occupancy.every((day) => day.occupied === 0)).toBe(true);
  });
});

describe("calendar edge cases", () => {
  it("handles single-night booking spanning one visible day", () => {
    const days = [new Date(2026, 6, 5)];
    const placement = placeBooking(
      { check_in: "2026-07-05", check_out: "2026-07-06" },
      days
    );

    expect(placement?.span).toBe(1);
    expect(placement?.startIndex).toBe(0);
  });

  it("uses half-open interval for end-exclusive checkout day", () => {
    const bookings = [
      makeBooking({
        id: "b1",
        room_id: "room_a",
        check_in: "2026-07-05",
        check_out: "2026-07-06",
      }),
    ];

    expect(
      hasRoomConflict(bookings, "room_a", "2026-07-06", "2026-07-07")
    ).toBe(false);
  });
});
