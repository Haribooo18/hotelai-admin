import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { Room } from "@/types/room";

import { createBookingsRepositoryClient } from "./bookings.repository.client";
import { createGuestsRepositoryClient } from "./guests.repository.client";
import { createRoomsRepositoryClient } from "./rooms.repository.client";

export type DashboardSupplementData = {
  bookings: Booking[];
  rooms: Room[];
  guests: Guest[];
};

export async function loadDashboardSupplement(
  hotelId: string
): Promise<DashboardSupplementData> {
  const bookingsRepo = createBookingsRepositoryClient(hotelId);
  const roomsRepo = createRoomsRepositoryClient(hotelId);
  const guestsRepo = createGuestsRepositoryClient(hotelId);

  const [bookings, rooms, guests] = await Promise.all([
    bookingsRepo.getAll(),
    roomsRepo.getAll(),
    guestsRepo.getAll(),
  ]);

  return { bookings, rooms, guests };
}
