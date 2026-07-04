"use server";

import { revalidatePath } from "next/cache";

import { supabase } from "@/lib/supabase";

type CreateGuestInput = {
  hotel_id: string;

  first_name: string;
  last_name: string;

  email: string;
  phone: string;
};

export async function createGuest(
  input: CreateGuestInput
) {
  const { error } = await supabase
    .from("guests")
    .insert({
      hotel_id: input.hotel_id,

      first_name: input.first_name,
      last_name: input.last_name,

      email: input.email,
      phone: input.phone,

      total_bookings: 0,
      total_spent: 0,
    });

  if (error) {
    throw error;
  }

  revalidatePath("/guests");
}

export async function deleteGuest(
  id: string
) {
  const { error } = await supabase
    .from("guests")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  revalidatePath("/guests");
}