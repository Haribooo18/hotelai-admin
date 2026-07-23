import type { AIAction } from "@/types/ai-action";
import type { Conversation } from "@/types/conversation";
import type { TranslationPath } from "@/lib/i18n/translations";
import type { AdminLocale } from "@/lib/i18n/locales";
import type { KnowledgeArticle } from "@/types/knowledge-article";
import type { Lead } from "@/types/lead";
import type { Message } from "@/types/message";

import { formatAdminDateShort, formatAdminTime } from "@/lib/dashboard/format";
import { todayIso } from "@/lib/dashboard/date";

export type AIOpsKpis = {
  activeConversations: number;
  aiResolvedToday: number;
  humanTakeoverRate: number;
  avgResponseMinutes: number;
  conversionRate: number;
  aiSatisfaction: number;
};

export type AIInboxFilters = {
  search: string;
  status: string;
  channel: string;
  priority: string;
  assigned: "" | "me" | "unassigned";
  date: string;
};

export type AIAnalysis = {
  intent: string;
  sentiment: "positive" | "neutral" | "negative";
  language: string;
  confidence: number;
  nextBestAction: string;
};

export type GuestContext = {
  displayName: string;
  email: string | null;
  phone: string | null;
  currentReservation: string | null;
  previousStays: number;
  lifetimeRevenue: number;
  tags: string[];
  preferences: string[];
};

function isActiveConversation(conversation: Conversation): boolean {
  return !["resolved", "archived"].includes(conversation.status);
}

/**
 * Hydration-safe by construction: `now` must be passed in explicitly
 * rather than computed internally via `new Date()`. Calling `new Date()`
 * directly during render meant the server render and the client's first
 * render (before hydration completes) could land on different sides of a
 * day boundary — same message, different branch, different text — which
 * is exactly the shape of a React hydration mismatch (error #418).
 *
 * Callers should pass `null` for the very first render (server render and
 * the client's pre-mount render), which always produces the same
 * deterministic absolute-time output on both sides. Only after mount
 * (e.g. via a `useEffect` that calls `setNow(new Date())`) should a real
 * `Date` be passed — that update happens client-side, after hydration has
 * already succeeded, so it's a normal re-render rather than a mismatch.
 */
export function formatRelativeTime(
  iso: string | null,
  t: (path: TranslationPath) => string,
  locale: AdminLocale,
  now: Date | null = null
): string {
  if (!iso) return "";

  const date = new Date(iso);

  if (!now) return formatAdminTime(iso, locale);

  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return formatAdminTime(iso, locale);
  }

  if (diffDays === 1) return t("ai.yesterday");

  return formatAdminDateShort(date, locale);
}

export function computeAIOpsKpis(conversations: Conversation[]): AIOpsKpis {
  const today = todayIso();
  const active = conversations.filter(isActiveConversation);
  const resolved = conversations.filter(
    (conversation) => conversation.status === "resolved"
  );

  const aiResolvedToday = conversations.filter(
    (conversation) =>
      conversation.status === "resolved" &&
      conversation.updated_at.slice(0, 10) === today
  ).length;

  const humanAssigned = active.filter(
    (conversation) => conversation.assigned_to
  ).length;

  const humanTakeoverRate =
    active.length > 0 ? Math.round((humanAssigned / active.length) * 100) : 0;

  const responseSamples = conversations
    .filter(
      (conversation) => conversation.last_message_at && conversation.created_at
    )
    .map(
      (conversation) =>
        (new Date(conversation.last_message_at!).getTime() -
          new Date(conversation.created_at).getTime()) /
        60000
    )
    .filter((minutes) => minutes > 0 && minutes < 24 * 60);

  const avgResponseMinutes =
    responseSamples.length > 0
      ? Math.round(
          responseSamples.reduce((sum, value) => sum + value, 0) /
            responseSamples.length
        )
      : 0;

  const withLead = conversations.filter((conversation) => conversation.lead_id);
  const converted = withLead.filter(
    (conversation) => conversation.status === "resolved"
  );

  const conversionRate =
    withLead.length > 0
      ? Math.round((converted.length / withLead.length) * 100)
      : 0;

  const aiResolved = resolved.filter(
    (conversation) => !conversation.assigned_to
  ).length;

  const aiSatisfaction =
    resolved.length > 0
      ? Math.round((aiResolved / resolved.length) * 100)
      : 0;

  return {
    activeConversations: active.length,
    aiResolvedToday,
    humanTakeoverRate,
    avgResponseMinutes,
    conversionRate,
    aiSatisfaction,
  };
}

