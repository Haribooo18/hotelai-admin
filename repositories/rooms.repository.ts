import type { Room } from "@/types/room";

import {
  throwRepositoryError,
  type RepositoryContext,
} from "./context.types";

type RoomInsertRow = {
  room_type: string;
  capacity: number;
  price: number;
};

type RoomUpdateRow = {
  room_type: string;
  capacity: number;
  price: number;
};

export type AvailableRoomSummary = {
  id: string;
  room_type: string;
  price: number;
};

export class RoomsRepository {
  constructor(private readonly ctx: RepositoryContext) {}

  async getAll(): Promise<Room[]> {
    const { data, error } = await this.ctx.supabase
      .from("rooms")
      .select("*")
      .eq("hotel_id", this.ctx.hotelId)
      .order("room_type", { ascending: true });

    if (error) throwRepositoryError(error);

    return (data ?? []) as Room[];
  }

  async getById(id: string): Promise<Room | null> {
    const { data, error } = await this.ctx.supabase
      .from("rooms")
      .select("*")
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId)
      .maybeSingle();

    if (error) throwRepositoryError(error);

    return (data as Room | null) ?? null;
  }

  async create(row: RoomInsertRow): Promise<void> {
    const { error } = await this.ctx.supabase.from("rooms").insert({
      hotel_id: this.ctx.hotelId,
      ...row,
    });

    if (error) throwRepositoryError(error);
  }

  async update(id: string, row: RoomUpdateRow): Promise<void> {
    const { error } = await this.ctx.supabase
      .from("rooms")
      .update(row)
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.ctx.supabase
      .from("rooms")
      .delete()
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId);

    if (error) throwRepositoryError(error);
  }

  async getAvailableSummaries(): Promise<AvailableRoomSummary[]> {
    const { data, error } = await this.ctx.supabase
      .from("rooms")
      .select("id, room_type, price")
      .eq("hotel_id", this.ctx.hotelId)
      .order("room_type", { ascending: true });

    if (error) throwRepositoryError(error);

    return (data ?? []) as AvailableRoomSummary[];
  }
}
