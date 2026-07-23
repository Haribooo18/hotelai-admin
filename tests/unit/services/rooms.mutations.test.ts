import { beforeEach, describe, expect, it, vi } from "vitest";

const getRepositoryContextMock = vi.fn();
const createMock = vi.fn();
const updateMock = vi.fn();
const deleteMock = vi.fn();
const revalidatePathMock = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: (path: string) => revalidatePathMock(path),
}));

vi.mock("@/lib/tenant/repository-context", () => ({
  getRepositoryContext: () => getRepositoryContextMock(),
}));

vi.mock("@/repositories/rooms.repository.server", () => ({
  createRoomsRepository: () => ({
    create: createMock,
    update: updateMock,
    delete: deleteMock,
  }),
}));

import { createRoom, deleteRoom, updateRoom } from "@/lib/services/rooms.mutations";

describe("rooms.mutations", () => {
  beforeEach(() => {
    getRepositoryContextMock.mockReset().mockResolvedValue({ hotelId: "hotel-1", supabase: {} });
    createMock.mockReset().mockResolvedValue(undefined);
    updateMock.mockReset().mockResolvedValue(undefined);
    deleteMock.mockReset().mockResolvedValue(undefined);
    revalidatePathMock.mockReset();
  });

  describe("createRoom", () => {
    it("rejects an empty room type before touching the repository", async () => {
      await expect(
        createRoom({ room_type: "", capacity: 2, price: 100 })
      ).rejects.toThrow();
      expect(createMock).not.toHaveBeenCalled();
    });

    it("rejects zero or negative price", async () => {
      await expect(
        createRoom({ room_type: "Standard", capacity: 2, price: 0 })
      ).rejects.toThrow();
      expect(createMock).not.toHaveBeenCalled();
    });

    it("rejects zero capacity", async () => {
      await expect(
        createRoom({ room_type: "Standard", capacity: 0, price: 100 })
      ).rejects.toThrow();
      expect(createMock).not.toHaveBeenCalled();
    });

    it("coerces string capacity/price from a form submission into numbers", async () => {
      await createRoom({
        room_type: "Family",
        capacity: "3" as unknown as number,
        price: "150.50" as unknown as number,
      });

      expect(createMock).toHaveBeenCalledWith({
        room_type: "Family",
        capacity: 3,
        price: 150.5,
      });
    });

    it("revalidates /rooms, /bookings, and /calendar — a new room changes availability everywhere", async () => {
      await createRoom({ room_type: "Standard", capacity: 2, price: 100 });

      expect(revalidatePathMock).toHaveBeenCalledWith("/rooms");
      expect(revalidatePathMock).toHaveBeenCalledWith("/bookings");
      expect(revalidatePathMock).toHaveBeenCalledWith("/calendar");
    });
  });

  describe("updateRoom", () => {
    it("requires an id", async () => {
      await expect(
        updateRoom({ id: "", room_type: "Standard", capacity: 2, price: 100 })
      ).rejects.toThrow();
      expect(updateMock).not.toHaveBeenCalled();
    });

    it("passes only the mutable fields through to the repository, keyed by id", async () => {
      await updateRoom({ id: "room-1", room_type: "Deluxe", capacity: 4, price: 250 });

      expect(updateMock).toHaveBeenCalledWith("room-1", {
        room_type: "Deluxe",
        capacity: 4,
        price: 250,
      });
    });
  });

  describe("deleteRoom", () => {
    it("deletes and revalidates every route that shows room/availability data", async () => {
      await deleteRoom("room-1");

      expect(deleteMock).toHaveBeenCalledWith("room-1");
      expect(revalidatePathMock).toHaveBeenCalledWith("/rooms");
      expect(revalidatePathMock).toHaveBeenCalledWith("/bookings");
      expect(revalidatePathMock).toHaveBeenCalledWith("/calendar");
    });
  });
});
