import { createRoomsRepository } from "@/repositories/rooms.repository.server";

import type { Room } from "@/types/room";

export async function getRooms(): Promise<Room[]> {
  const repo = await createRoomsRepository();
  return repo.getAll();
}

export async function getRoom(id: string): Promise<Room | null> {
  const repo = await createRoomsRepository();
  return repo.getById(id);
}

export async function getAvailableRooms() {
  const repo = await createRoomsRepository();
  return repo.getAvailableSummaries();
}
