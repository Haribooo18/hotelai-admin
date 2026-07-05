import type { ComponentType } from "react";
import {
  Globe,
  Mail,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

import type { ConversationChannel } from "@/types/conversation";
import { getConversationChannelMeta } from "@/lib/ai/metadata";

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
  const meta = getConversationChannelMeta(channel);
  const Icon = channelIcons[channel as ConversationChannel] ?? Globe;

  return (
    <span className={`inline-flex items-center gap-1.5 ${className ?? ""}`}>
      <Icon size={size} className="shrink-0 text-[var(--shell-muted)]" aria-hidden />
      {showLabel && (
        <span className="text-xs text-[var(--shell-muted)]">{meta?.label ?? channel}</span>
      )}
    </span>
  );
}
