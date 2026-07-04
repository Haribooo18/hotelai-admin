"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

type CreateRoomInput = {
  hotel_id: string;
  room_type: string;
  capacity: number;
  price: number;
};

type UpdateRoomInput = {
  id: string;
  room_type: string;
  capacity: number;
  price: number;
};

export async function createRoom(input: CreateRoomInput) {
  const { error } = await supabase
    .from("rooms")
    .insert({
      hotel_id: input.hotel_id,
      room_type: input.room_type,
      capacity: input.capacity,
      price: input.price,
    });

  if (error) {
    throw error;
  }

  revalidatePath("/rooms");
}

export async function updateRoom(input: UpdateRoomInput) {
  const { error } = await supabase
    .from("rooms")
    .update({
      room_type: input.room_type,
      capacity: input.capacity,
      price: input.price,
    })
    .eq("id", input.id);

  if (error) {
    throw error;
  }

  revalidatePath("/rooms");
}

export async function deleteRoom(id: string) {
  const { error } = await supabase
    .from("rooms")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  revalidatePath("/rooms");
}