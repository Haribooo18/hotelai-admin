import type {
  ConversationChannel,
  ConversationPriority,
  ConversationStatus,
} from "@/types/conversation";

type StatusMeta = {
  value: ConversationStatus;
  label: string;
  badgeClassName: string;
};

type ChannelMeta = {
  value: ConversationChannel;
  label: string;
};

type PriorityMeta = {
  value: ConversationPriority;
  label: string;
  badgeClassName: string;
};

export const CONVERSATION_STATUSES: StatusMeta[] = [
  {
    value: "new",
    label: "New",
    badgeClassName: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  },
  {
    value: "assigned",
    label: "Assigned",
    badgeClassName: "bg-violet-500/15 text-violet-400 border border-violet-500/30",
  },
  {
    value: "ai_answering",
    label: "AI responding",
    badgeClassName: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  },
  {
    value: "waiting_guest",
    label: "Waiting for guest",
    badgeClassName: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  },
  {
    value: "resolved",
    label: "Resolved",
    badgeClassName: "bg-zinc-500/15 text-zinc-300 border border-zinc-500/30",
  },
  {
    value: "archived",
    label: "Archived",
    badgeClassName: "bg-zinc-700/30 text-zinc-500 border border-zinc-600/30",
  },
];

export const CONVERSATION_CHANNELS: ChannelMeta[] = [
  { value: "website", label: "Website" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook_messenger", label: "Messenger" },
  { value: "email", label: "Email" },
];

export const CONVERSATION_PRIORITIES: PriorityMeta[] = [
  {
    value: "low",
    label: "Low",
    badgeClassName: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/30",
  },
  {
    value: "normal",
    label: "Normal",
    badgeClassName: "bg-zinc-600/15 text-zinc-300 border border-zinc-600/30",
  },
  {
    value: "high",
    label: "High",
    badgeClassName: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  },
  {
    value: "urgent",
    label: "Urgent",
    badgeClassName: "bg-red-500/15 text-red-400 border border-red-500/30",
  },
];

const statusByValue = new Map(CONVERSATION_STATUSES.map((s) => [s.value, s]));
const channelByValue = new Map(CONVERSATION_CHANNELS.map((c) => [c.value, c]));
const priorityByValue = new Map(CONVERSATION_PRIORITIES.map((p) => [p.value, p]));

export function getConversationStatusMeta(status: string) {
  return statusByValue.get(status as ConversationStatus);
}

export function getConversationChannelMeta(channel: string) {
  return channelByValue.get(channel as ConversationChannel);
}

export function getConversationPriorityMeta(priority: string) {
  return priorityByValue.get(priority as ConversationPriority);
}

export const CONVERSATION_STATUS_OPTIONS = CONVERSATION_STATUSES.map(
  ({ value, label }) => ({ value, label })
);

export const CONVERSATION_CHANNEL_OPTIONS = CONVERSATION_CHANNELS.map(
  ({ value, label }) => ({ value, label })
);

export const CONVERSATION_PRIORITY_OPTIONS = CONVERSATION_PRIORITIES.map(
  ({ value, label }) => ({ value, label })
);
