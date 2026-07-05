"use client";

import type { Conversation } from "@/types/conversation";
import { cn } from "@/lib/utils";
import { getConversationChannelMeta } from "@/lib/ai/metadata";

import { AIStatusBadge } from "./AIStatusBadge";
import { ChannelIcon } from "./ChannelIcon";
import { PriorityBadge } from "./PriorityBadge";
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

const PRIORITY_DOT: Record<string, string> = {
  high: "bg-amber-400",
  urgent: "bg-red-400",
};

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: Props) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-[var(--shell-border)]/50 bg-[var(--shell-surface)]/85 backdrop-blur-xl md:w-[300px] md:shrink-0">
      <div
        className="flex-1 overflow-y-auto"
        role="listbox"
        aria-label="Conversation list"
      >
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

            return (
              <button
                key={conversation.id}
                type="button"
                role="option"
                aria-selected={selectedId === conversation.id}
                onClick={() => onSelect(conversation.id)}
                className={cn(
                  "group w-full border-b border-[var(--shell-border)]/40 px-3 py-3 text-left transition-[background-color,transform,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:bg-[var(--shell-surface-raised)]/70",
                  selectedId === conversation.id &&
                    "bg-[var(--shell-nav-active-bg)]/50 shadow-[inset_2px_0_0_0_var(--shell-accent)]"
                )}
              >
                <div className="flex items-start gap-2.5">
                  <div className="relative shrink-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shell-accent-muted)] text-[11px] font-semibold text-[var(--shell-accent)]">
                      {getGuestInitials(conversation.guest_name)}
                    </div>
                    {conversation.priority in PRIORITY_DOT ? (
                      <span
                        className={cn(
                          "absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-[var(--shell-surface)]",
                          PRIORITY_DOT[conversation.priority]
                        )}
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
                          <span>·</span>
                          <span className="truncate">On-property</span>
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="text-[10px] text-[var(--shell-muted)]">
                          {formatRelativeTime(conversation.last_message_at)}
                        </span>
                        {conversation.unread_count > 0 ? (
                          <span
                            className="flex h-5 min-w-5 animate-pulse items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[10px] font-bold text-white"
                            aria-label={`${conversation.unread_count} unread`}
                          >
                            {conversation.unread_count}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <p className="mt-1.5 line-clamp-2 text-[12px] leading-snug text-[var(--shell-muted)]">
                      {conversation.last_message_preview ?? "No messages yet"}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                          human
                            ? "bg-violet-500/12 text-violet-400"
                            : "bg-emerald-500/12 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.12)]"
                        )}
                      >
                        {human ? "Human" : "AI"}
                      </span>
                      <AIStatusBadge status={conversation.status} />
                      <PriorityBadge priority={conversation.priority} />
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
