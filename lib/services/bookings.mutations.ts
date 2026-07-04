"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getCurrentHotelId } from "@/lib/tenant";
import {
  bookingCreateSchema,
  bookingUpdateSchema,
  type BookingCreateInput,
  type BookingUpdateInput,
} from "@/lib/validations/booking";

function revalidateBookings() {
  revalidatePath("/bookings");
  revalidatePath("/");
  revalidatePath("/calendar");
}

async function calculateTotalPrice(
  hotelId: string,
  roomId: string,
  checkIn: string,
  checkOut: string
) {
  const supabase = await createClient();

  const { data: room, error } = await supabase
    .from("rooms")
    .select("price")
    .eq("id", roomId)
    .eq("hotel_id", hotelId)
    .single();

  if (error) throw error;

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return room.price * nights;
}

async function ensureRoomAvailable(
  hotelId: string,
  roomId: string,
  checkIn: string,
  checkOut: string,
  bookingId?: string
) {
  const supabase = await createClient();

  let query = supabase
    .from("bookings")
    .select("id, guest_name, check_in, check_out")
    .eq("hotel_id", hotelId)
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

export async function createBooking(input: BookingCreateInput) {
  const parsed = bookingCreateSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const { guest_name, guest_email, guest_phone, room_id, check_in, check_out } =
    parsed.data;

  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  await ensureRoomAvailable(hotelId, room_id, check_in, check_out);

  const totalPrice = await calculateTotalPrice(
    hotelId,
    room_id,
    check_in,
    check_out
  );

  const { error } = await supabase.from("bookings").insert({
    hotel_id: hotelId,
    room_id,
    guest_name,
    guest_email,
    guest_phone,
    check_in,
    check_out,
    total_price: totalPrice,
    status: "confirmed",
  });

  if (error) throw error;

  revalidateBookings();
}

export async function updateBooking(input: BookingUpdateInput) {
  const parsed = bookingUpdateSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const {
    id,
    guest_name,
    guest_email,
    guest_phone,
    room_id,
    check_in,
    check_out,
  } = parsed.data;

  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  await ensureRoomAvailable(hotelId, room_id, check_in, check_out, id);

  const totalPrice = await calculateTotalPrice(
    hotelId,
    room_id,
    check_in,
    check_out
  );

  const { error } = await supabase
    .from("bookings")
    .update({
      room_id,
      guest_name,
      guest_email,
      guest_phone,
      check_in,
      check_out,
      total_price: totalPrice,
    })
    .eq("id", id)
    .eq("hotel_id", hotelId);

  if (error) throw error;

  revalidateBookings();
}

export async function deleteBooking(id: string) {
  const supabase = await createClient();
  const hotelId = await getCurrentHotelId();

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", id)
    .eq("hotel_id", hotelId);

  if (error) throw error;

  revalidateBookings();
}
