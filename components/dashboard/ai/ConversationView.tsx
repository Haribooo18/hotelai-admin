"use client";

import { useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { Conversation } from "@/types/conversation";
import type { Message } from "@/types/message";
import type { Lead } from "@/types/lead";

import { markConversationRead } from "@/lib/services/ai.mutations";

import { ConversationHeader } from "./ConversationHeader";
import { LeadCard } from "./LeadCard";
import { MessageBubble } from "./MessageBubble";
import { MessageComposer } from "./MessageComposer";
import { QuickActions } from "./QuickActions";
import { TypingIndicator } from "./TypingIndicator";

type Props = {
  conversation: Conversation;
  messages: Message[];
  lead: Lead | null;
  currentUserId: string;
};

export function ConversationView({
  conversation,
  messages,
  lead,
  currentUserId,
}: Props) {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

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
    // Mark read once when opening a conversation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation.id]);

  const visibleMessages = messages.filter((m) => !m.deleted_at);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <ConversationHeader conversation={conversation} />

      <div className="border-b border-zinc-800 px-5 py-3">
        <QuickActions
          conversation={conversation}
          currentUserId={currentUserId}
        />
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div
          className="flex min-w-0 flex-1 flex-col"
          role="log"
          aria-label="Сообщения"
          aria-live="polite"
        >
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {visibleMessages.length === 0 ? (
              <p className="text-center text-sm text-zinc-500">
                Нет сообщений. Начните диалог.
              </p>
            ) : (
              visibleMessages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))
            )}

            {conversation.is_guest_typing && <TypingIndicator />}

            <div ref={bottomRef} />
          </div>

          <MessageComposer conversationId={conversation.id} />
        </div>

        <aside className="hidden w-64 shrink-0 overflow-y-auto border-l border-zinc-800 bg-zinc-950 p-4 lg:block">
          <LeadCard lead={lead} />

          {conversation.internal_notes && (
            <div className="mt-4 rounded-xl border border-amber-900/30 bg-amber-950/20 p-3">
              <p className="text-xs uppercase tracking-widest text-amber-500/80">
                Внутренние заметки
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-300">
                {conversation.internal_notes}
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
