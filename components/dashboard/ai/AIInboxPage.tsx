"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

import { AdminPageStack, DashboardPageHeader } from "@/components/dashboard/home/DashboardPrimitives";
import { useI18n } from "@/lib/i18n";

import { AIContextPanel } from "./AIContextPanel";
import { AIExecutiveKpis } from "./AIExecutiveKpis";
import { AIInboxToolbar } from "./AIInboxToolbar";
import { ConversationList } from "./ConversationList";
import { ConversationView } from "./ConversationView";
import { EmptyConversation } from "./EmptyConversation";
import {
  computeAIOpsKpis,
  filterConversations,
  type AIInboxFilters,
} from "./ai-ops-metrics";
import { streamAIConversation } from "./ai-stream-client";

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

const DEFAULT_FILTERS: AIInboxFilters = {
  search: "",
  status: "",
  channel: "",
  priority: "",
  assigned: "",
  date: "",
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
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("conversation");

  const [filters, setFilters] = useState<AIInboxFilters>(DEFAULT_FILTERS);
  const [createOpen, setCreateOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [channel, setChannel] = useState("website");
  const [pending, startTransition] = useTransition();
  const [refreshing, startRefresh] = useTransition();

  const kpis = useMemo(
    () => computeAIOpsKpis(conversations),
    [conversations]
  );

  const filteredConversations = useMemo(
    () => filterConversations(conversations, filters, currentUserId),
    [conversations, filters, currentUserId]
  );

  function handleSelect(id: string) {
    router.push(`/ai?conversation=${id}`);
  }

  function handleBack() {
    router.push("/ai");
  }

  function handleRefresh() {
    startRefresh(() => {
      router.refresh();
    });
  }

  function handleRegenerate() {
    if (!selectedConversation || !aiEnabled) return;

    startTransition(async () => {
      try {
        await streamAIConversation(selectedConversation.id);
        router.refresh();
        toast.success("AI response regenerated");
      } catch (error) {
        console.error(error);
        toast.error(
          error instanceof Error ? error.message : "Failed to regenerate"
        );
      }
    });
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
    <AdminPageStack className="ds-page-enter">
      <DashboardPageHeader
        title={t("pages.messages.title")}
        subtitle={t("pages.messages.subtitle")}
      />

      <AIExecutiveKpis kpis={kpis} loading={refreshing} />

      <AIInboxToolbar
        filters={filters}
        refreshing={refreshing}
        onFiltersChange={setFilters}
        onCreateClick={() => setCreateOpen(true)}
        onRefresh={handleRefresh}
      />

      <div className="flex h-[calc(100vh-18rem)] min-h-[520px] overflow-hidden rounded-[var(--ds-radius)] bg-[var(--shell-surface)]/80 shadow-[var(--shell-shadow-sm)] backdrop-blur-xl">
        <div
          className={
            selectedId
              ? "hidden h-full md:flex"
              : "flex h-full w-full md:w-auto"
          }
        >
          <ConversationList
            conversations={filteredConversations}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>

        <main
          className={
            selectedId
              ? "flex min-w-0 flex-1 flex-col border-r border-[var(--shell-border)]/50"
              : "hidden min-w-0 flex-1 flex-col border-r border-[var(--shell-border)]/50 md:flex"
          }
        >
          {selectedConversation ? (
            <ConversationView
              conversation={selectedConversation}
              messages={messages}
              currentUserId={currentUserId}
              aiEnabled={aiEnabled}
              onBack={handleBack}
              showBack={Boolean(selectedId)}
            />
          ) : (
            <EmptyConversation />
          )}
        </main>

        <AIContextPanel
          conversation={selectedConversation}
          messages={messages}
          lead={lead}
          articles={articles}
          aiActions={aiActions}
          currentUserId={currentUserId}
          aiEnabled={aiEnabled}
          onRegenerate={aiEnabled ? handleRegenerate : undefined}
        />
      </div>

      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent className="border-0 bg-[var(--shell-content)] sm:max-w-md">
          <SheetHeader>
            <SheetTitle>New conversation</SheetTitle>
          </SheetHeader>

          <form onSubmit={handleCreate} className="mt-6 space-y-4 px-6 pb-6">
            <div className="space-y-1.5">
              <label htmlFor="guest_name" className="text-[13px] text-[var(--shell-muted)]">
                Guest name
              </label>
              <Input
                id="guest_name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                className="rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] shadow-[var(--shell-shadow-sm)]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="channel" className="text-[13px] text-[var(--shell-muted)]">
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

            <Button
              type="submit"
              className="h-[var(--ds-input-height)] w-full rounded-[var(--ds-radius-sm)] bg-emerald-600 hover:bg-emerald-500"
              disabled={pending}
            >
              {pending ? "Creating…" : "Create conversation"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </AdminPageStack>
  );
}
