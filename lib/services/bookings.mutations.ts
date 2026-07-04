"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

type CreateBookingInput = {
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  room_id: string;
  check_in: string;
  check_out: string;
};

type UpdateBookingInput = {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  room_id: string;
  check_in: string;
  check_out: string;
};

async function calculateTotalPrice(
  roomId: string,
  checkIn: string,
  checkOut: string
) {
  const { data: room, error } = await supabase
    .from("rooms")
    .select("price")
    .eq("id", roomId)
    .single();

  if (error) throw error;

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(checkOut).getTime() -
        new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return room.price * nights;
}

async function ensureRoomAvailable(
  roomId: string,
  checkIn: string,
  checkOut: string,
  bookingId?: string
) {
  let query = supabase
    .from("bookings")
    .select("id, guest_name, check_in, check_out")
    .eq("room_id", roomId)
    .neq("status", "cancelled");

  if (bookingId) {
    query = query.neq("id", bookingId);
  }

  const { data, error } = await query;

  if (error) throw error;

  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();

  const conflict = data?.find((booking) => {
    const existingStart = new Date(booking.check_in).getTime();
    const existingEnd = new Date(booking.check_out).getTime();

    return start < existingEnd && end > existingStart;
  });

  if (conflict) {
    throw new Error(
      `Номер уже забронирован (${conflict.check_in} — ${conflict.check_out})`
    );
  }
}

export async function createBooking(
  input: CreateBookingInput
) {
  await ensureRoomAvailable(
    input.room_id,
    input.check_in,
    input.check_out
  );

  const totalPrice = await calculateTotalPrice(
    input.room_id,
    input.check_in,
    input.check_out
  );

  const { error } = await supabase
    .from("bookings")
    .insert({
      hotel_id: "hotel_aurora",
      room_id: input.room_id,
      guest_name: input.guest_name,
      guest_email: input.guest_email,
      guest_phone: input.guest_phone,
      check_in: input.check_in,
      check_out: input.check_out,
      total_price: totalPrice,
      status: "confirmed",
    });

  if (error) throw error;

  revalidatePath("/bookings");
}

export async function updateBooking(
  input: UpdateBookingInput
) {
  await ensureRoomAvailable(
    input.room_id,
    input.check_in,
    input.check_out,
    input.id
  );

  const totalPrice = await calculateTotalPrice(
    input.room_id,
    input.check_in,
    input.check_out
  );

  const { error } = await supabase
    .from("bookings")
    .update({
      room_id: input.room_id,
      guest_name: input.guest_name,
      guest_email: input.guest_email,
      guest_phone: input.guest_phone,
      check_in: input.check_in,
      check_out: input.check_out,
      total_price: totalPrice,
    })
    .eq("id", input.id);

  if (error) throw error;

  revalidatePath("/bookings");
}

export async function deleteBooking(id: string) {
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/bookings");
}