"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getCurrentHotelId } from "@/lib/tenant";
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

  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { error } = await supabase.from("rooms").insert({
    hotel_id: hotelId,
    room_type: parsed.data.room_type,
    capacity: parsed.data.capacity,
    price: parsed.data.price,
  });

  if (error) {
    throw error;
  }

  revalidateRooms();
}

export async function updateRoom(input: RoomUpdateInput) {
  const parsed = roomUpdateSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { error } = await supabase
    .from("rooms")
    .update({
      room_type: parsed.data.room_type,
      capacity: parsed.data.capacity,
      price: parsed.data.price,
    })
    .eq("id", parsed.data.id)
    .eq("hotel_id", hotelId);

  if (error) {
    throw error;
  }

  revalidateRooms();
}

export async function deleteRoom(id: string) {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { error } = await supabase
    .from("rooms")
    .delete()
    .eq("id", id)
    .eq("hotel_id", hotelId);

  if (error) {
    throw error;
  }

  revalidateRooms();
}
