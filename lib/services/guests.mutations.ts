"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getCurrentHotelId } from "@/lib/tenant";
import {
  guestCreateSchema,
  guestUpdateSchema,
  type GuestCreateInput,
  type GuestUpdateInput,
} from "@/lib/validations/guest";
import type { Guest } from "@/types/guest";

function revalidateGuests(id?: string) {
  revalidatePath("/guests");
  if (id) revalidatePath(`/guests/${id}`);
}

function toRow(data: Omit<GuestUpdateInput, "id">) {
  return {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email || null,
    phone: data.phone || null,
    country: data.country || null,
    city: data.city || null,
    notes: data.notes || null,
    avatar_url: data.avatar_url || null,
    tags: data.tags,
    is_vip: data.is_vip,
    is_favorite: data.is_favorite,
  };
}

export async function createGuest(input: GuestCreateInput) {
  const parsed = guestCreateSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { error } = await supabase.from("guests").insert({
    hotel_id: hotelId,
    total_bookings: 0,
    total_spent: 0,
    ...toRow(parsed.data),
  });

  if (error) throw error;

  revalidateGuests();
}

export async function updateGuest(input: GuestUpdateInput) {
  const parsed = guestUpdateSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const { id, ...rest } = parsed.data;

  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { error } = await supabase
    .from("guests")
    .update(toRow(rest))
    .eq("id", id)
    .eq("hotel_id", hotelId);

  if (error) throw error;

  revalidateGuests(id);
}

/** Soft delete — marks the guest as deleted, preserving history. */
export async function deleteGuest(id: string) {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { error } = await supabase
    .from("guests")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("hotel_id", hotelId);

  if (error) throw error;

  revalidateGuests(id);
}

export async function setGuestFavorite(id: string, value: boolean) {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { error } = await supabase
    .from("guests")
    .update({ is_favorite: value })
    .eq("id", id)
    .eq("hotel_id", hotelId);

  if (error) throw error;

  revalidateGuests(id);
}

export async function setGuestVip(id: string, value: boolean) {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { error } = await supabase
    .from("guests")
    .update({ is_vip: value })
    .eq("id", id)
    .eq("hotel_id", hotelId);

  if (error) throw error;

  revalidateGuests(id);
}

/**
 * Merges the source guest into the target: unions tags, concatenates notes,
 * fills missing target contact fields from the source, then soft-deletes source.
 */
export async function mergeGuests(input: {
  targetId: string;
  sourceId: string;
}) {
  if (input.targetId === input.sourceId) {
    throw new Error("Нельзя объединить гостя с самим собой");
  }

  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .in("id", [input.targetId, input.sourceId])
    .eq("hotel_id", hotelId)
    .is("deleted_at", null);

  if (error) throw error;

  const guests = (data ?? []) as Guest[];
  const target = guests.find((g) => g.id === input.targetId);
  const source = guests.find((g) => g.id === input.sourceId);

  if (!target || !source) {
    throw new Error("Гость не найден");
  }

  const mergedTags = Array.from(
    new Set([...(target.tags ?? []), ...(source.tags ?? [])])
  );

  const mergedNotes = [target.notes, source.notes]
    .filter((n): n is string => Boolean(n && n.trim()))
    .join("\n---\n");

  const { error: updateError } = await supabase
    .from("guests")
    .update({
      email: target.email ?? source.email,
      phone: target.phone ?? source.phone,
      country: target.country ?? source.country,
      city: target.city ?? source.city,
      notes: mergedNotes || null,
      tags: mergedTags,
      is_vip: target.is_vip || source.is_vip,
      is_favorite: target.is_favorite || source.is_favorite,
      total_bookings: (target.total_bookings ?? 0) + (source.total_bookings ?? 0),
      total_spent: Number(target.total_spent ?? 0) + Number(source.total_spent ?? 0),
    })
    .eq("id", target.id)
    .eq("hotel_id", hotelId);

  if (updateError) throw updateError;

  const { error: deleteError } = await supabase
    .from("guests")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", source.id)
    .eq("hotel_id", hotelId);

  if (deleteError) throw deleteError;

  revalidateGuests(target.id);
}
