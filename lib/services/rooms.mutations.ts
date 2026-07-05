"use server";

import { revalidatePath } from "next/cache";

import { createRoomsRepository } from "@/repositories/rooms.repository.server";
import { getRepositoryContext } from "@/lib/tenant/repository-context";
import {
  roomCreateSchema,
  roomUpdateSchema,
  type RoomCreateInput,
  type RoomUpdateInput,
} from "@/lib/validations/room";

function revalidateRooms() {
  revalidatePath("/rooms");
  revalidatePath("/bookings");
  revalidatePath("/calendar");
}

export async function createRoom(input: RoomCreateInput) {
  const parsed = roomCreateSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const ctx = await getRepositoryContext();
  await createRoomsRepository(ctx).create({
    room_type: parsed.data.room_type,
    capacity: parsed.data.capacity,
    price: parsed.data.price,
  });

  revalidateRooms();
}

export async function updateRoom(input: RoomUpdateInput) {
  const parsed = roomUpdateSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const ctx = await getRepositoryContext();
  await createRoomsRepository(ctx).update(parsed.data.id, {
    room_type: parsed.data.room_type,
    capacity: parsed.data.capacity,
    price: parsed.data.price,
  });

  revalidateRooms();
}

export async function deleteRoom(id: string) {
  const ctx = await getRepositoryContext();
  await createRoomsRepository(ctx).delete(id);
  revalidateRooms();
}
