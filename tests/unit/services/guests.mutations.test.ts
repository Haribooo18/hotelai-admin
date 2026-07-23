import { beforeEach, describe, expect, it, vi } from "vitest";

const getRepositoryContextMock = vi.fn();
const createMock = vi.fn();
const updateMock = vi.fn();
const deleteMock = vi.fn();
const setFavoriteMock = vi.fn();
const setVipMock = vi.fn();
const getByIdsMock = vi.fn();
const updateMergedGuestMock = vi.fn();
const revalidatePathMock = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: (path: string) => revalidatePathMock(path),
}));

vi.mock("@/lib/tenant/repository-context", () => ({
  getRepositoryContext: () => getRepositoryContextMock(),
}));

vi.mock("@/repositories/guests.repository.server", () => ({
  createGuestsRepository: () => ({
    create: createMock,
    update: updateMock,
    delete: deleteMock,
    setFavorite: setFavoriteMock,
    setVip: setVipMock,
    getByIds: getByIdsMock,
    updateMergedGuest: updateMergedGuestMock,
  }),
}));

import {
  createGuest,
  deleteGuest,
  mergeGuests,
  setGuestFavorite,
  setGuestVip,
  updateGuest,
} from "@/lib/services/guests.mutations";

const VALID_INPUT = {
  first_name: "Иван",
  last_name: "Иванов",
  email: "ivan@example.com",
  phone: "+79261234567",
  country: "Russia",
  city: "Moscow",
  notes: "",
  avatar_url: "",
  tags: ["vip-guest"],
  is_vip: false,
  is_favorite: false,
};

function guestFixture(overrides: Record<string, unknown> = {}) {
  return {
    id: "guest-1",
    first_name: "Иван",
    last_name: "Иванов",
    email: "ivan@example.com",
    phone: "+79261234567",
    country: "Russia",
    city: "Moscow",
    notes: null,
    tags: [] as string[],
    is_vip: false,
    is_favorite: false,
    total_bookings: 0,
    total_spent: 0,
    ...overrides,
  };
}

