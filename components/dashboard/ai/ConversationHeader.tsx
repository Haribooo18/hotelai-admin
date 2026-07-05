import type { Conversation } from "@/types/conversation";

import { AIStatusBadge } from "./AIStatusBadge";
import { ChannelIcon } from "./ChannelIcon";
import { PriorityBadge } from "./PriorityBadge";

type Props = {
  conversation: Conversation;
};

export function ConversationHeader({ conversation }: Props) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--shell-border)] bg-[var(--shell-surface)] px-5 py-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate text-lg font-semibold">
            {conversation.guest_name}
          </h2>
          <AIStatusBadge status={conversation.status} />
          <PriorityBadge priority={conversation.priority} />
        </div>

        {conversation.subject && (
          <p className="mt-1 truncate text-sm text-[var(--shell-muted)]">
            {conversation.subject}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[var(--shell-muted)]">
          <ChannelIcon channel={conversation.channel} showLabel />
          {conversation.guest_email && <span>{conversation.guest_email}</span>}
          {conversation.guest_phone && <span>{conversation.guest_phone}</span>}
        </div>
      </div>
    </header>
  );
}
