"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Bot, Plus } from "lucide-react";
import { toast } from "sonner";

import type { Conversation } from "@/types/conversation";
import type { Message } from "@/types/message";
import type { KnowledgeArticle } from "@/types/knowledge-article";
import type { Lead } from "@/types/lead";

import { createConversation } from "@/lib/services/ai.mutations";
import { conversationCreateSchema } from "@/lib/validations/ai";
import { CONVERSATION_CHANNEL_OPTIONS } from "@/lib/ai/metadata";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { ConversationList } from "./ConversationList";
import { ConversationView } from "./ConversationView";
import { EmptyConversation } from "./EmptyConversation";
import { KnowledgePanel } from "./KnowledgePanel";

type Props = {
  conversations: Conversation[];
  articles: KnowledgeArticle[];
  selectedConversation: Conversation | null;
  messages: Message[];
  lead: Lead | null;
  currentUserId: string;
  aiActions?: import("@/types/ai-action").AIAction[];
  aiEnabled?: boolean;
};

export function AIInboxPage({
  conversations,
  articles,
  selectedConversation,
  messages,
  lead,
  currentUserId,
  aiActions = [],
  aiEnabled = false,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("conversation");

  const [createOpen, setCreateOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [channel, setChannel] = useState("website");
  const [pending, startTransition] = useTransition();

  function handleSelect(id: string) {
    router.push(`/ai?conversation=${id}`);
  }

  function handleBack() {
    router.push("/ai");
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    const parsed = conversationCreateSchema.safeParse({
      guest_name: guestName,
      channel,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Error");
      return;
    }

    startTransition(async () => {
      try {
        const id = await createConversation(parsed.data);
        setCreateOpen(false);
        setGuestName("");
        toast.success("Conversation created");
        router.push(`/ai?conversation=${id}`);
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to create conversation");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-bold">
            <Bot className="h-9 w-9 text-emerald-500" />
            AI Receptionist
          </h1>

          <p className="mt-3 text-zinc-400">
            Incoming guest inquiries across all channels.
          </p>
        </div>

        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New conversation
        </Button>
      </div>

      <div className="flex h-[calc(100vh-14rem)] min-h-[480px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
        <div
          className={
            selectedId
              ? "hidden h-full md:flex"
              : "flex h-full w-full md:w-auto"
          }
        >
          <ConversationList
            conversations={conversations}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>

        <main
          className={
            selectedId
              ? "flex min-w-0 flex-1 flex-col"
              : "hidden min-w-0 flex-1 flex-col md:flex"
          }
        >
          {selectedId && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2 text-sm text-zinc-400 md:hidden"
            >
              <ArrowLeft size={16} />
              Back to list
            </button>
          )}

          {selectedConversation ? (
            <ConversationView
              conversation={selectedConversation}
              messages={messages}
              lead={lead}
              currentUserId={currentUserId}
              aiActions={aiActions}
              aiEnabled={aiEnabled}
            />
          ) : (
            <EmptyConversation />
          )}
        </main>

        <KnowledgePanel articles={articles} />
      </div>

      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>New conversation</SheetTitle>
          </SheetHeader>

          <form onSubmit={handleCreate} className="mt-6 space-y-4 px-6 pb-6">
            <div className="space-y-1.5">
              <label htmlFor="guest_name" className="text-sm text-zinc-400">
                Guest name
              </label>
              <Input
                id="guest_name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="channel" className="text-sm text-zinc-400">
                Channel
              </label>
              <Select
                id="channel"
                value={channel}
                onChange={setChannel}
                aria-label="Channel"
                options={CONVERSATION_CHANNEL_OPTIONS}
              />
            </div>

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Creating…" : "Create"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