describe("guests.mutations", () => {
  beforeEach(() => {
    getRepositoryContextMock.mockReset().mockResolvedValue({ hotelId: "hotel-1", supabase: {} });
    createMock.mockReset().mockResolvedValue(undefined);
    updateMock.mockReset().mockResolvedValue(undefined);
    deleteMock.mockReset().mockResolvedValue(undefined);
    setFavoriteMock.mockReset().mockResolvedValue(undefined);
    setVipMock.mockReset().mockResolvedValue(undefined);
    getByIdsMock.mockReset();
    updateMergedGuestMock.mockReset().mockResolvedValue(undefined);
    revalidatePathMock.mockReset();
  });

  describe("createGuest", () => {
    it("rejects invalid input before touching the repository", async () => {
      await expect(createGuest({ ...VALID_INPUT, first_name: "" })).rejects.toThrow();
      expect(createMock).not.toHaveBeenCalled();
    });

    it("normalizes empty optional strings to null and revalidates /guests", async () => {
      await createGuest({ ...VALID_INPUT, notes: "", avatar_url: "" });

      expect(createMock).toHaveBeenCalledWith(
        expect.objectContaining({ notes: null, avatar_url: null })
      );
      expect(revalidatePathMock).toHaveBeenCalledWith("/guests");
    });
  });

  describe("updateGuest", () => {
    it("revalidates both the list and the guest's own detail page", async () => {
      await updateGuest({ id: "guest-1", ...VALID_INPUT });

      expect(updateMock).toHaveBeenCalledWith("guest-1", expect.any(Object));
      expect(revalidatePathMock).toHaveBeenCalledWith("/guests");
      expect(revalidatePathMock).toHaveBeenCalledWith("/guests/guest-1");
    });
  });

  describe("deleteGuest / setGuestFavorite / setGuestVip", () => {
    it("soft-deletes and revalidates the guest's own page", async () => {
      await deleteGuest("guest-1");
      expect(deleteMock).toHaveBeenCalledWith("guest-1");
      expect(revalidatePathMock).toHaveBeenCalledWith("/guests/guest-1");
    });

    it("toggles favorite", async () => {
      await setGuestFavorite("guest-1", true);
      expect(setFavoriteMock).toHaveBeenCalledWith("guest-1", true);
    });

    it("toggles VIP", async () => {
      await setGuestVip("guest-1", true);
      expect(setVipMock).toHaveBeenCalledWith("guest-1", true);
    });
  });

  describe("mergeGuests", () => {
    it("refuses to merge a guest with itself, without calling the repository at all", async () => {
      await expect(
        mergeGuests({ targetId: "guest-1", sourceId: "guest-1" })
      ).rejects.toThrow();
      expect(getRepositoryContextMock).not.toHaveBeenCalled();
    });

    it("throws if either guest can't be found", async () => {
      getByIdsMock.mockResolvedValue([guestFixture({ id: "guest-1" })]); // source missing

      await expect(
        mergeGuests({ targetId: "guest-1", sourceId: "guest-2" })
      ).rejects.toThrow();
      expect(updateMergedGuestMock).not.toHaveBeenCalled();
    });

    it("unions tags without duplicates", async () => {
      getByIdsMock.mockResolvedValue([
        guestFixture({ id: "guest-1", tags: ["vip", "returning"] }),
        guestFixture({ id: "guest-2", tags: ["returning", "corporate"] }),
      ]);

      await mergeGuests({ targetId: "guest-1", sourceId: "guest-2" });

      const call = updateMergedGuestMock.mock.calls[0][1];
      expect(new Set(call.tags)).toEqual(new Set(["vip", "returning", "corporate"]));
      expect(call.tags).toHaveLength(3);
    });

    it("concatenates notes from both guests, skipping empty ones", async () => {
      getByIdsMock.mockResolvedValue([
        guestFixture({ id: "guest-1", notes: "Prefers high floor." }),
        guestFixture({ id: "guest-2", notes: "Allergic to nuts." }),
      ]);

      await mergeGuests({ targetId: "guest-1", sourceId: "guest-2" });

      const call = updateMergedGuestMock.mock.calls[0][1];
      expect(call.notes).toBe("Prefers high floor.\n---\nAllergic to nuts.");
    });

    it("does not add a separator when only one guest has notes", async () => {
      getByIdsMock.mockResolvedValue([
        guestFixture({ id: "guest-1", notes: null }),
        guestFixture({ id: "guest-2", notes: "Allergic to nuts." }),
      ]);

      await mergeGuests({ targetId: "guest-1", sourceId: "guest-2" });

      const call = updateMergedGuestMock.mock.calls[0][1];
      expect(call.notes).toBe("Allergic to nuts.");
    });

    it("fills missing target contact fields from the source, but never overwrites existing ones", async () => {
      getByIdsMock.mockResolvedValue([
        guestFixture({ id: "guest-1", email: null, phone: "+79261111111" }),
        guestFixture({ id: "guest-2", email: "source@example.com", phone: "+79262222222" }),
      ]);

      await mergeGuests({ targetId: "guest-1", sourceId: "guest-2" });

      const call = updateMergedGuestMock.mock.calls[0][1];
      expect(call.email).toBe("source@example.com"); // target had none, filled from source
      expect(call.phone).toBe("+79261111111"); // target already had one, kept
    });

    it("is VIP/favorite if either guest was", async () => {
      getByIdsMock.mockResolvedValue([
        guestFixture({ id: "guest-1", is_vip: false, is_favorite: true }),
        guestFixture({ id: "guest-2", is_vip: true, is_favorite: false }),
      ]);

      await mergeGuests({ targetId: "guest-1", sourceId: "guest-2" });

      const call = updateMergedGuestMock.mock.calls[0][1];
      expect(call.is_vip).toBe(true);
      expect(call.is_favorite).toBe(true);
    });

    it("sums total_bookings and total_spent numerically, not as strings", async () => {
      getByIdsMock.mockResolvedValue([
        guestFixture({ id: "guest-1", total_bookings: 3, total_spent: "150.50" }),
        guestFixture({ id: "guest-2", total_bookings: 2, total_spent: "99.50" }),
      ]);

      await mergeGuests({ targetId: "guest-1", sourceId: "guest-2" });

      const call = updateMergedGuestMock.mock.calls[0][1];
      expect(call.total_bookings).toBe(5);
      expect(call.total_spent).toBe(250);
    });

    it("soft-deletes the source guest and revalidates the target's page, not the source's", async () => {
      getByIdsMock.mockResolvedValue([
        guestFixture({ id: "guest-1" }),
        guestFixture({ id: "guest-2" }),
      ]);

      await mergeGuests({ targetId: "guest-1", sourceId: "guest-2" });

      expect(deleteMock).toHaveBeenCalledWith("guest-2");
      expect(revalidatePathMock).toHaveBeenCalledWith("/guests/guest-1");
      expect(revalidatePathMock).not.toHaveBeenCalledWith("/guests/guest-2");
    });
  });
});
