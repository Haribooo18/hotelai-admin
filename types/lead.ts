export type LeadStatus =
  | "new"
  | "contacted"
  | "confirmed"
  | "cancelled";

export type Lead = {
  lead_id: string;
  created_at: string;
  guest_name: string | null;
  phone: string | null;
  email: string | null;
  room_type: string | null;
  check_in: string | null;
  check_out: string | null;
  guests: number | null;
  status: LeadStatus | string | null;
  comment: string | null;
};
