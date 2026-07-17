import { z } from "zod";

export const checkAvailabilityInputSchema = z.object({
  room_id: z.string().uuid(),
  check_in: z.string().min(1),
  check_out: z.string().min(1),
});

export const checkAvailabilityOutputSchema = z.object({
  available: z.boolean(),
  conflicts: z.array(
    z.object({
      id: z.string(),
      check_in: z.string(),
      check_out: z.string(),
    })
  ),
});

export const createBookingToolInputSchema = z.object({
  room_id: z.string().uuid(),
  guest_name: z.string().min(1),
  check_in: z.string().min(1),
  check_out: z.string().min(1),
  guest_email: z.string().email().optional().or(z.literal("")),
  guest_phone: z.string().optional(),
  notes: z.string().optional(),
});

export const createBookingToolOutputSchema = z.object({
  booking_id: z.string().uuid(),
  total_price: z.number(),
});

export const updateBookingToolInputSchema = z.object({
  booking_id: z.string().uuid(),
  guest_name: z.string().min(1).optional(),
  check_in: z.string().optional(),
  check_out: z.string().optional(),
  status: z.enum(["pending", "confirmed", "checked_in", "checked_out", "cancelled"]).optional(),
  notes: z.string().optional(),
});

export const updateBookingToolOutputSchema = z.object({
  booking_id: z.string().uuid(),
  updated: z.boolean(),
});

export const cancelBookingToolInputSchema = z.object({
  booking_id: z.string().uuid(),
  reason: z.string().optional(),
});

export const cancelBookingToolOutputSchema = z.object({
  booking_id: z.string().uuid(),
  cancelled: z.boolean(),
});

export const searchKnowledgeToolInputSchema = z.object({
  query: z.string().min(1),
  limit: z.number().int().min(1).max(20).optional(),
  language: z.string().optional(),
});

export const searchKnowledgeToolOutputSchema = z.object({
  results: z.array(
    z.object({
      id: z.string().uuid(),
      title: z.string(),
      content: z.string(),
      category: z.string().nullable(),
      score: z.number(),
    })
  ),
});

export const getGuestToolInputSchema = z.object({
  guest_id: z.string().uuid().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
}).refine(
  (v) => v.guest_id || v.email || v.phone,
  { message: "Укажите guest_id, email или phone" }
);

export const getGuestToolOutputSchema = z.object({
  guest: z
    .object({
      id: z.string().uuid(),
      first_name: z.string(),
      last_name: z.string(),
      email: z.string().nullable(),
      phone: z.string().nullable(),
      is_vip: z.boolean(),
      tags: z.array(z.string()),
    })
    .nullable(),
});

export const getRoomToolInputSchema = z.object({
  room_id: z.string().uuid().optional(),
  room_type: z.string().optional(),
}).refine(
  (v) => v.room_id || v.room_type,
  { message: "Укажите room_id или room_type" }
);

export const getRoomToolOutputSchema = z.object({
  rooms: z.array(
    z.object({
      id: z.string().uuid(),
      room_type: z.string(),
      price: z.number(),
      capacity: z.number().nullable(),
    })
  ),
});


export const requestHumanHandoffInputSchema = z.object({
  reason: z.string().trim().min(3).max(1000),
  urgency: z.enum(["normal", "high", "urgent"]).default("normal"),
  guest_message: z.string().trim().max(2000).optional(),
});

export const requestHumanHandoffOutputSchema = z.object({
  handoff_requested: z.literal(true),
  conversation_id: z.string().uuid(),
  status: z.literal("handoff_requested"),
  priority: z.enum(["normal", "high", "urgent"]),
});