export function filterConversations(
  conversations: Conversation[],
  filters: AIInboxFilters,
  currentUserId: string
): Conversation[] {
  const query = filters.search.trim().toLowerCase();

  return conversations.filter((conversation) => {
    const haystack = [
      conversation.guest_name,
      conversation.guest_email ?? "",
      conversation.guest_phone ?? "",
      conversation.last_message_preview ?? "",
      conversation.subject ?? "",
      ...(conversation.tags ?? []),
    ]
      .join(" ")
      .toLowerCase();

    if (query && !haystack.includes(query)) return false;
    if (filters.status && conversation.status !== filters.status) return false;
    if (filters.channel && conversation.channel !== filters.channel) return false;
    if (filters.priority && conversation.priority !== filters.priority) {
      return false;
    }

    if (filters.assigned === "me" && conversation.assigned_to !== currentUserId) {
      return false;
    }

    if (filters.assigned === "unassigned" && conversation.assigned_to) {
      return false;
    }

    if (filters.date) {
      const lastDate = conversation.last_message_at?.slice(0, 10) ?? "";
      if (lastDate < filters.date) return false;
    }

    return true;
  });
}

export function isHumanHandled(conversation: Conversation): boolean {
  return Boolean(conversation.assigned_to) || conversation.status === "assigned";
}

export function getGuestInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function buildGuestContext(
  conversation: Conversation,
  lead: Lead | null
): GuestContext {
  const tags = conversation.tags ?? [];
  const preferences: string[] = [];

  if (conversation.channel === "email") preferences.push("Prefers email");
  if (conversation.channel === "whatsapp") preferences.push("Prefers WhatsApp");
  if (conversation.guest_phone) preferences.push("Phone on file");

  let currentReservation: string | null = null;
  if (lead?.check_in && lead?.check_out) {
    currentReservation = `${lead.room_type ?? "Room"} · ${lead.check_in} → ${lead.check_out}`;
  } else if (conversation.subject) {
    currentReservation = conversation.subject;
  }

  return {
    displayName: conversation.guest_name,
    email: conversation.guest_email ?? lead?.email ?? null,
    phone: conversation.guest_phone ?? lead?.phone ?? null,
    currentReservation,
    previousStays: lead?.status === "confirmed" ? 1 : 0,
    lifetimeRevenue: lead?.status === "confirmed" ? 0 : 0,
    tags,
    preferences,
  };
}

const INTENT_KEYWORDS: Array<{ intent: string; words: string[] }> = [
  { intent: "Booking inquiry", words: ["book", "reserve", "availability", "room"] },
  { intent: "Cancellation", words: ["cancel", "refund"] },
  { intent: "Check-in support", words: ["check in", "arrival", "early"] },
  { intent: "Pricing question", words: ["price", "rate", "cost", "discount"] },
  { intent: "Complaint", words: ["problem", "issue", "unhappy", "complaint"] },
];

const POSITIVE_WORDS = ["thank", "great", "perfect", "excellent", "love"];
const NEGATIVE_WORDS = ["bad", "angry", "unhappy", "problem", "cancel", "refund"];

