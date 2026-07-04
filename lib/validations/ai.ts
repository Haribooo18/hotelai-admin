import { z } from "zod";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const optionalEmail = z
  .string()
  .trim()
  .refine((v) => v === "" || EMAIL_RE.test(v), {
    message: "Некорректный email",
  })
  .default("");

export const conversationStatusSchema = z.enum([
  "new",
  "assigned",
  "ai_answering",
  "waiting_guest",
  "resolved",
  "archived",
]);

export const conversationChannelSchema = z.enum([
  "website",
  "whatsapp",
  "telegram",
  "instagram",
  "facebook_messenger",
  "email",
]);

export const conversationPrioritySchema = z.enum([
  "low",
  "normal",
  "high",
  "urgent",
]);

export const messageRoleSchema = z.enum(["guest", "staff", "ai", "system"]);

export const conversationCreateSchema = z.object({
  guest_name: z.string().trim().min(1, "Введите имя гостя"),
  guest_email: optionalEmail,
  guest_phone: z.string().trim().default(""),
  channel: conversationChannelSchema.default("website"),
  priority: conversationPrioritySchema.default("normal"),
  subject: z.string().trim().default(""),
  lead_id: z.string().trim().default(""),
});

export const conversationUpdateStatusSchema = z.object({
  id: z.string().uuid(),
  status: conversationStatusSchema,
});

export const conversationUpdatePrioritySchema = z.object({
  id: z.string().uuid(),
  priority: conversationPrioritySchema,
});

export const conversationAssignSchema = z.object({
  conversation_id: z.string().uuid(),
  user_id: z.string().uuid(),
});

export const conversationInternalNotesSchema = z.object({
  id: z.string().uuid(),
  internal_notes: z.string().trim().default(""),
});

export const sendMessageSchema = z.object({
  conversation_id: z.string().uuid(),
  body: z.string().trim().min(1, "Введите сообщение"),
  is_internal: z.boolean().default(false),
});

export const addConversationTagSchema = z.object({
  conversation_id: z.string().uuid(),
  tag: z.string().trim().min(1, "Введите тег"),
});

export const conversationDeleteSchema = z.object({
  id: z.string().uuid(),
});

export type ConversationCreateInput = z.infer<typeof conversationCreateSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
