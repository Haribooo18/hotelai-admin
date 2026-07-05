import type { Conversation } from "@/types/conversation";
import { cn } from "@/lib/utils";

import { AIStatusBadge } from "./AIStatusBadge";
import { ChannelIcon } from "./ChannelIcon";
import { PriorityBadge } from "./PriorityBadge";
import { isHumanHandled } from "./ai-ops-metrics";

type Props = {
  conversation: Conversation;
};

export function ConversationHeader({ conversation }: Props) {
  const human = isHumanHandled(conversation);

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--shell-border)]/50 bg-[var(--shell-surface)]/92 px-4 py-3 backdrop-blur-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-[16px] font-semibold tracking-[-0.02em] text-[var(--shell-text)]">
              {conversation.guest_name}
            </h2>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                human
                  ? "bg-violet-500/12 text-violet-400"
                  : "bg-emerald-500/12 text-emerald-400"
              )}
            >
              {human ? "Human" : "AI"}
            </span>
            <AIStatusBadge status={conversation.status} />
            <PriorityBadge priority={conversation.priority} />
          </div>

          {conversation.subject ? (
            <p className="mt-1 truncate text-[12px] text-[var(--shell-muted)]">
              {conversation.subject}
            </p>
          ) : null}

          <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] text-[var(--shell-muted)]">
            <ChannelIcon channel={conversation.channel} showLabel />
            {conversation.guest_email ? <span>{conversation.guest_email}</span> : null}
            {conversation.guest_phone ? <span>{conversation.guest_phone}</span> : null}
          </div>
        </div>
      </div>
    </header>
  );
}
