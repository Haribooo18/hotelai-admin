import { supabase } from "@/lib/supabase";

export type Room = {
  id: string;
  hotel_id: string;
  room_type: string;
  capacity: number;
  price: number;
};

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