import { createClient } from "@/lib/supabase/server";
import { getCurrentHotelId } from "@/lib/tenant";

import type { Room } from "@/types/room";

export async function getRooms(): Promise<Room[]> {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("hotel_id", hotelId)
    .order("room_type", { ascending: true });

  if (error) {
    throw new Error(
      `${error.code}: ${error.message}${
        error.details ? ` (${error.details})` : ""
      }`
    );
  }

  return (data ?? []) as Room[];
}

export async function getRoom(id: string): Promise<Room | null> {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", id)
    .eq("hotel_id", hotelId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `${error.code}: ${error.message}${
        error.details ? ` (${error.details})` : ""
      }`
    );
  }

  return (data as Room | null) ?? null;
}

export async function getAvailableRooms() {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { data, error } = await supabase
    .from("rooms")
    .select("id, room_type, price")
    .eq("hotel_id", hotelId)
    .order("room_type", { ascending: true });

  if (error) {
    throw new Error(
      `${error.code}: ${error.message}${
        error.details ? ` (${error.details})` : ""
      }`
    );
  }

  return data ?? [];
}
