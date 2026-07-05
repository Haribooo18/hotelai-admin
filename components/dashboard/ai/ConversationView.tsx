"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { Conversation } from "@/types/conversation";
import type { Message } from "@/types/message";
import type { Lead } from "@/types/lead";
import type { AIAction } from "@/types/ai-action";

import { markConversationRead } from "@/lib/services/ai.mutations";

import { ConversationReplay } from "@/components/dashboard/settings/ConversationReplay";

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
  aiActions?: AIAction[];
  aiEnabled?: boolean;
};

export function ConversationView({
  conversation,
  messages,
  lead,
  currentUserId,
  aiActions = [],
  aiEnabled = false,
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

  const visibleMessages = messages.filter((m) => !m.deleted_at);
  const showAiTyping =
    conversation.is_ai_typing || streaming;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <ConversationHeader conversation={conversation} />

      <div className="border-b border-[var(--shell-border)] px-5 py-3">
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

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div
          className="flex min-w-0 flex-1 flex-col"
          role="log"
          aria-label="Messages"
          aria-live="polite"
        >
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {visibleMessages.length === 0 ? (
              <p className="text-center text-sm text-[var(--shell-muted)]">
                No messages yet. Start the conversation.
              </p>
            ) : (
              visibleMessages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))
            )}

            {streaming && streamText && (
              <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 px-4 py-3 text-sm text-[var(--shell-text)]">
                {streamText}
              </div>
            )}

            {showAiTyping && <TypingIndicator actor="ai" />}
            {conversation.is_guest_typing && (
              <TypingIndicator actor="guest" />
            )}

            <div ref={bottomRef} />
          </div>

          <MessageComposer
            conversationId={conversation.id}
            aiEnabled={aiEnabled}
            onStreamDelta={setStreamText}
            onStreamEnd={() => {
              setStreaming(false);
              setStreamText("");
            }}
          />
        </div>

        <aside className="hidden w-64 shrink-0 overflow-y-auto border-l border-[var(--shell-border)] bg-[var(--shell-surface)] p-4 lg:block">
          <LeadCard lead={lead} />

          {conversation.internal_notes && (
            <div className="mt-4 rounded-xl border border-amber-900/30 bg-amber-950/20 p-3">
              <p className="text-xs uppercase tracking-widest text-amber-500/80">
                Internal notes
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--shell-text)]">
                {conversation.internal_notes}
              </p>
            </div>
          )}

          <div className="mt-4">
            <p className="mb-2 text-xs uppercase tracking-widest text-[var(--shell-muted)]">
              AI Replay
            </p>
            <ConversationReplay actions={aiActions} />
          </div>
        </aside>
      </div>
    </div>
  );
}