export function buildAIAnalysis(
  conversation: Conversation,
  messages: Message[],
  aiActions: AIAction[]
): AIAnalysis {
  const guestMessages = messages
    .filter((message) => message.role === "guest" && !message.deleted_at)
    .map((message) => message.body.toLowerCase())
    .join(" ");

  const intent =
    INTENT_KEYWORDS.find((item) =>
      item.words.some((word) => guestMessages.includes(word))
    )?.intent ?? "General inquiry";

  const positiveHits = POSITIVE_WORDS.filter((word) =>
    guestMessages.includes(word)
  ).length;
  const negativeHits = NEGATIVE_WORDS.filter((word) =>
    guestMessages.includes(word)
  ).length;

  let sentiment: AIAnalysis["sentiment"] = "neutral";
  if (positiveHits > negativeHits) sentiment = "positive";
  if (negativeHits > positiveHits) sentiment = "negative";

  const hasCyrillic = /[а-яё]/i.test(guestMessages);
  const language = hasCyrillic ? "Russian" : "English";

  const completedActions = aiActions.filter(
    (action) => action.status === "completed"
  ).length;
  const confidence =
    aiActions.length > 0
      ? Math.round((completedActions / aiActions.length) * 100) / 100
      : 0.82;

  let nextBestAction = "Send a follow-up and confirm guest intent";
  if (conversation.status === "new") {
    nextBestAction = "Greet the guest and clarify stay dates";
  } else if (conversation.status === "waiting_guest") {
    nextBestAction = "Wait for guest reply or send a gentle reminder";
  } else if (conversation.status === "ai_answering") {
    nextBestAction = "Let AI complete the draft, then review before sending";
  } else if (conversation.assigned_to) {
    nextBestAction = "Human agent should respond within SLA";
  } else if (conversation.status === "resolved") {
    nextBestAction = "Archive or request satisfaction feedback";
  }

  return {
    intent,
    sentiment,
    language,
    confidence,
    nextBestAction,
  };
}

export function getRelevantArticles(
  articles: KnowledgeArticle[],
  conversation: Conversation,
  messages: Message[]
): KnowledgeArticle[] {
  const lastGuest = [...messages]
    .reverse()
    .find((message) => message.role === "guest" && !message.deleted_at);

  const query = [
    conversation.subject ?? "",
    conversation.last_message_preview ?? "",
    lastGuest?.body ?? "",
    ...(conversation.tags ?? []),
  ]
    .join(" ")
    .toLowerCase();

  if (!query.trim()) {
    return articles.filter((article) => article.is_pinned).slice(0, 4);
  }

  return articles
    .filter((article) => {
      const haystack = [article.title, article.content, article.category ?? "", ...article.tags]
        .join(" ")
        .toLowerCase();
      return article.tags.some((tag) => query.includes(tag.toLowerCase())) ||
        haystack.split(" ").some((word) => word.length > 4 && query.includes(word));
    })
    .slice(0, 5);
}

export function getSuggestedReplies(
  conversation: Conversation
): string[] {
  switch (conversation.status) {
    case "new":
      return [
        "Thank you for contacting us. How may I help with your stay?",
        "Happy to assist with availability and room options.",
      ];
    case "waiting_guest":
      return [
        "Just checking in — do you still need help with your reservation?",
        "We are ready when you are. Reply anytime.",
      ];
    case "ai_answering":
      return [
        "I can help finalize your booking details right away.",
        "Let me confirm the best room option for your dates.",
      ];
    case "assigned":
      return [
        "A member of our team is reviewing your request now.",
        "We will follow up with a personal response shortly.",
      ];
    default:
      return [
        "Thank you for your message.",
        "Is there anything else we can help you with?",
      ];
  }
}

export function getPromptSources(aiActions: AIAction[]): string[] {
  return aiActions
    .filter((action) => action.tool_name === "search_knowledge")
    .map((action) => {
      const title = action.output?.title;
      return typeof title === "string" ? title : action.tool_name ?? action.action_type;
    })
    .filter((value, index, list) => list.indexOf(value) === index)
    .slice(0, 6);
}
