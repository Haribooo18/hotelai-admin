"use client";

import { useMemo, useState, useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/lib/toast";

import type { Conversation } from "@/types/conversation";
import type { Message } from "@/types/message";
import type { KnowledgeArticle } from "@/types/knowledge-article";
import type { Lead } from "@/types/lead";

import { createConversation } from "@/lib/services/ai.mutations";
import { conversationCreateSchema } from "@/lib/validations/ai";
import { CONVERSATION_CHANNEL_OPTIONS } from "@/lib/ai/metadata";

import { Button } from "@/components/ui/core/Button";
import { Input } from "@/components/ui/core/Input";
import { Select } from "@/components/ui/core/Select";
import { FormField } from "@/components/ui/core/FormField";
import { WorkspaceFormDrawer } from "@/components/dashboard/shared/WorkspaceOverlay";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { WorkspacePageLayout } from "@/components/dashboard/shared/WorkspacePageLayout";
import { useCreateQueryParam } from "@/components/dashboard/shared/useCreateQueryParam";
import { formRaisedControlClass, formSectionClass } from "@/lib/dashboard/design-system";
import { localizeErrorWithT, useI18n } from "@/lib/i18n";

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
  const openCreate = useCallback(() => setCreateOpen(true), []);
  useCreateQueryParam(openCreate);
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
        toast.success(t("ai.regenerateSuccess"));
      } catch (error) {
        console.error(error);
        toast.error(
          localizeErrorWithT(
            t,
            error instanceof Error ? error.message : t("ai.aiResponseFailed")
          )
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
      toast.error(
        localizeErrorWithT(t, parsed.error.issues[0]?.message ?? t("errors.invalidData"))
      );
      return;
    }

    startTransition(async () => {
      try {
        const id = await createConversation(parsed.data);
        setCreateOpen(false);
        setGuestName("");
        toast.success(t("ai.conversationCreated"));
        router.push(`/ai?conversation=${id}`);
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error(t("ai.createFailed"));
      }
    });
  }

  return (
    <>
      <WorkspacePageLayout
        header={
          <PageHeader
            title={t("pages.messages.title")}
            subtitle={t("pages.messages.subtitle")}
          />
        }
        kpis={<AIExecutiveKpis kpis={kpis} loading={refreshing} />}
        toolbar={
          <AIInboxToolbar
            filters={filters}
            refreshing={refreshing}
            onFiltersChange={setFilters}
            onRefresh={handleRefresh}
          />
        }
      >
        <GlassSurface className="flex min-h-[min(65svh,720px)] overflow-hidden shadow-[var(--shell-shadow-sm)]">
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
      </GlassSurface>
      </WorkspacePageLayout>

      <WorkspaceFormDrawer
        open={createOpen}
        onOpenChange={setCreateOpen}
        title={t("ai.newConversation")}
      >
        <form onSubmit={handleCreate} className={formSectionClass}>
          <FormField label={t("bookings.formGuestName")} htmlFor="guest_name">
            <Input
              id="guest_name"
              value={guestName}
              onChange={(event) => setGuestName(event.target.value)}
              required
              className={formRaisedControlClass}
            />
          </FormField>

          <FormField label={t("ai.formChannel")} htmlFor="channel">
            <Select
              id="channel"
              value={channel}
              onChange={setChannel}
              aria-label={t("ai.formChannel")}
              options={CONVERSATION_CHANNEL_OPTIONS}
            />
          </FormField>

          <Button
            type="submit"
            className="w-full"
            disabled={pending}
            loading={pending}
          >
            {pending ? t("ai.creating") : t("ai.createConversation")}
          </Button>
        </form>
      </WorkspaceFormDrawer>
    </>
  );
}
