"use client";

import type { ComponentType } from "react";
import {
  Globe,
  Mail,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

import type { ConversationChannel } from "@/types/conversation";
import { useI18n } from "@/lib/i18n";
import type { TranslationPath } from "@/lib/i18n/translations";

const channelIcons: Record<
  ConversationChannel,
  ComponentType<{ size?: number; className?: string }>
> = {
  website: Globe,
  whatsapp: Phone,
  telegram: Send,
  instagram: MessageCircle,
  facebook_messenger: MessageCircle,
  email: Mail,
};

const CHANNEL_KEYS: Record<ConversationChannel, TranslationPath> = {
  website: "ai.channels.website",
  whatsapp: "ai.channels.whatsapp",
  telegram: "ai.channels.telegram",
  instagram: "ai.channels.instagram",
  facebook_messenger: "ai.channels.facebook_messenger",
  email: "ai.channels.email",
};

type Props = {
  channel: string;
  size?: number;
  className?: string;
  showLabel?: boolean;
};

export function ChannelIcon({
  channel,
  size = 16,
  className,
  showLabel,
}: Props) {
  const { t } = useI18n();
  const channelKey = CHANNEL_KEYS[channel as ConversationChannel];
  const label = channelKey ? t(channelKey) : channel;
  const Icon = channelIcons[channel as ConversationChannel] ?? Globe;

  return (
    <span className={`inline-flex items-center gap-1.5 ${className ?? ""}`}>
      <Icon size={size} className="shrink-0 text-[var(--shell-muted)]" aria-hidden />
      {showLabel && (
        <span className="text-xs text-[var(--shell-muted)]">{label}</span>
      )}
    </span>
  );
}
