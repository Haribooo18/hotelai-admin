import { createRoomsRepository } from "@/repositories/rooms.repository.server";
import { getRepositoryContext } from "@/lib/tenant/repository-context";

import type { Room } from "@/types/room";

export async function getRooms(): Promise<Room[]> {
  const ctx = await getRepositoryContext();
  return createRoomsRepository(ctx).getAll();
}

export async function getRoom(id: string): Promise<Room | null> {
  const ctx = await getRepositoryContext();
  return createRoomsRepository(ctx).getById(id);
}

export async function getAvailableRooms() {
  const ctx = await getRepositoryContext();
  return createRoomsRepository(ctx).getAvailableSummaries();
}
