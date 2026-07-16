export type BookingStatus =
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled";

export type Booking = {
  id: string;

  hotel_id: string;
  room_id: string;

  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;

  check_in: string;
  check_out: string;

  adults: number;
  children: number;

  total_price: number;

  status: BookingStatus;

  created_at: string;
  updated_at: string;
};