export type Guest = {
  id: string;

  hotel_id: string;

  first_name: string;
  last_name: string;

  email: string | null;
  phone: string | null;

  country: string | null;
  city: string | null;

  notes: string | null;

  tags: string[];
  is_vip: boolean;
  is_favorite: boolean;
  avatar_url: string | null;

  total_bookings: number;
  total_spent: number;

  deleted_at: string | null;

  created_at: string;
  updated_at: string;
};

/**
 * Live stay statistics computed from a guest's booking history
 * (bookings are matched by email/name — see guests.service).
 */
export type GuestStats = {
  totalBookings: number;
  totalNights: number;
  totalRevenue: number;
  lastStay: string | null;
  upcomingCheckIn: string | null;
};
