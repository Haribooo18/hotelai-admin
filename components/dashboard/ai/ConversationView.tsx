"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import type { Conversation } from "@/types/conversation";
import type { Message } from "@/types/message";

import { markConversationRead } from "@/lib/services/ai.mutations";

import { ConversationHeader } from "./ConversationHeader";
import { MessageBubble } from "./MessageBubble";
import { MessageComposer } from "./MessageComposer";
import { QuickActions } from "./QuickActions";
import { TypingIndicator } from "./TypingIndicator";

type Props = {
  conversation: Conversation;
  messages: Message[];
  currentUserId: string;
  aiEnabled?: boolean;
  onBack?: () => void;
  showBack?: boolean;
};

function dayLabel(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const dateKey = date.toDateString();
  if (dateKey === today.toDateString()) return "Today";
  if (dateKey === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

export function ConversationView({
  conversation,
  messages,
  currentUserId,
  aiEnabled = false,
  onBack,
  showBack = false,
}: Props) {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [, startTransition] = useTransition();
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, streamText]);

  useEffect(() => {
    if (conversation.unread_count <= 0) return;

    startTransition(async () => {
      try {
        await markConversationRead(conversation.id);
        router.refresh();
      } catch (error) {
        console.error(error);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation.id]);

  const visibleMessages = messages.filter((message) => !message.deleted_at);
  const showAiTyping = conversation.is_ai_typing || streaming;

  const timeline = useMemo(() => {
    const groups: Array<{ day: string; messages: Message[] }> = [];

    for (const message of visibleMessages) {
      const day = dayLabel(message.created_at);
      const last = groups[groups.length - 1];
      if (!last || last.day !== day) {
        groups.push({ day, messages: [message] });
      } else {
        last.messages.push(message);
      }
    }

    return groups;
  }, [visibleMessages]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-[var(--shell-surface)]/60">
      {showBack && onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 border-b border-[var(--shell-border)]/50 px-4 py-2 text-[13px] text-[var(--shell-muted)] md:hidden"
        >
          <ArrowLeft size={16} />
          Back to inbox
        </button>
      ) : null}

      <ConversationHeader conversation={conversation} />

      <div className="border-b border-[var(--shell-border)]/50 px-4 py-2.5">
        <QuickActions
          conversation={conversation}
          currentUserId={currentUserId}
          aiEnabled={aiEnabled}
          onAIStreamStart={() => {
            setStreaming(true);
            setStreamText("");
          }}
        />
      </div>

      <div
        className="flex min-h-0 flex-1 flex-col"
        role="log"
        aria-label="Messages"
        aria-live="polite"
      >
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {visibleMessages.length === 0 ? (
            <p className="py-12 text-center text-[13px] text-[var(--shell-muted)]">
              No messages yet. Start the conversation below.
            </p>
          ) : (
            timeline.map((group) => (
              <div key={group.day} className="space-y-3">
                <div className="flex items-center gap-3 py-1">
                  <div className="h-px flex-1 bg-[var(--shell-border)]/60" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--shell-muted)]">
                    {group.day}
                  </span>
                  <div className="h-px flex-1 bg-[var(--shell-border)]/60" />
                </div>

                {group.messages.map((message, index) => {
                  const previous = group.messages[index - 1];
                  const grouped =
                    previous?.role === message.role &&
                    !message.is_internal &&
                    !previous.is_internal;

                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      guestName={conversation.guest_name}
                      grouped={grouped}
                    />
                  );
                })}
              </div>
            ))
          )}

          {streaming && streamText ? (
            <div className="flex justify-start">
              <div className="max-w-[78%] rounded-[var(--ds-radius)] border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2.5 text-[13px] text-[var(--shell-text)] shadow-[0_0_20px_rgba(16,185,129,0.08)]">
                {streamText}
              </div>
            </div>
          ) : null}

          {showAiTyping ? <TypingIndicator actor="ai" /> : null}
          {conversation.is_guest_typing ? (
            <TypingIndicator actor="guest" />
          ) : null}

          <div ref={bottomRef} />
        </div>

        <MessageComposer
          conversationId={conversation.id}
          conversation={conversation}
          aiEnabled={aiEnabled}
          onStreamDelta={setStreamText}
          onStreamEnd={() => {
            setStreaming(false);
            setStreamText("");
          }}
        />
      </div>
    </div>
  );
}
