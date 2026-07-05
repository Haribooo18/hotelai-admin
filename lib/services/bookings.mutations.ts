"use server";

import { revalidatePath } from "next/cache";

import {
  calculateTotalPrice as computeTotalPrice,
  findAvailabilityConflict,
  formatAvailabilityConflictError,
} from "@/lib/booking-logic";
import { createBookingsRepository } from "@/repositories/bookings.repository.server";
import type { BookingsRepository } from "@/repositories/bookings.repository";
import { getRepositoryContext } from "@/lib/tenant/repository-context";
import {
  bookingCreateSchema,
  bookingUpdateSchema,
  bookingRescheduleSchema,
  type BookingCreateInput,
  type BookingUpdateInput,
  type BookingRescheduleInput,
} from "@/lib/validations/booking";

function revalidateBookings() {
  revalidatePath("/bookings");
  revalidatePath("/");
  revalidatePath("/calendar");
}

async function ensureRoomAvailable(
  repo: BookingsRepository,
  roomId: string,
  checkIn: string,
  checkOut: string,
  bookingId?: string
) {
  const rows = await repo.findAvailabilityConflicts(roomId, bookingId);
  const conflict = findAvailabilityConflict(rows, checkIn, checkOut);

  if (conflict) {
    throw new Error(formatAvailabilityConflictError(conflict));
  }
}

export async function createBooking(input: BookingCreateInput) {
  const parsed = bookingCreateSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const { guest_name, guest_email, guest_phone, room_id, check_in, check_out } =
    parsed.data;

  const ctx = await getRepositoryContext();
  const repo = createBookingsRepository(ctx);

  await ensureRoomAvailable(repo, room_id, check_in, check_out);

  const roomPrice = await repo.getRoomPrice(room_id);
  const totalPrice = computeTotalPrice(roomPrice, check_in, check_out);

  const result = await repo.create({
    room_id,
    guest_name,
    guest_email,
    guest_phone,
    check_in,
    check_out,
    total_price: totalPrice,
    status: "confirmed",
  });

  revalidateBookings();
  return result;
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

  const ctx = await getRepositoryContext();
  const repo = createBookingsRepository(ctx);

  await ensureRoomAvailable(repo, room_id, check_in, check_out, id);

  const roomPrice = await repo.getRoomPrice(room_id);
  const totalPrice = computeTotalPrice(roomPrice, check_in, check_out);

  await repo.update(id, {
    room_id,
    guest_name,
    guest_email,
    guest_phone,
    check_in,
    check_out,
    total_price: totalPrice,
  });

  revalidateBookings();
}

export async function rescheduleBooking(input: BookingRescheduleInput) {
  const parsed = bookingRescheduleSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const { id, room_id, check_in, check_out } = parsed.data;

  const ctx = await getRepositoryContext();
  const repo = createBookingsRepository(ctx);

  await ensureRoomAvailable(repo, room_id, check_in, check_out, id);

  const roomPrice = await repo.getRoomPrice(room_id);
  const totalPrice = computeTotalPrice(roomPrice, check_in, check_out);

  await repo.reschedule(id, {
    room_id,
    check_in,
    check_out,
    total_price: totalPrice,
  });

  revalidateBookings();
}

export async function deleteBooking(id: string) {
  const ctx = await getRepositoryContext();
  await createBookingsRepository(ctx).delete(id);
  revalidateBookings();
}
