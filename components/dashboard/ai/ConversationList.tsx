"use client";

import type { Conversation } from "@/types/conversation";
import { getConversationChannelMeta } from "@/lib/ai/metadata";

import { Avatar, AvatarFallback } from "@/components/ui/display/Avatar";
import { Badge } from "@/components/ui/display/Badge";
import { Counter } from "@/components/ui/display/Counter";
import { StatusDot } from "@/components/ui/display/StatusDot";
import { Scrollable } from "@/components/ui/primitives/Scrollable";
import { cn } from "@/lib/utils";

import { AIStatusBadge } from "./AIStatusBadge";
import { ChannelIcon } from "./ChannelIcon";
import { PriorityBadge } from "./PriorityBadge";
import { AIConversationCard } from "./ai-ui";
import {
  formatRelativeTime,
  getGuestInitials,
  isHumanHandled,
} from "./ai-ops-metrics";

type Props = {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const PRIORITY_TONE: Record<string, "warning" | "danger" | "default"> = {
  high: "warning",
  urgent: "danger",
};

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: Props) {
  return (
    <aside
      className="flex h-full w-full flex-col border-r border-[var(--shell-border)]/50 bg-[var(--shell-surface)]/85 backdrop-blur-xl md:w-[320px] md:shrink-0 lg:w-[340px]"
      aria-label="Conversation list"
    >
      <Scrollable className="flex-1" role="listbox">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-[13px] text-[var(--shell-muted)]">
            No conversations match your filters
          </div>
        ) : (
          conversations.map((conversation) => {
            const channelLabel =
              getConversationChannelMeta(conversation.channel)?.label ??
              conversation.channel;
            const human = isHumanHandled(conversation);
            const selected = selectedId === conversation.id;

            return (
              <AIConversationCard
                key={conversation.id}
                selected={selected}
                aria-selected={selected}
                onClick={() => onSelect(conversation.id)}
              >
                <div className="flex items-start gap-2.5">
                  <div className="relative shrink-0">
                    <Avatar className="size-9">
                      <AvatarFallback className="text-[11px] font-semibold">
                        {getGuestInitials(conversation.guest_name)}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.priority in PRIORITY_TONE ? (
                      <StatusDot
                        tone={PRIORITY_TONE[conversation.priority] ?? "default"}
                        pulse={conversation.priority === "urgent"}
                        className="absolute -right-0.5 -top-0.5 ring-2 ring-[var(--shell-surface)]"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-[var(--shell-text)]">
                          {conversation.guest_name}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--shell-muted)]">
                          <ChannelIcon channel={conversation.channel} size={12} />
                          <span className="truncate">{channelLabel}</span>
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="text-[10px] text-[var(--shell-muted)]">
                          {formatRelativeTime(conversation.last_message_at)}
                        </span>
                        {conversation.unread_count > 0 ? (
                          <Badge
                            variant="success"
                            className="h-5 min-w-5 animate-pulse justify-center px-1.5 text-[10px] font-bold"
                            aria-label={`${conversation.unread_count} unread`}
                          >
                            <Counter value={conversation.unread_count} />
                          </Badge>
                        ) : null}
                      </div>
                    </div>

                    <p className="mt-1.5 line-clamp-2 text-[12px] leading-snug text-[var(--shell-muted)]">
                      {conversation.last_message_preview ?? "No messages yet"}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <Badge
                        variant={human ? "default" : "success"}
                        className={cn(
                          human
                            ? "bg-violet-500/12 text-violet-400"
                            : "shadow-[0_0_12px_rgba(16,185,129,0.12)]"
                        )}
                      >
                        {human ? "Human" : "AI"}
                      </Badge>
                      <AIStatusBadge status={conversation.status} />
                      <PriorityBadge priority={conversation.priority} />
                    </div>
                  </div>
                </div>
              </AIConversationCard>
            );
          })
        )}
      </Scrollable>
    </aside>
  );
}
