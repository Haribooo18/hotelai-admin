import type { Room } from "@/types/room";
import type { DbRoomRow } from "@/types/database/generated";
import {
  resolveHousekeepingStatus,
  resolveMaintenanceStatus,
  resolveRoomTypeName,
  toRoom,
  type DbRoomRowWithType,
} from "@/lib/database/mappers";

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

const ROOM_SELECT = "*, room_types(name)";

export class RoomsRepository {
  constructor(private readonly ctx: RepositoryContext) {}

  private async resolveRoomTypeId(roomType: string): Promise<string | null> {
    const name = roomType.trim();
    if (!name) return null;

    const { data: existing, error: lookupError } = await this.ctx.supabase
      .from("room_types")
      .select("id")
      .eq("hotel_id", this.ctx.hotelId)
      .eq("name", name)
      .maybeSingle();

    if (lookupError) throwRepositoryError(lookupError);
    if (existing?.id) return existing.id as string;

    const { data, error } = await this.ctx.supabase
      .from("room_types")
      .insert({ hotel_id: this.ctx.hotelId, name })
      .select("id")
      .single();

    if (error) throwRepositoryError(error);

    return data.id as string;
  }

  private mapRoom(row: DbRoomRowWithType): Room {
    return toRoom(row);
  }

  private async getRawById(id: string): Promise<DbRoomRow | null> {
    const { data, error } = await this.ctx.supabase
      .from("rooms")
      .select("*")
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId)
      .maybeSingle();

    if (error) throwRepositoryError(error);

    return (data as DbRoomRow | null) ?? null;
  }

  async getAll(): Promise<Room[]> {
    const { data, error } = await this.ctx.supabase
      .from("rooms")
      .select(ROOM_SELECT)
      .eq("hotel_id", this.ctx.hotelId)
      .order("room_type", { ascending: true });

    if (error) throwRepositoryError(error);

    return ((data ?? []) as DbRoomRowWithType[]).map((row) => this.mapRoom(row));
  }

  async getById(id: string): Promise<Room | null> {
    const { data, error } = await this.ctx.supabase
      .from("rooms")
      .select(ROOM_SELECT)
      .eq("id", id)
      .eq("hotel_id", this.ctx.hotelId)
      .maybeSingle();

    if (error) throwRepositoryError(error);

    return data ? this.mapRoom(data as DbRoomRowWithType) : null;
  }

  async create(row: RoomInsertRow): Promise<void> {
    const roomTypeId = await this.resolveRoomTypeId(row.room_type);

    const { error } = await this.ctx.supabase.from("rooms").insert({
      hotel_id: this.ctx.hotelId,
      ...row,
      room_type_id: roomTypeId,
      housekeeping_status: "clean",
      maintenance_status: "operational",
    });

    if (error) throwRepositoryError(error);
  }

  async update(id: string, row: RoomUpdateRow): Promise<void> {
    const existing = await this.getRawById(id);
    const roomTypeId = await this.resolveRoomTypeId(row.room_type);

    const { error } = await this.ctx.supabase
      .from("rooms")
      .update({
        ...row,
        room_type_id: roomTypeId,
        housekeeping_status: existing
          ? resolveHousekeepingStatus(existing)
          : "clean",
        maintenance_status: existing
          ? resolveMaintenanceStatus(existing)
          : "operational",
      })
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
      .select("id, room_type, room_type_id, price, room_types(name)")
      .eq("hotel_id", this.ctx.hotelId)
      .order("room_type", { ascending: true });

    if (error) throwRepositoryError(error);

    return ((data ?? []) as unknown as Array<{
      id: string;
      room_type: string;
      room_type_id: string | null;
      price: number;
      room_types?: { name: string } | { name: string }[] | null;
    }>).map((row) => ({
      id: row.id,
      room_type: resolveRoomTypeName(row),
      price: Number(row.price),
    }));
  }
}
