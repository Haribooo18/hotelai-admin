import type { Conversation } from "@/types/conversation";

import { Badge } from "@/components/ui/display/Badge";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { Inline } from "@/components/ui/primitives/Inline";

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
      <GlassSurface className="rounded-[var(--ds-radius-sm)] p-3 shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <Inline gap="sm" wrap className="items-center">
              <h2 className="truncate text-[16px] font-semibold tracking-[-0.02em] text-[var(--shell-text)]">
                {conversation.guest_name}
              </h2>
              <Badge
                variant={human ? "default" : "success"}
                className={
                  human
                    ? "bg-violet-500/12 text-violet-400"
                    : undefined
                }
              >
                {human ? "Human" : "AI"}
              </Badge>
              <AIStatusBadge status={conversation.status} />
              <PriorityBadge priority={conversation.priority} />
            </Inline>

            {conversation.subject ? (
              <p className="mt-1 truncate text-[12px] text-[var(--shell-muted)]">
                {conversation.subject}
              </p>
            ) : null}

            <Inline gap="md" wrap className="mt-2 text-[12px] text-[var(--shell-muted)]">
              <ChannelIcon channel={conversation.channel} showLabel />
              {conversation.guest_email ? <span>{conversation.guest_email}</span> : null}
              {conversation.guest_phone ? <span>{conversation.guest_phone}</span> : null}
            </Inline>
          </div>
        </div>
      </GlassSurface>
    </header>
  );
}
