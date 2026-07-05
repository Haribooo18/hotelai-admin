"use server";

import { revalidatePath } from "next/cache";

import { createGuestsRepository } from "@/repositories/guests.repository.server";
import {
  guestCreateSchema,
  guestUpdateSchema,
  type GuestCreateInput,
  type GuestUpdateInput,
} from "@/lib/validations/guest";
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

  const repo = await createGuestsRepository();
  await repo.create(toRow(parsed.data));

  revalidateGuests();
}

export async function updateGuest(input: GuestUpdateInput) {
  const parsed = guestUpdateSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const { id, ...rest } = parsed.data;

  const repo = await createGuestsRepository();
  await repo.update(id, toRow(rest));

  revalidateGuests(id);
}

/** Soft delete — marks the guest as deleted, preserving history. */
export async function deleteGuest(id: string) {
  const repo = await createGuestsRepository();
  await repo.delete(id);
  revalidateGuests(id);
}

export async function setGuestFavorite(id: string, value: boolean) {
  const repo = await createGuestsRepository();
  await repo.setFavorite(id, value);
  revalidateGuests(id);
}

export async function setGuestVip(id: string, value: boolean) {
  const repo = await createGuestsRepository();
  await repo.setVip(id, value);
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

  const repo = await createGuestsRepository();
  const guests = await repo.getByIds([input.targetId, input.sourceId]);
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

  await repo.updateMergedGuest(target.id, {
    email: target.email ?? source.email,
    phone: target.phone ?? source.phone,
    country: target.country ?? source.country,
    city: target.city ?? source.city,
    notes: mergedNotes || null,
    tags: mergedTags,
    is_vip: target.is_vip || source.is_vip,
    is_favorite: target.is_favorite || source.is_favorite,
    total_bookings:
      (target.total_bookings ?? 0) + (source.total_bookings ?? 0),
    total_spent:
      Number(target.total_spent ?? 0) + Number(source.total_spent ?? 0),
  });

  await repo.delete(source.id);

  revalidateGuests(target.id);
}
