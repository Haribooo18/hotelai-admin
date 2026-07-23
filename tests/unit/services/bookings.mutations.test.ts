import { beforeEach, describe, expect, it, vi } from "vitest";

const getRepositoryContextMock = vi.fn();
const findAvailabilityConflictsMock = vi.fn();
const getRoomPriceMock = vi.fn();
const createMock = vi.fn();
const updateMock = vi.fn();
const rescheduleMock = vi.fn();
const deleteMock = vi.fn();
const revalidatePathMock = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: (path: string) => revalidatePathMock(path),
}));

vi.mock("@/lib/tenant/repository-context", () => ({
  getRepositoryContext: () => getRepositoryContextMock(),
}));

// bookings.mutations.ts only ever talks to BookingsRepository through its
// public interface (create/update/reschedule/delete/getRoomPrice/
// findAvailabilityConflicts) — so that's the right boundary to mock at.
// The repository's own internal Supabase query construction and guest
// linking logic are a different unit's responsibility and belong in their
// own test file, not re-verified here.
vi.mock("@/repositories/bookings.repository.server", () => ({
  createBookingsRepository: () => ({
    findAvailabilityConflicts: findAvailabilityConflictsMock,
    getRoomPrice: getRoomPriceMock,
    create: createMock,
    update: updateMock,
    reschedule: rescheduleMock,
    delete: deleteMock,
  }),
}));

import {
  createBooking,
  deleteBooking,
  rescheduleBooking,
  updateBooking,
} from "@/lib/services/bookings.mutations";

const VALID_INPUT = {
  guest_name: "Иван Иванов",
  guest_email: "ivan@example.com",
  guest_phone: "+79261234567",
  room_id: "room-1",
  check_in: "2027-01-11",
  check_out: "2027-01-15",
};

describe("bookings.mutations", () => {
  beforeEach(() => {
    getRepositoryContextMock.mockReset().mockResolvedValue({
      hotelId: "hotel-1",
      supabase: {},
    });
    findAvailabilityConflictsMock.mockReset().mockResolvedValue([]);
    getRoomPriceMock.mockReset().mockResolvedValue(100);
    createMock.mockReset().mockResolvedValue({ id: "booking-1", total_price: 400 });
    updateMock.mockReset().mockResolvedValue(undefined);
    rescheduleMock.mockReset().mockResolvedValue(undefined);
    deleteMock.mockReset().mockResolvedValue(undefined);
    revalidatePathMock.mockReset();
  });

  describe("createBooking", () => {
    it("rejects invalid input before touching the repository at all", async () => {
      await expect(
        createBooking({ ...VALID_INPUT, guest_name: "" })
      ).rejects.toThrow();

      expect(getRepositoryContextMock).not.toHaveBeenCalled();
      expect(createMock).not.toHaveBeenCalled();
    });

    it("rejects a checkout date that is not after check-in", async () => {
      await expect(
        createBooking({ ...VALID_INPUT, check_in: "2027-01-15", check_out: "2027-01-11" })
      ).rejects.toThrow();

      expect(createMock).not.toHaveBeenCalled();
    });

    it("computes total price from room price × nights and writes it, then revalidates", async () => {
      getRoomPriceMock.mockResolvedValue(150);
      // 2027-01-11 -> 2027-01-15 = 4 nights

      const result = await createBooking(VALID_INPUT);

      expect(createMock).toHaveBeenCalledWith(
        expect.objectContaining({
          room_id: "room-1",
          check_in: "2027-01-11",
          check_out: "2027-01-15",
          total_price: 600,
          status: "confirmed",
        })
      );
      expect(result).toEqual({ id: "booking-1", total_price: 400 });
      expect(revalidatePathMock).toHaveBeenCalledWith("/bookings");
      expect(revalidatePathMock).toHaveBeenCalledWith("/calendar");
    });

    it("refuses to create when the room has a conflicting booking, and never calls create", async () => {
      findAvailabilityConflictsMock.mockResolvedValue([
        {
          id: "existing-booking",
          guest_name: "Other Guest",
          check_in: "2027-01-12",
          check_out: "2027-01-13",
        },
      ]);

      await expect(createBooking(VALID_INPUT)).rejects.toThrow();

      expect(createMock).not.toHaveBeenCalled();
      expect(revalidatePathMock).not.toHaveBeenCalled();
    });

    it("allows a booking that is adjacent to an existing one (checkout meets next check-in)", async () => {
      findAvailabilityConflictsMock.mockResolvedValue([
        {
          id: "existing-booking",
          guest_name: "Other Guest",
          check_in: "2026-12-01",
          check_out: "2027-01-11", // ends exactly when the new one starts
        },
      ]);

      await expect(createBooking(VALID_INPUT)).resolves.toBeDefined();
      expect(createMock).toHaveBeenCalled();
    });
  });

  describe("updateBooking", () => {
    it("excludes the booking's own id from the availability conflict check", async () => {
      await updateBooking({ id: "booking-1", ...VALID_INPUT });

      expect(findAvailabilityConflictsMock).toHaveBeenCalledWith(
        "room-1",
        "booking-1"
      );
    });

    it("recomputes total price from the current room price on every update", async () => {
      getRoomPriceMock.mockResolvedValue(200);

      await updateBooking({ id: "booking-1", ...VALID_INPUT });

      expect(updateMock).toHaveBeenCalledWith(
        "booking-1",
        expect.objectContaining({ total_price: 800 })
      );
    });

    it("blocks the update on a real conflict with a different booking", async () => {
      findAvailabilityConflictsMock.mockResolvedValue([
        {
          id: "some-other-booking",
          guest_name: "Other Guest",
          check_in: "2027-01-12",
          check_out: "2027-01-14",
        },
      ]);

      await expect(
        updateBooking({ id: "booking-1", ...VALID_INPUT })
      ).rejects.toThrow();
      expect(updateMock).not.toHaveBeenCalled();
    });
  });

  describe("rescheduleBooking", () => {
    it("reschedules with recomputed price and revalidates", async () => {
      getRoomPriceMock.mockResolvedValue(100);

      await rescheduleBooking({
        id: "booking-1",
        room_id: "room-2",
        check_in: "2027-02-01",
        check_out: "2027-02-03",
      });

      expect(rescheduleMock).toHaveBeenCalledWith(
        "booking-1",
        expect.objectContaining({
          room_id: "room-2",
          check_in: "2027-02-01",
          check_out: "2027-02-03",
          total_price: 200,
        })
      );
      expect(revalidatePathMock).toHaveBeenCalledWith("/bookings");
    });

    it("blocks a reschedule into an occupied slot", async () => {
      findAvailabilityConflictsMock.mockResolvedValue([
        {
          id: "existing",
          guest_name: "Other Guest",
          check_in: "2027-02-01",
          check_out: "2027-02-05",
        },
      ]);

      await expect(
        rescheduleBooking({
          id: "booking-1",
          room_id: "room-2",
          check_in: "2027-02-02",
          check_out: "2027-02-03",
        })
      ).rejects.toThrow();
      expect(rescheduleMock).not.toHaveBeenCalled();
    });
  });

  describe("deleteBooking", () => {
    it("deletes and revalidates the affected pages", async () => {
      await deleteBooking("booking-1");

      expect(deleteMock).toHaveBeenCalledWith("booking-1");
      expect(revalidatePathMock).toHaveBeenCalledWith("/bookings");
      expect(revalidatePathMock).toHaveBeenCalledWith("/");
      expect(revalidatePathMock).toHaveBeenCalledWith("/calendar");
    });
  });
});
