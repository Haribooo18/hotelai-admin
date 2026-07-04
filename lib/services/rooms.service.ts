import { supabase } from "@/lib/supabase";
import type { Room } from "@/types/room";

export async function getRooms(): Promise<Room[]> {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .order("room_type", { ascending: true });

  if (error) {
    console.error("Failed to load rooms:", error);
    return [];
  }

  return (data ?? []) as Room[];
}

export async function getAvailableRooms() {
  const { data, error } = await supabase
    .from("rooms")
    .select("id, room_type, price")
    .order("room_type", { ascending: true });

  if (error) {
    console.error("Failed to load available rooms:", error);
    return [];
  }

  return data ?? [];
}